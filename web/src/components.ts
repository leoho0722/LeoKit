import { h, cx, icon, uid, type Attrs, type Child, type LKGlyph } from './dom.js';

/* ---------------------------------- Button --------------------------------- */

export type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'plain' | 'destructive';
export type ControlSize = 'sm' | 'md' | 'lg';

export interface ButtonOptions {
  /** 動詞開頭的祈使句。「新增訂閱」而不是「確定」。 */
  label: string;
  /** 預設 'primary'。一個畫面最多一個 primary。 */
  variant?: ButtonVariant;
  /** 預設 'md'（44px，同時滿足 iOS 的最小觸控）。 */
  size?: ControlSize;
  icon?: LKGlyph;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /** 標籤無法說明用途時必填。 */
  ariaLabel?: string;
  onClick?: (ev: MouseEvent) => void;
  class?: string;
}

const TYPE_CLASS: Record<ControlSize, string> = { sm: 'label-sm', md: 'label', lg: 'label-lg' };

export function Button(options: ButtonOptions): HTMLButtonElement {
  const size = options.size ?? 'md';
  return h(
    'button',
    {
      type: options.type ?? 'button',
      class: cx(
        'lk-btn',
        `lk-btn--${options.variant ?? 'primary'}`,
        size !== 'md' && `lk-btn--${size}`,
        options.fullWidth && 'lk-btn--full',
        TYPE_CLASS[size],
        options.class,
      ),
      disabled: options.disabled,
      'aria-label': options.ariaLabel,
      onClick: options.onClick,
    } as Attrs,
    [options.icon ? icon(options.icon, 'lk-btn__icon') : null, options.label],
  );
}

/* -------------------------------- TextField -------------------------------- */

export interface TextFieldOptions {
  /** 永遠顯示在輸入框上方。不要用 placeholder 取代 label。 */
  label?: string;
  placeholder?: string;
  value?: string;
  icon?: LKGlyph;
  help?: string;
  /** 有值即進入錯誤態：邊框轉 danger、顯示帶圖示的錯誤訊息。會覆蓋 help。 */
  error?: string;
  multiline?: boolean;
  disabled?: boolean;
  type?: string;
  id?: string;
  class?: string;
}

export function TextField(options: TextFieldOptions): HTMLDivElement {
  const id = options.id ?? uid('lk-field');
  const describedBy = options.error || options.help ? `${id}-desc` : undefined;
  const input = h(
    options.multiline ? 'textarea' : 'input',
    {
      id,
      class: cx('lk-input', options.multiline && 'lk-textarea', 'body'),
      type: options.multiline ? null : (options.type ?? 'text'),
      placeholder: options.placeholder,
      value: options.multiline ? null : options.value,
      disabled: options.disabled,
      'aria-invalid': options.error ? 'true' : null,
      'aria-describedby': describedBy,
    } as Attrs,
    options.multiline && options.value ? [options.value] : [],
  );

  let below: HTMLElement | null = null;
  if (options.error) {
    below = h('div', { id: describedBy, class: 'lk-field__error footnote' }, [icon('alert'), options.error]);
  } else if (options.help) {
    below = h('div', { id: describedBy, class: 'lk-field__help footnote', text: options.help });
  }

  return h('div', { class: cx('lk-field', options.error && 'lk-field--error', options.class) }, [
    options.label ? h('label', { class: 'lk-field__label subhead', for: id, text: options.label } as Attrs) : null,
    h('div', { class: cx('lk-field__wrap', options.icon && 'lk-field__wrap--lead') }, [
      options.icon ? icon(options.icon, 'lk-field__lead') : null,
      input,
    ]),
    below,
  ]);
}

/* ----------------------------------- Card ---------------------------------- */

export type CardElevation = 'flat' | 'resting' | 'raised';

export interface CardOptions {
  children?: Child[];
  /** 'resting'（預設）｜'flat'｜'raised'。深色主題請用 'flat'。 */
  elevation?: CardElevation;
  /** 內距歸零並裁切內容，用於整張卡片就是一個 List 的情況。 */
  flush?: boolean;
  selected?: boolean;
  class?: string;
}

export function Card(options: CardOptions = {}): HTMLDivElement {
  const modifier =
    options.elevation === 'flat' ? 'lk-card--flat' : options.elevation === 'raised' ? 'lk-card--raised' : null;
  return h(
    'div',
    { class: cx('lk-card', modifier, options.flush && 'lk-card--flush', options.selected && 'lk-card--selected', options.class) },
    options.children ?? [],
  );
}

/* --------------------------------- ListRow --------------------------------- */

export interface ListOptions {
  children?: Child[];
  class?: string;
}

export function List(options: ListOptions = {}): HTMLUListElement {
  return h('ul', { class: cx('lk-list', options.class), role: 'list' }, options.children ?? []);
}

export interface ListRowOptions {
  title: string;
  subtitle?: string;
  /** 尾端的靜態文字，例如金額或日期。 */
  value?: string;
  icon?: LKGlyph;
  /** 尾端自訂元素，例如 Badge 或 switch。 */
  trailing?: Node;
  /** 顯示 chevron 並讓整列可點。 */
  chevron?: boolean;
  href?: string;
  selected?: boolean;
  onClick?: (ev: MouseEvent) => void;
  class?: string;
}

export function ListRow(options: ListRowOptions): HTMLElement {
  const body: Child[] = [h('span', { class: 'lk-row__title headline', text: options.title })];
  if (options.subtitle) body.push(h('span', { class: 'lk-row__sub footnote', text: options.subtitle }));

  const trail: Child[] = [];
  if (options.value) trail.push(h('span', { class: 'callout', text: options.value }));
  if (options.trailing) trail.push(options.trailing);
  if (options.chevron) trail.push(icon('chevron', 'lk-row__chevron'));

  const tappable = Boolean(options.onClick || options.href || options.chevron);
  const tag = options.href ? 'a' : tappable ? 'button' : 'li';

  return h(
    tag as 'a' | 'button' | 'li',
    {
      class: cx('lk-row', tappable && 'lk-row--tappable', options.selected && 'lk-row--selected', options.class),
      href: options.href,
      type: tag === 'button' ? 'button' : null,
      'aria-current': options.selected ? 'true' : null,
      onClick: options.onClick,
    } as Attrs,
    [
      options.icon ? h('span', { class: 'lk-row__lead' }, [icon(options.icon)]) : null,
      h('span', { class: 'lk-row__body' }, body),
      trail.length ? h('span', { class: 'lk-row__trail' }, trail) : null,
    ],
  );
}

