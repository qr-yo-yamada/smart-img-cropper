const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'src/assets/images');
const outputFile = path.join(__dirname, 'public/imageList.json');

const files = fs.readdirSync(imageDir).filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file));
fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

console.log('Image list generated:', files);
