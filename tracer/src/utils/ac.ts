function mean(arr: number[]): number {
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}
function autocovariance(arr: number[], k: number, mu: number): number {
  const n = arr.length;
  let sum = 0;
  for (let i = 0; i + k < n; i++) {
    sum += (arr[i] - mu) * (arr[i + k] - mu);
  }
  return sum / (n - k);
}
function autocorrelation(arr: number[], k: number, mu: number, c0: number): number {
  return c0 > 0 ? autocovariance(arr, k, mu) / c0 : 0;
}
export function autocorrTime(arr: number[]): number {
  const n = arr.length;
  if (n < 2) return 1;
  const mu = mean(arr);
  const c0 = autocovariance(arr, 0, mu);
  if (c0 <= 0) return 1;
  let tau = 1;
  for (let k = 1; k < n; k++) {
    const rho = autocorrelation(arr, k, mu, c0);
    if (rho <= 0) break;
    tau += 2 * rho;
  }
  return tau;
}
export function ess(arr: number[]): number {
  const tau = autocorrTime(arr);
  return tau > 0 ? arr.length / tau : arr.length;
}
