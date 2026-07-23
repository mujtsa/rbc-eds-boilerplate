export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  const [leftCell, rightCell] = cells;

  // Left group: count + filters trigger
  if (leftCell) {
    leftCell.classList.add('columns-toolbar-left');
    [...leftCell.children].forEach((p, i) => {
      if (i === 0) p.classList.add('columns-toolbar-count');
      else p.classList.add('columns-toolbar-filters');
    });
  }

  // Right group: "Sort by:" label + dropdown value
  if (rightCell) {
    rightCell.classList.add('columns-toolbar-right');
    const raw = rightCell.textContent.trim();
    const match = raw.match(/^(sort by:?)\s*(.*)$/i);
    rightCell.textContent = '';
    const label = document.createElement('span');
    label.className = 'columns-toolbar-sort-label';
    const select = document.createElement('span');
    select.className = 'columns-toolbar-select';
    if (match) {
      [, label.textContent] = match;
      select.textContent = match[2] || '';
    } else {
      label.textContent = 'Sort by:';
      select.textContent = raw;
    }
    rightCell.append(label, select);
  }
}
