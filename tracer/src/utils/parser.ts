export type ColumnMajor = Record<string, number[]>;

export function parseBioTSV(text: string): { data: ColumnMajor; names: string[] } {
  const lines = text
    .split(/\r?\n/)
    .filter(l => !l.startsWith('#') && l.trim());

  const rows = lines.map(l => l.split(/\s+/));
  const headers = rows[0];              
  const cols: ColumnMajor = {};
  headers.forEach(h => (cols[h] = []));

  for (let i = 1; i < rows.length; i++) {
    rows[i].forEach((v, j) => {
      const k = headers[j];
      cols[k].push(+v);
    });
  }

  const names = headers.slice(1);

  return { data: cols, names };
}
