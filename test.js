const { convert } = require('./dist/index.js');
const fs = require('fs');
const read = fs.readFileSync('./AnimatedSticker.tgs')

console.info(convert(read));