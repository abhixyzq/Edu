import React from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  emptyMessage = 'No records found.',
  loading = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e8eff1] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f4fafd] border-b border-[#e8eff1]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-xs font-bold text-[#564338] uppercase tracking-wider ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-2 text-[#564338]">
                  <div className="w-6 h-6 border-2 border-[#ff8c42] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium">Loading…</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-xs text-[#897266]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-b border-[#f0f0f0] hover:bg-[#f9fbfc] transition-colors last:border-b-0"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3.5 text-[#161d1f] ${col.className ?? ''}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