/* ---------------------------------- Badge ---------------------------------- */

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'count';

export interface BadgeOptions {
  /** 狀態必須由文字說明 —— 顏色只是加速辨識。 */
  label: string;
  tone?: BadgeTone;
  icon?: LKGlyph;
  /** 以圓點取代圖示。 */
  dot?: boolean;
  class?: string;
}

export function Badge(options: BadgeOptions): HTMLSpanElement {
  const tone = options.tone ?? 'neutral';
  const lead: Child[] = options.dot
    ? [h('span', { class: 'lk-badge__dot' })]
    : options.icon
      ? [icon(options.icon)]
      : [];
  return h('span', { class: cx('lk-badge', tone !== 'neutral' && `lk-badge--${tone}`, 'label-sm', options.class) }, [
    ...lead,
    options.label,
  ]);
}

/* ---------------------------------- Banner --------------------------------- */

export type BannerTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BannerOptions {
  /** 先說發生什麼、再說怎麼辦。 */
  message: string;
  title?: string;
  tone?: BannerTone;
  icon?: LKGlyph;
  /** 最多一個，且要能真的解決問題。 */
  actions?: Node[];
  /** 給了才顯示關閉鈕。無法被使用者解決的問題不要給。 */
  onDismiss?: () => void;
  dismissLabel?: string;
  class?: string;
}

export function Banner(options: BannerOptions): HTMLDivElement {
  const tone = options.tone ?? 'neutral';
  const body: Child[] = [];
  if (options.title) body.push(h('p', { class: 'lk-banner__title headline', text: options.title }));
  body.push(h('p', { class: 'lk-banner__text callout', text: options.message }));
  if (options.actions?.length) body.push(h('div', { class: 'lk-banner__actions' }, options.actions));

  return h(
    'div',
    {
      class: cx('lk-banner', tone !== 'neutral' && `lk-banner--${tone}`, options.class),
      role: tone === 'danger' ? 'alert' : 'status',
    },
    [
      options.icon ? icon(options.icon) : null,
      h('div', { class: 'lk-banner__body' }, body),
      options.onDismiss
        ? h('button', {
            type: 'button',
            class: 'lk-banner__close',
            'aria-label': options.dismissLabel ?? '關閉提示',
            onClick: options.onDismiss,
          } as Attrs, [icon('close')])
        : null,
    ],
  );
}

/* --------------------------- Checkbox / Radio ------------------------------ */

/** Checkbox 的三種狀態。`'mixed'` 是父項部分選取，方框顯示橫線而非勾。 */
export type CheckedState = boolean | 'mixed';

export interface ChoiceOptions {
  /** 可換行；方框對齊第一行。沒有 label 時必填 `ariaLabel`。 */
  label?: string;
  /** 標籤下方的一行說明。 */
  description?: string;
  checked?: CheckedState;
  /** Radio 用：這個選項代表的值，會原封不動傳給 `onChange`。 */
  value?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Checkbox 收到新的勾選狀態；Radio 收到 `value`。 */
  onChange?: (next: boolean | string) => void;
  class?: string;
}

function choice(options: ChoiceOptions, kind: 'checkbox' | 'radio'): HTMLButtonElement {
  const mark =
    kind === 'radio'
      ? h('span', { class: 'lk-choice__dot' })
      : options.checked === 'mixed'
        ? h('span', { class: 'lk-choice__dash' })
        : icon('check');
  const body: Child[] = [h('span', { class: 'body', text: options.label ?? '' })];
  if (options.description) {
    body.push(h('span', { class: 'lk-choice__desc footnote', text: options.description }));
  }

  const button = h(
    'button',
    {
      type: 'button',
      role: kind,
      class: cx('lk-choice', kind === 'radio' && 'lk-choice--radio', options.class),
      'aria-checked': options.checked === 'mixed' ? 'mixed' : String(options.checked === true),
      'aria-label': options.label ? undefined : options.ariaLabel,
      'data-value': options.value,
      disabled: options.disabled,
    } as Attrs,
    [h('span', { class: 'lk-choice__box' }, [mark]), h('span', { class: 'lk-choice__body' }, body)],
  );

  button.addEventListener('click', () => {
    if (kind === 'radio') {
      const group = button.closest('.lk-choice-group');
      group
        ?.querySelectorAll('.lk-choice--radio')
        .forEach((peer) => peer.setAttribute('aria-checked', 'false'));
      button.setAttribute('aria-checked', 'true');
      options.onChange?.(options.value ?? true);
      return;
    }
    // mixed 的父項一律先變成全選，不回到 mixed
    const next = button.getAttribute('aria-checked') !== 'true';
    button.setAttribute('aria-checked', String(next));
    options.onChange?.(next);
  });
  return button;
}

/** 多選，或同意一個條件。要按「儲存」才生效的選項用這個，立即生效的用 `Toggle`。 */
export function Checkbox(options: ChoiceOptions): HTMLButtonElement {
  return choice(options, 'checkbox');
}

/** 從一組互斥選項選一個，且所有選項都要看得見。一定要包在 `ChoiceGroup({ radio: true })` 裡。 */
export function Radio(options: ChoiceOptions): HTMLButtonElement {
  return choice(options, 'radio');
}

export interface ChoiceGroupOptions {
  children: Node[];
  /** Radio 群組必填 true —— 互斥行為與 `role="radiogroup"` 都由容器提供。 */
  radio?: boolean;
  /** 說明這一組在選什麼，必填。 */
  ariaLabel?: string;
  class?: string;
}

/** Checkbox 或 Radio 的群組容器。Radio 的互斥行為由它負責。 */
export function ChoiceGroup(options: ChoiceGroupOptions): HTMLDivElement {
  return h(
    'div',
    {
      class: cx('lk-choice-group', options.class),
      role: options.radio ? 'radiogroup' : 'group',
      'aria-label': options.ariaLabel,
    },
    options.children,
  );
}

