import zlib from 'zlib';

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

function changeValue(value: number | OffsetKeyframe, scale: number): number | OffsetKeyframe {
    if (typeof value === 'number') value = value * scale;
    if (typeof value === 'object') {
        if (value.s != null) value.s = value.s.map(v => v * scale);
        if (value.e != null) value.e = value.e.map(v => v * scale);
    }
    return value;
}

export function convert(tgs: Buffer, resize = 512): string {
    let json: LottieAnimation = { layers: [] };

    try {
        const unzip = zlib.gunzipSync(tgs);
        json = JSON.parse(unzip.toString('utf-8'));
    } catch {
        json = JSON.parse(tgs.toString('utf-8'));
    }

    const scale = resize / 512;
    json.w = (json.w || 512) * scale;
    json.h = (json.h || 512) * scale;

    if (json.layers != null) {
        for (const layer of json.layers) {
            if (layer.ks != null) {
                if (layer.parent == null) {
                    if (layer.ks?.p != null) layer.ks.p.k = layer.ks.p.k.map(v => changeValue(v, scale));
                    if (layer.ks?.s != null) layer.ks.s.k = layer.ks.s.k.map(v => changeValue(v, scale));
                    else layer.ks.s = { a: 0, k: [100 * scale, 100 * scale, 100 * scale] };
                }
            }
        }
    }

    return JSON.stringify(json);
}

export default convert;