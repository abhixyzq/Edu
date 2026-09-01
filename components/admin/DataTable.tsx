'use client';

import React, { useState, useMemo } from 'react';

export interface Column<T> {
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
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  emptyMessage = 'No records found.',
  loading = false,
  searchable = false,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim() || searchKeys.length === 0) {
      return data;
    }
    const q = searchTerm.toLowerCase();
    return data.filter((item) => {
      return searchKeys.some((k) => {
        const val = item[k];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
      });
    });
  }, [data, searchable, searchTerm, searchKeys]);

  return (
    <div className="space-y-3 w-full">
      {/* Optional Search Bar */}
      {searchable && (
        <div className="relative max-w-sm w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border-2 border-[#e2e8f0] text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#7c3aed] outline-none shadow-2xs transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-3xl border-2 border-[#e2e8f0] bg-white shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#f8fafc] border-b-2 border-[#e2e8f0]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3.5 text-left text-[11px] font-black text-[#64748b] uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-14">
                  <div className="inline-flex flex-col items-center gap-2 text-slate-500">
                    <div className="w-8 h-8 border-3 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-14 text-slate-400 font-bold">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="material-symbols-outlined text-[36px] text-slate-300">search_off</span>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={String(row[keyField])}
                  className="hover:bg-violet-50/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-[#1e293b] font-medium ${col.className ?? ''}`}
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
    </div>
  );
}