/* ---------------------------------- Toggle --------------------------------- */

export interface ToggleOptions {
  /** 寫「開啟後會發生什麼」的肯定句。沒有 label 時必填 `ariaLabel`。 */
  label?: string;
  checked?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onChange?: (next: boolean) => void;
  class?: string;
}

/** 開關一個立即生效的設定。狀態由呼叫端持有，元件不自己記。 */
export function Toggle(options: ToggleOptions): HTMLButtonElement {
  const button = h(
    'button',
    {
      type: 'button',
      role: 'switch',
      class: cx('lk-toggle', options.fullWidth && 'lk-toggle--full', options.class),
      'aria-checked': String(options.checked === true),
      'aria-label': options.label ? undefined : options.ariaLabel,
      disabled: options.disabled,
    } as Attrs,
    [
      options.label ? h('span', { class: 'body', text: options.label }) : null,
      h('span', { class: 'lk-toggle__track' }, [h('span', { class: 'lk-toggle__knob' })]),
    ],
  );
  button.addEventListener('click', () => {
    const next = button.getAttribute('aria-checked') !== 'true';
    button.setAttribute('aria-checked', String(next));
    options.onChange?.(next);
  });
  return button;
}

/* ---------------------------- SegmentedControl ----------------------------- */

export interface SegmentedItem {
  /** 名詞而非動詞，長度接近其他選項。 */
  label: string;
  value: string;
}

export interface SegmentedControlOptions {
  /** 2–4 個；超過就改用可捲動的 Tabs。 */
  items: SegmentedItem[];
  /** 受控值；沒給時選第一項。沒有「全不選」狀態。 */
  value?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
  onChange?: (value: string) => void;
  class?: string;
}

/** 在少數幾個互斥的檢視或篩選條件之間切換。切換後立即生效，不需要「套用」。 */
export function SegmentedControl(options: SegmentedControlOptions): HTMLDivElement {
  const selected = options.value ?? options.items[0]?.value;
  const root = h('div', {
    class: cx('lk-seg', options.fullWidth && 'lk-seg--full', options.class),
    role: 'tablist',
    'aria-label': options.ariaLabel,
  });

  for (const item of options.items) {
    const tab = h('button', {
      type: 'button',
      role: 'tab',
      class: 'lk-seg__item label',
      'aria-selected': String(item.value === selected),
      'data-value': item.value,
      text: item.label,
    });
    tab.addEventListener('click', () => {
      for (const peer of root.children) peer.setAttribute('aria-selected', 'false');
      tab.setAttribute('aria-selected', 'true');
      options.onChange?.(item.value);
    });
    root.appendChild(tab);
  }
  return root;
}

/* ----------------------------------- Chip ---------------------------------- */

export interface ChipOptions {
  /** 名詞、6 個中文字以內，不要截斷。 */
  label: string;
  selected?: boolean;
  icon?: LKGlyph;
  /** 尾端帶叉叉，點擊時呼叫 `onRemove` 而不是切換選取。 */
  removable?: boolean;
  disabled?: boolean;
  /** 可移除的 Chip 必填「移除 <名稱>」。 */
  ariaLabel?: string;
  onChange?: (selected: boolean) => void;
  onRemove?: () => void;
  class?: string;
}

/** 一個可點的短標籤：篩選、多選、或可移除的已選項目。不可點的狀態標記用 `Badge`。 */
export function Chip(options: ChipOptions): HTMLButtonElement {
  const children: Child[] = [];
  if (options.icon) children.push(icon(options.icon));
  children.push(options.label);
  if (options.removable) children.push(icon('close', 'lk-chip__remove'));

  const button = h(
    'button',
    {
      type: 'button',
      class: cx('lk-chip', 'label', options.class),
      'aria-pressed': String(options.selected === true),
      'aria-label': options.ariaLabel,
      disabled: options.disabled,
    } as Attrs,
    children,
  );
  button.addEventListener('click', () => {
    if (options.removable) {
      options.onRemove?.();
      return;
    }
    const next = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(next));
    options.onChange?.(next);
  });
  return button;
}

/* ---------------------------------- AppBar --------------------------------- */

export interface AppBarOptions {
  /** 就是這個畫面在說什麼，不要放 App 名稱。 */
  title: string;
  /** 最前面的元素，通常是返回或關閉鈕。 */
  leading?: Node;
  /** 最多兩個圖示動作；更多請收進 `Menu`。 */
  actions?: Node[];
  /** iOS 風格的標題置中。Android 一律靠左。 */
  centered?: boolean;
  /** 內容捲動後改用陰影取代分隔線。 */
  scrolled?: boolean;
  class?: string;
}

/** 畫面最上方的列：標題、返回、以及該畫面層級的動作。安全區內距由版面容器處理。 */
export function AppBar(options: AppBarOptions): HTMLElement {
  return h(
    'header',
    {
      class: cx(
        'lk-appbar',
        options.centered && 'lk-appbar--centered',
        options.scrolled && 'lk-appbar--scrolled',
        options.class,
      ),
    },
    [
      options.leading ?? null,
      h('h1', { class: 'lk-appbar__title headline', text: options.title }),
      options.actions?.length ? h('div', { class: 'lk-appbar__actions' }, options.actions) : null,
    ],
  );
}

/* ---------------------------------- TabBar --------------------------------- */

export interface TabBarItem {
  /** 名詞、四個中文字以內。 */
  label: string;
  icon: LKGlyph;
  value: string;
  /** 未讀數量或小圓點的文字；沒有就不顯示。 */
  badge?: string;
}

export interface TabBarOptions {
  /** 3–5 個頂層區塊；超過 5 個請改用側邊欄或抽屜。 */
  items: TabBarItem[];
  /** 受控值；沒給時選第一項。 */
  value?: string;
  ariaLabel?: string;
  onChange?: (value: string) => void;
  class?: string;
}

