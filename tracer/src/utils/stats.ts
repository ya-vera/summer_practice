import * as ss from 'simple-statistics';

export function mean(arr: number[]): number {
    return ss.mean(arr);
}
export function median(arr: number[]): number {
    return ss.median(arr);
}
export function variance(arr: number[]): number {
    return ss.variance(arr);
}
export function sd(arr: number[]): number {
    return Math.sqrt(ss.variance(arr));
}
export function se(arr: number[]): number {
    return sd(arr) / Math.sqrt(arr.length);
}
export function min(arr: number[]): number {
    return ss.min(arr);
}
export function max(arr: number[]): number {
    return ss.max(arr);
}
export function trimmedMinMax(arr: number[]): [number, number] {
    const sorted = [...arr].sort((a, b) => a - b);
    const trim = Math.floor(arr.length * 0.05);
    return [sorted[trim], sorted[sorted.length - 1 - trim]];
}
