// Turns the original photos in /assets-source into web-ready files in /src/assets/photos.
//  - applies EXIF orientation, then strips ALL metadata (phone photos can carry GPS coordinates)
//  - splits the side-by-side / stacked "before & after" composites into separate before + after
//    images (cropping out baked-in labels, borders and watermarks) so the site can build its own slider
//  - resizes oversized originals
// Run with:  npm run prep:images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets-source';
const OUT = 'src/assets/photos';
await mkdir(OUT, { recursive: true });

/** @param {string} out @param {string} input @param {{extract?: {left:number,top:number,width:number,height:number}, width?: number, quality?: number, flatten?: boolean, enhance?: boolean}} o */
async function make(out, input, { extract, width = 1600, quality = 82, flatten = false, enhance = false } = {}) {
  // 1) normalise orientation first so crop coordinates refer to what you actually see
  let buf = await sharp(path.join(SRC, input)).rotate().toBuffer();
  let img = sharp(buf);
  if (flatten) img = img.flatten({ background: '#ffffff' });
  if (extract) img = img.extract(extract);
  if (enhance) {
    // Very low-resolution source: light denoise (so sharpening doesn't amplify JPEG blocks), a smooth upscale
    // to `width`, then unsharp-mask to rebuild edges. Best-effort only: a larger original photo will always beat this.
    img = img.median(3).resize({ width, kernel: 'lanczos3' }).sharpen({ sigma: 1.8, m1: 1.0, m2: 3.5 });
  } else {
    img = img.resize({ width, withoutEnlargement: true });
  }
  const info = await img
    .jpeg({ quality, mozjpeg: true })
    .toFile(path.join(OUT, out));
  console.log(`${out.padEnd(34)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// ---- Before / after pairs (4:5 crops, label-free) -------------------------------------------
// Hallway: panels are the same doorway shot twice, so a wipe lines up well.
await make('ba-hallway-before.jpg', 'carpet-before-after-diamond.jpg', { extract: { left: 26, top: 230, width: 436, height: 545 }, width: 900, quality: 88 });
await make('ba-hallway-after.jpg', 'carpet-before-after-diamond.jpg', { extract: { left: 498, top: 230, width: 436, height: 545 }, width: 900, quality: 88 });
// Spot removal on light carpet
await make('ba-spots-before.jpg', 'carpet-before-after-1.jpg', { extract: { left: 0, top: 200, width: 530, height: 662 }, width: 900 });
await make('ba-spots-after.jpg', 'carpet-before-after-1.jpg', { extract: { left: 550, top: 200, width: 530, height: 662 }, width: 900 });
// Brown carpet (stacked composite -> top = before, bottom = after)
await make('ba-brown-before.jpg', 'carpet-before-after-brown.jpg', { extract: { left: 600, top: 24, width: 613, height: 766 }, width: 900 });
await make('ba-brown-after.jpg', 'carpet-before-after-brown.jpg', { extract: { left: 600, top: 1130, width: 613, height: 766 }, width: 900 });
// Brown carpet, WIDE 3:2 crop for the homepage hero (high-res original, so it stays crisp when shown large)
await make('ba-brown-wide-before.jpg', 'carpet-before-after-brown.jpg', { extract: { left: 360, top: 24, width: 1149, height: 766 }, width: 1200, quality: 84 });
await make('ba-brown-wide-after.jpg', 'carpet-before-after-brown.jpg', { extract: { left: 360, top: 1130, width: 1149, height: 766 }, width: 1200, quality: 84 });
// Office carpet (stacked: top = before, bottom = after) – different framing, shown as a static pair
await make('ba-office-before.jpg', 'carpet-before-after-office.jpg', { extract: { left: 0, top: 50, width: 746, height: 372 }, width: 1000 });
await make('ba-office-after.jpg', 'carpet-before-after-office.jpg', { extract: { left: 0, top: 450, width: 746, height: 372 }, width: 1000 });
// Patterned carpet (note: the original file was named "tile-before-after" but it is carpet)
await make('ba-pattern-before.jpg', 'tile-before-after.jpg', { extract: { left: 0, top: 400, width: 870, height: 1100 }, width: 900 });
await make('ba-pattern-after.jpg', 'tile-before-after.jpg', { extract: { left: 903, top: 400, width: 870, height: 1100 }, width: 900 });

// ---- On-the-job photos ----------------------------------------------------------------------
await make('job-carpet-wand.jpg', 'carpet-cleaning.jpg', { width: 1600 });
await make('job-carpet-machine.jpg', 'carpet-cleaning-machine.jpg', { width: 1100 });
await make('job-carpet-doorway.jpg', 'carpet-cleaning-doorway.jpg', { width: 1000 });
await make('job-carpet-hallway.jpg', 'carpet-cleaning-hallway.jpg', { width: 1600 });
await make('job-carpet-pattern.jpg', 'carpet-pattern-cleaning.jpg', { width: 1600 });
await make('job-tile-grout.jpg', 'tile-grout-cleaning.jpg', { width: 1131, quality: 90, enhance: true }); // 377px source → 3× + sharpened
await make('job-hardwood.jpg', 'hardwood-cleaning.jpg', { width: 1000 });
await make('job-upholstery.jpg', 'upholstery-cleaning.jpg', { width: 1100 });
// Area rug: cropped from the stock living-room illustration the old site already used (no suitable rug photo supplied)
await make('job-rug.jpg', 'hero-room.png', { extract: { left: 540, top: 905, width: 714, height: 349 }, width: 1000 });

// ---- Marketing / resource imagery -----------------------------------------------------------
await make('cta-mop.jpg', 'mop-cta.jpg', { width: 1600, quality: 80 });
await make('resource-carpet-fibers.jpg', 'resource-carpet-fibers.png', { width: 1100, flatten: true, quality: 88 });
await make('resource-urine-diagram.jpg', 'resource-urine-diagram.png', { width: 1100, flatten: true, quality: 88 });
await make('resource-mattress-diagram.jpg', 'resource-mattress-diagram.png', { width: 1100, flatten: true, quality: 88 });

console.log('done');
