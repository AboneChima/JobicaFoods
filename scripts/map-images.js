const fs = require('fs');
const path = require('path');

// Read the images directory
const imagesDir = path.join(__dirname, '../public/images');
const images = fs.readdirSync(imagesDir)
  .filter(file => file.includes('WhatsApp'))
  .sort();

console.log('Total images found:', images.length);
console.log('\nImages list:');
images.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

// Read products
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('\n\nTotal products:', products.length);
console.log('\nProducts list:');
products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} ${product.size || ''} (${product.brand})`);
});

console.log('\n\nCreate a mapping in image-mapping.json with format:');
console.log('{ "productId": "imageFileName" }');
