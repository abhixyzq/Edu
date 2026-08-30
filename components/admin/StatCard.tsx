import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  iconBg?: string;
}

export function StatCard({ icon, label, value, delta, deltaPositive = true, iconBg = 'bg-[#ff8c42]/20' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e8eff1] hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-[22px] text-[#ff8c42]">{icon}</span>
        </div>
        {delta && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            deltaPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {deltaPositive ? '▲' : '▼'} {delta}
          </span>
        )}
      </div>
      <p className="text-[#564338] text-xs font-semibold mb-1">{label}</p>
      <p className="font-heading text-2xl font-extrabold text-[#161d1f]">{value}</p>
    </div>
  );
}
