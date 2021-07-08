# TGS2Lottie
[![npm](https://img.shields.io/npm/v/tgs2lottie)](https://www.npmjs.com/package/tgs2lottie)  
telegram animated sticker to lottie animation json! :D  
[Github Pages](https://kamyu1537.github.io/tgs2lottie-web/)

## Download
### NPM
```shell
npm install --save tgs2lottie
```

## How to use?
### NODE
```js
const { convert } = require('./dist/index.js');
const fs = require('fs');
const read = fs.readFileSync('./AnimatedSticker.tgs')

console.info(convert(read));
```
### Shell
```shell
tgs2lottie --size 320 ./AnimatedSticker.tgs
```

## Build
### Typescript
```shell
npm ci
npm run build
```
