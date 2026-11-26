import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  Button, TextField, Card, List, ListRow, Badge, Banner,
  Checkbox, Radio, ChoiceGroup, Toggle, SegmentedControl, Chip,
  AppBar, TabBar, Tabs,
  Sheet, Dialog, Menu, Toast, Tip, tipShouldShow, tipShown, tipDismiss, tipReset,
  Avatar, EmptyState, Progress, Spinner, Skeleton, Table,
  Slider, Stepper, PickerField, Combobox,
  lkTokens, setTheme,
} from '../dist/index.js';

test('Button：variant 與 size 反映在 class 上，並帶對應的字級 class', () => {
  const primary = Button({ label: '儲存訂閱' });
  assert.equal(primary.tagName, 'BUTTON');
  assert.equal(primary.type, 'button');
  assert.match(primary.className, /lk-btn lk-btn--primary/);
  assert.match(primary.className, /\blabel\b/);
  assert.equal(primary.textContent, '儲存訂閱');

  const small = Button({ label: '小', variant: 'secondary', size: 'sm' });
  assert.match(small.className, /lk-btn--secondary/);
  assert.match(small.className, /lk-btn--sm/);
  assert.match(small.className, /label-sm/);
});

test('Button：disabled 會真的停用，icon 會加上 svg', () => {
  const b = Button({ label: '停用', disabled: true, icon: 'plus' });
  assert.equal(b.disabled, true);
  assert.equal(b.querySelectorAll('svg').length, 1);
});

test('Button：onClick 會被呼叫', () => {
  let clicked = 0;
  const b = Button({ label: '點我', onClick: () => { clicked += 1; } });
  b.click();
  assert.equal(clicked, 1);
});

test('TextField：label 與 input 以 for/id 綁定', () => {
  const field = TextField({ label: '服務名稱', value: 'Netflix' });
  const label = field.querySelector('label');
  const input = field.querySelector('input');
  assert.ok(label && input);
  assert.equal(label.getAttribute('for'), input.id);
  assert.notEqual(input.id, '');
});

test('TextField：沒有 label 時用 ariaLabel 命名輸入框', () => {
  const field = TextField({ ariaLabel: '搜尋訂閱', placeholder: '搜尋' });
  const input = field.querySelector('input');
  assert.equal(field.querySelector('label'), null);
  // placeholder 一打字就消失，不能當標籤用
  assert.equal(input.getAttribute('aria-label'), '搜尋訂閱');
});

test('TextField：onInput 逐字回報、onChange 在 change 時回報', () => {
  const typed = [];
  const committed = [];
  const field = TextField({
    label: '服務名稱',
    onInput: (v) => typed.push(v),
    onChange: (v) => committed.push(v),
  });
  const input = field.querySelector('input');

  input.value = 'Net';
  input.dispatchEvent(new window.Event('input'));
  input.value = 'Netflix';
  input.dispatchEvent(new window.Event('input'));
  assert.deepEqual(typed, ['Net', 'Netflix']);
  assert.deepEqual(committed, []);

  input.dispatchEvent(new window.Event('change'));
  assert.deepEqual(committed, ['Netflix']);
});

test('TextField：multiline 也吐同樣的回呼', () => {
  const seen = [];
  const field = TextField({ label: '備註', multiline: true, onInput: (v) => seen.push(v) });
  const area = field.querySelector('textarea');
  area.value = '記一下';
  area.dispatchEvent(new window.Event('input'));
  assert.deepEqual(seen, ['記一下']);
});

test('TextField：錯誤態同時設 aria-invalid、describedby 與 lk-field--error', () => {
  const field = TextField({ label: '每期金額', value: '0', error: '金額需大於 0，請重新輸入。', help: '被覆蓋' });
  const input = field.querySelector('input');
  assert.equal(input.getAttribute('aria-invalid'), 'true');
  assert.match(field.className, /lk-field--error/);
  const desc = field.querySelector('.lk-field__error');
  assert.ok(desc, '錯誤態必須有錯誤訊息元素');
  assert.equal(desc.id, input.getAttribute('aria-describedby'), 'aria-describedby 必須指向錯誤訊息');
  assert.ok(desc.querySelector('svg'), '錯誤訊息前要有警示圖示，不能只靠紅色');
  assert.match(desc.textContent, /金額需大於 0/);
  assert.equal(field.querySelector('.lk-field__help'), null, 'error 應覆蓋 help');
});

test('TextField：每個欄位的 id 都不一樣', () => {
  const a = TextField({ label: 'A' }).querySelector('input').id;
  const b = TextField({ label: 'B' }).querySelector('input').id;
  assert.notEqual(a, b);
});

test('Card：elevation 與修飾類', () => {
  assert.match(Card().className, /^lk-card$/);
  assert.match(Card({ elevation: 'flat' }).className, /lk-card--flat/);
  assert.match(Card({ elevation: 'raised' }).className, /lk-card--raised/);
  assert.match(Card({ flush: true, selected: true }).className, /lk-card--flush.*lk-card--selected/);
});

test('ListRow：一律包在 li 裡，可點的那層才是 button', () => {
  const row = ListRow({
    title: 'Netflix 標準方案',
    subtitle: '每月 3 日扣款',
    value: 'NT$ 390',
    chevron: true,
    onClick: () => {},
  });
  assert.equal(row.tagName, 'LI');
  const inner = row.firstElementChild;
  assert.equal(inner.tagName, 'BUTTON');
  assert.match(inner.className, /lk-row--tappable/);
  assert.ok(inner.querySelector('.lk-row__chevron'));

  const plain = ListRow({ title: '合計', value: 'NT$ 2,480' });
  assert.equal(plain.tagName, 'LI');
  assert.equal(plain.firstElementChild.tagName, 'DIV');
  assert.doesNotMatch(plain.firstElementChild.className, /lk-row--tappable/);
});

test('ListRow：只給 chevron 不給動作會直接擋下來，不做出死按鈕', () => {
  assert.throws(() => ListRow({ title: '設定', chevron: true }), /chevron/);
  assert.doesNotThrow(() => ListRow({ title: '設定', chevron: true, href: '/settings' }));
});

test('ListRow：href 會產生連結', () => {
  const row = ListRow({ title: '說明', href: '/help' });
  assert.equal(row.tagName, 'LI');
  const link = row.firstElementChild;
  assert.equal(link.tagName, 'A');
  assert.equal(link.getAttribute('href'), '/help');
});

test('List：是 ul 且 role=list，子節點一律是 li', () => {
  const list = List({
    children: [ListRow({ title: 'a' }), ListRow({ title: 'b', href: '/b' })],
  });
  assert.equal(list.tagName, 'UL');
  assert.equal(list.getAttribute('role'), 'list');
  assert.equal(list.children.length, 2);
  // <ul> 只收 <li>，塞 <button> 進去閱讀器就不會把它算成清單項目
  for (const child of list.children) assert.equal(child.tagName, 'LI');
});

