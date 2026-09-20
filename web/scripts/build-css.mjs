/** 把兩份樣式表複製進 dist，並在檔頭標明版本。 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
for (const [from, to] of [['tokens.generated.css', 'tokens.css'], ['leokit.css', 'leokit.css']]) {
  const body = readFileSync(new URL(`../src/${from}`, import.meta.url), 'utf8');
  writeFileSync(new URL(`../dist/${to}`, import.meta.url), `/* ${pkg.name} v${pkg.version} */\n${body}`);
  console.log('  dist/' + to);
}
