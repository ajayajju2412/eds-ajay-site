const PAGE_SIZE = 10;
const COLUMNS = ['Name', 'Department', 'Experience', 'City'];

async function fetchPlaceholders() {
  window.employeePlaceholders = window.employeePlaceholders || fetch('/employee-placeholders.json')
    .then((resp) => resp.json())
    .then((json) => {
      const placeholders = {};
      json.data.forEach((row) => {
        placeholders[row.Key] = row.Value;
      });
      return placeholders;
    })
    .catch(() => ({}));
  return window.employeePlaceholders;
}

function renderRow(employee) {
  const tr = document.createElement('tr');
  COLUMNS.forEach((key) => {
    const td = document.createElement('td');
    td.textContent = employee[key] || '';
    tr.append(td);
  });
  return tr;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const sheetUrl = link ? link.href.replace(/\.json$/, '') : '';
  block.textContent = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  COLUMNS.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col;
    headRow.append(th);
  });
  thead.append(headRow);
  const tbody = document.createElement('tbody');
  table.append(thead, tbody);
  block.append(table);

  const loadMoreButton = document.createElement('button');
  loadMoreButton.type = 'button';
  loadMoreButton.className = 'employee-list-load-more';
  block.append(loadMoreButton);

  const placeholders = await fetchPlaceholders();
  loadMoreButton.textContent = placeholders.loadMoreLabel || 'Load more';

  let offset = 0;

  async function loadNextPage() {
    const resp = await fetch(`${sheetUrl}.json?limit=${PAGE_SIZE}&offset=${offset}`);
    const json = await resp.json();
    json.data.forEach((employee) => tbody.append(renderRow(employee)));
    offset += json.data.length;
    if (offset >= json.total || json.data.length === 0) {
      loadMoreButton.remove();
    }
  }

  loadMoreButton.addEventListener('click', loadNextPage);
  await loadNextPage();
}