/** App 的主導覽：在 3–5 個平行的頂層區塊之間切換。導覽狀態由呼叫端持有。 */
export function TabBar(options: TabBarOptions): HTMLElement {
  const items = options.items.slice(0, 5);
  const current = options.value ?? items[0]?.value;
  const root = h('nav', {
    class: cx('lk-tabbar', options.class),
    'aria-label': options.ariaLabel ?? '主導覽',
  });

  for (const item of items) {
    const button = h(
      'button',
      {
        type: 'button',
        class: 'lk-tabbar__item caption',
        'aria-current': item.value === current ? 'page' : undefined,
        'data-value': item.value,
      } as Attrs,
      [
        h('span', { class: 'lk-tabbar__icon' }, [
          icon(item.icon),
          item.badge ? h('span', { class: 'lk-tabbar__badge label-sm', text: item.badge }) : null,
        ]),
        h('span', { text: item.label }),
      ],
    );
    button.addEventListener('click', () => {
      for (const peer of root.children) peer.removeAttribute('aria-current');
      button.setAttribute('aria-current', 'page');
      options.onChange?.(item.value);
    });
    root.appendChild(button);
  }
  return root;
}

/* ----------------------------------- Tabs ---------------------------------- */

export interface TabItem {
  label: string;
  value: string;
  icon?: LKGlyph;
  /** 數量標記，例如未讀筆數。 */
  badge?: string;
  badgeTone?: BadgeTone;
}

export interface TabsOptions {
  items: TabItem[];
  /** 受控值；沒給時選第一項。 */
  value?: string;
  /** 撐滿容器並平分寬度，用於 2–3 個 tab。 */
  fill?: boolean;
  ariaLabel?: string;
  onChange?: (value: string) => void;
  class?: string;
}

/** 在同一層級的幾個內容區之間切換。切換後的內容由呼叫端渲染，元件不管內容。 */
export function Tabs(options: TabsOptions): HTMLDivElement {
  const current = options.value ?? options.items[0]?.value;
  const root = h('div', {
    class: cx('lk-tabs', options.fill && 'lk-tabs--fill', options.class),
    role: 'tablist',
    'aria-label': options.ariaLabel,
  });

  for (const item of options.items) {
    const children: Child[] = [];
    if (item.icon) children.push(icon(item.icon, 'lk-btn__icon'));
    children.push(item.label);
    if (item.badge) children.push(Badge({ label: item.badge, tone: item.badgeTone }));

    const tab = h(
      'button',
      {
        type: 'button',
        role: 'tab',
        class: 'lk-tabs__item label',
        'aria-selected': String(item.value === current),
        'data-value': item.value,
      } as Attrs,
      children,
    );
    tab.addEventListener('click', () => {
      for (const peer of root.children) peer.setAttribute('aria-selected', 'false');
      tab.setAttribute('aria-selected', 'true');
      options.onChange?.(item.value);
    });
    root.appendChild(tab);
  }
  return root;
}

/* ---------------------------------- Sheet ---------------------------------- */

export interface SheetOptions {
  /** 會被朗讀為這個 dialog 的名稱。 */
  title?: string;
  subtitle?: string;
  /** 動作或表單內容。 */
  children?: Node[];
  /** 頂部的把手，預設顯示。不可滑動關閉時傳 false。 */
  grabber?: boolean;
  class?: string;
}

/** 由下往上推出的面板。開關狀態與焦點移動由呼叫端持有，元件只負責內容。 */
export function Sheet(options: SheetOptions): HTMLElement {
  return h(
    'section',
    {
      class: cx('lk-sheet', options.class),
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': options.title,
    } as Attrs,
    [
      options.grabber === false ? null : h('div', { class: 'lk-sheet__grabber' }),
      options.title ? h('h2', { class: 'lk-sheet__title title-2', text: options.title }) : null,
      options.subtitle ? h('p', { class: 'lk-sheet__sub callout', text: options.subtitle }) : null,
      h('div', { class: 'lk-sheet__actions' }, options.children ?? []),
    ],
  );
}

/* ---------------------------------- Dialog --------------------------------- */

export interface DialogOptions {
  /** 用問句或結果句，會被朗讀為這個 dialog 的名稱。 */
  title: string;
  /** 說明後果，不要重複標題。 */
  body?: string;
  /** Button 陣列。取消在左、主要動作在右（Web 與 Android 慣例）。 */
  actions?: Node[];
  /** 按鈕上下堆疊，用於動作文字較長時。 */
  stacked?: boolean;
  class?: string;
}

/** 打斷使用者、要求一個決定的對話框。焦點鎖與 Esc 請交給原生 `dialog` 元素或呼叫端處理。 */
export function Dialog(options: DialogOptions): HTMLDivElement {
  return h(
    'div',
    {
      class: cx('lk-dialog', options.class),
      role: 'alertdialog',
      'aria-modal': 'true',
      'aria-label': options.title,
    } as Attrs,
    [
      h('h2', { class: 'lk-dialog__title title-3', text: options.title }),
      options.body ? h('p', { class: 'lk-dialog__body callout', text: options.body }) : null,
      h(
        'div',
        { class: cx('lk-dialog__actions', options.stacked && 'lk-dialog__actions--stacked') },
        options.actions ?? [],
      ),
    ],
  );
}

/* ----------------------------------- Menu ---------------------------------- */

export interface MenuAction {
  label: string;
  icon?: LKGlyph;
  /** 尾端的補充說明，例如快速鍵。 */
  hint?: string;
  /** 有值時這一項是單選項，會用 `menuitemradio` 並標上 `aria-checked`。 */
  checked?: boolean;
  /** 破壞性動作，文字轉為 danger。 */
  danger?: boolean;
  disabled?: boolean;
  onSelect?: (ev: MouseEvent) => void;
}

/** 分隔線。 */
export interface MenuSeparator {
  separator: true;
}

/** 一組項目的小標題。 */
export interface MenuGroup {
  group: string;
}

export type MenuItem = MenuAction | MenuSeparator | MenuGroup;

export interface MenuOptions {
  /** 行動端超過 6 項請改用 `Sheet`。 */
  items: MenuItem[];
  ariaLabel?: string;
  class?: string;
}

