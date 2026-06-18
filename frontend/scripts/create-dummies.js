import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(tinyPngBase64, 'base64');

const filenames = [
  'hero.jpg',
  'collection-banner.jpg',
  'product-1.jpg',
  'product-2.jpg',
  'product-3.jpg',
  'product-4.jpg',
  'saree-base-1.jpg',
  'saree-base-2.jpg',
  'saree-base-3.jpg',
  'saree-base-4.jpg',
  'saree-base-5.jpg',
  'saree-base-6.jpg',
  'saree-base-7.jpg'
];

const destDirs = [
  path.join(__dirname, '../src/assets'),
  path.join(__dirname, '../public/assets')
];

destDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  filenames.forEach(file => {
    const destPath = path.join(dir, file);
    fs.writeFileSync(destPath, buffer);
    console.log(`Created dummy asset: ${destPath}`);
  });
});

console.log('All dummy assets created.');
