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

/* -------------------------------- 焦點群組 -------------------------------- */

/** 方向鍵的軸：inline 收左右、block 收上下、both 兩組都收。 */
export type RoveAxis = 'inline' | 'block' | 'both';

export interface RoveOptions {
  axis: RoveAxis;
  /** 群組裡的所有項目，依視覺順序排列。 */
  items: () => HTMLElement[];
  /** 從群組外 Tab 進來時落在哪一項；沒給就是第一個可用的項目。 */
  current?: () => HTMLElement | undefined;
  /** 方向鍵把焦點移到某一項之後呼叫，例如 radio 要跟著選取。 */
  onMove?: (item: HTMLElement) => void;
}

function usable(item: HTMLElement): boolean {
  return !(item as HTMLButtonElement).disabled && item.getAttribute('aria-disabled') !== 'true';
}

function isRtl(node: HTMLElement): boolean {
  return node.ownerDocument.defaultView?.getComputedStyle(node).direction === 'rtl';
}

/** 這個按鍵要往前（-1）還是往後（1）走；不是這個軸的方向鍵就回 0。 */
function stepFor(key: string, axis: RoveAxis, rtl: boolean): number {
  const inline = axis !== 'block';
  const block = axis !== 'inline';
  if (inline && key === 'ArrowRight') return rtl ? -1 : 1;
  if (inline && key === 'ArrowLeft') return rtl ? 1 : -1;
  if (block && key === 'ArrowDown') return 1;
  if (block && key === 'ArrowUp') return -1;
  return 0;
}

/**
 * Roving tabindex：一組項目只佔一個 Tab 停駐點，方向鍵與 Home／End 在項目之間移動焦點，頭尾相接。
 *
 * 焦點在群組內時，停駐點跟著焦點走，Tab 與 Shift+Tab 都會直接離開群組；
 * 焦點離開後停駐點回到 `current`，下次 Tab 進來落在那裡。
 * 回傳 `sync`，`current` 改變後呼叫它重新分配 tabindex。
 */
export function rove(container: HTMLElement, options: RoveOptions): () => void {
  const place = (entry: HTMLElement | undefined): void => {
    for (const item of options.items()) item.tabIndex = item === entry ? 0 : -1;
  };
  const sync = (): void => {
    // 已選的那一項如果被停用就無法聚焦，整組會 Tab 不進來，改落在第一個可用的項目
    const current = options.current?.();
    place(current && usable(current) ? current : options.items().find(usable));
  };

  container.addEventListener('focusin', (event) => {
    const item = event.target as HTMLElement;
    if (options.items().includes(item)) place(item);
  });
  container.addEventListener('focusout', (event) => {
    if (!container.contains(event.relatedTarget as Node | null)) sync();
  });

  container.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const items = options.items().filter(usable);
    const index = items.indexOf(event.target as HTMLElement);
    if (index < 0) return;

    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else {
      const step = stepFor(event.key, options.axis, isRtl(container));
      if (step === 0) return;
      next = (index + step + items.length) % items.length;
    }

    const target = items[next];
    if (!target) return;
    event.preventDefault();
    target.focus();
    options.onMove?.(target);
  });

  sync();
  return sync;
}

export type FocusgroupBehavior = 'tablist' | 'menu';

/**
 * 瀏覽器是否原生支援這種 focusgroup。目前只有 Chromium 系列。
 *
 * 只看屬性存在不夠：實作可能有 `focusGroup` 卻還不支援某個 behavior，所以再問 `supports()`。
 * 沒定義可用 token 的 DOMTokenList 呼叫 `supports()` 會丟 TypeError（跟 `classList.supports()` 一樣），
 * 半成品或旗標後的實作可能就是這樣，所以任何例外都當成不支援，改走 `rove()`。
 */
export function hasNativeFocusgroup(behavior: FocusgroupBehavior): boolean {
  if (!('focusGroup' in HTMLElement.prototype)) return false;
  try {
    const tokens = (document.createElement('div') as HTMLElement & { focusGroup?: DOMTokenList }).focusGroup;
    return tokens?.supports?.(behavior) === true;
  } catch {
    return false;
  }
}

/** 原生 focusgroup 只負責移動焦點，所以這裡不收 `onMove`；`axis` 也只給退路用，原生的軸由 behavior 決定。 */
export interface FocusgroupOptions extends Omit<RoveOptions, 'onMove'> {
  /** 沒有寫 role 的項目要補上的 role。容器的 role 就是 behavior 本身。 */
  itemRole: string;
}

/**
 * 宣告一個 tablist 或 menu 的焦點群組。
 *
 * 容器與項目的 role 一律寫在 DOM 上。原生 focusgroup 遇到明確 role 只是跳過推斷，鍵盤行為照常，
 * 而只看 DOM 的工具（axe、Playwright 的 getByRole、呼叫端的 `[role="tab"]` 選擇器）才不會因瀏覽器而異。
 *
 * 支援原生 focusgroup 的瀏覽器把方向鍵與單一 Tab 停駐點交給瀏覽器，其他瀏覽器用 `rove()` 補上。
 * 兩條路都是 `nomemory`：從外面進來時落在 `current`（例如已選的 tab），而不是上次停留的那一項。
 *
 * 回傳 `sync`，`current` 改變後呼叫它。
 */
export function focusgroup(
  container: HTMLElement,
  behavior: FocusgroupBehavior,
  options: FocusgroupOptions,
): () => void {
  container.setAttribute('role', behavior);
  for (const item of options.items()) {
    if (!item.hasAttribute('role')) item.setAttribute('role', options.itemRole);
  }

  if (hasNativeFocusgroup(behavior)) {
    container.setAttribute('focusgroup', `${behavior} nomemory`);
    const sync = (): void => {
      const entry = options.current?.();
      for (const item of options.items()) item.toggleAttribute('focusgroupstart', item === entry);
    };
    sync();
    return sync;
  }
  return rove(container, options);
}

/**
 * 捲動 `scroller` 讓 `item` 完整露出，只捲它自己。
 *
 * `scrollIntoView()` 會連所有可捲動的祖先（包括頁面）一起捲；能限制範圍的 `container` 選項
 * 目前只有新版 Chromium 認得，其他瀏覽器會忽略，所以自己算位移。
 */
export function reveal(scroller: HTMLElement, item: HTMLElement): void {
  const outer = scroller.getBoundingClientRect();
  const inner = item.getBoundingClientRect();
  // 可見範圍要扣掉邊框；clientWidth／clientHeight 已經不含捲軸
  const top = outer.top + scroller.clientTop;
  const left = outer.left + scroller.clientLeft;
  const bottom = top + scroller.clientHeight;
  const right = left + scroller.clientWidth;
  // 用差值調整，不用絕對位置：由右至左時 scrollLeft 是負的，差值的方向不受影響
  if (inner.top < top) scroller.scrollTop -= top - inner.top;
  else if (inner.bottom > bottom) scroller.scrollTop += inner.bottom - bottom;
  if (inner.left < left) scroller.scrollLeft -= left - inner.left;
  else if (inner.right > right) scroller.scrollLeft += inner.right - right;
}

/** 切換 documentElement 的 data-theme，值為 tokens.json 的 theme id。 */
export function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
}