test('Badge：tone 對應 class，且文字一定存在', () => {
  assert.doesNotMatch(Badge({ label: '串流' }).className, /lk-badge--/);
  assert.match(Badge({ label: '使用中', tone: 'success' }).className, /lk-badge--success/);
  const withDot = Badge({ label: '使用中', tone: 'success', dot: true });
  assert.ok(withDot.querySelector('.lk-badge__dot'));
  assert.match(withDot.textContent, /使用中/, '狀態必須有文字，不能只有顏色');
});

test('Banner：danger 用 role=alert，其餘用 role=status', () => {
  assert.equal(Banner({ message: 'x', tone: 'danger' }).getAttribute('role'), 'alert');
  assert.equal(Banner({ message: 'x' }).getAttribute('role'), 'status');
  assert.equal(Banner({ message: 'x', tone: 'warning' }).getAttribute('role'), 'status');
});

test('Banner：沒給 onDismiss 就不該有關閉鈕', () => {
  assert.equal(Banner({ message: 'x' }).querySelector('.lk-banner__close'), null);
  let dismissed = 0;
  const b = Banner({ message: 'x', onDismiss: () => { dismissed += 1; } });
  b.querySelector('.lk-banner__close').click();
  assert.equal(dismissed, 1);
});

test('setTheme 會寫到 documentElement', () => {
  setTheme('dark');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
  setTheme('light');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'light');
});

test('Checkbox 的部分選取以 aria-checked="mixed" 表達，且方框畫橫線而非勾', () => {
  const box = Checkbox({ label: '全部類別', checked: 'mixed' });
  assert.equal(box.getAttribute('aria-checked'), 'mixed');
  assert.ok(box.querySelector('.lk-choice__dash'), '部分選取要畫橫線');
  assert.equal(box.querySelector('svg'), null, '部分選取不該同時畫勾');
});

test('點擊 mixed 的 Checkbox 變成全選，不回到 mixed', () => {
  const seen = [];
  const box = Checkbox({ label: '全部類別', checked: 'mixed', onChange: (v) => seen.push(v) });
  box.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(box.getAttribute('aria-checked'), 'true');
  assert.deepEqual(seen, [true]);
});

test('Radio 在群組內互斥：選了新的，舊的會被取消', () => {
  const picked = [];
  const group = ChoiceGroup({
    radio: true,
    ariaLabel: '付款週期',
    children: [
      Radio({ label: '月繳', value: 'monthly', checked: true, onChange: (v) => picked.push(v) }),
      Radio({ label: '年繳', value: 'yearly', onChange: (v) => picked.push(v) }),
    ],
  });
  document.body.appendChild(group);
  const [monthly, yearly] = group.querySelectorAll('.lk-choice--radio');
  yearly.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(group.getAttribute('role'), 'radiogroup');
  assert.equal(yearly.getAttribute('aria-checked'), 'true');
  assert.equal(monthly.getAttribute('aria-checked'), 'false', '同群組的其他選項要被取消');
  assert.deepEqual(picked, ['yearly']);
  group.remove();
});

test('Toggle 用 role="switch"，點擊翻轉 aria-checked 並回報新狀態', () => {
  const seen = [];
  const toggle = Toggle({ label: '扣款前三天提醒', onChange: (v) => seen.push(v) });
  assert.equal(toggle.getAttribute('role'), 'switch');
  assert.equal(toggle.getAttribute('aria-checked'), 'false');
  toggle.dispatchEvent(new window.MouseEvent('click'));
  toggle.dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, [true, false]);
  assert.equal(toggle.getAttribute('aria-checked'), 'false');
});

test('沒有 label 的 Toggle 用 ariaLabel；有 label 時不重複標記', () => {
  assert.equal(Toggle({ ariaLabel: '深色模式' }).getAttribute('aria-label'), '深色模式');
  assert.equal(Toggle({ label: '深色模式', ariaLabel: '深色模式' }).getAttribute('aria-label'), null);
});

test('SegmentedControl 沒給 value 時選第一項，切換後只有一個 aria-selected', () => {
  const seen = [];
  const seg = SegmentedControl({
    ariaLabel: '訂閱狀態',
    items: [
      { label: '全部', value: 'all' },
      { label: '使用中', value: 'active' },
      { label: '已取消', value: 'cancelled' },
    ],
    onChange: (v) => seen.push(v),
  });
  assert.equal(seg.getAttribute('role'), 'tablist');
  assert.equal(seg.children[0].getAttribute('aria-selected'), 'true');
  seg.children[2].dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, ['cancelled']);
  assert.deepEqual(
    Array.from(seg.children, (c) => c.getAttribute('aria-selected')),
    ['false', 'false', 'true'],
  );
});

test('Chip 的 removable 走 onRemove，不切換 aria-pressed', () => {
  let removed = 0;
  let changed = 0;
  const chip = Chip({
    label: '月繳',
    removable: true,
    ariaLabel: '移除條件：月繳',
    onRemove: () => { removed += 1; },
    onChange: () => { changed += 1; },
  });
  assert.ok(chip.querySelector('.lk-chip__remove'), '可移除的 Chip 要有叉叉');
  chip.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(removed, 1);
  assert.equal(changed, 0, '可移除的 Chip 不該同時回報選取變化');
  assert.equal(chip.getAttribute('aria-pressed'), 'false');
});

test('Chip 的篩選模式用 aria-pressed 切換', () => {
  const seen = [];
  const chip = Chip({ label: '串流', onChange: (v) => seen.push(v) });
  chip.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(chip.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(seen, [true]);
});

test('AppBar 的標題是 h1，動作只在有給時才建立容器', () => {
  const plain = AppBar({ title: '訂閱明細' });
  assert.equal(plain.tagName, 'HEADER');
  assert.equal(plain.querySelector('h1').textContent, '訂閱明細');
  assert.equal(plain.querySelector('.lk-appbar__actions'), null);

  const full = AppBar({ title: 'Netflix', centered: true, scrolled: true, actions: [Button({ label: '編輯' })] });
  assert.match(full.className, /lk-appbar--centered/);
  assert.match(full.className, /lk-appbar--scrolled/);
  assert.equal(full.querySelectorAll('.lk-appbar__actions button').length, 1);
});

test('TabBar 最多只留 5 項，選中的那項用 aria-current="page"', () => {
  const seen = [];
  const items = ['a', 'b', 'c', 'd', 'e', 'f'].map((v) => ({ label: v, icon: 'bell', value: v }));
  const bar = TabBar({ items, value: 'b', onChange: (v) => seen.push(v) });
  assert.equal(bar.children.length, 5, '超過 5 個頂層區塊要被截掉');
  assert.equal(bar.children[1].getAttribute('aria-current'), 'page');
  bar.children[3].dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, ['d']);
  assert.equal(bar.children[1].getAttribute('aria-current'), null, '切換後舊的要拿掉 aria-current');
  assert.equal(bar.children[3].getAttribute('aria-current'), 'page');
});

