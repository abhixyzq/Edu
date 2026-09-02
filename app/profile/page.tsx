'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useUser, sanitizeUsername } from '@/context/UserContext';
import { BOARDS } from '@/lib/mockData';
import { Mascot } from '@/components/gamification/Mascot';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';
import { GemIcon, HeartLifeIcon, StreakFlameIcon, XpBoltIcon } from '@/components/icons/AppIcons';

const SCHOLAR_AVATARS = [
  { id: 'av-1', src: '/emoji/file_0000000007148211a1eafe7e0e8b1aa2.png', name: '3D Scholar 1' },
  { id: 'av-2', src: '/emoji/file_0000000046d082119e0e9eef22bb129f.png', name: '3D Scholar 2' },
  { id: 'av-3', src: '/emoji/file_000000004fb88211bf8e0f9ffbed8f55.png', name: '3D Scholar 3' },
  { id: 'av-4', src: '/emoji/file_00000000de50821193433d73f25e29cf.png', name: '3D Scholar 4' },
  { id: 'av-5', src: '/emoji/file_00000000e11082119a9e3d2feef9e762.png', name: '3D Scholar 5' },
  { id: 'av-6', src: '/emoji/file_00000000e218821199cdb2575db7c3f8.png', name: '3D Scholar 6' },
  { id: 'av-7', src: '/emoji/file_00000000ef8c82119a5f33c7714208ec.png', name: '3D Scholar 7' },
];

