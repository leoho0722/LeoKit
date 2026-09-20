import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lkTokens } from '../dist/index.js';

const source = JSON.parse(readFileSync(new URL('../../tokens/tokens.json', import.meta.url), 'utf8'));

test('產生出來的色彩數量與來源一致，兩個主題都有', () => {
  const count = source.color.tokens.length;
  assert.equal(Object.keys(lkTokens.color.light).length, count);
  assert.equal(Object.keys(lkTokens.color.dark).length, count);
});

test('色彩值與 tokens.json 相符', () => {
  assert.equal(lkTokens.color.light['brand'], '#1e5fcc');
  assert.equal(lkTokens.color.dark['brand'], '#5b9bff');
  assert.equal(lkTokens.color.light['bg-canvas'], '#f5f6f8');
  assert.equal(lkTokens.color.dark['bg-canvas'], '#0e1116');
});

test('別名在兩個主題都解析成被指向的 token', () => {
  assert.equal(lkTokens.color.light['text-link'], lkTokens.color.light['brand']);
  assert.equal(lkTokens.color.dark['text-link'], lkTokens.color.dark['brand']);
  assert.equal(lkTokens.color.light['border-focus'], lkTokens.color.light['brand']);
  assert.equal(lkTokens.color.dark['border-focus'], lkTokens.color.dark['brand']);
});

test('帶 alpha 的色值保留 alpha', () => {
  assert.equal(lkTokens.color.light['bg-scrim'], 'rgba(0, 0, 0, 0.4)');
  assert.equal(lkTokens.color.dark['bg-scrim'], 'rgba(0, 0, 0, 0.6)');
});

test('spacing token 的名稱就是實際數值，且落在 4pt 尺度上', () => {
  const names = Object.keys(lkTokens.spacing);
  assert.ok(names.length > 0, 'spacing token 不應為空');
  for (const [name, value] of Object.entries(lkTokens.spacing)) {
    const n = Number(name.replace('spacing-', ''));
    assert.ok(Number.isFinite(n), `${name} 的名稱應以實際數值結尾`);
    assert.equal(value, n === 0 ? '0' : `${n}px`, `${name} 應為 ${n}px`);
    assert.ok(n === 0 || n === 2 || n % 4 === 0, `${name} 應是 4 的倍數或半階的 2`);
  }
});

test('字級數量與來源一致，且都有 fontSize / lineHeight', () => {
  const count = source.type.groups.reduce((n, g) => n + g.styles.length, 0);
  assert.equal(Object.keys(lkTokens.type).length, count);
  for (const [name, style] of Object.entries(lkTokens.type)) {
    assert.match(style.fontSize, /^\d+px$/, `${name} fontSize`);
    assert.match(style.lineHeight, /^\d+px$/, `${name} lineHeight`);
  }
});

test('對比度：文字 token 對它 usage 所列的底色達標（抽驗 WCAG AA）', () => {
  const lum = (hex) => {
    const h = hex.replace('#', '');
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const pairs = [
    ['text-primary', 'bg-surface', 4.5], ['text-secondary', 'bg-surface', 4.5],
    ['text-tertiary', 'bg-surface', 4.5], ['text-on-brand', 'brand', 4.5],
    ['brand-ink', 'brand-subtle', 4.5], ['danger-ink', 'danger-subtle', 4.5],
    ['border-control', 'bg-surface', 3.0],
  ];
  for (const theme of ['light', 'dark']) {
    for (const [fg, bg, min] of pairs) {
      const r = ratio(lkTokens.color[theme][fg], lkTokens.color[theme][bg]);
      assert.ok(r >= min, `${theme}：${fg} 對 ${bg} 只有 ${r.toFixed(2)}:1，需 ≥ ${min}`);
    }
  }
});
