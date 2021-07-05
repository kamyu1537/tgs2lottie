const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

if (process.argv[2] === undefined) {
    throw Error('argv[2] is undefined');
}

const p = path.parse(process.argv[2]);
const tgs = fs.readFileSync(process.argv[2]);

let json = {};
try {
    const unzip = zlib.gunzipSync(tgs);
    json = JSON.parse(unzip.toString('utf-8'));
} catch {
    json = JSON.parse(tgs);
}


json.w = 320;
json.h = 320;

let i = 0;
for (const layer of json.layers) {
    if (layer.ks != null) {
        if (layer.parent === undefined) {
            if (layer.ks.p != null) layer.ks.p.k = layer.ks.p.k.map((item) => changeValue(item));
            if (layer.ks.s != null) layer.ks.s.k = layer.ks.s.k.map(item => changeValue(item));
            else layer.ks.s = { a: 0, k: [62.5, 62.5, 62.5] };
        }
    }
    i += 1;
}

function changeValue(value) {
    if (typeof value === 'number') value = value * 0.625;
    if (typeof value === 'object') {
        if (value.s != null) value.s = value.s.map(item => item * 0.625);
        if (value.e != null) value.e = value.e.map(item => item * 0.625);
    }
    return value;
}

fs.writeFileSync(path.join(p.dir, p.name + '_320.json'), JSON.stringify(json));