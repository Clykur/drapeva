import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACT_DIR = '/Users/karthiknaramala/.gemini/antigravity-ide/brain/70c59a5a-0658-4cce-92c8-90928a9fb668';

const sourceImages = {
  champagne_gold: path.join(ARTIFACT_DIR, 'saree_champagne_gold_1781766047033.png'),
  crimson_red: path.join(ARTIFACT_DIR, 'saree_crimson_red_1781766062282.png'),
  emerald_green: path.join(ARTIFACT_DIR, 'saree_emerald_green_1781766077971.png'),
  ivory_gold: path.join(ARTIFACT_DIR, 'saree_ivory_gold_1781766094812.png'),
  weaving_detail: path.join(ARTIFACT_DIR, 'saree_weaving_detail_1781766107775.png')
};

const mapping = {
  'hero.jpg': sourceImages.champagne_gold,
  'collection-banner.jpg': sourceImages.weaving_detail,
  'product-1.jpg': sourceImages.crimson_red,
  'product-2.jpg': sourceImages.emerald_green,
  'product-3.jpg': sourceImages.champagne_gold,
  'product-4.jpg': sourceImages.ivory_gold,
  'saree-base-1.jpg': sourceImages.crimson_red,
  'saree-base-2.jpg': sourceImages.weaving_detail,
  'saree-base-3.jpg': sourceImages.weaving_detail,
  'saree-base-4.jpg': sourceImages.emerald_green,
  'saree-base-5.jpg': sourceImages.ivory_gold,
  'saree-base-6.jpg': sourceImages.champagne_gold,
  'saree-base-7.jpg': sourceImages.weaving_detail
};

const destDirs = [
  path.join(__dirname, '../src/assets'),
  path.join(__dirname, '../public/assets')
];

// Ensure directories exist
destDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

Object.entries(mapping).forEach(([destFilename, srcPath]) => {
  if (!fs.existsSync(srcPath)) {
    console.error(`Source image not found: ${srcPath}`);
    return;
  }

  destDirs.forEach(dir => {
    const destPath = path.join(dir, destFilename);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${path.basename(srcPath)} -> ${destPath}`);
  });
});

console.log('Copy operation completed.');
