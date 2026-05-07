const fs = require('fs');
const { createCanvas, Image } = require('canvas');

const buf = fs.readFileSync('src/assets/pokemon/overworld_sprites.png');
const img = new Image();
img.onload = () => {
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    console.log(`Top-left pixel RGB: ${data[0]}, ${data[1]}, ${data[2]}, ${data[3]}`);
};
img.src = buf;
