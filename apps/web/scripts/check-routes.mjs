import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const app = await readFile(join(root, 'src/App.tsx'), 'utf8');
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
const sources = vercel.rewrites.map((rewrite) => rewrite.source);

const missing = routes.filter((path) => path !== '*' && !sources.includes(path));
if (missing.length > 0) {
  console.error(`[routes] missing Vercel rewrites: ${missing.join(', ')}`);
  process.exit(1);
}

const catchAll = sources.filter((source) => source === '/(.*)' || source === '/:path*');
if (catchAll.length > 0) {
  console.error('[routes] catch-all rewrite reintroduces soft 404s');
  process.exit(1);
}

console.log(`[routes] ${routes.length} routes covered, no catch-all`);
