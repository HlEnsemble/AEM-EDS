/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const columnsDiv = element.querySelector('.columns');
  if (!columnsDiv) return;

  // Get the two direct children of the columns block (the columns themselves)
  const columnDivs = Array.from(columnsDiv.children);
  if (columnDivs.length < 2) return;

  const leftCol = columnDivs[0];
  const rightCol = columnDivs[1];

  // --- LEFT COLUMN ---
  // Collect all content in order: image, headings, paragraph, list
  const leftColContent = Array.from(leftCol.childNodes).filter(node => node.nodeType === 1);

  // --- RIGHT COLUMN ---
  // The right column is just a picture
  let rightColContent = rightCol.querySelector('picture') || rightCol.querySelector('img');
  if (!rightColContent) {
    rightColContent = rightCol;
  }

  // --- BUILD TABLE ---
  const headerRow = ['Columns (columns2)'];
  const contentRow = [leftColContent, rightColContent];
  const cells = [headerRow, contentRow];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Always modify the DOM by replacing the element
  if (blockTable) {
    element.replaceWith(blockTable);
  } else {
    // As a fallback, remove the element
    element.remove();
  }
}
