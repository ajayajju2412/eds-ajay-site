import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_BACKGROUND_COLOR = 'blue';

export default function decorate(block) {
  const [contentRow, colorRow] = [...block.children];
  const backgroundColor = colorRow?.textContent.trim() || DEFAULT_BACKGROUND_COLOR;

  const cells = [...contentRow.children];
  block.replaceChildren(...cells);

  cells.forEach((cell) => {
    const img = cell.querySelector('img');
    if (img) {
      cell.classList.add('banner-image');
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    } else {
      cell.classList.add('banner-text');
    }
  });

  block.style.setProperty('--banner-background-color', backgroundColor);
}
