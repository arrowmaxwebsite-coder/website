// Generates favicon + social-share (Open Graph) images into /public.
// Run with:  npm run prep:brand
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

await mkdir('public', { recursive: true });

const NAVY = '#002244';

// ---- Favicon: navy tile with the logo's swoosh + arrow tip -----------------------------------
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#6CB01E"/><stop offset=".45" stop-color="#D3F516"/><stop offset="1" stop-color="#4EC7EE"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="${NAVY}"/>
  <path d="M10 45 C 22 53, 42 46, 53 24" fill="none" stroke="url(#g)" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M42.5 20.5 L56 15.5 L54.2 29.5 Z" fill="#4EC7EE" stroke="#4EC7EE" stroke-width="2" stroke-linejoin="round"/>
</svg>`;
await writeFile('public/favicon.svg', faviconSvg);
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile('public/icon-512.png');

// ---- Open Graph image (1200x630) -------------------------------------------------------------
const W = 1200, H = 630;
const logo = await sharp('src/assets/logo.png').resize({ width: 520 }).toBuffer();
const after = await sharp('src/assets/photos/ba-hallway-after.jpg').resize(330, 412, { fit: 'cover' }).toBuffer();
const before = await sharp('src/assets/photos/ba-hallway-before.jpg').resize(330, 412, { fit: 'cover' }).toBuffer();
// two-tone split photo on the right
const split = await sharp({ create: { width: 330, height: 412, channels: 3, background: '#000' } })
  .composite([
    { input: await sharp(before).extract({ left: 0, top: 0, width: 165, height: 412 }).toBuffer(), left: 0, top: 0 },
    { input: await sharp(after).extract({ left: 165, top: 0, width: 165, height: 412 }).toBuffer(), left: 165, top: 0 },
  ]).png().toBuffer();
const rounded = await sharp(split)
  .composite([{ input: Buffer.from(`<svg width="330" height="412"><rect width="330" height="412" rx="26" fill="#fff"/></svg>`), blend: 'dest-in' }])
  .png().toBuffer();

const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="a" cx="85%" cy="10%" r="60%"><stop offset="0" stop-color="#4EC7EE" stop-opacity=".35"/><stop offset="1" stop-color="#4EC7EE" stop-opacity="0"/></radialGradient>
    <radialGradient id="l" cx="5%" cy="100%" r="55%"><stop offset="0" stop-color="#A8DF18" stop-opacity=".28"/><stop offset="1" stop-color="#A8DF18" stop-opacity="0"/></radialGradient>
    <linearGradient id="s" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#6CB01E"/><stop offset=".5" stop-color="#D3F516"/><stop offset="1" stop-color="#4EC7EE"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#a)"/><rect width="${W}" height="${H}" fill="url(#l)"/>
  <path d="M-20 560 C 260 640, 700 600, 1230 330" fill="none" stroke="url(#s)" stroke-width="10" stroke-linecap="round" opacity=".9"/>
  <path d="M-20 590 C 300 655, 760 640, 1230 400" fill="none" stroke="#4EC7EE" stroke-width="3" stroke-linecap="round" opacity=".6"/>
  <text x="70" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="64" fill="#fff">Carpet &amp; Floor</text>
  <text x="70" y="404" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="64" fill="#A8DF18">Cleaning. Done Right.</text>
  <text x="72" y="462" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="#ADF2EE">Westmoreland · Indiana · Cambria County, PA</text>
  <text x="72" y="520" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="34" fill="#fff">Free quote  (724) 702-4340</text>
</svg>`;

await sharp(Buffer.from(bg))
  .composite([
    { input: logo, left: 64, top: 70 },
    { input: rounded, left: 800, top: 108 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('brand assets written to /public');
