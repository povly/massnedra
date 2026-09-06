export interface ListItem {
  /** Заголовок строки. */
  title: string;
  /** Подпись под заголовком (опционально). */
  subtitle?: string;
}

export interface ListElements {
  container: HTMLElement;
  /** 'group' — строка области (заголовок + число справа), 'place' — строка района/участка. */
  variant: 'group' | 'place';
}

const ARROW_SVG = `
  <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 17.8801L10.8832 8.99695L2 0.11377L0.585786 1.52798L8.05475 8.99695L0.585786 16.4659L2 17.8801Z" fill="#e2bf56"/>
  </svg>`;

const ESCAPE_RULES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>]/g, (ch) => ESCAPE_RULES[ch] ?? ch);
}

/**
 * Универсальный список панели (области / районы / точки):
 * клик по строке → onItemClick(index).
 */
export function renderList(
  els: ListElements,
  items: readonly ListItem[],
  onItemClick: (index: number) => void,
): void {
  els.container.innerHTML = '';

  items.forEach((item, index) => {
    if (els.variant === 'group') {
      const row = document.createElement('div');
      row.className = 'p-map__group';
      row.innerHTML = `
        <div class="p-map__group-title">${escapeHtml(item.title)}</div>
        ${item.subtitle ? `<div class="p-map__group-num">${escapeHtml(item.subtitle)}</div>` : ''}
        <div class="p-map__group-arrow">${ARROW_SVG}</div>
      `;
      row.addEventListener('click', () => onItemClick(index));
      els.container.appendChild(row);
      return;
    }

    const row = document.createElement('div');
    row.className = 'p-map__place-item';
    row.innerHTML = `
      <div class="p-map__place-title">${escapeHtml(item.title)}</div>
      ${item.subtitle ? `<div class="p-map__place-text">${escapeHtml(item.subtitle)}</div>` : ''}
      <div class="p-map__place-arrow">${ARROW_SVG}</div>
    `;
    row.addEventListener('click', () => onItemClick(index));
    els.container.appendChild(row);
  });
}
