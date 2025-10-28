/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children divs
  const wrapper = element.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // --- COLUMN 1: Logo ---
  // Find the first <a> with an <img> (logo)
  let logoEl = null;
  const logoLink = wrapper.querySelector('a[href]');
  if (logoLink && logoLink.querySelector('img')) {
    logoEl = logoLink;
  }

  // --- COLUMN 2: Search ---
  // Find the <input> and its containing <p>
  let searchEl = null;
  const searchP = Array.from(wrapper.querySelectorAll('p')).find(p => p.querySelector('input[type="text"]'));
  if (searchP) {
    searchEl = searchP;
  }

  // --- COLUMN 3: User/Support/Bag ---
  // The <ul> contains all the user/account/support/bag items
  let navToolsEl = null;
  const ul = wrapper.querySelector('ul');
  if (ul) {
    navToolsEl = ul;
  }

  // Build the columns row
  const columnsRow = [logoEl, searchEl, navToolsEl].filter(Boolean);

  // Table header
  const headerRow = ['Columns (columns1)'];
  const tableCells = [headerRow, columnsRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
