export type ColumnMajor = Record<string, Float64Array>;

export function parseBioTSV(text: string): { data: ColumnMajor; names: string[] } {
    const lines = text.split(/\r?\n/);
    let start = 0;
    while (start < lines.length && lines[start].startsWith('#')) {
        start++;
    }
    const dataLines = lines.slice(start).filter((line) => line.trim() !== '');

    if (dataLines.length === 0) {
        return { data: {}, names: [] };
    }
    const headers = dataLines[0].split('\t');
    const nCols = headers.length;
    const nRows = dataLines.length - 1;

    const data: ColumnMajor = {};
    for (const h of headers) {
        data[h] = new Float64Array(nRows);
    }

    for (let i = 1; i < dataLines.length; i++) {
        const row = dataLines[i].split('\t');
        for (let j = 0; j < nCols; j++) {
            const key = headers[j];
            const v = parseFloat(row[j]);
            data[key][i - 1] = isNaN(v) ? NaN : v;
        }
    }
    const names = headers.slice(1);

    return { data, names };
}
