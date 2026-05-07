const fs = require('fs');
const files = [
  'Accumula_Town_Spring_BW.png',
  'DS _ DSi - Pokemon Black 2 _ White 2 - Overworld - Pokemon (Overworld).png'
];
files.forEach(f => {
  const buf = fs.readFileSync(f);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log(`${f}: ${w}x${h} (${(buf.length/1024).toFixed(0)} KB)`);
});
