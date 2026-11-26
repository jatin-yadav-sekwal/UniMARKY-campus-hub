import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const baseUrl = 'https://unimarky.runs-on.dev';

const universities = [
  {
    slug: 'central-university-of-haryana',
    name: 'Central University of Haryana',
    short: 'CUH',
    city: 'Mahendragarh, Haryana',
    country: 'IN',
    website: 'https://www.cuh.ac.in/',
  },
  {
    slug: 'massachusetts-institute-of-technology-mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    short: 'MIT',
    city: 'Cambridge, Massachusetts',
    country: 'US',
    website: 'https://www.mit.edu/',
  },
  {
    slug: 'banaras-hindu-university-bhu',
    name: 'Banaras Hindu University (BHU)',
    short: 'BHU',
    city: 'Varanasi, Uttar Pradesh',
    country: 'IN',
    website: 'https://www.bhu.ac.in/',
  },
  {
    slug: 'iit-bombay',
    name: 'IIT Bombay',
    short: 'IITB',
    city: 'Mumbai, Maharashtra',
    country: 'IN',
    website: 'https://www.iitb.ac.in/',
  },
];

const services = [
  {
    title: 'Marketplace',
    href: '/marketplace',
    copy: (u) =>
      `Buy and sell textbooks, calculators, cycles and hostel gear with students at ${u.short}.`,
  },
  {
    title: 'Communities',
    href: '/communities',
    copy: (u) => `Join clubs, batches and campus events at ${u.short}.`,
  },
  {
    title: 'Study',
    href: '/study',
    copy: () =>
      'Find notes, previous-year papers and course resources by subject and semester.',
  },
  {
    title: 'Accommodation',
    href: '/housing',
    copy: (u) =>
      `PGs, hostels and flats near ${u.short} — filter by distance and contact the host directly.`,
  },
  {
    title: 'Food',
    href: '/food',
    copy: (u) =>
      `Menus, price ranges and student favourites from places around ${u.short}.`,
  },
  {
    title: 'Lost & Found',
    href: '/lost-found',
    copy: (u) =>
      `Report something lost or found on the ${u.short} campus and get it back to its owner.`,
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function faqsFor(u) {
  return [
    {
      q: `Who can use UniMARKY at ${u.short}?`,
      a: `Students at ${u.name}. Create an account, choose ${u.name} during onboarding, and your marketplace, communities and resources are scoped to that campus.`,
    },
    {
      q: 'What can I do with one account?',
      a: 'Buy and sell in the marketplace, join communities, find study material, look for accommodation and food, and report lost or found items.',
    },
    {
      q: 'Do I need a university email to sign up?',
      a: 'No. Sign up with email or Google, then select your university during onboarding.',
    },
  ];
}

const schemaFor = (u, url) => {
  const faqs = faqsFor(u);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollegeOrUniversity',
        name: u.name,
        url,
        sameAs: [u.website],
        address: {
          '@type': 'PostalAddress',
          addressLocality: u.city,
          addressCountry: u.country,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Universities',
            item: `${baseUrl}/universities`,
          },
          { '@type': 'ListItem', position: 3, name: u.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };
};

function shell({ title, description, url, schema, body }) {
  const json = JSON.stringify(schema).replaceAll('<', '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="UniMARKY" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${baseUrl}/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${baseUrl}/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet" />
  <script type="application/ld+json">${json}</script>
  <style>
    :root{--ink:#262522;--muted:#66625c;--line:#e8e6e1;--paper:#f7f6f3;--blue:#3157d5}
    *{box-sizing:border-box}
    body{margin:0;background:#fff;color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;line-height:1.65;-webkit-font-smoothing:antialiased}
    a{color:inherit}
    .wrap{max-width:1120px;margin:0 auto;padding:0 24px}
    .top{border-bottom:1px solid var(--line);padding:20px 0;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
    .top img{height:26px;width:auto;display:block}
    .top nav{display:flex;gap:18px;flex-wrap:wrap;font-size:13px}
    .top nav a{text-decoration:none;color:var(--muted)}
    .top nav a:hover{color:var(--ink)}
    .hero{padding:64px 0 44px;border-bottom:1px solid var(--line)}
    .mono{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
    h1{font-family:'Space Grotesk',sans-serif;font-weight:400;font-size:clamp(34px,5vw,54px);line-height:1.06;letter-spacing:-.045em;margin:14px 0 18px;max-width:20ch}
    h1 span{color:#716c62}
    .lead{max-width:62ch;color:var(--muted);font-size:16px;margin:0 0 26px}
    .actions{display:flex;gap:12px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:0 16px;height:42px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:500}
    .btn-primary{background:var(--blue);border:1px solid var(--blue);color:#fff}
    .btn-secondary{background:#fff;border:1px solid #e0ded8;color:var(--ink)}
    .services{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);margin:44px 0}
    .service{background:#fff;padding:26px;display:flex;flex-direction:column;gap:10px}
    .service h2{font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:500;margin:0}
    .service p{margin:0;color:var(--muted);font-size:14px}
    .service a{margin-top:auto;align-self:flex-start;color:var(--blue);text-decoration:none;font-size:13px;border-bottom:1px solid rgba(49,87,213,.35);padding-bottom:3px}
    .section{padding:48px 0;border-top:1px solid var(--line)}
    .section h2{font-family:'Space Grotesk',sans-serif;font-weight:400;font-size:28px;letter-spacing:-.03em;margin:0 0 18px}
    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    .step{font-size:14px;color:var(--muted)}
    .step strong{display:block;color:var(--ink);font-size:15px;margin-bottom:4px}
    .faq details{border-top:1px solid var(--line);padding:14px 0}
    .faq summary{cursor:pointer;font-weight:500;font-size:14px}
    .faq p{color:var(--muted);font-size:14px;margin:10px 0 0}
    .cta{background:var(--paper);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:40px 0;margin-top:12px}
    .universities{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:32px 0}
    .uni{border:1px solid var(--line);padding:20px}
    .uni a{font-family:'Space Grotesk',sans-serif;font-size:18px;color:var(--ink);text-decoration:none}
    .uni a:hover{color:var(--blue)}
    .uni p{margin:6px 0 0;color:var(--muted);font-size:13px}
    footer{padding:32px 0;border-top:1px solid var(--line);color:var(--muted);font-size:13px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
    footer a{text-decoration:none;margin-right:14px}
    footer a:hover{color:var(--ink)}
    @media(max-width:760px){.services,.steps,.universities{grid-template-columns:1fr}.hero{padding:44px 0 32px}}
  </style>
</head>
<body>
  <header class="top wrap">
    <a href="/" aria-label="UniMARKY home"><img src="/unimarky-logo.png" alt="UniMARKY" /></a>
    <nav>
      <a href="/">Home</a>
      <a href="/universities">Universities</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/auth">Sign in</a>
    </nav>
  </header>
  ${body}
  <footer class="wrap">
    <span>© ${new Date().getFullYear()} UniMARKY</span>
    <span>
      <a href="/">Home</a>
      <a href="/universities">Universities</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </span>
  </footer>
</body>
</html>`;
}

function campusBody(u) {
  const cards = services
    .map(
      (s) => `<article class="service"><h2>${s.title}</h2><p>${escapeHtml(
        s.copy(u)
      )}</p><a href="${s.href}">Open ${s.title.toLowerCase()} →</a></article>`
    )
    .join('\n');

  const faqs = faqsFor(u)
    .map(
      (f) =>
        `<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`
    )
    .join('\n');

  const others = universities
    .filter((other) => other.slug !== u.slug)
    .map(
      (other) =>
        `<article class="uni"><a href="/universities/${other.slug}">${escapeHtml(
          other.name
        )}</a><p>${escapeHtml(other.city)}</p></article>`
    )
    .join('\n');

  return `
  <main>
    <section class="hero wrap">
      <p class="mono">Campus / ${u.short}</p>
      <h1>Everything campus at <span>${escapeHtml(u.name)}.</span></h1>
      <p class="lead">One verified student account for the marketplace, communities, study material, accommodation, food and lost &amp; found at ${u.short}.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/auth">Create your student account</a>
        <a class="btn btn-secondary" href="/marketplace">Browse the marketplace</a>
      </div>
    </section>

    <section class="wrap">
      <div class="services">${cards}</div>
    </section>

    <section class="section wrap">
      <h2>How it works</h2>
      <div class="steps">
        <div class="step"><strong>01 / Sign up</strong>Create an account with email or Google.</div>
        <div class="step"><strong>02 / Pick your campus</strong>Choose ${escapeHtml(u.name)} during onboarding.</div>
        <div class="step"><strong>03 / Use campus services</strong>Buy, join, study, find a stay or a meal — one account.</div>
      </div>
    </section>

    <section class="section wrap faq">
      <h2>Questions from ${u.short}</h2>
      ${faqs}
    </section>

    <section class="section wrap">
      <h2>Other campuses</h2>
      <div class="universities">${others}</div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2 style="margin:0 0 8px">Ready to use ${u.short}?</h2>
        <p class="lead" style="margin:0 0 18px">Create your account and choose ${escapeHtml(u.name)} during onboarding.</p>
        <a class="btn btn-primary" href="/auth">Get started</a>
      </div>
    </section>
  </main>`;
}

function campusPage(u) {
  const url = `${baseUrl}/universities/${u.slug}`;
  return shell({
    title: `Campus Marketplace & Student Services at ${u.short} | UniMARKY`,
    description: `Buy and sell, join communities, find study material, stays and food at ${u.name}. One verified student account for campus life.`,
    url,
    schema: schemaFor(u, url),
    body: campusBody(u),
  });
}

function universitiesIndex() {
  const url = `${baseUrl}/universities`;
  const cards = universities
    .map(
      (u) =>
        `<article class="uni"><a href="/universities/${u.slug}">${escapeHtml(
          u.name
        )}</a><p>${escapeHtml(u.city)} · ${u.short}</p></article>`
    )
    .join('\n');
  const genericCopy = {
    Marketplace:
      'Buy and sell textbooks, electronics, cycles and hostel gear with students at your university.',
    Communities: 'Join clubs, batches and campus events at your university.',
    Study: 'Find notes, previous-year papers and course resources by subject and semester.',
    Accommodation:
      'PGs, hostels and flats near your university — filter by distance and contact the host.',
    Food: 'Menus, price ranges and student favourites from places around your campus.',
    'Lost & Found':
      'Report something lost or found on campus and get it back to its owner.',
  };

  const serviceList = services
    .map(
      (s) =>
        `<div class="step"><strong>${s.title}</strong>${escapeHtml(
          genericCopy[s.title] ?? ''
        )}</div>`
    )
    .join('\n');

  const body = `
  <main>
    <section class="hero wrap">
      <p class="mono">Campus directory</p>
      <h1>Campus services, <span>by university.</span></h1>
      <p class="lead">UniMARKY keeps the marketplace, communities, study material, accommodation, food and lost &amp; found scoped to your university. Pick your campus to see what is inside.</p>
    </section>
    <section class="wrap">
      <div class="universities">${cards}</div>
    </section>
    <section class="section wrap">
      <h2>What you get</h2>
      <div class="steps">${serviceList}</div>
    </section>
    <section class="cta">
      <div class="wrap">
        <h2 style="margin:0 0 8px">Find your campus</h2>
        <p class="lead" style="margin:0 0 18px">Create an account, choose your university, and everything stays scoped to it.</p>
        <a class="btn btn-primary" href="/auth">Get started</a>
      </div>
    </section>
  </main>`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: 'Universities on UniMARKY', url },
      {
        '@type': 'ItemList',
        itemListElement: universities.map((u, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: u.name,
          url: `${baseUrl}/universities/${u.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Universities', item: url },
        ],
      },
    ],
  };

  return shell({
    title: 'Universities on UniMARKY | Campus Services Directory',
    description:
      'Browse the universities on UniMARKY: marketplace, communities, study material, accommodation, food and lost & found, scoped to each campus.',
    url,
    schema,
    body,
  });
}

await mkdir(join(dist, 'universities'), { recursive: true });
const indexHtml = universitiesIndex();
await writeFile(join(dist, 'universities.html'), indexHtml);
await writeFile(join(dist, 'universities', 'index.html'), indexHtml);

for (const u of universities) {
  const html = campusPage(u);
  await writeFile(join(dist, 'universities', `${u.slug}.html`), html);
  await mkdir(join(dist, 'universities', u.slug), { recursive: true });
  await writeFile(join(dist, 'universities', u.slug, 'index.html'), html);
}

console.log(`[seo] wrote ${universities.length + 1} university pages`);
