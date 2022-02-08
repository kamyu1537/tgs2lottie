import pako from 'pako';

interface OffsetKeyframe {
    s: number[];
    e: number[];
}

interface LottieVector {
    a?: 0 | 1;
    k: (number | OffsetKeyframe)[]
}

interface LottieTransform {
    p?: LottieVector;
    s?: LottieVector;
}

interface LottieLayer {
    ks?: LottieTransform;
    parent?: number;
}

interface LottieAnimation {
    w?: number;
    h?: number;
    layers?: LottieLayer[];
}

function scaleValue(value: number | OffsetKeyframe, scale: number): number | OffsetKeyframe {
    if (typeof value === 'number') value = value * scale;
    if (typeof value === 'object') {
        if (value.s != null) value.s = value.s.map(v => v * scale);
        if (value.e != null) value.e = value.e.map(v => v * scale);
    }
    return value;
}

function bytesToString(bytes: Uint8Array): string {
    let result = "";
    for (let i = 0; i < bytes.length; ++i) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
}

export function convert(tgs: Uint8Array, size = 512): string {
    if (size < 1) {
        throw new Error("Size must be at least 1!");
    }

    let json: LottieAnimation = { layers: [] };

    try {
        const unzip = pako.ungzip(tgs);
        json = JSON.parse(bytesToString(unzip));
    } catch {
        json = JSON.parse(bytesToString(tgs));
    }

    const scale = size / (json.w || 512);
    json.w = (json.w || 512) * scale;
    json.h = (json.h || 512) * scale;

    if (json.layers != null) {
        for (const layer of json.layers) {
            if (layer.ks != null) {
                if (layer.parent == null) {
                    if (layer.ks?.p != null) layer.ks.p.k = layer.ks.p.k.map(v => scaleValue(v, scale));
                    if (layer.ks?.s != null) layer.ks.s.k = layer.ks.s.k.map(v => scaleValue(v, scale));
                    else layer.ks.s = { a: 0, k: [100 * scale, 100 * scale, 100 * scale] };
                }
            }
        }
    }

    return JSON.stringify(json);
}

export default convert;
