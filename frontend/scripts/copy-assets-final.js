#!/usr/bin/env node
/**
 * Copy saree images from artifacts to frontend public assets.
 * Run this script from the workspace root:
 *   node frontend/scripts/copy-assets-final.js
 *
 * The script reads each image from the brain artifacts directory
 * and writes them to the public/assets and src/assets folders.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const home = homedir();
const brainDir = join(home, '.gemini/antigravity-ide/brain/70c59a5a-0658-4cce-92c8-90928a9fb668');
const projectDir = join(home, 'Desktop/golden-silk-emporium/frontend');

const mappings = [
  {
    src: 'saree_hero_champagne_1781768368858.png',
    dests: [
      'public/assets/hero.jpg',
      'src/assets/hero.jpg',
      'public/assets/product-3.jpg',
      'src/assets/product-3.jpg',
      'public/assets/saree-base-6.jpg',
      'src/assets/saree-base-6.jpg',
    ]
  },
  {
    src: 'product_1_crimson_1781768445781.png',
    dests: [
      'public/assets/product-1.jpg',
      'src/assets/product-1.jpg',
      'public/assets/saree-base-1.jpg',
      'src/assets/saree-base-1.jpg',
    ]
  },
  {
    src: 'product_2_emerald_1781768464412.png',
    dests: [
      'public/assets/product-2.jpg',
      'src/assets/product-2.jpg',
      'public/assets/saree-base-4.jpg',
      'src/assets/saree-base-4.jpg',
    ]
  },
  {
    src: 'product_4_ivory_1781768486937.png',
    dests: [
      'public/assets/product-4.jpg',
      'src/assets/product-4.jpg',
      'public/assets/saree-base-5.jpg',
      'src/assets/saree-base-5.jpg',
    ]
  },
  {
    src: 'saree_weaving_detail_1781768506265.png',
    dests: [
      'public/assets/collection-banner.jpg',
      'src/assets/collection-banner.jpg',
      'public/assets/saree-base-2.jpg',
      'src/assets/saree-base-2.jpg',
      'public/assets/saree-base-3.jpg',
      'src/assets/saree-base-3.jpg',
      'public/assets/saree-base-7.jpg',
      'src/assets/saree-base-7.jpg',
    ]
  },
];

let success = 0;
let failed = 0;

for (const map of mappings) {
  const srcPath = join(brainDir, map.src);
  let buf;
  try {
    buf = readFileSync(srcPath);
    console.log(`✓ Read ${map.src} (${buf.length} bytes)`);
  } catch (err) {
    console.error(`✗ Failed to read ${map.src}: ${err.message}`);
    failed++;
    continue;
  }
  
  for (const dest of map.dests) {
    const destPath = join(projectDir, dest);
    try {
      mkdirSync(join(projectDir, dest.split('/').slice(0, -1).join('/')), { recursive: true });
      writeFileSync(destPath, buf);
      console.log(`  → copied to ${dest}`);
      success++;
    } catch (err) {
      console.error(`  ✗ Failed to write ${dest}: ${err.message}`);
      failed++;
    }
  }
}

console.log(`\nDone: ${success} files copied, ${failed} failed.`);
