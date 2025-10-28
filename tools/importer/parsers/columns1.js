/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: fallback if .default-content-wrapper is not present
  let contentWrapper = element.querySelector(':scope > .default-content-wrapper');
  if (!contentWrapper) contentWrapper = element;

  // 1. Logo (first <p> with <a><picture><img>)
  const logoPara = contentWrapper.querySelector('p a picture img')?.closest('p');

  // 2. Search bar (input + icon)
  const searchPara = contentWrapper.querySelector('p input')?.closest('p');

  // 3. Right-side nav (the <ul> list)
  const navList = contentWrapper.querySelector('ul');
  let navClone = navList ? navList.cloneNode(true) : null;
  // Fix casing for 'Support' and 'Bag' (these are text nodes after icon spans)
  if (navClone) {
    const lis = navClone.querySelectorAll('li');
    lis.forEach(li => {
      // Find the text node after the icon span
      const iconSpan = li.querySelector('span.icon');
      if (iconSpan) {
        let next = iconSpan.nextSibling;
        while (next && next.nodeType !== 3) next = next.nextSibling;
        if (next && next.nodeType === 3) {
          // Trim and check text
          let txt = next.textContent.trim();
          if (txt.toLowerCase() === 'support') next.textContent = 'Support';
          if (txt.toLowerCase() === 'bag') next.textContent = 'Bag';
        }
      }
    });
  }

  // Build columns: logo, search, nav
  const columns = [];
  if (logoPara) columns.push(logoPara);
  if (searchPara) columns.push(searchPara);
  if (navClone) columns.push(navClone);

  // Header row
  const headerRow = ['Columns (columns1)'];
  // Content row: each main section as a column
  const contentRow = columns;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