/** 從一個觸發點展開的動作清單。開關與定位由呼叫端處理。 */
export function Menu(options: MenuOptions): HTMLDivElement {
  const root = h('div', {
    class: cx('lk-menu', options.class),
    role: 'menu',
    'aria-label': options.ariaLabel,
  });

  for (const item of options.items) {
    if ('separator' in item) {
      root.appendChild(h('hr', { class: 'lk-menu__sep' }));
      continue;
    }
    if ('group' in item) {
      root.appendChild(h('div', { class: 'lk-menu__group label-sm', text: item.group }));
      continue;
    }
    const children: Child[] = [];
    if (item.icon) children.push(icon(item.icon));
    children.push(h('span', { class: 'lk-menu__label body', text: item.label }));
    if (item.hint) children.push(h('span', { class: 'lk-menu__hint footnote', text: item.hint }));
    if (item.checked) children.push(icon('check'));

    root.appendChild(
      h(
        'button',
        {
          type: 'button',
          role: item.checked === undefined ? 'menuitem' : 'menuitemradio',
          class: cx('lk-menu__item', item.danger && 'lk-menu__item--danger'),
          'aria-checked': item.checked === undefined ? undefined : String(item.checked),
          disabled: item.disabled,
          onClick: item.onSelect,
        } as Attrs,
        children,
      ),
    );
  }
  return root;
}

/* ----------------------------------- Toast --------------------------------- */

export type ToastTone = 'default' | 'danger';

export interface ToastOptions {
  /** 一句話說完，不要放標題。 */
  message: string;
  tone?: ToastTone;
  icon?: LKGlyph;
  /** 動作的文字。這個動作必須也能從別處觸達，鍵盤使用者可能來不及 Tab 到它。 */
  action?: string;
  onAction?: (ev: MouseEvent) => void;
  class?: string;
}

/** 短暫的操作回饋。Toast 不搶焦點，顯示時機、佇列與自動消失由呼叫端管理。 */
export function Toast(options: ToastOptions): HTMLDivElement {
  const isDanger = options.tone === 'danger';
  return h(
    'div',
    {
      class: cx('lk-toast', isDanger && 'lk-toast--danger', options.class),
      role: isDanger ? 'alert' : 'status',
      'aria-live': isDanger ? 'assertive' : 'polite',
    },
    [
      options.icon ? icon(options.icon) : null,
      h('span', { class: 'lk-toast__msg callout', text: options.message }),
      options.action
        ? h('button', {
            type: 'button',
            class: 'lk-toast__action label',
            text: options.action,
            onClick: options.onAction,
          } as Attrs)
        : null,
    ],
  );
}

/* ------------------------------------ Tip ---------------------------------- */

export type TipForm = 'inline' | 'anchored';
export type TipArrow = 'top' | 'bottom' | 'left' | 'right';

export interface TipOptions {
  /** 一句話說這個功能能做什麼。 */
  title: string;
  message?: string;
  /** `inline` 是版面裡的一塊；`anchored` 帶箭頭指向某個元素。 */
  form?: TipForm;
  icon?: LKGlyph;
  actions?: Node[];
  /** `anchored` 時箭頭指向哪一邊，預設 top。 */
  arrow?: TipArrow;
  /** 給了才顯示關閉鈕。按下的後果是永久的，所以標籤要說清楚。 */
  onDismiss?: () => void;
  dismissLabel?: string;
  class?: string;
}

/** 功能發現提示。Tip 不搶焦點；要不要顯示請先問 `tipShouldShow`。 */
export function Tip(options: TipOptions): HTMLDivElement {
  const anchored = options.form === 'anchored';
  const body: Child[] = [h('p', { class: 'lk-tip__title headline', text: options.title })];
  if (options.message) body.push(h('p', { class: 'lk-tip__text callout', text: options.message }));
  if (options.actions?.length) body.push(h('div', { class: 'lk-tip__actions' }, options.actions));

  return h(
    'div',
    {
      class: cx('lk-tip', anchored ? 'lk-tip--anchored' : 'lk-tip--inline', options.class),
      role: 'note',
      'data-arrow': anchored ? (options.arrow ?? 'top') : undefined,
    } as Attrs,
    [
      anchored ? h('span', { class: 'lk-tip__arrow', 'aria-hidden': 'true' } as Attrs) : null,
      icon(options.icon ?? 'lightbulb'),
      h('div', { class: 'lk-tip__body' }, body),
      options.onDismiss
        ? h('button', {
            type: 'button',
            class: 'lk-tip__close',
            'aria-label': options.dismissLabel ?? '不再顯示這個提示',
            onClick: options.onDismiss,
          } as Attrs, [icon('close')])
        : null,
    ],
  );
}

export interface TipRule {
  /** 這個提示的識別碼，跨平台共用同一個字串。 */
  id: string;
  /** 最多顯示幾次，預設 1。 */
  maxDisplays?: number;
  /** 額外條件，回傳 false 就不顯示。 */
  when?: () => boolean;
}

interface TipRecord {
  shown: number;
  done: boolean;
}

const TIP_KEY = 'leokit.tips';

/** 讀出所有提示的狀態。瀏覽器可能擋掉儲存，讀不到就當作還沒看過。 */
function tipState(): Record<string, TipRecord> {
  try {
    return JSON.parse(window.localStorage.getItem(TIP_KEY) ?? '{}') as Record<string, TipRecord>;
  } catch {
    return {};
  }
}

function tipWrite(next: Record<string, TipRecord>): void {
  try {
    window.localStorage.setItem(TIP_KEY, JSON.stringify(next));
  } catch {
    // 儲存被擋掉時就不記；寧可多顯示一次，也不要該顯示卻不顯示
  }
}

function tipRecord(id: string): TipRecord {
  return tipState()[id] ?? { shown: 0, done: false };
}

/**
 * 這個提示現在該不該顯示。
 *
 * iOS 這一段交給 TipKit，`TipRule` 的欄位刻意與它對齊，
 * 這樣「哪些提示、什麼時候出現」可以寫成一份跨平台的清單。
 */
