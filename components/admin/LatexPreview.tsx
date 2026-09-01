'use client';

import React from 'react';

interface LatexPreviewProps {
  content: string;
  label?: string;
}

export function LatexPreview({ content, label = 'Formula & Text Preview' }: LatexPreviewProps) {
  if (!content.trim()) return null;

  return (
    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
          Live Render
        </span>
      </div>
      <div className="text-xs sm:text-sm font-semibold text-slate-800 break-words leading-relaxed">
        {content}
      </div>
    </div>
  );
}
