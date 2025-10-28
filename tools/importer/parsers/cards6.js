/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block: 2 columns, multiple rows, each row = 1 card
  // Header row: must be a single cell row (not th, not colspan)
  const rows = [['Cards (cards6)']];

  // Find the cards container (the repeating card structure)
  const cardsContainer = element.querySelector('.cards-container');
  if (!cardsContainer) return;

  // Select all card elements
  const cardElements = cardsContainer.querySelectorAll('.cards-element');

  cardElements.forEach((cardEl) => {
    // --- Image cell ---
    const imageContainer = cardEl.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageContainer) {
      imageEl = imageContainer.querySelector('picture') || imageContainer.querySelector('img');
    }
    const imageCell = imageEl ? imageEl : '';

    // --- Text cell ---
    const bodyContainer = cardEl.querySelector('.cards-card-body');
    let titleEl = null, descEl = null, ctaEl = null;
    if (bodyContainer) {
      titleEl = bodyContainer.querySelector('p > strong');
      const descCandidates = Array.from(bodyContainer.querySelectorAll('p'));
      descEl = descCandidates.find(p => !p.querySelector('strong') && !p.classList.contains('button-container'));
      ctaEl = bodyContainer.querySelector('.button-container a');
    }
    const textCellContent = [];
    if (titleEl) {
      const titleDiv = document.createElement('div');
      titleDiv.appendChild(titleEl.cloneNode(true));
      textCellContent.push(titleDiv);
    }
    if (descEl) {
      textCellContent.push(descEl.cloneNode(true));
    }
    if (ctaEl) {
      textCellContent.push(ctaEl.cloneNode(true));
    }
    const textCell = textCellContent.length ? textCellContent : '';

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
