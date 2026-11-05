import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'src');

const patterns = [
  { regex: /\[TODO/, name: '[TODO' },
  { regex: /lorem ipsum/i, name: 'lorem ipsum' },
  { regex: /Design better and spend less time/, name: 'Design better and spend less time' },
  { regex: /Shreethemes/, name: 'Shreethemes' },
  { regex: /#0e6e5c/i, name: 'legacy teal #0e6e5c' },
  { regex: /mdi-/, name: 'mdi- icon font reference' },
  { regex: /["']Agencia["']|>Agencia</, name: '"Agencia" placeholder text' },
];

const extensions = ['.js', '.jsx', '.mjs', '.scss', '.css', '.json'];
const excludeDirs = ['node_modules', '.next', 'out', 'docs'];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (excludeDirs.includes(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (extensions.some(ext => entry.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const files = [...walk(srcDir)];

// Also check root config files (package.json, next.config.mjs, jsconfig.json)
const rootConfigs = ['package.json', 'next.config.mjs', 'jsconfig.json'];
for (const cfg of rootConfigs) {
  const cfgPath = join(root, cfg);
  if (existsSync(cfgPath) && files.indexOf(cfgPath) === -1) {
    files.push(cfgPath);
  }
}
const hits = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const { regex, name } of patterns) {
      if (regex.test(lines[i])) {
        const rel = file.replace(root, '').replace(/\\/g, '/').replace(/^\//, '');
        hits.push(`${rel}:${i + 1} — ${name}`);
      }
    }
  }
}

if (hits.length === 0) {
  console.log('OK: 0 placeholders');
  process.exit(0);
} else {
  for (const h of hits) console.log(`  ${h}`);
  console.log(`\nFALLO: ${hits.length} placeholders`);
  process.exitCode = 1;
}
