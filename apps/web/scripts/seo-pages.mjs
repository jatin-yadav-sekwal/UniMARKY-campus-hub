import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const baseUrl = 'https://unimarky.runs-on.dev';

const serviceLinks = `
  <nav>
    <a href="/marketplace">Marketplace</a> ·
    <a href="/communities">Communities</a> ·
    <a href="/study">Study</a> ·
    <a href="/housing">Accommodation</a> ·
    <a href="/food">Food</a> ·
    <a href="/lost-found">Lost &amp; Found</a> ·
    <a href="/about">About</a> ·
    <a href="/contact">Contact</a>
  </nav>`;

const pages = {
  '/': {
    title: 'UniMARKY | Campus Marketplace & Student Communities',
    description:
      'Buy and sell on campus, join student communities, find notes, stays and food — one verified student account for your university.',
    heading: 'UniMARKY — everything campus in one place',
    body: 'A campus platform for verified students: marketplace, communities, study material, accommodation, food and lost & found, scoped to your university.',
  },
  '/about': {
    title: 'About UniMARKY — One Account for Campus Life',
    description:
      'Why UniMARKY exists: a verified student account for campus marketplace, communities, study material, accommodation and food.',
    heading: 'About UniMARKY',
    body: 'UniMARKY brings the useful parts of campus life — buying and selling, communities, study resources, stays and food — into one student account.',
  },
  '/contact': {
    title: 'Contact UniMARKY',
    description:
      'Get in touch with the UniMARKY team for help, feedback or partnership questions.',
    heading: 'Contact UniMARKY',
    body: 'Questions, feedback or a problem with a listing? Reach the UniMARKY team and we will look into it.',
  },
  '/terms': {
    title: 'Terms | UniMARKY',
    description: 'The terms that govern using UniMARKY and its campus services.',
    heading: 'Terms of use',
    body: 'The rules for using UniMARKY, including listings, communities and account responsibilities.',
  },
  '/privacy': {
    title: 'Privacy | UniMARKY',
    description:
      'How UniMARKY handles account data, listings and community activity.',
    heading: 'Privacy policy',
    body: 'What UniMARKY stores, why it stores it, and the choices you have over your account and content.',
  },
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const faqs = [
  {
    q: 'What can I do on Unimarky?',
    a: 'Marketplace, communities, study material, accommodation, food and lost & found — one student account for all six, scoped to your university.',
  },
  {
    q: 'Who can use it?',
    a: 'Students. Create an account, then pick your university during onboarding; that choice sets which listings, communities and resources you see.',
  },
  {
    q: 'Do I need an account to browse?',
    a: 'Yes. Every service sits behind the same student account, so you sign up once and move between them without signing in again.',
  },
  {
    q: 'How do I sell something?',
    a: "Open Marketplace and choose List an item. Add a title, price, description and photos; the listing then appears in your university's marketplace for other students to find.",
  },
  {
    q: 'How do I contact a seller or host?',
    a: 'Each listing has a contact section. If the seller or host shared a phone number, it is shown there so you can reach them directly.',
  },
  {
    q: 'How do I get help?',
    a: 'Use the Contact page to reach the team. Include the page you were on and what went wrong so we can look into it.',
  },
];

function structuredData(path, page) {
  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: page.heading, item: `${baseUrl}${path}` },
    ],
  };
}

function replaceContent(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

function pageHtml(template, path, page) {
  const url = `${baseUrl}${path}`;
  let out = template;

  out = replaceContent(out, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  out = replaceContent(
    out,
    /(<meta name="description" content=")[^"]*(")/,
    `$1${escapeHtml(page.description)}$2`
  );
  out = replaceContent(
    out,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`
  );
  out = replaceContent(
    out,
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${escapeHtml(page.title)}$2`
  );
  out = replaceContent(
    out,
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${escapeHtml(page.description)}$2`
  );
  out = replaceContent(
    out,
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${url}$2`
  );
  out = replaceContent(
    out,
    /(<meta name="twitter:title" content=")[^"]*(")/,
    `$1${escapeHtml(page.title)}$2`
  );
  out = replaceContent(
    out,
    /(<meta name="twitter:description" content=")[^"]*(")/,
    `$1${escapeHtml(page.description)}$2`
  );

  if (!out.includes('name="robots"')) {
    out = out.replace(
      '</head>',
      '  <meta name="robots" content="index, follow">\n</head>'
    );
  }

  const schema = JSON.stringify(structuredData(path, page)).replaceAll('<', '\\u003c');
  out = out.replace(
    '</head>',
    `  <script type="application/ld+json">${schema}</script>\n</head>`
  );

  // Accurate no-JS fallback. This is not hidden text: it is the same page
  // summary and navigation, shown only when the SPA cannot run.
  const fallback = `
<noscript>
  <main style="max-width:760px;margin:48px auto;padding:0 20px;font-family:system-ui,sans-serif;line-height:1.6;color:#262522">
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.body)}</p>
    ${serviceLinks}
  </main>
</noscript>`;
  out = out.replace('</body>', `${fallback}\n</body>`);

  return out;
}

const template = await readFile(join(dist, 'index.html'), 'utf8');

for (const [path, page] of Object.entries(pages)) {
  const html = pageHtml(template, path, page);
  if (path === '/') {
    await writeFile(join(dist, 'index.html'), html);
    continue;
  }

  const slug = path.slice(1);
  await writeFile(join(dist, `${slug}.html`), html);
  await mkdir(join(dist, slug), { recursive: true });
  await writeFile(join(dist, slug, 'index.html'), html);
}

console.log(`[seo] wrote ${Object.keys(pages).length} public pages`);