test('TabBar 沒給 ariaLabel 時有預設的導覽名稱，badge 會畫出來', () => {
  const bar = TabBar({ items: [{ label: '通知', icon: 'bell', value: 'n', badge: '3' }] });
  assert.equal(bar.getAttribute('aria-label'), '主導覽');
  assert.equal(bar.querySelector('.lk-tabbar__badge').textContent, '3');
});

test('Tabs 用 role="tab"，切換後只有一個 aria-selected，badge 是 Badge 元件', () => {
  const seen = [];
  const tabs = Tabs({
    ariaLabel: '訂閱分類',
    items: [
      { label: '全部', value: 'all' },
      { label: '待處理', value: 'todo', badge: '2', badgeTone: 'danger' },
    ],
    onChange: (v) => seen.push(v),
  });
  assert.equal(tabs.getAttribute('role'), 'tablist');
  assert.equal(tabs.children[0].getAttribute('aria-selected'), 'true');
  assert.match(tabs.querySelector('.lk-badge').className, /lk-badge--danger/);
  tabs.children[1].dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, ['todo']);
  assert.deepEqual(Array.from(tabs.children, (c) => c.getAttribute('aria-selected')), ['false', 'true']);
});

test('Sheet 是 role="dialog"，標題當作它的名稱，grabber 可關掉', () => {
  const sheet = Sheet({ title: '排序方式', subtitle: '立即套用', children: [Button({ label: '金額' })] });
  assert.equal(sheet.getAttribute('role'), 'dialog');
  assert.equal(sheet.getAttribute('aria-modal'), 'true');
  assert.equal(sheet.getAttribute('aria-label'), '排序方式');
  assert.ok(sheet.querySelector('.lk-sheet__grabber'), '預設要有把手');
  assert.equal(Sheet({ title: 'x', grabber: false }).querySelector('.lk-sheet__grabber'), null);
});

test('Dialog 是 role="alertdialog"，stacked 反映在動作容器上', () => {
  const dialog = Dialog({
    title: '要刪除這筆訂閱嗎？',
    body: '刪除後歷史紀錄也會一起消失，這個動作無法復原。',
    actions: [Button({ label: '取消', variant: 'secondary' }), Button({ label: '刪除訂閱', variant: 'destructive' })],
    stacked: true,
  });
  assert.equal(dialog.getAttribute('role'), 'alertdialog');
  assert.equal(dialog.querySelector('h2').textContent, '要刪除這筆訂閱嗎？');
  assert.match(dialog.querySelector('.lk-dialog__actions').className, /--stacked/);
  assert.equal(dialog.querySelectorAll('.lk-dialog__actions button').length, 2);
});

test('Menu 的三種項目：動作、分隔線、群組標題', () => {
  const menu = Menu({
    ariaLabel: '更多動作',
    items: [
      { group: '這筆訂閱' },
      { label: '編輯', icon: 'plus' },
      { label: '每月', checked: true },
      { separator: true },
      { label: '刪除', danger: true, disabled: true },
    ],
  });
  assert.equal(menu.getAttribute('role'), 'menu');
  assert.equal(menu.querySelector('.lk-menu__group').textContent, '這筆訂閱');
  assert.ok(menu.querySelector('hr.lk-menu__sep'));
  const items = menu.querySelectorAll('.lk-menu__item');
  assert.equal(items[0].getAttribute('role'), 'menuitem');
  assert.equal(items[1].getAttribute('role'), 'menuitemradio', '有 checked 的項目是單選項');
  assert.equal(items[1].getAttribute('aria-checked'), 'true');
  assert.match(items[2].className, /--danger/);
  assert.equal(items[2].disabled, true);
});

test('Toast 的 danger 用 alert + assertive，其餘用 status + polite', () => {
  const ok = Toast({ message: '已復原這筆訂閱。', action: '查看' });
  assert.equal(ok.getAttribute('role'), 'status');
  assert.equal(ok.getAttribute('aria-live'), 'polite');
  assert.equal(ok.querySelector('.lk-toast__action').textContent, '查看');

  const bad = Toast({ message: '同步失敗。', tone: 'danger' });
  assert.equal(bad.getAttribute('role'), 'alert');
  assert.equal(bad.getAttribute('aria-live'), 'assertive');
});

test('Tip 的 anchored 帶箭頭且箭頭是裝飾，inline 不帶', () => {
  const anchored = Tip({ title: '可以長按排序', form: 'anchored', arrow: 'bottom', onDismiss: () => {} });
  assert.equal(anchored.getAttribute('role'), 'note');
  assert.equal(anchored.getAttribute('data-arrow'), 'bottom');
  assert.equal(anchored.querySelector('.lk-tip__arrow').getAttribute('aria-hidden'), 'true');
  assert.equal(anchored.querySelector('.lk-tip__close').getAttribute('aria-label'), '不再顯示這個提示');

  const inline = Tip({ title: '可以長按排序' });
  assert.equal(inline.getAttribute('data-arrow'), null);
  assert.equal(inline.querySelector('.lk-tip__arrow'), null);
  assert.equal(inline.querySelector('.lk-tip__close'), null, '沒給 onDismiss 就不該有關閉鈕');
});

test('tip 規則：預設只顯示一次，dismiss 之後永遠不顯示', () => {
  tipReset();
  const rule = { id: 'sort-hint' };
  assert.equal(tipShouldShow(rule), true);
  tipShown('sort-hint');
  assert.equal(tipShouldShow(rule), false, 'maxDisplays 預設 1');

  tipReset('sort-hint');
  assert.equal(tipShouldShow({ id: 'sort-hint', maxDisplays: 3 }), true);
  tipShown('sort-hint');
  tipShown('sort-hint');
  assert.equal(tipShouldShow({ id: 'sort-hint', maxDisplays: 3 }), true);
  tipShown('sort-hint');
  assert.equal(tipShouldShow({ id: 'sort-hint', maxDisplays: 3 }), false);

  tipReset('sort-hint');
  tipDismiss('sort-hint');
  assert.equal(tipShouldShow({ id: 'sort-hint', maxDisplays: 99 }), false, 'dismiss 之後不管次數都不顯示');
  tipReset();
});

