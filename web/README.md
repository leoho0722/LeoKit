# @leoho0722/leokit

LeoKit 的 Web 實作層。沒有框架依賴 —— 元件是回傳 `HTMLElement` 的工廠函式。

## 安裝

```bash
echo "@leoho0722:registry=https://npm.pkg.github.com" >> .npmrc
npm install @leoho0722/leokit
```

## 用法

樣式分兩層，兩個都要載入：

```ts
import '@leoho0722/leokit/tokens.css';   // 自訂屬性與字級 class
import '@leoho0722/leokit/leokit.css';   // 元件 class

import { Button, ListRow, Banner, setTheme } from '@leoho0722/leokit';

document.body.append(
  ListRow({ title: 'Netflix 標準方案', subtitle: '每月 3 日扣款', value: 'NT$ 390', chevron: true }),
  Button({ label: '新增訂閱', onClick: () => {} }),
  Banner({
    title: 'Netflix 扣款失敗',
    message: '付款卡片已過期，下次扣款也會失敗。',
    tone: 'danger',
    icon: 'alert',
  }),
);

setTheme('dark');   // 寫到 documentElement 的 data-theme
```

沒有打包工具的頁面用 IIFE 版本，載入後掛在 `window.LeoKit`：

```html
<link rel="stylesheet" href="node_modules/@leoho0722/leokit/dist/tokens.css">
<link rel="stylesheet" href="node_modules/@leoho0722/leokit/dist/leokit.css">
<script src="node_modules/@leoho0722/leokit/dist/leokit.iife.js"></script>
```

## 慣例

- class 一律 `lk-` 前綴，並組合 token 的字級 class：`class="lk-btn lk-btn--primary label"`。
- `lkTokens` 匯出型別化的 token 值，可以在 JS 裡讀色票與尺度。
- 主題切換靠 `data-theme` 屬性，可以下在 `<html>` 也可以下在任何容器上。

## 開發

```bash
npm run build      # tsc 產 ESM + d.ts、esbuild 產 IIFE、複製兩份 CSS
npm test           # node:test + jsdom
npm run typecheck
```
