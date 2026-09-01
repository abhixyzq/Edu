'use client';

import React, { useState } from 'react';
import { Modal, FormField, inputCls, selectCls, PrimaryBtn } from './Modal';
import { supabase } from '@/lib/supabase';
import { playGemDing, playButtonClick } from '@/lib/soundEffects';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  is_admin: boolean;
  gems?: number;
  hearts?: number;
  xp_points?: number;
  streak_days?: number;
  league_tier?: string;
  target_board?: string;
  class_level?: string;
}

interface UserActionModalProps {
  user: UserProfile | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserActionModal({ user, open, onClose, onSuccess }: UserActionModalProps) {
  const [gemsToAdd, setGemsToAdd] = useState(50);
  const [xpToAdd, setXpToAdd] = useState(100);
  const [selectedLeague, setSelectedLeague] = useState(user?.league_tier || 'Starter League');
  const [classLevel, setClassLevel] = useState(user?.class_level || 'Class 12');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  if (!user) return null;

  const handleRefillHearts = async () => {
    setSaving(true);
    try {
      await supabase.from('profiles').update({ hearts: 5 }).eq('id', user.id);
      playGemDing();
      setToast('Hearts successfully refilled to 5/5!');
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGems = async () => {
    setSaving(true);
    try {
      const currentGems = user.gems ?? 100;
      await supabase.from('profiles').update({ gems: currentGems + gemsToAdd }).eq('id', user.id);
      playGemDing();
      setToast(`+${gemsToAdd} Gems awarded to ${user.name}!`);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddXp = async () => {
    setSaving(true);
    try {
      const currentXp = user.xp_points ?? 0;
      await supabase.from('profiles').update({ xp_points: currentXp + xpToAdd }).eq('id', user.id);
      playGemDing();
      setToast(`+${xpToAdd} XP awarded to ${user.name}!`);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMeta = async () => {
    setSaving(true);
    try {
      await supabase.from('profiles').update({
        league_tier: selectedLeague,
        class_level: classLevel,
      }).eq('id', user.id);
      playGemDing();
      setToast('Scholar details updated!');
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Manage Scholar: ${user.name}`}
      subtitle={`@${user.username || 'scholar'} • ${user.email}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {toast && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>✅ {toast}</span>
            <button onClick={() => setToast('')} className="text-emerald-500 font-bold text-xs">✕</button>
          </div>
        )}

        {/* User Snapshot Badges */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase">Gems</span>
            <p className="text-sm font-black text-cyan-700">💎 {user.gems ?? 100}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase">Hearts</span>
            <p className="text-sm font-black text-rose-600">❤️ {user.hearts ?? 5}/5</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase">Total XP</span>
            <p className="text-sm font-black text-amber-600">⚡ {user.xp_points ?? 0}</p>
          </div>
        </div>

        {/* Quick Refill Hearts */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-rose-900">Refill Hearts to 5/5</h4>
            <p className="text-[10px] text-rose-600">Instantly grant full test lives</p>
          </div>
          <button
            type="button"
            onClick={handleRefillHearts}
            disabled={saving}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-50"
          >
            Refill ❤️
          </button>
        </div>

        {/* Award Gems Form */}
        <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-cyan-900">Award Free Gems 💎</h4>
            <span className="text-[10px] font-bold text-cyan-600">Study wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={gemsToAdd}
              onChange={(e) => setGemsToAdd(Number(e.target.value))}
              min={5}
              step={10}
              className="w-24 bg-white border border-cyan-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
            />
            <button
              type="button"
              onClick={handleAddGems}
              disabled={saving}
              className="flex-1 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-50"
            >
              + Grant Gems
            </button>
          </div>
        </div>

        {/* Award XP Form */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-900">Award Bonus XP ⚡</h4>
            <span className="text-[10px] font-bold text-amber-600">Leaderboard boost</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={xpToAdd}
              onChange={(e) => setXpToAdd(Number(e.target.value))}
              min={10}
              step={50}
              className="w-24 bg-white border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
            />
            <button
              type="button"
              onClick={handleAddXp}
              disabled={saving}
              className="flex-1 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-50"
            >
              + Grant XP
            </button>
          </div>
        </div>

        {/* League & Class Selection */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2">
            <FormField label="League Tier">
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className={selectCls}
              >
                <option value="Starter League">🌱 Starter League</option>
                <option value="Scholar League">🪵 Scholar League</option>
                <option value="Achiever League">🔷 Achiever League</option>
                <option value="Elite League">🥇 Elite League</option>
                <option value="Master League">💎 Master League</option>
                <option value="Champion League">👑 Champion League</option>
                <option value="Legend League">⚡ Legend League</option>
                <option value="Nainix League">🌟 Nainix League</option>
              </select>
            </FormField>

            <FormField label="Class Level">
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className={selectCls}
              >
                <option value="Class 12">Class 12</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="JEE Main/Adv">JEE Main/Adv</option>
                <option value="NEET UG">NEET UG</option>
              </select>
            </FormField>
          </div>

          <PrimaryBtn onClick={handleUpdateMeta} loading={saving}>
            Save Scholar Settings
          </PrimaryBtn>
        </div>

      </div>
    </Modal>
  );
}