test('tip 規則：when 回傳 false 就不顯示；讀不到狀態時寧可多顯示一次', () => {
  tipReset();
  assert.equal(tipShouldShow({ id: 'x', when: () => false }), false);
  assert.equal(tipShouldShow({ id: 'x', when: () => true }), true);
  assert.equal(tipShouldShow({ id: 'never-seen' }), true);
  tipReset();
});

test('Avatar 的退階順序：圖片 → 首字 → 字形，中日韓取一個字、拉丁取兩個字母', () => {
  const withImage = Avatar({ name: '林怡君', src: 'https://example.test/a.png' });
  assert.equal(withImage.querySelector('img').alt, '林怡君');

  const cjk = Avatar({ name: '林怡君' });
  assert.equal(cjk.querySelector('span').textContent, '林');

  const latin = Avatar({ name: 'Leo Ho', size: 'lg' });
  assert.equal(latin.querySelector('span').textContent, 'LH');
  assert.match(latin.className, /lk-avatar--lg/);
  assert.match(latin.querySelector('span').className, /title-3/);

  const anonymous = Avatar({});
  assert.ok(anonymous.querySelector('svg'), '兩者都沒有時退回字形');
  assert.equal(anonymous.getAttribute('aria-hidden'), 'true', '沒有名稱時對閱讀器隱藏');
});

test('Avatar 的 square 與 brand 是語意修飾類', () => {
  const service = Avatar({ name: 'Netflix', square: true, tone: 'brand' });
  assert.match(service.className, /lk-avatar--square/);
  assert.match(service.className, /lk-avatar--brand/);
  assert.equal(service.getAttribute('aria-label'), 'Netflix');
});

test('EmptyState 的標題是 h2，動作與圖示只在有給時建立', () => {
  const bare = EmptyState({ title: '還沒有任何訂閱。' });
  assert.equal(bare.querySelector('h2').textContent, '還沒有任何訂閱。');
  assert.equal(bare.querySelector('.lk-empty__icon'), null);
  assert.equal(bare.querySelector('.lk-empty__actions'), null);

  const full = EmptyState({
    title: '還沒有任何訂閱。',
    body: '新增第一筆之後，這裡會顯示每月總支出。',
    icon: 'inbox',
    actions: [Button({ label: '新增第一筆' })],
    compact: true,
  });
  assert.match(full.className, /lk-empty--compact/);
  assert.ok(full.querySelector('.lk-empty__icon svg'));
  assert.equal(full.querySelectorAll('.lk-empty__actions button').length, 1);
});

test('Progress 給了 value 就有 aria-valuenow 並夾在 0–100，省略就是不確定', () => {
  const half = Progress({ value: 42, ariaLabel: '匯入進度' });
  assert.equal(half.getAttribute('role'), 'progressbar');
  assert.equal(half.getAttribute('aria-valuenow'), '42');
  assert.equal(half.querySelector('.lk-progress__bar').style.width, '42%');

  assert.equal(Progress({ value: 140 }).querySelector('.lk-progress__bar').style.width, '100%');
  assert.equal(Progress({ value: -20 }).querySelector('.lk-progress__bar').style.width, '0%');

  const unknown = Progress({ ariaLabel: '同步中' });
  assert.match(unknown.className, /lk-progress--indeterminate/);
  assert.equal(unknown.getAttribute('aria-valuenow'), null);
});

test('Spinner 有預設標籤，Skeleton 對閱讀器隱藏', () => {
  assert.equal(Spinner().getAttribute('aria-label'), '載入中');
  assert.equal(Spinner({ ariaLabel: '正在計算' }).getAttribute('aria-label'), '正在計算');

  const bone = Skeleton({ variant: 'circle', width: '48px' });
  assert.match(bone.className, /lk-skeleton--circle/);
  assert.equal(bone.style.width, '48px');
  assert.equal(bone.getAttribute('aria-hidden'), 'true');
  assert.match(Skeleton().className, /lk-skeleton--line/);
});

test('Table 的數字欄靠右、可排序欄是按鈕並帶 aria-sort，Node 儲存格原樣放進去', () => {
  let sorted = 0;
  const badge = Badge({ label: '使用中', tone: 'success' });
  const table = Table({
    caption: '本月訂閱',
    sticky: true,
    columns: [
      { key: 'name', label: '服務' },
      { key: 'state', label: '狀態' },
      { key: 'amount', label: '金額', numeric: true, sortable: true, sort: 'descending', onSort: () => { sorted += 1; } },
    ],
    rows: [{ name: 'Netflix', state: badge, amount: 390 }],
  });
  assert.equal(table.querySelector('caption').textContent, '本月訂閱');
  assert.match(table.querySelector('table').className, /lk-table--sticky/);

  const headers = table.querySelectorAll('th');
  assert.equal(headers[2].getAttribute('aria-sort'), 'descending');
  assert.match(headers[2].className, /lk-table__num/);
  headers[2].querySelector('button.lk-table__sort').dispatchEvent(new window.MouseEvent('click'));
  assert.equal(sorted, 1);
  assert.equal(headers[0].querySelector('button'), null, '不可排序的欄不該是按鈕');

  const cells = table.querySelectorAll('td');
  assert.equal(cells[0].textContent, 'Netflix');
  assert.equal(cells[1].firstChild, badge, 'Node 儲存格要原樣放進去');
  assert.equal(cells[2].textContent, '390');
  assert.match(cells[2].className, /lk-table__num/);
});

test('Table 缺少某一欄的資料時畫空白，不畫 undefined', () => {
  const table = Table({
    columns: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }],
    rows: [{ a: '有' }],
  });
  const cells = table.querySelectorAll('td');
  assert.equal(cells[0].textContent, '有');
  assert.equal(cells[1].textContent, '');
});

test('Slider 用原生 range，format 同時寫進 aria-valuetext 與旁邊的數值', () => {
  const seen = [];
  const field = Slider({
    label: '預算上限',
    min: 0,
    max: 2000,
    step: 50,
    value: 500,
    format: (v) => `NT$ ${v.toLocaleString('en-US')}`,
    help: '只顯示低於這個金額的訂閱',
    onChange: (v) => seen.push(v),
  });
  const input = field.querySelector('input[type="range"]');
  assert.equal(input.getAttribute('aria-valuetext'), 'NT$ 500');
  assert.equal(field.querySelector('.lk-slider-out').textContent, 'NT$ 500');
  assert.equal(field.querySelector('.lk-slider-out').getAttribute('aria-hidden'), 'true');
  assert.equal(field.querySelector('.lk-field__help').textContent, '只顯示低於這個金額的訂閱');

  input.value = '1500';
  input.dispatchEvent(new window.Event('input'));
  assert.deepEqual(seen, [1500]);
  assert.equal(input.getAttribute('aria-valuetext'), 'NT$ 1,500');
  assert.equal(input.style.getPropertyValue('--lk-pct'), '75%');
});

