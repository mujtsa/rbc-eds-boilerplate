import { getMetadata } from '../../scripts/aem.js';

const FOOTER_PATH = '/fragments/nav/footer';

async function fetchFragment(path) {
  let resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) resp = await fetch(`/content${path}.plain.html`);
  if (!resp.ok) resp = await fetch(path);
  if (!resp.ok) throw Error(`Couldn't fetch ${path}`);
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Fragment .plain.html places sections directly under <body> (no <main>).
  const sections = doc.body.querySelectorAll(':scope > div');
  return sections.length ? sections : doc.body.querySelectorAll('main > div');
}

export default async function decorate(el) {
  const footerMeta = getMetadata('footer');
  const path = footerMeta ? new URL(footerMeta, window.location).pathname : FOOTER_PATH;
  const sections = await fetchFragment(path);

  const inner = document.createElement('div');
  inner.className = 'rbc-footer';
  const rows = [...sections];
  rows.forEach((section) => inner.append(section));

  // Sections are positional (authoring classes are stripped by DA/EDS):
  // 0 = link columns, 1 = social, 2 = legal, 3 = copyright.
  const [links, social, legal, copyright] = rows;
  social?.classList.add('rbc-footer-social');
  legal?.classList.add('rbc-footer-legal');
  copyright?.classList.add('rbc-footer-copyright');

  // The link-columns section flattens to h3 + ul pairs directly (DA/EDS strips
  // the per-column wrapper divs). Re-wrap each h3 + ul pair into a column.
  if (links) {
    links.classList.add('rbc-footer-links');
    const columns = [];
    let current = null;
    [...links.children].forEach((child) => {
      if (child.tagName === 'H3') {
        current = document.createElement('div');
        columns.push(current);
        current.append(child);
      } else if (current) {
        current.append(child);
      }
    });
    columns.forEach((col) => links.append(col));
  }

  el.append(inner);
}
