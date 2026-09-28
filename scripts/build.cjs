const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const pages = ['index.html', 'terms.html', 'privacy.html', 'refunds.html'];

(async () => {
  let origin = '';
  if (process.env.SITE_URL) {
    const url = new URL(process.env.SITE_URL);
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be the HTTPS origin of the public website, with no path, query or credentials.');
    origin = url.origin;
  }
  await fs.mkdir(path.join(out, 'assets', 'vendor'), { recursive: true });
  const css = (await Promise.all(['styles.css', 'editorial.css', 'policies.css'].map(file => fs.readFile(path.join(root, file), 'utf8')))).join('\n');
  const minCss = await esbuild.transform(css, { loader: 'css', minify: true, target: ['safari15', 'chrome100', 'firefox100'] });
  const minJs = await esbuild.transform(await fs.readFile(path.join(root, 'script.js'), 'utf8'), { loader: 'js', minify: true, target: ['safari15', 'chrome100', 'firefox100'] });
  for (const [name, content] of [['site.min.css', minCss.code], ['script.min.js', minJs.code]]) {
    await fs.writeFile(path.join(root, name), content);
    await fs.writeFile(path.join(out, name), content);
  }
  const assets = (await fs.readdir(path.join(root, 'assets'))).filter(name => /(?:\.webp|\.woff2|LICENSE\.txt)$/.test(name) || ['favicon.svg', 'social-preview.jpg'].includes(name));
  for (const file of assets) await fs.copyFile(path.join(root, 'assets', file), path.join(out, 'assets', file));
  for (const file of ['gsap.min.js', 'ScrollTrigger.min.js']) await fs.copyFile(path.join(root, 'assets', 'vendor', file), path.join(out, 'assets', 'vendor', file));
  const refs = [...assets.map(name => `assets/${name}`), 'assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js', 'site.min.css', 'script.min.js'];
  const hashes = new Map(await Promise.all(refs.map(async file => [file, crypto.createHash('sha256').update(await fs.readFile(path.join(out, file))).digest('hex').slice(0,12)])));
  for (const file of pages) {
    let html = await fs.readFile(path.join(root, file), 'utf8');
    if (origin) {
      const canonical = origin + (file === 'index.html' ? '/' : `/${file}`);
      html = html.replace('</head>', `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"></head>`);
      html = html.replace(/(content=")assets\/social-preview\.jpg"/g, `$1${origin}/assets/social-preview.jpg"`);
      html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, text) => {
        const data = JSON.parse(text);
        data.url = origin + '/';
        data.image = origin + '/assets/social-preview.jpg';
        return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      });
    }
    html = html.replace(/(?:assets\/[a-zA-Z0-9_./-]+|site\.min\.css|script\.min\.js)/g, file => hashes.has(file) ? `${file}?v=${hashes.get(file)}` : file);
    await fs.writeFile(path.join(out, file), html);
  }
  const robots = 'User-agent: *\nAllow: /\n' + (origin ? `Sitemap: ${origin}/sitemap.xml\n` : '');
  await fs.writeFile(path.join(out, 'robots.txt'), robots);
  await fs.writeFile(path.join(out, '404.html'), '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Dr Wash Laundry</title><link rel="stylesheet" href="/site.min.css"></head><body><main class="policy-content"><h1>Page not found</h1><p>The page you requested is unavailable.</p><a href="/">Return to Dr Wash Laundry</a></main></body></html>');
  if (origin) {
    // Policy drafts are noindex and stay out of the sitemap until approved.
    await fs.writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
  } else {
    await fs.unlink(path.join(out, 'sitemap.xml')).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  await fs.copyFile(path.join(root, '_headers'), path.join(out, '_headers'));
  console.log(`Built dist/. ${origin ? `Canonical URLs and sitemap use ${origin}.` : 'Public domain not set: canonical URLs and sitemap await SITE_URL.'}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