test('Slider 的可及名稱：有 label 就用 for/id 綁，沒有才用 ariaLabel', () => {
  const withLabel = Slider({ label: '預算' });
  const input = withLabel.querySelector('input');
  const label = withLabel.querySelector('label');
  assert.equal(input.getAttribute('aria-label'), null);
  // 只有視覺標籤而沒有關聯的話，滑桿其實是沒有名字的
  assert.notEqual(input.id, '');
  assert.equal(label.getAttribute('for'), input.id);

  assert.equal(Slider({ ariaLabel: '預算' }).querySelector('input').getAttribute('aria-label'), '預算');
});

test('Stepper 到邊界時停用對應的按鈕，並把值夾在範圍內', () => {
  const seen = [];
  const stepper = Stepper({ value: 1, min: 1, max: 3, ariaLabel: '份數', onChange: (v) => seen.push(v) });
  const [decrease, , increase] = stepper.children;
  assert.equal(stepper.getAttribute('role'), 'group');
  assert.equal(decrease.disabled, true, '已在下界，減少要停用');
  assert.equal(increase.disabled, false);
  assert.equal(decrease.getAttribute('aria-label'), '減少');

  increase.dispatchEvent(new window.MouseEvent('click'));
  increase.dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, [2, 3]);
  assert.equal(increase.disabled, true, '已在上界，增加要停用');
  assert.equal(stepper.children[1].textContent, '3');
});

test('PickerField 是按鈕而不是輸入框，錯誤時標 aria-invalid 並接上說明', () => {
  let opened = 0;
  const field = PickerField({
    label: '下次扣款日',
    kind: 'date',
    error: '請選一個未來的日期',
    onOpen: () => { opened += 1; },
  });
  const trigger = field.querySelector('button.lk-picker');
  assert.equal(trigger.getAttribute('aria-haspopup'), 'dialog');
  assert.equal(trigger.getAttribute('aria-invalid'), 'true');
  const errorNode = field.querySelector('.lk-field__error');
  assert.equal(trigger.getAttribute('aria-describedby'), errorNode.id);
  assert.match(field.className, /lk-field--error/);
  trigger.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(opened, 1);
});

test('PickerField 沒有值時顯示 placeholder 並套 placeholder 樣式', () => {
  const empty = PickerField({ label: '週期', placeholder: '選擇扣款週期' });
  assert.match(empty.querySelector('.lk-picker').className, /lk-picker--placeholder/);
  assert.equal(empty.querySelector('.lk-picker__value').textContent, '選擇扣款週期');

  const filled = PickerField({ label: '週期', value: '每月' });
  assert.doesNotMatch(filled.querySelector('.lk-picker').className, /lk-picker--placeholder/);
  assert.equal(filled.querySelector('.lk-picker__value').textContent, '每月');
});

test('Combobox 打字會過濾選項，選了之後回報 value 並收起面板', () => {
  const picked = [];
  const field = Combobox({
    label: '服務',
    options: [
      { label: 'Netflix', value: 'netflix' },
      { label: 'Spotify', value: 'spotify' },
      { label: 'Disney+', value: 'disney' },
    ],
    onChange: (v) => picked.push(v),
  });
  document.body.appendChild(field);
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');
  assert.equal(panel.hidden, true, '一開始要收起來');

  input.dispatchEvent(new window.Event('focus'));
  assert.equal(panel.hidden, false);
  assert.equal(input.getAttribute('aria-expanded'), 'true');
  assert.equal(panel.querySelectorAll('[role="option"]').length, 3);

  input.value = 'sp';
  input.dispatchEvent(new window.Event('input'));
  const filtered = panel.querySelectorAll('[role="option"]');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].textContent, 'Spotify');

  filtered[0].dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(picked, ['spotify']);
  assert.equal(input.value, 'Spotify');
  assert.equal(panel.hidden, true);
  field.remove();
});

test('Combobox 用 aria-activedescendant 指向目前選項，選項不進 Tab 順序，失焦就收起', () => {
  const field = Combobox({
    label: '服務',
    options: [
      { label: 'Netflix', value: 'netflix' },
      { label: 'Spotify', value: 'spotify' },
    ],
  });
  document.body.appendChild(field);
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');

  input.dispatchEvent(new window.Event('focus'));
  const options = panel.querySelectorAll('[role="option"]');
  for (const option of options) {
    assert.equal(option.getAttribute('tabindex'), '-1', '焦點留在輸入框，選項不能被 Tab 到');
    assert.notEqual(option.id, '');
  }
  assert.equal(input.getAttribute('aria-activedescendant'), null, '還沒移動時不指向任何選項');

  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(input.getAttribute('aria-activedescendant'), options[1].id);

  // 重新過濾後選項會重建，舊的 activedescendant 不能留著指到同 id 的新選項
  input.value = 'net';
  input.dispatchEvent(new window.Event('input'));
  assert.equal(input.getAttribute('aria-activedescendant'), null);

  input.dispatchEvent(new window.Event('blur'));
  assert.equal(panel.hidden, true, '失焦要收起面板');
  assert.equal(input.getAttribute('aria-expanded'), 'false');
  field.remove();
});

test('Combobox 沒有符合選項時顯示 emptyText，方向鍵會在選項間繞回', () => {
  const field = Combobox({
    options: [
      { label: 'Netflix', value: 'netflix' },
      { label: 'Spotify', value: 'spotify' },
    ],
    emptyText: '找不到這個服務',
  });
  document.body.appendChild(field);
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');

  input.value = 'zzz';
  input.dispatchEvent(new window.Event('input'));
  assert.equal(panel.querySelector('.lk-combobox__empty').textContent, '找不到這個服務');

  input.value = '';
  input.dispatchEvent(new window.Event('input'));
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(panel.querySelectorAll('[role="option"]')[0].getAttribute('aria-selected'), 'true');
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
  assert.equal(panel.querySelectorAll('[role="option"]')[0].getAttribute('aria-selected'), 'true', '往上繞回第一項');

  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(panel.hidden, true);
  field.remove();
});

/* ------------------------------ 鍵盤與焦點群組 ------------------------------ */

const key = (target, name) =>
  target.dispatchEvent(new window.KeyboardEvent('keydown', { key: name, bubbles: true }));