export function tipShouldShow(rule: TipRule): boolean {
  if (!rule.id) return true;
  if (rule.when && !rule.when()) return false;
  const record = tipRecord(rule.id);
  if (record.done) return false;
  return record.shown < (rule.maxDisplays ?? 1);
}

/** 顯示之後呼叫，把顯示次數加一。 */
export function tipShown(id: string): void {
  if (!id) return;
  const all = tipState();
  const record = tipRecord(id);
  all[id] = { shown: record.shown + 1, done: record.done };
  tipWrite(all);
}

/** 使用者按下「不再顯示」時呼叫，之後永遠不再顯示。 */
export function tipDismiss(id: string): void {
  if (!id) return;
  const all = tipState();
  all[id] = { shown: tipRecord(id).shown, done: true };
  tipWrite(all);
}

/** 清掉提示的狀態。不給 id 就全部清掉，通常只在測試或設定頁的「重設導覽」用。 */
export function tipReset(id?: string): void {
  if (id === undefined) {
    tipWrite({});
    return;
  }
  const all = tipState();
  delete all[id];
  tipWrite(all);
}

/* ---------------------------------- Avatar --------------------------------- */

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarOptions {
  /** 完整名稱。沒有圖片時取首字，同時當作無障礙標籤。 */
  name?: string;
  /** 圖片網址。載入失敗的退階由呼叫端處理（清掉 src 重繪）。 */
  src?: string;
  size?: AvatarSize;
  /** 品牌色底，用於服務或方案。 */
  tone?: 'neutral' | 'brand';
  /** 方形代表服務或品牌，圓形代表人。這個形狀差異是語意，不是裝飾。 */
  square?: boolean;
  /** 旁邊已經有名字文字時不要給，避免閱讀器念兩次。 */
  ariaLabel?: string;
  class?: string;
}

/** 中日韓取第一個字，拉丁字母取前兩個詞的首字母。 */
function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const first = trimmed.charAt(0);
  if (/[　-鿿가-힯]/.test(first)) return first;
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** 代表一個人或一個服務的小圖。退階順序是圖片 → 首字 → 字形。 */
export function Avatar(options: AvatarOptions): HTMLSpanElement {
  const label = options.name ?? options.ariaLabel;
  let children: Child[];
  if (options.src) {
    children = [h('img', { src: options.src, alt: options.name ?? '', loading: 'lazy' })];
  } else if (options.name) {
    children = [
      h('span', {
        class: options.size === 'lg' ? 'title-3' : 'label',
        text: initials(options.name),
      }),
    ];
  } else {
    children = [icon('user')];
  }

  return h(
    'span',
    {
      class: cx(
        'lk-avatar',
        options.size && options.size !== 'md' && `lk-avatar--${options.size}`,
        options.tone === 'brand' && 'lk-avatar--brand',
        options.square && 'lk-avatar--square',
        options.class,
      ),
      role: 'img',
      'aria-label': label,
      'aria-hidden': label ? undefined : 'true',
    } as Attrs,
    children,
  );
}

/* -------------------------------- EmptyState ------------------------------- */

export interface EmptyStateOptions {
  /** 一句陳述，說明現在沒有什麼。 */
  title: string;
  /** 說明接下來能做什麼。 */
  body?: string;
  icon?: LKGlyph;
  /** 最多兩個，第一個是主要動作。 */
  actions?: Node[];
  /** 放在卡片或區塊裡時用，上下留白減半。 */
  compact?: boolean;
  class?: string;
}

/** 一個區域目前沒有內容時該顯示什麼。用一句陳述加一個動作，不要只寫「沒有資料」。 */
export function EmptyState(options: EmptyStateOptions): HTMLDivElement {
  return h('div', { class: cx('lk-empty', options.compact && 'lk-empty--compact', options.class) }, [
    options.icon ? h('div', { class: 'lk-empty__icon' }, [icon(options.icon)]) : null,
    h('h2', { class: 'lk-empty__title title-3', text: options.title }),
    options.body ? h('p', { class: 'lk-empty__body callout', text: options.body }) : null,
    options.actions?.length ? h('div', { class: 'lk-empty__actions' }, options.actions) : null,
  ]);
}

/* --------------------------------- Progress -------------------------------- */

export interface ProgressOptions {
  /** 0–100。省略就是「不知道還要多久」的不確定狀態。 */
  value?: number;
  tone?: 'brand' | 'success';
  /** 說明在進行什麼，必填。 */
  ariaLabel?: string;
  class?: string;
}

/** 一條進度軌道。知道進度就給 `value`，不知道就省略。 */
export function Progress(options: ProgressOptions): HTMLDivElement {
  const isIndeterminate = options.value === undefined || options.value === null;
  const bar = h('div', { class: 'lk-progress__bar' });
  if (!isIndeterminate) {
    const clamped = Math.max(0, Math.min(100, options.value as number));
    bar.style.width = `${clamped}%`;
  }

  return h(
    'div',
    {
      class: cx(
        'lk-progress',
        isIndeterminate && 'lk-progress--indeterminate',
        options.tone === 'success' && 'lk-progress--success',
        options.class,
      ),
      role: 'progressbar',
      'aria-label': options.ariaLabel,
      'aria-valuenow': isIndeterminate ? undefined : String(Math.round(options.value as number)),
      'aria-valuemin': isIndeterminate ? undefined : '0',
      'aria-valuemax': isIndeterminate ? undefined : '100',
    } as Attrs,
    [bar],
  );
}

export interface SpinnerOptions {
  ariaLabel?: string;
  class?: string;
}

/** 轉圈圈。只用在小範圍或按鈕內，整頁載入請用 `Skeleton`。 */
export function Spinner(options: SpinnerOptions = {}): HTMLDivElement {
  return h('div', {
    class: cx('lk-spinner', options.class),
    role: 'status',
    'aria-label': options.ariaLabel ?? '載入中',
  });
}

export type SkeletonVariant = 'line' | 'title' | 'circle';

export interface SkeletonOptions {
  variant?: SkeletonVariant;
  /** CSS 長度，例如 `'60%'`。 */
  width?: string;
  class?: string;
}

