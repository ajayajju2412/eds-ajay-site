export default function decorate(block) {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const crumbs = [{ text: 'Home', link: '/' }];
  let path = '';
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    const text = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push(i === segments.length - 1 ? { text } : { text, link: path });
  });

  const ul = document.createElement('ul');
  crumbs.forEach((crumb) => {
    const li = document.createElement('li');
    if (crumb.link) {
      const a = document.createElement('a');
      a.href = crumb.link;
      a.textContent = crumb.text;
      li.append(a);
    } else {
      li.textContent = crumb.text;
    }
    ul.append(li);
  });
  block.replaceChildren(ul);
}
