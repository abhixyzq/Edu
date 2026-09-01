'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';
import { UserActionModal } from '@/components/admin/UserActionModal';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar_url?: string;
  target_board: string;
  class_level?: string;
  streak_days: number;
  xp_points: number;
  gems?: number;
  hearts?: number;
  league_tier?: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles((data as Profile[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAdmin(p: Profile) {
    if (!confirm(`Toggle admin role for "${p.name}"?`)) return;
    setTogglingId(p.id);
    const next = !p.is_admin;
    const { error } = await supabase.from('profiles').update({ is_admin: next }).eq('id', p.id);
    if (!error) {
      playGemDing();
      setProfiles((prev) => prev.map((u) => (u.id === p.id ? { ...u, is_admin: next } : u)));
    }
    setTogglingId(null);
  }

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Student / Scholar',
      render: (r: Profile) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            {r.avatar_url ? (
              <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover" />
            ) : (
              (r.name?.charAt(0) || 'S').toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-black text-[#1e293b] text-xs sm:text-sm truncate">{r.name}</p>
              {r.is_admin && (
                <span className="text-[9px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
              <span className="font-bold text-[#7c3aed]">@{r.username || 'scholar'}</span>
              <span>•</span>
              <span className="truncate">{r.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'class_level',
      label: 'Academic Track',
      render: (r: Profile) => (
        <div>
          <span className="text-xs font-black text-[#1e293b] block">{r.class_level || 'Class 12'}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{r.target_board || 'CBSE'}</span>
        </div>
      ),
    },
    {
      key: 'xp_points',
      label: 'XP & Gems',
      render: (r: Profile) => (
        <div className="text-xs space-y-0.5">
          <p className="font-black text-amber-600">⚡ {r.xp_points || 0} XP</p>
          <p className="text-[10px] font-bold text-cyan-700">💎 {r.gems ?? 100} Gems</p>
        </div>
      ),
    },
    {
      key: 'league_tier',
      label: 'League',
      render: (r: Profile) => (
        <span className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-[#6d28d9] text-[10px] font-black uppercase tracking-wider">
          {r.league_tier || 'Starter League'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Scholar Actions',
      render: (r: Profile) => (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              playButtonClick();
              setSelectedUser(r);
              setModalOpen(true);
            }}
            className="text-[11px] font-black text-white bg-[#7c3aed] hover:bg-[#6d28d9] px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Manage Perks</span>
          </button>

          <button
            onClick={() => toggleAdmin(r)}
            disabled={togglingId === r.id}
            className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              r.is_admin
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {togglingId === r.id ? '…' : r.is_admin ? 'Demote' : 'Make Admin'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-6xl w-full mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-black text-[#1e293b]">
              Registered Scholars & Users
            </h1>
            <span className="text-xs font-black text-[#7c3aed] bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
              {profiles.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student study wallets, hearts, leagues, and administrator privileges.
          </p>
        </div>
      </div>

      {/* User Table */}
      <DataTable
        columns={columns}
        data={profiles}
        keyField="id"
        loading={loading}
        emptyMessage="No scholars found matching your search."
        searchable
        searchPlaceholder="Search by name, @username, email, or class..."
        searchKeys={['name', 'email', 'username', 'class_level', 'target_board']}
      />

      {/* User Perks & Actions Dialog */}
      <UserActionModal
        user={selectedUser}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          load();
        }}
      />

    </div>
  );
}