/** 內容還沒來時的佔位方塊。純色不掃光，且對閱讀器隱藏。 */
export function Skeleton(options: SkeletonOptions = {}): HTMLDivElement {
  const node = h('div', {
    class: cx('lk-skeleton', `lk-skeleton--${options.variant ?? 'line'}`, options.class),
    'aria-hidden': 'true',
  });
  if (options.width) node.style.width = options.width;
  return node;
}

/* ---------------------------------- Table ---------------------------------- */

export type TableSort = 'ascending' | 'descending';

export interface TableColumn {
  /** 對應 `rows` 裡的鍵。 */
  key: string;
  label: string;
  /** 數字欄靠右並用等寬數字。 */
  numeric?: boolean;
  sortable?: boolean;
  /** 目前這一欄的排序方向，會寫進 `aria-sort`。 */
  sort?: TableSort;
  onSort?: (ev: MouseEvent) => void;
}

/** 一列的資料。值可以是字串、數字，或一個 Node（例如 `Badge`）。 */
export type TableRow = Record<string, string | number | Node | undefined>;

export interface TableOptions {
  columns: TableColumn[];
  rows: TableRow[];
  /** 這張表在說什麼，會被閱讀器唸出來。 */
  caption?: string;
  /** 表頭在捲動時固定。 */
  sticky?: boolean;
  class?: string;
}

/** 多欄、可比較的資料。排序、分頁與篩選的邏輯都在呼叫端，元件只負責畫。 */
export function Table(options: TableOptions): HTMLDivElement {
  const head = h(
    'tr',
    null,
    options.columns.map((column) =>
      h(
        'th',
        {
          scope: 'col',
          class: cx('subhead', column.numeric && 'lk-table__num'),
          'aria-sort': column.sort,
        } as Attrs,
        [
          column.sortable
            ? h('button', { type: 'button', class: 'lk-table__sort', onClick: column.onSort } as Attrs, [
                column.label,
                icon('sort'),
              ])
            : column.label,
        ],
      ),
    ),
  );

  const body = options.rows.map((row) =>
    h(
      'tr',
      null,
      options.columns.map((column) => {
        const cell = row[column.key];
        // 不用 `instanceof Node`：宿主環境不一定把 Node 掛在全域上
        const isNode = typeof cell === 'object' && cell !== null;
        return h('td', { class: cx('callout', column.numeric && 'lk-table__num') }, [
          isNode ? cell : cell === undefined ? '' : String(cell),
        ]);
      }),
    ),
  );

  return h('div', { class: cx('lk-table-wrap', options.class) }, [
    h('table', { class: cx('lk-table', options.sticky && 'lk-table--sticky') }, [
      options.caption ? h('caption', { class: 'footnote', text: options.caption }) : null,
      h('thead', null, [head]),
      h('tbody', null, body),
    ]),
  ]);
}

/* ---------------------------------- Slider --------------------------------- */

export interface SliderOptions {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  /** 沒有 label 時必填 `ariaLabel`。 */
  label?: string;
  ariaLabel?: string;
  /** 把數字轉成看得懂的文字，例如加上幣別。同時會寫進 `aria-valuetext`。 */
  format?: (value: number) => string;
  help?: string;
  tone?: 'brand' | 'success';
  disabled?: boolean;
  onChange?: (value: number) => void;
  class?: string;
}

/** 在一個連續範圍裡挑一個值。用原生 `input[type=range]`，鍵盤與閱讀器行為免費取得。 */
export function Slider(options: SliderOptions): HTMLDivElement {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const value = options.value ?? min;
  const format = options.format ?? ((raw: number) => String(raw));

  const output = h('span', {
    class: 'lk-slider-out body-strong',
    text: format(value),
    'aria-hidden': 'true',
  });
  const input = h('input', {
    type: 'range',
    class: cx('lk-slider', options.tone === 'success' && 'lk-slider--success'),
    min: String(min),
    max: String(max),
    step: String(options.step ?? 1),
    value: String(value),
    'aria-label': options.label ? undefined : options.ariaLabel,
    'aria-valuetext': format(value),
    disabled: options.disabled,
  } as Attrs);

  /** 重畫填色比例與數值文字。閱讀器唸的是格式化後的字，不是原始數字。 */
  const paint = (next: number): void => {
    const percent = max === min ? 0 : ((next - min) / (max - min)) * 100;
    input.style.setProperty('--lk-pct', `${percent}%`);
    output.textContent = format(next);
    input.setAttribute('aria-valuetext', format(next));
  };

  input.addEventListener('input', () => {
    const next = Number(input.value);
    paint(next);
    options.onChange?.(next);
  });
  paint(value);

  return h('div', { class: cx('lk-slider-field', options.class) }, [
    options.label ? h('label', { class: 'lk-field__label subhead', text: options.label }) : null,
    h('div', { class: 'lk-slider-row' }, [input, output]),
    options.help ? h('div', { class: 'lk-field__help footnote', text: options.help }) : null,
  ]);
}

/* --------------------------------- Stepper --------------------------------- */

export interface StepperOptions {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  /** 說明在調整什麼，必填。 */
  ariaLabel?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
  onChange?: (value: number) => void;
  class?: string;
}

/** 用加減鈕微調一個小整數。範圍大或需要直接輸入時請用 `TextField`。 */
export function Stepper(options: StepperOptions): HTMLSpanElement {
  const min = options.min ?? 0;
  const max = options.max ?? 99;
  const step = options.step ?? 1;
  let value = options.value ?? min;

  const output = h('span', { class: 'lk-stepper__value body-strong', text: String(value) });
  const decrease = h(
    'button',
    { type: 'button', class: 'lk-stepper__btn', 'aria-label': options.decreaseLabel ?? '減少' } as Attrs,
    [icon('minus')],
  );
  const increase = h(
    'button',
    { type: 'button', class: 'lk-stepper__btn', 'aria-label': options.increaseLabel ?? '增加' } as Attrs,
    [icon('plus')],
  );

  /** 夾到範圍內、更新畫面，並回報新值。到邊界時把那一側的按鈕停用。 */
  const set = (next: number): void => {
    value = Math.max(min, Math.min(max, next));
    output.textContent = String(value);
    decrease.disabled = value <= min;
    increase.disabled = value >= max;
    options.onChange?.(value);
  };

  decrease.addEventListener('click', () => set(value - step));
  increase.addEventListener('click', () => set(value + step));
  decrease.disabled = value <= min;
  increase.disabled = value >= max;

  return h(
    'span',
    { class: cx('lk-stepper', options.class), role: 'group', 'aria-label': options.ariaLabel } as Attrs,
    [decrease, output, increase],
  );
}

