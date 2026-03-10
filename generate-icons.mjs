import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = './public/icon.svg';
const svgBuffer = fs.readFileSync(svgPath);

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join('./public', name));
  console.log(`✓ public/${name} (${size}x${size})`);
}

console.log('\nTüm ikonlar oluşturuldu!');
