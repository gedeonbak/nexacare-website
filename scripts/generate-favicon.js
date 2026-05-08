const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('public/favicon.svg');

async function generate() {
  await sharp(svg).resize(16, 16).png().toFile('public/favicon-16x16.png');
  await sharp(svg).resize(32, 32).png().toFile('public/favicon-32x32.png');
  await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(svg).resize(192, 192).png().toFile('public/android-chrome-192x192.png');
  await sharp(svg).resize(512, 512).png().toFile('public/android-chrome-512x512.png');
  console.log('All favicon sizes generated.');
}

generate().catch(console.error);