/* ------------------------------- PickerField ------------------------------- */

export type PickerKind = 'select' | 'date' | 'time';

export interface PickerFieldOptions {
  label?: string;
  /** 已經格式化好的顯示字串。元件不持有值。 */
  value?: string;
  placeholder?: string;
  kind?: PickerKind;
  help?: string;
  error?: string;
  disabled?: boolean;
  /** 按下欄位時呼叫，由呼叫端打開平台原生的選擇面。 */
  onOpen?: (ev: MouseEvent) => void;
  class?: string;
}

/** 一個看起來像輸入框、但按下去會打開原生選擇器的欄位。元件不自己彈出任何東西。 */
export function PickerField(options: PickerFieldOptions): HTMLDivElement {
  const id = uid('lk-picker');
  const leading = options.kind === 'date' ? 'calendar' : options.kind === 'time' ? 'clock' : null;
  const describedBy = options.error || options.help ? `${id}-d` : undefined;

  const trigger = h(
    'button',
    {
      type: 'button',
      id,
      class: cx('lk-picker', 'body', !options.value && 'lk-picker--placeholder'),
      'aria-haspopup': 'dialog',
      'aria-invalid': options.error ? 'true' : undefined,
      'aria-describedby': describedBy,
      disabled: options.disabled,
      onClick: options.onOpen,
    } as Attrs,
    [
      leading ? icon(leading, 'lk-picker__lead') : null,
      h('span', {
        class: 'lk-picker__value',
        text: options.value ?? options.placeholder ?? '請選擇',
      }),
      icon('chevronDown', 'lk-picker__chevron'),
    ],
  );

  return h('div', { class: cx('lk-field', options.error && 'lk-field--error', options.class) }, [
    options.label
      ? h('label', { class: 'lk-field__label subhead', for: id, text: options.label } as Attrs)
      : null,
    trigger,
    fieldFooter(id, options.error, options.help),
  ]);
}

/** 欄位下方的錯誤或說明。有錯誤就顯示錯誤，兩者都沒有就不佔位置。 */
function fieldFooter(id: string, error?: string, help?: string): Child {
  if (error) {
    return h('div', { id: `${id}-d`, class: 'lk-field__error footnote' }, [icon('alert'), error]);
  }
  if (help) {
    return h('div', { id: `${id}-d`, class: 'lk-field__help footnote', text: help });
  }
  return null;
}

/* -------------------------------- Combobox -------------------------------- */

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxOptions {
  /** 非同步搜尋時由呼叫端替換這個陣列並自行處理載入狀態。 */
  options: ComboboxOption[];
  /** 初始顯示的文字。 */
  value?: string;
  label?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  /** 沒有符合選項時顯示的一行字。 */
  emptyText?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  class?: string;
}

/** 可以打字過濾的選擇欄位。過濾在元件內做，選項來源由呼叫端提供。 */
export function Combobox(options: ComboboxOptions): HTMLDivElement {
  const id = uid('lk-combobox');
  const listId = `${id}-list`;
  const describedBy = options.error || options.help ? `${id}-d` : undefined;
  let active = -1;

  const input = h('input', {
    id,
    class: 'lk-input body',
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    placeholder: options.placeholder,
    value: options.value,
    'aria-expanded': 'false',
    'aria-controls': listId,
    'aria-autocomplete': 'list',
    'aria-invalid': options.error ? 'true' : undefined,
    'aria-describedby': describedBy,
    disabled: options.disabled,
  } as Attrs);

  const panel = h('div', { class: 'lk-menu lk-combobox__panel', id: listId, role: 'listbox' });
  panel.hidden = true;

  const close = (): void => {
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    active = -1;
  };

  const render = (query: string): void => {
    panel.textContent = '';
    const needle = query.toLowerCase();
    const matches = options.options.filter(
      (option) => !needle || option.label.toLowerCase().includes(needle),
    );
    if (matches.length === 0) {
      panel.appendChild(
        h('div', {
          class: 'lk-combobox__empty footnote',
          text: options.emptyText ?? '沒有符合的選項',
        }),
      );
      return;
    }
    matches.forEach((option, index) => {
      const row = h(
        'button',
        {
          type: 'button',
          role: 'option',
          class: 'lk-menu__item',
          'aria-selected': String(index === active),
          'data-value': option.value,
        } as Attrs,
        [h('span', { class: 'lk-menu__label body', text: option.label })],
      );
      row.addEventListener('click', () => {
        input.value = option.label;
        close();
        options.onChange?.(option.value);
      });
      panel.appendChild(row);
    });
  };

  const open = (): void => {
    render(input.value);
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  input.addEventListener('focus', open);
  input.addEventListener('input', () => {
    active = -1;
    open();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (panel.hidden) open();
      const rows = panel.querySelectorAll('[role="option"]');
      if (rows.length === 0) return;
      active =
        event.key === 'ArrowDown'
          ? (active + 1) % rows.length
          : active <= 0
            ? rows.length - 1
            : active - 1;
      rows.forEach((row, index) => row.setAttribute('aria-selected', String(index === active)));
      return;
    }
    if (event.key === 'Enter' && active >= 0) {
      const rows = panel.querySelectorAll<HTMLButtonElement>('[role="option"]');
      const row = rows[active];
      if (row) {
        event.preventDefault();
        row.click();
      }
    }
  });

  return h('div', { class: cx('lk-field', options.error && 'lk-field--error', options.class) }, [
    options.label
      ? h('label', { class: 'lk-field__label subhead', for: id, text: options.label } as Attrs)
      : null,
    h('div', { class: 'lk-combobox' }, [h('div', { class: 'lk-field__wrap' }, [input]), panel]),
    fieldFooter(id, options.error, options.help),
  ]);
}
