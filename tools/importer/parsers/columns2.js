/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns2)'];

  // Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // The columns block has a single child div (the row), which has two children (columns)
  const rowDiv = columnsBlock.querySelector(':scope > div');
  if (!rowDiv) return;

  // Get the two columns (left and right)
  const columnDivs = Array.from(rowDiv.children);
  if (columnDivs.length < 2) return;

  // Left column: contains all content for the left side
  const leftCol = columnDivs[0];
  // Right column: contains all content for the right side
  const rightCol = columnDivs[1];

  // For the left column, include ALL its direct children (preserves headings, images, paragraphs, lists, etc.)
  // Also, extract text nodes inside leftCol (for headings/subheadings that may be present as text nodes)
  const leftContent = [];
  leftCol.childNodes.forEach(node => {
    if (node.nodeType === 1) {
      leftContent.push(node.cloneNode(true));
    } else if (node.nodeType === 3 && node.textContent.trim()) {
      // Wrap text node in a <span> to preserve it
      const span = document.createElement('span');
      span.textContent = node.textContent.trim();
      leftContent.push(span);
    }
  });

  // For the right column, if it's a picture, use it; otherwise, use its first picture or all children
  let rightContent;
  if (rightCol.tagName && rightCol.tagName.toLowerCase() === 'picture') {
    rightContent = rightCol.cloneNode(true);
  } else {
    const pic = rightCol.querySelector('picture');
    rightContent = pic ? pic.cloneNode(true) : rightCol.cloneNode(true);
  }

  // Compose the table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