test('Tabs 只佔一個 Tab 停駐點，左右鍵移動焦點並讓選取跟著走，頭尾相接', () => {
  const seen = [];
  const tabs = Tabs({
    ariaLabel: '訂閱分類',
    value: 'todo',
    items: [
      { label: '全部', value: 'all' },
      { label: '待處理', value: 'todo' },
      { label: '已取消', value: 'cancelled' },
    ],
    onChange: (v) => seen.push(v),
  });
  document.body.appendChild(tabs);
  const [all, todo, cancelled] = tabs.children;
  assert.deepEqual(Array.from(tabs.children, (c) => c.tabIndex), [-1, 0, -1], '從外面 Tab 進來要落在已選的 tab');

  todo.focus();
  key(todo, 'ArrowRight');
  assert.equal(document.activeElement, cancelled);
  assert.equal(cancelled.getAttribute('aria-selected'), 'true');
  key(cancelled, 'ArrowRight');
  assert.equal(document.activeElement, all, '最後一個再往右回到第一個');
  key(all, 'End');
  assert.equal(document.activeElement, cancelled);
  assert.deepEqual(seen, ['cancelled', 'all', 'cancelled']);
  assert.deepEqual(Array.from(tabs.children, (c) => c.tabIndex), [-1, -1, 0], 'Tab 停駐點跟著選取移動');
  tabs.remove();
});

test('Tabs 點擊或聚焦已選的那一項不會重複回報', () => {
  const seen = [];
  const tabs = Tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], onChange: (v) => seen.push(v) });
  document.body.appendChild(tabs);
  tabs.children[0].focus();
  tabs.children[0].dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, []);
  tabs.children[1].dispatchEvent(new window.MouseEvent('click'));
  assert.deepEqual(seen, ['b']);
  tabs.remove();
});

test('SegmentedControl 與 Tabs 一樣可以用方向鍵切換', () => {
  const seen = [];
  const seg = SegmentedControl({
    ariaLabel: '訂閱狀態',
    items: [{ label: '全部', value: 'all' }, { label: '使用中', value: 'active' }],
    onChange: (v) => seen.push(v),
  });
  document.body.appendChild(seg);
  assert.equal(seg.children[0].getAttribute('role'), 'tab');
  seg.children[0].focus();
  key(seg.children[0], 'ArrowLeft');
  assert.equal(document.activeElement, seg.children[1], '第一個再往左回到最後一個');
  assert.deepEqual(seen, ['active']);
  seg.remove();
});

test('Radio 群組只佔一個 Tab 停駐點，方向鍵移動並同時選取，跳過停用的選項', () => {
  const picked = [];
  const group = ChoiceGroup({
    radio: true,
    ariaLabel: '付款週期',
    children: [
      Radio({ label: '月繳', value: 'monthly', onChange: (v) => picked.push(v) }),
      Radio({ label: '季繳', value: 'quarterly', disabled: true, onChange: (v) => picked.push(v) }),
      Radio({ label: '年繳', value: 'yearly', checked: true, onChange: (v) => picked.push(v) }),
    ],
  });
  document.body.appendChild(group);
  const [monthly, quarterly, yearly] = group.querySelectorAll('.lk-choice--radio');
  assert.equal(yearly.tabIndex, 0, 'Tab 進來要落在已選的那一項');
  assert.equal(monthly.tabIndex, -1);

  yearly.focus();
  key(yearly, 'ArrowDown');
  assert.equal(document.activeElement, monthly, '頭尾相接，並跳過停用的季繳');
  assert.equal(monthly.getAttribute('aria-checked'), 'true');
  assert.equal(yearly.getAttribute('aria-checked'), 'false');
  assert.equal(quarterly.getAttribute('aria-checked'), 'false');
  assert.deepEqual(picked, ['monthly']);
  assert.equal(monthly.tabIndex, 0, '選了新的之後 Tab 停駐點跟著移過去');
  assert.equal(yearly.tabIndex, -1);
  group.remove();
});

test('Menu 上下鍵在項目間移動、跳過停用項；群組標題之後的項目包成具名的 role="group"', () => {
  const menu = Menu({
    ariaLabel: '更多動作',
    items: [
      { label: '編輯' },
      { label: '封存', disabled: true },
      { separator: true },
      { group: '扣款週期' },
      { label: '每月', checked: true },
      { label: '每年', checked: false },
    ],
  });
  document.body.appendChild(menu);
  const items = menu.querySelectorAll('.lk-menu__item');
  assert.deepEqual(Array.from(items, (i) => i.tabIndex), [0, -1, -1, -1], '整個清單只佔一個 Tab 停駐點');

  items[0].focus();
  key(items[0], 'ArrowDown');
  assert.equal(document.activeElement, items[2], '跳過停用的封存');
  key(items[2], 'ArrowUp');
  assert.equal(document.activeElement, items[0]);
  key(items[0], 'End');
  assert.equal(document.activeElement, items[3]);

  const group = menu.querySelector('[role="group"]');
  assert.ok(group, '群組標題之後的項目要包成 group');
  const label = document.getElementById(group.getAttribute('aria-labelledby'));
  assert.equal(label.textContent, '扣款週期');
  assert.deepEqual(
    Array.from(group.querySelectorAll('[role="menuitemradio"]'), (i) => i.textContent),
    ['每月', '每年'],
    '單選項的範圍就是這個群組',
  );
  assert.equal(items[0].closest('[role="group"]'), null, '分隔線之前的項目不屬於群組');
  menu.remove();
});

test('Table 有 caption 時外層是以 caption 命名、可聚焦的捲動區；沒有就不加', () => {
  const captioned = Table({ caption: '本月訂閱', columns: [{ key: 'a', label: 'A' }], rows: [] });
  assert.equal(captioned.getAttribute('role'), 'region');
  assert.equal(captioned.getAttribute('tabindex'), '0', '鍵盤使用者要能聚焦後橫向捲動');
  assert.equal(captioned.getAttribute('aria-labelledby'), captioned.querySelector('caption').id);

  const bare = Table({ columns: [{ key: 'a', label: 'A' }], rows: [] });
  assert.equal(bare.getAttribute('role'), null, '沒有名稱的 region 沒有意義');
  assert.equal(bare.getAttribute('tabindex'), null);
});

test('Menu 方向鍵移動後焦點離開，Tab 停駐點回到第一項（nomemory），Shift+Tab 不會卡在清單裡', () => {
  const before = document.createElement('button');
  const menu = Menu({ items: [{ label: '編輯' }, { label: '複製' }, { label: '刪除' }] });
  document.body.append(before, menu);
  const items = menu.querySelectorAll('.lk-menu__item');

  items[0].focus();
  key(items[0], 'ArrowDown');
  key(items[1], 'ArrowDown');
  assert.deepEqual(Array.from(items, (i) => i.tabIndex), [-1, -1, 0], '焦點在清單內時停駐點跟著焦點，前後都沒有別的停駐點');

  before.focus();
  assert.deepEqual(Array.from(items, (i) => i.tabIndex), [0, -1, -1], '離開後下次 Tab 進來從第一項開始');
  before.remove();
  menu.remove();
});

