export interface Bin {
    bin: number;
    count: number;
}

export function histogram(arr: number[], bins: number): Bin[] {
    const n = arr.length;
    if (n === 0 || bins <= 0) return [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const width = (max - min) / bins;
    const result: Bin[] = [];
    for (let i = 0; i < bins; i++) {
        result.push({ bin: min + i * width, count: 0 });
    }
    for (const v of arr) {
        const idx = Math.min(Math.floor((v - min) / width), bins - 1);
        result[idx].count++;
    }
    return result;
}
