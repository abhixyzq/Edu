'use client';

import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  iconBg?: string;
  iconColor?: string;
  accentGradient?: string;
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaPositive = true,
  iconBg = 'bg-violet-100',
  iconColor = 'text-[#7c3aed]',
  accentGradient = 'from-violet-500/10 to-transparent',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e2e8f0] hover:border-violet-300 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
      {/* Background Accent Gradient Glow */}
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${accentGradient} rounded-bl-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100`} />

      <div className="relative z-10 flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-2xs border border-black/5`}>
          <span className={`material-symbols-outlined text-[24px] ${iconColor}`}>{icon}</span>
        </div>

        {delta && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${
            deltaPositive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}>
            {deltaPositive ? '↗' : '↘'} {delta}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[#64748b] text-xs font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-heading text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight">{value}</p>
      </div>
    </div>
  );
}