export default function ProfilePage() {
  const { user, setTargetBoard, setClassLevel, updateAvatar, updateUsername, logout } = useUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedCount = Object.keys(user.completedNodes).length;

  // Handle client-side compressed image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Compress and resize using canvas to avoid exceeding local storage quota
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updateAvatar(compressedDataUrl);
          playGemDing();
        }
        setIsUploading(false);
        setIsAvatarModalOpen(false);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleSelectPreMadeAvatar = (src: string) => {
    updateAvatar(src);
    playGemDing();
    setIsAvatarModalOpen(false);
  };

  const handleRemovePhoto = () => {
    updateAvatar('');
    playButtonClick();
    setIsAvatarModalOpen(false);
  };

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setIsSavingUsername(true);
    playButtonClick();

    const clean = sanitizeUsername(usernameInput);
    if (!clean || clean.length < 3) {
      setIsSavingUsername(false);
      return setUsernameError('Username must be 3-20 characters with letters, numbers, or underscore.');
    }

    const res = await updateUsername(clean);
    setIsSavingUsername(false);

    if (res.success) {
      playGemDing();
      setIsUsernameModalOpen(false);
    } else {
      setUsernameError(res.error || 'Failed to update username.');
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-28 font-sans">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
      />

      {/* ─── Profile Header Hero ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-6 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#e2e8f0] shadow-sm flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              
              {/* Profile Avatar */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    playButtonClick();
                    setIsAvatarModalOpen(true);
                  }}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md overflow-hidden relative border-2 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Change Profile Photo"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </button>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="bg-[#ede9fe] text-[#6d28d9] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-[#c4b5fd]">
                    Level {user.level}
                  </span>
                  <span className="bg-[#e0f2fe] text-[#0369a1] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-[#bae6fd]">
                    {user.leagueTier} League
                  </span>
                </div>
                
                <h1 className="font-heading text-lg sm:text-xl font-black text-[#1e293b] leading-tight">
                  {user.name}
                </h1>

                {/* Unique Instagram-Style @username Handle */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      playButtonClick();
                      setUsernameInput(user.username || 'scholar_12');
                      setUsernameError('');
                      setIsUsernameModalOpen(true);
                    }}
                    className="text-xs font-black text-[#7c3aed] bg-[#ede9fe]/90 hover:bg-[#ddd6fe] px-2.5 py-0.5 rounded-full border border-[#c4b5fd] flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                    title="Change your unique @handle"
                  >
                    <span>@{user.username || 'scholar_12'}</span>
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#64748b] mt-1">
                  {user.email || 'student@nainixone.prep'}
                </p>
              </div>
            </div>

            <div className="hidden xs:block shrink-0">
              <Mascot mood="happy" size={70} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-6">

        {/* ─── Official App Download Banner Card ─── */}
        <div className="bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#9333ea] text-white rounded-3xl p-5 shadow-md border-b-6 border-[#5521b5] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                OFFICIAL ANDROID APP
              </span>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                v1.0.3 Latest
              </span>
            </div>

            <h3 className="font-heading text-lg font-black leading-tight text-white">
              Install nainixOne on Android
            </h3>
            <p className="text-xs text-[#ede9fe] mt-1 leading-relaxed">
              Experience ultra-smooth practice sessions, offline tests, and fast gamified sound effects on your phone.
            </p>

            {/* Direct Download Button */}
            <a
              href="/nainixOne_Class12_Latest.apk"
              download="nainixOne_Class12_Latest.apk"
              onClick={playButtonClick}
              className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-violet-50 text-[#6d28d9] font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#6d28d9]">android</span>
              <span>Download Latest APK (Direct Install)</span>
            </a>
          </div>

          {/* Decorative background shape */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* ─── Gamified Stats Grid ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Streak */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
            <StreakFlameIcon size={30} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="font-heading text-xl font-black text-[#1e293b]">{user.streakDays}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Day Streak</span>
          </div>

          {/* Total XP */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
            <XpBoltIcon size={30} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="font-heading text-xl font-black text-[#1e293b]">{user.xp}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Total XP</span>
          </div>

          {/* Gems */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center group hover:border-cyan-300 transition-colors">
            <GemIcon size={30} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="font-heading text-xl font-black text-[#1e293b]">{user.gems}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Gems</span>
          </div>

          {/* Completed Nodes */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center group hover:border-emerald-300 transition-colors">
            <span className="material-symbols-outlined text-[30px] text-emerald-500 mb-1 group-hover:scale-110 transition-transform">verified</span>
            <span className="font-heading text-xl font-black text-[#1e293b]">{completedCount}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Mastered</span>
          </div>
        </div>

        {/* ─── Inventory & Power-ups ─── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-black text-[#1e293b]">
              Inventory & Items
            </h2>
            <Link
              href="/shop"
              onClick={playButtonClick}
              className="text-xs font-black text-[#7c3aed] hover:underline"
            >
              Shop Items
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-2.5">
              <span className="text-xl">🧊</span>
              <div>
                <p className="text-xs font-black text-[#1e293b]">Streak Freeze</p>
                <span className="text-[10px] text-[#64748b] font-bold">{user.inventory.streakFreeze} Equipped</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-2.5">
              <span className="text-xl">❤️</span>
              <div>
                <p className="text-xs font-black text-[#1e293b]">Hearts</p>
                <span className="text-[10px] text-[#64748b] font-bold">{user.hearts}/5 Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Class & Grade Level Selector ─── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-black text-[#1e293b]">
              Class & Academic Level
            </h2>
            <span className="text-[10px] font-black text-[#7c3aed] bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
              {user.classLevel || 'Class 12'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['Class 12', 'Class 11', 'Class 10', 'Class 9', 'JEE Main/Adv', 'NEET UG'].map((cls) => {
              const isSelected = (user.classLevel || 'Class 12') === cls;
              return (
                <button
                  key={cls}
                  onClick={() => {
                    playButtonClick();
                    setClassLevel(cls);
                    playGemDing();
                  }}
                  className={`p-2 rounded-2xl text-xs font-black border-b-3 active:border-b-0 active:translate-y-0.5 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#7c3aed] text-white border-[#5b21b6] shadow-xs'
                      : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] hover:bg-slate-100'
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Target Examination Board ─── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-xs">
          <h2 className="font-heading text-sm font-black text-[#1e293b] mb-3">
            Target Examination Board
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {BOARDS.map((board) => {
              const isSelected = user.targetBoard === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => {
                    playButtonClick();
                    setTargetBoard(board.id);
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-black border-b-3 active:border-b-0 active:translate-y-0.5 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#7c3aed] text-white border-[#5b21b6] shadow-xs'
                      : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-slate-50'
                  }`}
                >
                  {board.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Admin Panel Card (Visible to Admins) ─── */}
        {user.isAdmin && (
          <div className="bg-gradient-to-r from-[#1a1f21] to-[#2d3748] text-white rounded-3xl p-5 shadow-md border-b-4 border-[#ff8c42] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ff8c42] text-white flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </div>
              <div>
                <h3 className="font-heading text-sm font-black text-white">Administrator Portal</h3>
                <p className="text-[11px] text-[#cbd5e1]">Manage subjects, tests, questions & users</p>
              </div>
            </div>
            <Link
              href="/admin"
              onClick={playButtonClick}
              className="px-4 py-2 rounded-xl bg-[#ff8c42] hover:bg-[#ff7a24] text-white font-black text-xs transition-all shadow-xs"
            >
              Open Panel
            </Link>
          </div>
        )}

        {/* ─── About nainixOne & App Info Card ─── */}
        <Link
          href="/about"
          onClick={playButtonClick}
          className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex items-center justify-between group hover:border-violet-300 transition-all active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 text-[#7c3aed] flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">info</span>
            </div>
            <div>
              <h3 className="font-heading text-sm font-black text-slate-900">About nainixOne</h3>
              <p className="text-[11px] text-slate-500">App info, features & direct APK download</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-[#7c3aed] transition-colors">
            chevron_right
          </span>
        </Link>

        {/* ─── Sign Out ─── */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              playButtonClick();
              logout();
            }}
            className="w-full py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-600 font-black text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out of nainixOne
          </button>
        </div>

      </div>

      {/* ─── 1. Edit @Username Handle Modal ─── */}
      {isUsernameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-violet-100 text-[#7c3aed] flex items-center justify-center font-black text-sm">
                  @
                </span>
                <h3 className="font-heading font-black text-base text-slate-900">
                  Edit Unique ID
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUsernameModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUsername} className="my-4 space-y-3.5">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  Choose your Instagram-style Handle
                </label>
                <div className="relative border-2 border-slate-200 rounded-2xl bg-slate-50 flex items-center overflow-hidden focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/15 transition-all">
                  <div className="pl-3.5 pr-1 font-black text-violet-600 text-sm">
                    @
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                      setUsernameError('');
                    }}
                    placeholder="your_handle"
                    maxLength={20}
                    className="w-full bg-transparent py-2.5 px-1 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">
                  3-20 characters: letters, numbers, and underscores only.
                </p>
              </div>

              {usernameError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-2.5 rounded-xl flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{usernameError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingUsername}
                className="w-full py-3 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 text-white font-black text-xs shadow-md shadow-violet-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isSavingUsername ? 'Saving...' : 'Save Unique Handle'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ─── 2. Photo Upload & Avatar Picker Modal ─── */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-black text-base text-slate-900">
                Change Profile Photo
              </h3>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex flex-col items-center my-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white font-black text-3xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-violet-200 mb-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-500">
                {user.name}
              </p>
              <span className="text-[11px] font-black text-violet-600 mt-0.5">
                @{user.username || 'scholar_12'}
              </span>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                playButtonClick();
                fileInputRef.current?.click();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-violet-200 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              <span>{isUploading ? 'Compressing & Uploading...' : 'Upload Photo from Device'}</span>
            </button>

            {/* Pre-made Avatars */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-black uppercase text-slate-400 block mb-2.5 text-center">
                Or Choose a 3D Avatar
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {SCHOLAR_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleSelectPreMadeAvatar(av.src)}
                    className="aspect-square rounded-2xl bg-slate-50 hover:bg-violet-50 border-2 border-slate-200 hover:border-violet-400 p-1.5 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs overflow-hidden"
                    title={av.name}
                  >
                    <img
                      src={av.src}
                      alt={av.name}
                      className="w-full h-full object-contain drop-shadow-xs"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Remove Photo Action */}
            {user.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="w-full py-2.5 mt-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Remove Photo & Reset
              </button>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
