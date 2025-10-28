/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header row
  const headerRow = ['Columns (columns4)'];

  // Defensive: Find .wrapper and its two children (image, text)
  const wrapper = element.querySelector('.wrapper');
  if (!wrapper) return;
  const children = wrapper.querySelectorAll(':scope > div');
  if (children.length < 2) return;

  // Left column: image (picture)
  const imageDiv = children[0];
  const picture = imageDiv.querySelector('picture');
  // Reference the actual picture element (not clone)
  const imageContent = picture || imageDiv;

  // Right column: text block (all paragraphs)
  const textDiv = children[1];
  // Collect all paragraphs, preserving formatting
  const paragraphs = Array.from(textDiv.querySelectorAll('p'));
  // Defensive: if no paragraphs, use entire textDiv
  const textContent = paragraphs.length ? paragraphs : [textDiv];

  // Build the table rows: header, then columns
  const rows = [
    headerRow,
    [imageContent, textContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
