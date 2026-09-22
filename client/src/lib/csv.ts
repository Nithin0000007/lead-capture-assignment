export interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

export function parseCsv(input: string): ParsedCsv {
  const records: string[][] = [];
  let record: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      record.push(field.trim());
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      record.push(field.trim());
      field = '';
      if (record.some((value) => value !== '')) {
        records.push(record);
      }
      record = [];
      continue;
    }

    field += char;
  }

  record.push(field.trim());
  if (record.some((value) => value !== '')) {
    records.push(record);
  }

  const [headers = [], ...rows] = records;

  return {
    headers,
    rows: rows.map((row) => headers.map((_, index) => row[index] ?? '')),
  };
}
