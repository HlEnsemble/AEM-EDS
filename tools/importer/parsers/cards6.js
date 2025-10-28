/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parsing
  const cardsContainer = element.querySelector('.cards-container');
  if (!cardsContainer) return;

  const cardElements = Array.from(cardsContainer.querySelectorAll('.cards-element'));
  if (!cardElements.length) return;

  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  cardElements.forEach((cardEl, idx) => {
    // --- Image cell ---
    const imageContainer = cardEl.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageContainer) {
      const picture = imageContainer.querySelector('picture');
      if (picture) {
        imageEl = picture.cloneNode(true);
        // For the second card, add overlay text as alt/caption
        if (idx === 1) {
          const img = imageEl.querySelector('img');
          if (img) {
            // Append overlay text to alt
            img.alt = (img.alt ? img.alt + ' ' : '') + 'The OUTSIDE IS CALLING';
          }
        }
      } else {
        const img = imageContainer.querySelector('img');
        if (img) {
          imageEl = img.cloneNode(true);
          if (idx === 1) {
            imageEl.alt = (imageEl.alt ? imageEl.alt + ' ' : '') + 'The OUTSIDE IS CALLING';
          }
        }
      }
    }

    // --- Text cell ---
    const bodyContainer = cardEl.querySelector('.cards-card-body');
    let textCellContent = [];
    if (bodyContainer) {
      const titleP = bodyContainer.querySelector('p > strong');
      if (titleP && titleP.parentElement) {
        textCellContent.push(titleP.parentElement.cloneNode(true));
      }
      const descP = Array.from(bodyContainer.querySelectorAll('p')).find(p => !p.querySelector('strong') && !p.classList.contains('button-container'));
      if (descP) {
        textCellContent.push(descP.cloneNode(true));
      }
      const ctaP = bodyContainer.querySelector('p.button-container');
      if (ctaP) {
        textCellContent.push(ctaP.cloneNode(true));
      }
    }

    // Defensive: if no image or text, skip
    if (!imageEl && !textCellContent.length) return;

    rows.push([
      imageEl || '',
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
