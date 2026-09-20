import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
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

test('ListRow：可點時是 button 並有 chevron，不可點時是 li', () => {
  const tappable = ListRow({ title: 'Netflix 標準方案', subtitle: '每月 3 日扣款', value: 'NT$ 390', chevron: true });
  assert.equal(tappable.tagName, 'BUTTON');
  assert.match(tappable.className, /lk-row--tappable/);
  assert.ok(tappable.querySelector('.lk-row__chevron'));

  const plain = ListRow({ title: '合計', value: 'NT$ 2,480' });
  assert.equal(plain.tagName, 'LI');
  assert.doesNotMatch(plain.className, /lk-row--tappable/);
});

test('ListRow：href 會產生連結', () => {
  const link = ListRow({ title: '說明', href: '/help' });
  assert.equal(link.tagName, 'A');
  assert.equal(link.getAttribute('href'), '/help');
});

test('List：是 ul 且 role=list', () => {
  const list = List({ children: [ListRow({ title: 'a' })] });
  assert.equal(list.tagName, 'UL');
  assert.equal(list.getAttribute('role'), 'list');
  assert.equal(list.children.length, 1);
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

test('Slider 有 label 時不重複標記，沒有時用 ariaLabel', () => {
  assert.equal(Slider({ label: '預算' }).querySelector('input').getAttribute('aria-label'), null);
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
