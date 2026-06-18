import fs from 'fs';
import path from 'path';

const brainDir = '/Users/karthiknaramala/.gemini/antigravity-ide/brain/70c59a5a-0658-4cce-92c8-90928a9fb668';
const projectDir = '/Users/karthiknaramala/Desktop/golden-silk-emporium/frontend';

const mappings = [
  { src: 'saree_champagne_gold_1781766047033.png', dest: ['src/assets/hero.jpg', 'public/assets/hero.jpg'] },
  { src: 'saree_weaving_detail_1781766107775.png', dest: ['src/assets/collection-banner.jpg', 'public/assets/collection-banner.jpg'] },
  { src: 'saree_crimson_red_1781766062282.png', dest: ['src/assets/product-1.jpg', 'public/assets/product-1.jpg', 'src/assets/saree-base-1.jpg', 'public/assets/saree-base-1.jpg'] },
  { src: 'saree_emerald_green_1781766077971.png', dest: ['src/assets/product-2.jpg', 'public/assets/product-2.jpg', 'src/assets/saree-base-4.jpg', 'public/assets/saree-base-4.jpg'] },
  { src: 'saree_champagne_gold_1781766047033.png', dest: ['src/assets/product-3.jpg', 'public/assets/product-3.jpg', 'src/assets/saree-base-6.jpg', 'public/assets/saree-base-6.jpg'] },
  { src: 'saree_ivory_gold_1781766094812.png', dest: ['src/assets/product-4.jpg', 'public/assets/product-4.jpg', 'src/assets/saree-base-5.jpg', 'public/assets/saree-base-5.jpg'] },
  { src: 'saree_weaving_detail_1781766107775.png', dest: ['src/assets/saree-base-2.jpg', 'public/assets/saree-base-2.jpg', 'src/assets/saree-base-3.jpg', 'public/assets/saree-base-3.jpg', 'src/assets/saree-base-7.jpg', 'public/assets/saree-base-7.jpg'] }
];

for (const map of mappings) {
  const srcPath = path.join(brainDir, map.src);
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    continue;
  }
  for (const destRel of map.dest) {
    const destPath = path.join(projectDir, destRel);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${map.src} to ${destRel}`);
  }
}
console.log('Copy assets completed successfully.');
