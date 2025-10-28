/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block header
  const headerRow = ['Cards (cards5)'];

  // Find the container holding all card items
  const sliderContainer = element.querySelector('.slider-container');
  if (!sliderContainer) return;

  // Get all card elements
  const cardEls = Array.from(sliderContainer.querySelectorAll('.slider-item'));

  // Build rows for each card
  const rows = cardEls.map(card => {
    // Card link (for possible CTA)
    const link = card.querySelector('a');
    const href = link ? link.getAttribute('href') : null;

    // Image (always present)
    const img = card.querySelector('img');
    const imageCell = img ? img : '';

    // Text content (title, price, badge)
    const textFragments = [];

    // Badge (optional)
    const badge = card.querySelector('.best-seller');
    if (badge) {
      textFragments.push(badge);
    }

    // Title (strong inside .slider-text)
    const title = card.querySelector('.slider-text strong');
    if (title) {
      const titleDiv = document.createElement('div');
      titleDiv.appendChild(title.cloneNode(true));
      textFragments.push(titleDiv);
    }

    // Price (always present)
    const price = card.querySelector('.price');
    if (price) {
      const priceDiv = document.createElement('div');
      priceDiv.appendChild(price.cloneNode(true));
      textFragments.push(priceDiv);
    }

    // If there's a link, wrap all text fragments in an anchor
    let textCell;
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      textFragments.forEach(frag => a.appendChild(frag));
      textCell = a;
    } else {
      textCell = textFragments;
    }

    return [imageCell, textCell];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