test('Radio 群組裡已選的那一項被停用時，Tab 停駐點改落在第一個可用的選項', () => {
  const group = ChoiceGroup({
    radio: true,
    ariaLabel: '方案',
    children: [
      Radio({ label: '舊方案', value: 'legacy', checked: true, disabled: true }),
      Radio({ label: '標準', value: 'standard' }),
    ],
  });
  const [legacy, standard] = group.querySelectorAll('.lk-choice--radio');
  assert.equal(legacy.tabIndex, -1, '停用的按鈕無法聚焦，不能當停駐點');
  assert.equal(standard.tabIndex, 0);
});

test('Combobox 用滑鼠選完之後再點輸入框會重新展開', () => {
  const field = Combobox({ options: [{ label: 'Netflix', value: 'netflix' }] });
  document.body.appendChild(field);
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');
  input.dispatchEvent(new window.Event('focus'));
  panel.querySelector('[role="option"]').dispatchEvent(new window.MouseEvent('click'));
  assert.equal(panel.hidden, true);

  input.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(panel.hidden, false, '焦點一直在輸入框，不會再收到 focus 事件');
  field.remove();
});

test('瀏覽器原生支援 focusgroup 時交給瀏覽器，但 role 仍寫在 DOM 上', () => {
  const supported = new Set(['tablist', 'menu']);
  Object.defineProperty(window.HTMLElement.prototype, 'focusGroup', {
    configurable: true,
    get: () => ({ supports: (token) => supported.has(token) }),
  });
  try {
    const tabs = Tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] });
    assert.equal(tabs.getAttribute('focusgroup'), 'tablist nomemory');
    assert.equal(tabs.getAttribute('role'), 'tablist', '只看 DOM 的工具也要認得出來');
    assert.equal(tabs.children[0].getAttribute('role'), 'tab');
    assert.equal(tabs.children[0].getAttribute('tabindex'), null, '停駐點交給瀏覽器，不寫 tabindex');
    assert.deepEqual(Array.from(tabs.children, (t) => t.hasAttribute('focusgroupstart')), [true, false]);
    tabs.children[1].dispatchEvent(new window.MouseEvent('click'));
    assert.deepEqual(Array.from(tabs.children, (t) => t.hasAttribute('focusgroupstart')), [false, true], '進入點跟著選取移動');

    const menu = Menu({ items: [{ label: '編輯' }, { label: '封存', disabled: true }] });
    assert.equal(menu.getAttribute('focusgroup'), 'menu nomemory');
    assert.deepEqual(
      Array.from(menu.querySelectorAll('.lk-menu__item'), (i) => i.getAttribute('role')),
      ['menuitem', 'menuitem'],
      '停用項不能聚焦，瀏覽器不會替它推斷 role，所以一定要寫',
    );

    supported.delete('menu');
    const unsupported = Menu({ items: [{ label: '編輯' }] });
    assert.equal(unsupported.getAttribute('focusgroup'), null, '不支援這個 behavior 就走退路');
    assert.equal(unsupported.querySelector('.lk-menu__item').tabIndex, 0);
  } finally {
    delete window.HTMLElement.prototype.focusGroup;
  }
});

test('瀏覽器有 focusGroup 但 supports() 丟例外時，元件照樣建得出來並改走退路', () => {
  Object.defineProperty(window.HTMLElement.prototype, 'focusGroup', {
    configurable: true,
    get: () => ({ supports: () => { throw new window.TypeError('沒有定義可用的 token'); } }),
  });
  try {
    const tabs = Tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] });
    assert.equal(tabs.getAttribute('focusgroup'), null);
    assert.deepEqual(Array.from(tabs.children, (t) => t.tabIndex), [0, -1], '退路的 roving tabindex 接手');
    const menu = Menu({ items: [{ label: '編輯' }] });
    assert.equal(menu.getAttribute('focusgroup'), null);
  } finally {
    delete window.HTMLElement.prototype.focusGroup;
  }
});

test('Tabs 從外面把焦點移進來不會改變選取；呼叫端改了 aria-selected，停駐點也跟著移', async () => {
  const seen = [];
  const before = document.createElement('button');
  const tabs = Tabs({
    value: 'a',
    items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }],
    onChange: (v) => seen.push(v),
  });
  document.body.append(before, tabs);
  const [a, b, c] = tabs.children;

  // 例如路由變了，呼叫端直接切到 B
  a.setAttribute('aria-selected', 'false');
  b.setAttribute('aria-selected', 'true');
  await new Promise((resolve) => setTimeout(resolve));
  assert.deepEqual(Array.from(tabs.children, (t) => t.tabIndex), [-1, 0, -1], 'Tab 進來要落在新選的 B');

  before.focus();
  b.focus();
  before.focus();
  c.focus();
  assert.deepEqual(seen, [], '從外面進來（Tab 或程式呼叫 focus()）都不算切換');
  assert.equal(c.getAttribute('aria-selected'), 'false');
  before.remove();
  tabs.remove();
});

test('Tabs 按下滑鼠讓焦點移過去、但沒有完成點擊時不改變選取，之後方向鍵照常', () => {
  const seen = [];
  const tabs = Tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], onChange: (v) => seen.push(v) });
  document.body.appendChild(tabs);
  const [a, b] = tabs.children;
  a.focus();
  // Chromium 在 mousedown 就把焦點給按鈕，使用者拖走放開就不會有 click
  b.dispatchEvent(new window.Event('pointerdown', { bubbles: true }));
  b.focus();
  assert.deepEqual(seen, []);
  assert.equal(a.getAttribute('aria-selected'), 'true');

  key(b, 'ArrowLeft');
  assert.equal(document.activeElement, a);
  key(a, 'ArrowRight');
  assert.deepEqual(seen, ['b'], '按過鍵之後選取又跟著焦點走');
  tabs.remove();
});

test('Radio 群組在已選的第一項按 Home、最後一項按 End 時不重複回報', () => {
  const picked = [];
  const group = ChoiceGroup({
    radio: true,
    ariaLabel: '付款週期',
    children: [
      Radio({ label: '月繳', value: 'monthly', checked: true, onChange: (v) => picked.push(v) }),
      Radio({ label: '年繳', value: 'yearly', onChange: (v) => picked.push(v) }),
    ],
  });
  document.body.appendChild(group);
  const [monthly, yearly] = group.querySelectorAll('.lk-choice--radio');
  monthly.focus();
  key(monthly, 'Home');
  assert.deepEqual(picked, []);
  key(monthly, 'End');
  key(yearly, 'End');
  assert.deepEqual(picked, ['yearly']);
  group.remove();
});

