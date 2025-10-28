/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns4)'];

  // Defensive: Find the main wrapper containing image and text columns
  const wrapper = element.querySelector('.promo-banner .wrapper');
  if (!wrapper) return;

  // Get the immediate children of the wrapper (should be two columns)
  const columns = wrapper.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: image (picture > img)
  const leftCol = columns[0];
  const picture = leftCol.querySelector('picture');
  let imgEl = null;
  if (picture) {
    imgEl = picture.querySelector('img');
  }

  // Right column: text (two <p> elements)
  const rightCol = columns[1];
  // Collect all paragraphs
  const paragraphs = Array.from(rightCol.querySelectorAll('p'));

  // Compose right column cell
  let rightCellContent = [];
  if (paragraphs.length) {
    rightCellContent = paragraphs;
  } else if (rightCol.textContent.trim()) {
    // Fallback: if no <p>, use all text
    const p = document.createElement('p');
    p.textContent = rightCol.textContent.trim();
    rightCellContent = [p];
  }

  // Compose table rows
  const contentRow = [imgEl, rightCellContent];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
