// Fixes a typo that was baked into the mattress infographic copied from the old site: "Persperation" → "Perspiration".
//
// Only one letter is wrong (the second "e" should be an "i"), so rather than re-typing the word in a similar font we
// reuse the "i" that is already in "rat-i-on": same font, size, colour and blur. The wrong "e" is painted out with clean
// background taken from just above the label, the "i" is dropped in, and "ration" slides left to close the gap.
//
// Input : assets-source/resource-mattress-diagram.png          (original, left untouched)
// Output: assets-source/resource-mattress-diagram-fixed.png    (used by scripts/prep-images.mjs)
// Run   : node scripts/fix-mattress-label.mjs
//
// All coordinates are pixels in the 1438×1230 original. If the original is ever replaced, the sanity checks below fail
// loudly instead of silently producing a damaged image.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets-source/resource-mattress-diagram.png');
const OUT = path.join(root, 'assets-source/resource-mattress-diagram-fixed.png');

const BAND = { top: 405, bottom: 463 }; // rows covering the whole word, including the dot of the i and the descender of the p
const WRONG_E = { from: 1137, to: 1162 }; // second "e" in "Persperation"
const DONOR_I = { from: 1230, to: 1244 }; // the "i" in "ration" plus 3px of background each side
const RATION = { from: 1164, to: 1306 }; // "ration" plus a little background each side
const I_DEST = 1135; // where the donor rectangle lands (glyph itself ends up at x 1138–1146, 3px after the "p")
const RATION_DEST = 1148; // "ration" moves 16px left, leaving the same 4px gap an "e" had before the "r"
const CLEAN_ROWS_ABOVE = 65; // clean white background this far above the label is used as the patch

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = (x, y) => (y * W + x) * C;
const ink = (x, y) => 255 - data[px(x, y)] > 90; // text is blue, so the red channel drops

const inkCount = (x0, x1) => {
  let n = 0;
  for (let y = BAND.top; y <= BAND.bottom; y++) for (let x = x0; x <= x1; x++) if (ink(x, y)) n++;
  return n;
};

// --- sanity checks: this must be the image we measured --------------------------------------------------------
if (W !== 1438 || H !== 1230) throw new Error(`Unexpected size ${W}x${H}; re-measure the coordinates.`);
if (inkCount(WRONG_E.from, WRONG_E.to) < 200) throw new Error('No text where the wrong "e" should be.');
if (inkCount(DONOR_I.from + 3, DONOR_I.to - 3) < 100) throw new Error('No "i" where the donor glyph should be.');
if (inkCount(DONOR_I.from, DONOR_I.from + 1) !== 0 || inkCount(DONOR_I.to - 1, DONOR_I.to) !== 0) {
  throw new Error('Donor "i" is not isolated by background.');
}
for (let y = BAND.top - CLEAN_ROWS_ABOVE; y < BAND.bottom - CLEAN_ROWS_ABOVE; y++) {
  for (let x = WRONG_E.from; x <= RATION.to; x++) if (ink(x, y)) throw new Error('Patch source area is not clean background.');
}

const out = Buffer.from(data); // work on a copy; `data` stays the pristine original

const copyBlock = (srcX, srcY, dstX, dstY, w, h) => {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = px(srcX + x, srcY + y);
      const d = px(dstX + x, dstY + y);
      for (let c = 0; c < C; c++) out[d + c] = data[s + c];
    }
  }
};
const bandH = BAND.bottom - BAND.top + 1;

// 1. paint everything from the wrong "e" to the end of the word with clean background from above the label
copyBlock(WRONG_E.from, BAND.top - CLEAN_ROWS_ABOVE, WRONG_E.from, BAND.top, RATION.to - WRONG_E.from + 1, bandH);
// 2. "ration" slides left
copyBlock(RATION.from, BAND.top, RATION_DEST, BAND.top, RATION.to - RATION.from + 1, bandH);
// 3. the "i" goes where the "e" was
copyBlock(DONOR_I.from, BAND.top, I_DEST, BAND.top, DONOR_I.to - DONOR_I.from + 1, bandH);

await sharp(out, { raw: { width: W, height: H, channels: C } }).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${path.relative(root, OUT)}`);
