#!/usr/bin/env node
/**
 * LeoKit token 產生器
 *
 * 單一真實來源：tokens/tokens.json（與 Design System artifact 逐位元組同步）
 * 平台對應：tokens/platform-map.json（type style 對 iOS / Android 原生字級的對應）
 *
 * 產出（全部標記為 generated，不要手動編輯）：
 *   ios/Sources/LeoKit/Tokens/LK<型別>.generated.swift（一型別一檔，守 300 行上限）
 *   android/leokit/src/main/kotlin/io/github/leoho0722/leokit/tokens/LK<主題>.generated.kt（依 Kotlin 慣例分三檔）
 *   web/src/tokens.generated.css
 *   web/src/tokens.generated.ts
 *
 * 確定性：同樣的輸入永遠產生同樣的位元組，所以 CI 可以用 git diff --exit-code 檢查是否忘了重跑。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const tokens = JSON.parse(readFileSync(join(HERE, 'tokens.json'), 'utf8'));
const platformMap = JSON.parse(readFileSync(join(HERE, 'platform-map.json'), 'utf8'));

const BANNER_LINES = [
  'LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。',
  '來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。',
];

/* ---------- 命名 ---------- */
// bg-canvas -> bgCanvas · spacing-16 -> spacing16 · radius-2xl -> radius2xl
const camel = (name) =>
  name
    .replace(/\./g, '_')
    .split('-')
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');

/* ---------- 色彩 ---------- */
const themes = tokens.color.themes.map((t) => t.id);
const FIRST = themes[0];
const colorByName = new Map(tokens.color.tokens.map((t) => [t.name, t]));

function rawValue(token, theme) {
  const v = token.value;
  if (typeof v === 'string') return v;
  return v[theme] ?? v[FIRST];
}

