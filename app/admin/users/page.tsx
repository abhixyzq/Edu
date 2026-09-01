'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';

interface Profile {
  id: string;
  name: string;
  email: string;
  target_board: string;
  streak_days: number;
  xp_points: number;
  is_admin: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setProfiles((data as Profile[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleAdmin(profile: Profile) {
    setTogglingId(profile.id);
    await supabase.from('profiles').update({ is_admin: !profile.is_admin }).eq('id', profile.id);
    await load();
    setTogglingId(null);
  }

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' });

  const columns = [
    {
      key: 'name', label: 'User',
      render: (r: Profile) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ffdbc9] text-[#6a2d00] font-bold text-sm flex items-center justify-center shrink-0">
            {r.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-bold text-[#161d1f] text-xs">{r.name}</p>
            <p className="text-[10px] text-[#897266]">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'target_board', label: 'Board', render: (r: Profile) => <span className="text-xs font-semibold uppercase text-[#0060ac]">{r.target_board}</span> },
    { key: 'streak_days', label: 'Streak', render: (r: Profile) => <span className="text-xs font-bold">🔥 {r.streak_days}d</span> },
    { key: 'xp_points', label: 'XP', render: (r: Profile) => <span className="text-xs font-bold text-purple-600">{r.xp_points} XP</span> },
    { key: 'created_at', label: 'Joined', render: (r: Profile) => <span className="text-xs text-[#564338]">{fmtDate(r.created_at)}</span> },
    {
      key: 'is_admin', label: 'Role',
      render: (r: Profile) => (
        <button
          onClick={() => toggleAdmin(r)}
          disabled={togglingId === r.id}
          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer disabled:opacity-60 ${
            r.is_admin
              ? 'bg-[#ff8c42] text-white border-[#9b4500] hover:bg-[#9b4500]'
              : 'bg-white text-[#564338] border-[#dde4e6] hover:border-[#ff8c42] hover:text-[#9b4500]'
          }`}
        >
          {togglingId === r.id ? '…' : r.is_admin ? 'Admin' : 'Student'}
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">Users</h1>
          <p className="text-sm text-[#564338] mt-0.5">{filtered.length} of {profiles.length} users</p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#897266]">search</span>
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#dde4e6] text-sm bg-white placeholder:text-[#897266] focus:outline-none focus:ring-2 focus:ring-[#ff8c42]/40 focus:border-[#ff8c42] transition-all"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Admin count callout */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total', value: profiles.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Admins', value: profiles.filter((p) => p.is_admin).length, color: 'bg-orange-50 text-[#9b4500]' },
          { label: 'Students', value: profiles.filter((p) => !p.is_admin).length, color: 'bg-green-50 text-green-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl px-4 py-2 text-xs font-bold`}>
            {s.label}: {s.value}
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        loading={loading}
        emptyMessage="No users found."
      />

      <p className="text-[11px] text-[#897266]">
        💡 Click a user's role badge to toggle admin access. The change takes effect on their next login.
      </p>
    </div>
  );
}
