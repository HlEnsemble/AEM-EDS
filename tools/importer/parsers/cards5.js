/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Always include all card items present in the source HTML
  const cardItems = element.querySelectorAll('.slider-container > .slider-item');

  cardItems.forEach((card) => {
    // Each card is a link (<a>) containing image, title, price, and optionally a badge
    const link = card.querySelector('a');

    // --- IMAGE CELL ---
    // Find the image (always inside .slider-image .image-wrapper img)
    let imageEl = null;
    const img = card.querySelector('.slider-image .image-wrapper img');
    if (img) {
      imageEl = img;
    }

    // If there's a badge (e.g. 'Best Seller'), add it above the image
    const badge = card.querySelector('.best-seller span');
    let imageCellContent = [];
    if (badge) {
      // Create a badge element
      const badgeDiv = document.createElement('div');
      badgeDiv.textContent = badge.textContent;
      badgeDiv.style.fontSize = '0.75em';
      badgeDiv.style.fontWeight = 'bold';
      badgeDiv.style.background = '#34282b';
      badgeDiv.style.color = '#fff';
      badgeDiv.style.display = 'inline-block';
      badgeDiv.style.padding = '2px 6px';
      badgeDiv.style.marginBottom = '4px';
      badgeDiv.style.borderRadius = '2px';
      imageCellContent.push(badgeDiv);
    }
    if (imageEl) {
      imageCellContent.push(imageEl);
    }
    // If no badge, just the image
    if (imageCellContent.length === 1) imageCellContent = imageEl;

    // --- TEXT CELL ---
    // Use all text inside .slider-text, not just <strong>
    const sliderText = card.querySelector('.slider-text');
    const priceEl = card.querySelector('.price');
    const textCellContent = [];
    if (sliderText) {
      sliderText.childNodes.forEach((node) => {
        textCellContent.push(node.cloneNode(true));
      });
    }
    if (priceEl) {
      const priceDiv = document.createElement('div');
      priceDiv.textContent = priceEl.textContent;
      priceDiv.style.marginTop = '4px';
      textCellContent.push(priceDiv);
    }
    if (link && link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = 'View Product';
      cta.style.display = 'inline-block';
      cta.style.marginTop = '8px';
      textCellContent.push(cta);
    }

    rows.push([
      imageCellContent,
      textCellContent
    ]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
