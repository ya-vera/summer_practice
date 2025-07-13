import { min, max } from './stats';

export interface Bin {
    bin: number;
    count: number;
}

export function histogram(arr: number[], bins: number): Bin[] {
    const n = arr.length;
    if (n === 0 || bins <= 0) return [];
    const dataMin = min(arr);
    const dataMax = max(arr);
    const width = (dataMax - dataMin) / bins;
    const result: Bin[] = [];
    for (let i = 0; i < bins; i++) {
        result.push({ bin: dataMin + i * width, count: 0 });
    }
    for (const v of arr) {
        const idx = Math.min(Math.floor((v - dataMin) / width), bins - 1);
        result[idx].count++;
    }
    return result;
}