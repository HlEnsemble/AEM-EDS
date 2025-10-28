/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find the cards container (the repeating card elements)
  // The structure is: ...<div class="cards-element">...</div>...
  const cardElements = element.querySelectorAll('.cards-element');

  cardElements.forEach((cardEl) => {
    // --- IMAGE COLUMN ---
    // Each card's image is inside .cards-card-image
    const imageContainer = cardEl.querySelector('.cards-card-image');
    let imageCellContent = null;
    if (imageContainer) {
      // Find <picture> or <img> inside imageContainer
      const picture = imageContainer.querySelector('picture');
      if (picture) {
        imageCellContent = picture;
      } else {
        const img = imageContainer.querySelector('img');
        if (img) imageCellContent = img;
      }
      // Optionally add overlay text (the white text on image)
      // In source, this is a <p> after <picture>
      const overlayTextP = imageContainer.querySelector('p:not(:has(picture))');
      if (overlayTextP) {
        // Overlay text should be included visually, so add below image
        imageCellContent = [imageCellContent, overlayTextP];
      }
    }

    // --- TEXT COLUMN ---
    // Each card's text is inside .cards-card-body
    const bodyContainer = cardEl.querySelector('.cards-card-body');
    let textCellContent = [];
    if (bodyContainer) {
      // Title: <p><strong>...</strong></p>
      const titleP = bodyContainer.querySelector('p > strong');
      if (titleP && titleP.parentElement) {
        // Use <strong> inside <p> for heading
        textCellContent.push(titleP.parentElement);
      }
      // Description: next <p> after title
      const paragraphs = bodyContainer.querySelectorAll('p');
      for (let i = 0; i < paragraphs.length; i++) {
        // Skip title <p> and button containers
        const p = paragraphs[i];
        if (p.querySelector('strong')) continue;
        if (p.classList.contains('button-container')) continue;
        textCellContent.push(p);
      }
      // CTAs: all <p.button-container> (may be multiple)
      const buttonContainers = bodyContainer.querySelectorAll('p.button-container');
      buttonContainers.forEach((btnP) => {
        textCellContent.push(btnP);
      });
    }

    rows.push([
      imageCellContent,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