/** 替 jsdom 補上版面尺寸。jsdom 不排版，矩形與 client 尺寸預設都是 0。 */
function layout(element, rect, client) {
  element.getBoundingClientRect = () => rect;
  for (const [name, value] of Object.entries(client ?? {})) {
    Object.defineProperty(element, name, { configurable: true, value });
  }
  let top = 0;
  let left = 0;
  Object.defineProperty(element, 'scrollTop', { configurable: true, get: () => top, set: (v) => { top = v; } });
  Object.defineProperty(element, 'scrollLeft', { configurable: true, get: () => left, set: (v) => { left = v; } });
}

test('Tabs 切換時只捲 tab 列本身，不用會連頁面一起捲的 scrollIntoView', () => {
  const tabs = Tabs({ items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] });
  document.body.appendChild(tabs);
  const [, b] = tabs.children;
  let pageScrolled = false;
  b.scrollIntoView = () => { pageScrolled = true; };
  layout(tabs, { top: 0, bottom: 40, left: 0, right: 100 }, { clientWidth: 100, clientHeight: 40 });
  layout(b, { top: 0, bottom: 40, left: 90, right: 150 });

  b.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(tabs.scrollLeft, 50, '往右捲到 B 的右緣剛好露出');
  assert.equal(tabs.scrollTop, 0);
  assert.equal(pageScrolled, false);
  tabs.remove();
});

test('Combobox 方向鍵移到看不到的選項時只捲面板本身', () => {
  const field = Combobox({ options: [{ label: 'Netflix', value: 'n' }, { label: 'Spotify', value: 's' }] });
  document.body.appendChild(field);
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');
  input.dispatchEvent(new window.Event('focus'));
  layout(panel, { top: 100, bottom: 140, left: 0, right: 200 }, { clientWidth: 200, clientHeight: 40 });
  const [first, second] = panel.querySelectorAll('[role="option"]');
  let pageScrolled = false;
  for (const row of [first, second]) row.scrollIntoView = () => { pageScrolled = true; };
  layout(first, { top: 100, bottom: 140, left: 0, right: 200 });
  layout(second, { top: 140, bottom: 180, left: 0, right: 200 });

  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(panel.scrollTop, 0, '第一項已經看得到');
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(panel.scrollTop, 40);
  assert.equal(pageScrolled, false);
  field.remove();
});

test('Table 有 caption 但放得下時不是 region、不進 Tab 順序；溢出時才加上', () => {
  let measure;
  const observed = [];
  window.ResizeObserver = class {
    constructor(callback) { measure = callback; }
    observe(element) { observed.push(element); }
  };
  try {
    const wrap = Table({ caption: '本月訂閱', columns: [{ key: 'a', label: 'A' }], rows: [] });
    document.body.appendChild(wrap);
    assert.ok(observed.includes(wrap) && observed.includes(wrap.querySelector('table')), '外層與表格的尺寸都要看');
    const size = (scrollWidth) => {
      for (const [name, value] of Object.entries({ scrollWidth, clientWidth: 300, scrollHeight: 0, clientHeight: 0 })) {
        Object.defineProperty(wrap, name, { configurable: true, value });
      }
      measure();
    };

    size(300);
    assert.equal(wrap.getAttribute('role'), null, '不用捲動就不需要具名的捲動區，閱讀器也不會把 caption 唸兩次');
    assert.equal(wrap.getAttribute('tabindex'), null);
    assert.equal(wrap.getAttribute('aria-labelledby'), null);

    size(480);
    assert.equal(wrap.getAttribute('role'), 'region');
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('aria-labelledby'), wrap.querySelector('caption').id);

    wrap.focus();
    size(300);
    assert.equal(wrap.getAttribute('tabindex'), '0', '正聚焦在上面時不拿掉，焦點才不會掉回 body');
    wrap.blur();
    assert.equal(wrap.getAttribute('tabindex'), null, '失焦後補量一次，不必等下一次尺寸變化');
    assert.equal(wrap.getAttribute('role'), null);
    wrap.remove();
  } finally {
    delete window.ResizeObserver;
  }
});

test('leokit.css 不用 CSS nesting，減少動態與由右至左的覆寫在不支援 nesting 的瀏覽器也生效', () => {
  const css = readFileSync(new URL('../dist/leokit.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const stack = [];
  const nested = [];
  let prelude = '';
  for (const char of css) {
    if (char === '{') {
      // 樣式規則裡又開一個區塊，就是 nesting（巢狀的 @media 或 &:dir() 之類）
      if (stack.at(-1) === 'rule') nested.push(prelude.trim());
      stack.push(prelude.trim().startsWith('@') ? 'at' : 'rule');
      prelude = '';
    } else if (char === '}') {
      stack.pop();
      prelude = '';
    } else if (char === ';') {
      prelude = '';
    } else {
      prelude += char;
    }
  }
  assert.deepEqual(nested, []);
});

test('Combobox 在 Dialog 裡按 Esc：面板開著時只收面板，收起後再按才交給 Dialog', () => {
  const field = Combobox({ options: [{ label: 'Netflix', value: 'netflix' }] });
  const dialog = Dialog({ title: '新增訂閱', actions: [] });
  dialog.appendChild(field);
  document.body.appendChild(dialog);
  let dialogClosed = 0;
  // 呼叫端自己處理 Esc 的 Dialog
  dialog.addEventListener('keydown', (event) => { if (event.key === 'Escape') dialogClosed += 1; });
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');
  const esc = () => {
    const event = new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    input.dispatchEvent(event);
    return event;
  };

  input.dispatchEvent(new window.Event('focus'));
  const first = esc();
  assert.equal(panel.hidden, true);
  assert.equal(dialogClosed, 0, '外層收不到這次 Esc');
  assert.equal(first.defaultPrevented, true, '原生 dialog 也不會因為這次 Esc 關閉');

  const second = esc();
  assert.equal(dialogClosed, 1, '面板已經收起，Esc 照常交給 Dialog');
  assert.equal(second.defaultPrevented, false);
  dialog.remove();
});

test('Combobox 在輸入法選字時不攔 Enter 與 Esc', () => {
  const picked = [];
  const field = Combobox({ options: [{ label: 'Netflix', value: 'netflix' }], onChange: (v) => picked.push(v) });
  document.body.appendChild(field);
  const input = field.querySelector('input[role="combobox"]');
  const panel = field.querySelector('[role="listbox"]');
  input.dispatchEvent(new window.Event('focus'));
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));

  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));
  assert.deepEqual(picked, [], 'Enter 是在確認選字，不是選這個選項');
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', isComposing: true }));
  assert.equal(panel.hidden, false, 'Esc 是在取消選字，面板不收');

  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter' }));
  assert.deepEqual(picked, ['netflix']);
  field.remove();
});