/** 解析成 {r,g,b,a}；別名 {other} 會遞迴解析。 */
function parseColor(value, theme, seen = new Set()) {
  if (value.startsWith('{')) {
    const ref = value.slice(1, -1);
    if (seen.has(ref)) throw new Error(`色彩別名成環：${ref}`);
    seen.add(ref);
    const target = colorByName.get(ref);
    if (!target) throw new Error(`色彩別名指向不存在的 token：${ref}`);
    return parseColor(rawValue(target, theme), theme, seen);
  }
  if (value.startsWith('#')) {
    let h = value.slice(1);
    if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  const m = /^rgba?\(([^)]+)\)$/.exec(value);
  if (m) {
    const p = m[1].split(/[,/\s]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  }
  throw new Error(`產生器看不懂的色值：${value}`);
}

const hex6 = (c) => [c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
const argb8 = (c) => (Math.round(c.a * 255).toString(16).padStart(2, '0') + hex6(c)).toUpperCase();
const alphaLit = (a) => (Number.isInteger(a) ? a.toFixed(1) : String(a));

const colors = tokens.color.tokens.map((t) => ({
  name: t.name,
  id: camel(t.name),
  usage: t.usage,
  byTheme: Object.fromEntries(themes.map((th) => [th, parseColor(rawValue(t, th), th)])),
}));

/* ---------- 長度族（spacing / radius / size） ---------- */
const lengthFamilies = ['spacing', 'radius', 'size'].filter((f) => tokens[f]);
const numeric = (v) => parseFloat(String(v).replace(/px|rem|em|%/g, '')) || 0;

/* ---------- 字級 ---------- */
const typeStyles = tokens.type.groups.flatMap((g) =>
  g.styles.map((s) => ({ ...s, family: s.family ?? g.family, group: g.name }))
);

/* ---------- 輸出 ---------- */
function write(relPath, body) {
  const abs = join(ROOT, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body.endsWith('\n') ? body : body + '\n', 'utf8');
  console.log('  寫入', relPath, `(${body.length} 字元)`);
}

/* ===================== Swift ===================== */
/*
 * 產出遵循 ios-dev-kit 規範：Xcode 檔頭、一型別一檔、doc comment 首句為摘要不加句號、
 * 其餘句子各自成為一個 `- Note:`、行寬 100、stored property 之間空一行。
 */
const SWIFT_MODULE = 'LeoKit';
const SWIFT_CREATED_ON = '2026/09/19';
const SWIFT_LINE_LIMIT = 100;
const SWIFT_DIR = 'ios/Sources/LeoKit/Tokens';

/** Xcode 風格檔頭的六行。 */
function swiftHeader(fileName) {
  return [
    '//',
    `//  ${fileName}`,
    `//  ${SWIFT_MODULE}`,
    '//',
    `//  Created by Leo Ho on ${SWIFT_CREATED_ON}.`,
    '//',
  ];
}

/** 把一段文字折到 100 字元以內（含前綴），中文沒有空白時直接硬斷。 */
function swiftWrap(text, firstPrefix, contPrefix) {
  const out = [];
  let prefix = firstPrefix;
  let rest = text;
  while (rest.length > 0) {
    const room = SWIFT_LINE_LIMIT - prefix.length;
    if (rest.length <= room) {
      out.push(prefix + rest);
      break;
    }
    let cut = rest.lastIndexOf(' ', room);
    if (cut <= 0 || cut < room - 24) cut = room;
    out.push(prefix + rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
    prefix = contPrefix;
  }
  return out;
}

/** usage 轉 doc comment：首句摘要（不加句號），其餘每句一個 `- Note:`。 */
function swiftDoc(usage, indent) {
  const sentences = String(usage)
    .split('。')
    .map((s) => s.trim())
    .filter(Boolean);
  const lines = swiftWrap(sentences[0], `${indent}/// `, `${indent}/// `);
  if (sentences.length > 1) {
    lines.push(`${indent}///`);
    for (const s of sentences.slice(1)) {
      lines.push(...swiftWrap(s, `${indent}/// - Note: `, `${indent}///   `));
    }
  }
  return lines;
}

/** 寫出一個 Swift 產生檔：檔頭 → 產生器告示 → import → 宣告。 */
function swiftFile(fileName, imports, body) {
  const L = [...swiftHeader(fileName), ''];
  BANNER_LINES.forEach((l) => L.push(`// ${l}`));
  L.push('');
  for (const m of imports) L.push(`import ${m}`);
  if (imports.length > 0) L.push('');
  L.push(...body);
  write(`${SWIFT_DIR}/${fileName}`, L.join('\n'));
}

/** 產生一個「無 case enum 當命名空間、只有 static let」的 token 型別。 */
function swiftNamespace({ fileName, imports, typeName, summary, members }) {
  const L = [];
  L.push(...swiftDoc(summary, ''));
  L.push(`public enum ${typeName} {`);
  L.push('');
  L.push('    // MARK: - Properties');
  members.forEach((m) => {
    L.push('');
    L.push(...swiftDoc(m.usage, '    '));
    L.push(...m.decl);
  });
  L.push('}');
  swiftFile(fileName, imports, L);
}

function swift() {
  const allEntries = ['    public static let all: [String: LKColorValue] = ['];
  for (const c of colors) allEntries.push(`        "${c.name}": ${c.id},`);
  allEntries.push('    ]');

  swiftNamespace({
    fileName: 'LKColorValues.generated.swift',
    imports: [],
    typeName: 'LKColorValues',
    summary:
      '每個色彩 token 在淺色與深色主題下的實際色值。'
      + '測試與工具可以直接讀它，不必經過平台的動態色機制。'
      + '畫面上要用的顏色請改用 `LKColor`。',
    members: [
      ...colors.map((c) => {
        const l = c.byTheme.light;
        const d = c.byTheme.dark;
        // 全不透明的 token 只寫兩個引數；帶 alpha 的四個引數超過三個，依規範每個引數獨立一行
        const decl = l.a === 1 && d.a === 1
          ? [`    public static let ${c.id} = LKColorValue(light: 0x${hex6(l)}, dark: 0x${hex6(d)})`]
          : [
            `    public static let ${c.id} = LKColorValue(`,
            `        light: 0x${hex6(l)},`,
            `        lightAlpha: ${alphaLit(l.a)},`,
            `        dark: 0x${hex6(d)},`,
            `        darkAlpha: ${alphaLit(d.a)}`,
            '    )',
          ];
        return { usage: c.usage, decl };
      }),
      {
        usage: '全部色彩 token，key 是 tokens.json 裡的原始名稱。供測試列舉與工具比對使用。',
        decl: allEntries,
      },
    ],
  });

  swiftNamespace({
    fileName: 'LKColor.generated.swift',
    imports: ['SwiftUI'],
    typeName: 'LKColor',
    summary:
      '畫面上可以直接用的顏色，會跟著系統的淺色或深色外觀自動換色。'
      + '需要知道某個主題的實際色值時才改讀 `LKColorValues`。',
    members: colors.map((c) => ({
      usage: c.usage,
      decl: [`    public static let ${c.id} = LKColorValues.${c.id}.color`],
    })),
  });

  const familyMeta = {
    spacing: {
      typeName: 'LKSpacing',
      fileName: 'LKSpacing.generated.swift',
      summary:
        '元件之間與元件內部的間距刻度，名稱就是實際的 pt 數。'
        + '除了半階的 2，每一階都是 4 的倍數，不要自己插入中間值。',
    },
    radius: {
      typeName: 'LKRadius',
      fileName: 'LKRadius.generated.swift',
      summary:
        '圓角半徑的刻度，單位為 pt。'
        + 'iOS 請透過 `LKShape` 取用，它已經套上 Apple 平台該用的連續曲線圓角。',
    },
    size: {
      typeName: 'LKSize',
      fileName: 'LKSize.generated.swift',
      summary: '控制項高度、圖示、頭像與邊框寬度的固定尺寸，單位為 pt。',
    },
  };

  for (const fam of lengthFamilies) {
    const meta = familyMeta[fam];
    if (!meta) throw new Error(`長度族缺少 Swift 對應設定：${fam}`);
    swiftNamespace({
      fileName: meta.fileName,
      imports: ['Foundation'],
      typeName: meta.typeName,
      summary: meta.summary,
      members: tokens[fam].tokens.map((t) => ({
        usage: t.usage,
        decl: [`    public static let ${camel(t.name)}: CGFloat = ${numeric(t.value)}`],
      })),
    });
  }

  swiftNamespace({
    fileName: 'LKOpacity.generated.swift',
    imports: [],
    typeName: 'LKOpacity',
    summary: '停用、按下、滑過與選取這些狀態要疊上的不透明度。只靠不透明度表達狀態是不夠的，一定要同時改變互動行為或文字。',
    members: tokens.opacity.tokens.map((t) => ({
      usage: t.usage,
      decl: [`    public static let ${camel(t.name)}: Double = ${t.value}`],
    })),
  });

  swiftNamespace({
    fileName: 'LKFont.generated.swift',
    imports: ['SwiftUI'],
    typeName: 'LKFont',
    summary:
      '畫面上每一種文字的字級。'
      + '一律綁在系統的文字樣式上，使用者把字放大時會跟著放大，所以不寫死 pt 數。'
      + 'tokens.json 裡的 px 只是 Web 的值與設計稿的參考值。',
    members: typeStyles.map((s) => {
      const m = platformMap.type[s.name];
      if (!m) throw new Error(`platform-map.json 缺少字級對應：${s.name}`);
      const ios = m.ios;
      let expr = ios.design
        ? `Font.system(.${ios.textStyle}, design: .${ios.design})`
        : `Font.${ios.textStyle}`;
      if (ios.weight) expr += `.weight(.${ios.weight})`;
      return {
        usage: s.usage,
        decl: [`    public static let ${camel(s.name)}: Font = ${expr}`],
      };
    }),
  });
}

/* ===================== Kotlin ===================== */
/*
 * 依 Kotlin 官方 coding conventions 分三檔：語意相關的宣告放同一檔，檔案不長到數百行。
 *   LKColorScheme.generated.kt  data class 與它的兩個 scheme 工廠函式（單一 class + 相關頂層宣告，檔名取該 class）
 *   LKMetrics.generated.kt      LKSpacing / LKRadius / LKSize / LKOpacity（多個宣告，檔名描述內容）
 *   LKTypography.generated.kt   字級的 data class
 */
const KOTLIN_DIR = 'android/leokit/src/main/kotlin/io/github/leoho0722/leokit/tokens';

/** 寫出一個 Kotlin 產生檔：package → 產生器告示 → import → 宣告。 */
function kotlinFile(fileName, imports, body) {
  const L = ['package io.github.leoho0722.leokit.tokens', ''];
  BANNER_LINES.forEach((l) => L.push(`// ${l}`));
  L.push('');
  for (const m of imports) L.push(`import ${m}`);
  if (imports.length > 0) L.push('');
  L.push(...body);
  write(`${KOTLIN_DIR}/${fileName}`, L.join('\n'));
}

function kotlin() {
  /* ---- 色彩 ---- */
  {
    const L = [];
    L.push('/** LeoKit 的語意色彩。以 LKTheme 提供，透過 LKTheme.colors 取用。 */');
    L.push('@Immutable');
    L.push('public data class LKColorScheme(');
    colors.forEach((c, i) => {
      L.push(`    /** ${c.usage} */`);
      L.push(`    public val ${c.id}: Color${i === colors.length - 1 ? '' : ','}`);
    });
    L.push(')');
    for (const theme of themes) {
      const suffix = theme.charAt(0).toUpperCase() + theme.slice(1);
      const label = suffix === 'Light' ? '淺色' : '深色';
      L.push('');
      L.push('/**');
      L.push(` * 建出${label}主題要用的那一整組語意色彩。`);
      L.push(' *');
      L.push(` * @return 每個 token 都填好${label}值的 [LKColorScheme]`);
      L.push(' */');
      L.push(`public fun lk${suffix}ColorScheme(): LKColorScheme = LKColorScheme(`);
      colors.forEach((c, i) => {
        L.push(`    ${c.id} = Color(0x${argb8(c.byTheme[theme])})${i === colors.length - 1 ? '' : ','}`);
      });
      L.push(')');
    }
    kotlinFile(
      'LKColorScheme.generated.kt',
      ['androidx.compose.runtime.Immutable', 'androidx.compose.ui.graphics.Color'],
      L
    );
  }

  /* ---- 度量（間距、圓角、尺寸、不透明度）---- */
  {
    const meta = {
      spacing:
        '元件之間與元件內部的間距刻度，名稱就是實際的 dp 數。'
        + '除了半階的 2，每一階都是 4 的倍數，不要自己插入中間值。',
      radius: '圓角半徑的刻度，單位為 dp。以 RoundedCornerShape 套用。',
      size: '控制項高度、圖示、頭像與邊框寬度的固定尺寸，單位為 dp。',
    };
    const L = [];
    lengthFamilies.forEach((fam, i) => {
      if (!meta[fam]) throw new Error(`長度族缺少 Kotlin 說明：${fam}`);
      if (i > 0) L.push('');
      L.push(`/** ${meta[fam]} */`);
      L.push(`public object LK${fam.charAt(0).toUpperCase() + fam.slice(1)} {`);
      for (const t of tokens[fam].tokens) {
        L.push(`    /** ${t.usage} */`);
        L.push(`    public val ${camel(t.name)}: Dp = ${numeric(t.value)}.dp`);
      }
      L.push('}');
    });
    L.push('');
    L.push('/** 停用、按下、滑過與選取這些狀態要疊上的不透明度。 */');
    L.push('public object LKOpacity {');
    for (const t of tokens.opacity.tokens) {
      L.push(`    /** ${t.usage} */`);
      L.push(`    public const val ${camel(t.name)}: Float = ${Number(t.value).toFixed(2)}f`);
    }
    L.push('}');
    kotlinFile('LKMetrics.generated.kt', ['androidx.compose.ui.unit.Dp', 'androidx.compose.ui.unit.dp'], L);
  }

  /* ---- 字級 ---- */
  {
    const usesMono = typeStyles.some((s) => platformMap.type[s.name].android.mono);
    const imports = [
      'androidx.compose.runtime.Immutable',
      'androidx.compose.ui.text.TextStyle',
      ...(usesMono ? ['androidx.compose.ui.text.font.FontFamily'] : []),
      'androidx.compose.ui.text.font.FontWeight',
      'androidx.compose.ui.unit.sp',
    ];
    const L = [];
    L.push('/** LeoKit 的字級。註解裡是對應的 Material 3 type role。 */');
    L.push('@Immutable');
    L.push('public data class LKTypography(');
    typeStyles.forEach((s, i) => {
      const m = platformMap.type[s.name];
      L.push(`    /** ${s.usage} Material 3: ${m.android.role} */`);
      const weight = s.fontWeight >= 700 ? 'Bold' : s.fontWeight >= 600 ? 'SemiBold' : s.fontWeight >= 500 ? 'Medium' : 'Normal';
      const ls = s.letterSpacing ? `, letterSpacing = ${numeric(s.letterSpacing)}.sp` : '';
      const ff = m.android.mono ? ', fontFamily = FontFamily.Monospace' : '';
      L.push(`    public val ${camel(s.name)}: TextStyle = TextStyle(`);
      L.push(`        fontSize = ${numeric(s.fontSize)}.sp,`);
      L.push(`        lineHeight = ${numeric(s.lineHeight)}.sp,`);
      L.push(`        fontWeight = FontWeight.${weight}${ls}${ff}`);
      L.push(`    )${i === typeStyles.length - 1 ? '' : ','}`);
    });
    L.push(')');
    kotlinFile('LKTypography.generated.kt', imports, L);
  }
}

/* ===================== CSS ===================== */
function css() {
  const esc = (n) => n.replace(/\./g, '\\.');
  const cssColor = (c) => (c.a === 1 ? `#${hex6(c).toLowerCase()}` : `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`);
  const L = [];
  BANNER_LINES.forEach((l) => L.push(`/* ${l} */`));
  L.push('');
  L.push(`:root, [data-theme="${FIRST}"] {`);
  for (const c of colors) L.push(`  --${esc(c.name)}: ${cssColor(c.byTheme[FIRST])};`);
  for (const t of tokens.shadow.tokens) {
    const v = typeof t.value === 'string' ? t.value : t.value[FIRST];
    L.push(`  --${esc(t.name)}: ${v};`);
  }
  L.push('}');
  for (const theme of themes.slice(1)) {
    L.push(`[data-theme="${theme}"] {`);
    for (const c of colors) L.push(`  --${esc(c.name)}: ${cssColor(c.byTheme[theme])};`);
    for (const t of tokens.shadow.tokens) {
      const v = typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value[FIRST]);
      L.push(`  --${esc(t.name)}: ${v};`);
    }
    L.push('}');
  }
  L.push(':root {');
  for (const fam of [...lengthFamilies, 'opacity']) {
    for (const t of tokens[fam].tokens) L.push(`  --${esc(t.name)}: ${t.value};`);
  }
  for (const [k, v] of Object.entries(tokens.type.families)) L.push(`  --font-${k}: ${v};`);
  L.push('}');
  for (const s of typeStyles) {
    const parts = [
      `font-family: var(--font-${s.family})`,
      `font-size: ${s.fontSize}`,
      `line-height: ${s.lineHeight}`,
      `font-weight: ${s.fontWeight}`,
    ];
    if (s.letterSpacing) parts.push(`letter-spacing: ${s.letterSpacing}`);
    L.push(`.${esc(s.name)} { ${parts.join('; ')}; }`);
  }
  write('web/src/tokens.generated.css', L.join('\n'));
}

/* ===================== TypeScript ===================== */
function ts() {
  const L = [];
  BANNER_LINES.forEach((l) => L.push(`// ${l}`));
  L.push('');
  const cssColor = (c) => (c.a === 1 ? `#${hex6(c).toLowerCase()}` : `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`);
  L.push('export const lkTokens = {');
  L.push('  color: {');
  for (const theme of themes) {
    L.push(`    ${theme}: {`);
    for (const c of colors) L.push(`      '${c.name}': '${cssColor(c.byTheme[theme])}',`);
    L.push('    },');
  }
  L.push('  },');
  for (const fam of [...lengthFamilies, 'opacity']) {
    L.push(`  ${fam}: {`);
    for (const t of tokens[fam].tokens) L.push(`    '${t.name}': '${t.value}',`);
    L.push('  },');
  }
  L.push('  type: {');
  for (const s of typeStyles) {
    L.push(`    '${s.name}': { fontSize: '${s.fontSize}', lineHeight: '${s.lineHeight}', fontWeight: ${s.fontWeight}, family: '${s.family}' },`);
  }
  L.push('  },');
  L.push('} as const;');
  L.push('');
  L.push('export type LKTheme = keyof typeof lkTokens.color;');
  L.push('export type LKColorToken = keyof typeof lkTokens.color.light;');
  L.push('export type LKSpacingToken = keyof typeof lkTokens.spacing;');
  L.push('export type LKRadiusToken = keyof typeof lkTokens.radius;');
  L.push('export type LKSizeToken = keyof typeof lkTokens.size;');
  L.push('export type LKTypeStyle = keyof typeof lkTokens.type;');
  write('web/src/tokens.generated.ts', L.join('\n'));
}

console.log(`LeoKit tokens：${colors.length} 個色彩、${typeStyles.length} 個字級、${lengthFamilies.map((f) => `${tokens[f].tokens.length} 個 ${f}`).join('、')}`);
swift();
kotlin();
css();
ts();
console.log('完成。');
