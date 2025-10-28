/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block container
  const cardsBlock = element.querySelector('.cards.grid-3.block');
  if (!cardsBlock) return;

  // Get all card elements
  const cardElements = cardsBlock.querySelectorAll('.cards-element');

  // Build the header row
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  cardElements.forEach(card => {
    // Image cell: get the image container
    const imageContainer = card.querySelector('.cards-card-image');
    // Text cell: get the card body container
    const bodyContainer = card.querySelector('.cards-card-body');
    // Defensive: only add row if both image and body exist
    if (imageContainer && bodyContainer) {
      rows.push([
        imageContainer, // image cell
        bodyContainer   // text cell
      ]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
