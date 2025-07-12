export type ColumnMajor = Record<string, number[]>;

export function parseBioTSV(text: string): { data: ColumnMajor; names: string[] } {
  const lines = text.split(/\r?\n/);
  let start = 0;
  while (start < lines.length && lines[start].startsWith('#')) {
    start++;
  }
  const rows = lines
    .slice(start)
    .filter(l => l.trim() !== '')
    .map(l => l.split('\t'));

  if (rows.length === 0) {
    return { data: {}, names: [] };
  }

  const headers = rows[0];
  const cols: ColumnMajor = {};
  headers.forEach(h => {
    cols[h] = [];
  });

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      const val = parseFloat(row[j]);
      cols[key].push(isNaN(val) ? NaN : val);
    }
  }
  const names = headers.slice(1);

  return { data: cols, names };
}
