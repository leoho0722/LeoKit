/** 極簡 DOM 建構工具。LeoKit 的元件都是純 DOM 工廠，沒有框架依賴。 */

export type Attrs = Record<string, unknown> & {
  class?: string;
  text?: string;
  onClick?: (ev: MouseEvent) => void;
};

export type Child = Node | string | null | false | undefined;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Attrs | null,
  children?: Child[],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') node.className = String(value);
      else if (key === 'text') node.textContent = String(value);
      else if (key === 'onClick') node.addEventListener('click', value as EventListener);
      else node.setAttribute(key, value === true ? '' : String(value));
    }
  }
  for (const child of children ?? []) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * 介面內部用的功能性字形。
 * 這不是 LeoKit 的圖示集；產品圖示請用 SF Symbols / Material Symbols / Lucide。
 */
export const glyphs = {
  chevron: 'M9 6l6 6-6 6',
  check: 'M20 6L9 17l-5-5',
  plus: 'M12 5v14M5 12h14',
  close: 'M18 6L6 18M6 6l12 12',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4',
  alert: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 11v6M12 7.5h.01',
  lightbulb: 'M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.2v1h6v-1c0-.4.2-.9.6-1.2A6 6 0 0 0 12 3',
  inbox: 'M3 12h4l2 3h6l2-3h4M5 12l2-7h10l2 7v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
  chevronDown: 'M6 9l6 6 6-6',
  calendar: 'M7 3v4M17 3v4M4 9.5h16M5.5 5h13a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5z',
  minus: 'M5 12h14',
  more: 'M12 5h.01M12 12h.01M12 19h.01',
  user: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4.5 21a7.5 7.5 0 0 1 15 0',
  sort: 'M8 9l4-4 4 4M8 15l4 4 4-4',
} as const;

export type LKGlyph = keyof typeof glyphs;

export function icon(name: LKGlyph, className?: string): SVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', glyphs[name]);
  svg.appendChild(path);
  return svg;
}

let idCounter = 0;
/** 產生穩定、遞增的元素 id，避免同一頁多個元件互相衝突。 */
export function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/** 切換 documentElement 的 data-theme，值為 tokens.json 的 theme id。 */
export function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
}
