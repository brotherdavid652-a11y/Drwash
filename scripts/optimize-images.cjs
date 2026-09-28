const sharp = require('sharp');
const path = require('node:path');
const fs = require('node:fs/promises');
const root = path.resolve(__dirname, '..');

(async () => {
  for (const name of ['clothing', 'bedding', 'sneakers', 'pickup']) {
    const input = path.join(root, 'design', 'fresh-images', `${name}.png`);
    for (const width of [480, 900]) {
      await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(path.join(root, 'assets', `${name}-fresh-${width}.webp`));
    }
  }
  for (const width of [400, 720]) {
    await sharp(path.join(root, 'assets', 'hero-aqua-v3.png')).resize({ width }).webp({ quality: 80, alphaQuality: 85, effort: 5 }).toFile(path.join(root, 'assets', `hero-aqua-${width}.webp`));
  }
  await sharp(path.join(root, 'assets', 'hero-aqua-v3.png')).resize({ width: 540, height: 630, fit: 'contain', background: '#d5f5fb' }).flatten({ background: '#d5f5fb' }).extend({ left: 330, right: 330, top: 0, bottom: 0, background: '#d5f5fb' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(root, 'assets', 'social-preview.jpg'));
  const names = (await fs.readdir(path.join(root, 'assets'))).filter(name => name.endsWith('.webp'));
  for (const name of names) console.log(`${name}: ${Math.round((await fs.stat(path.join(root, 'assets', name))).size / 1024)} KB`);
})().catch(error => { console.error(error); process.exitCode = 1; });
