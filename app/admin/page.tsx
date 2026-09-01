'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/admin/StatCard';
import { playButtonClick } from '@/lib/soundEffects';

interface OverviewStats {
  totalUsers: number;
  totalTests: number;
  totalQuestions: number;
  totalAttempts: number;
}

interface RecentAttempt {
  id: string;
  test_title: string;
  score: number;
  total_marks: number;
  accuracy_percent: number;
  attempted_at: string;
  profiles: { name: string; email: string; avatar_url?: string; username?: string } | null;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    totalTests: 0,
    totalQuestions: 0,
    totalAttempts: 0,
  });
  const [recent, setRecent] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, testsRes, questionsRes, attemptsRes, recentRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('tests').select('id', { count: 'exact', head: true }),
          supabase.from('questions').select('id', { count: 'exact', head: true }),
          supabase.from('user_test_results').select('id', { count: 'exact', head: true }),
          supabase
            .from('user_test_results')
            .select('id, test_title, score, total_marks, accuracy_percent, attempted_at, profiles(name, email, avatar_url, username)')
            .order('attempted_at', { ascending: false })
            .limit(10),
        ]);

        setStats({
          totalUsers: usersRes.count ?? 0,
          totalTests: testsRes.count ?? 0,
          totalQuestions: questionsRes.count ?? 0,
          totalAttempts: attemptsRes.count ?? 0,
        });
        setRecent((recentRes.data as unknown as RecentAttempt[]) ?? []);
      } catch (e) {
        console.error('Admin overview load error', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 max-w-6xl w-full mx-auto font-sans">
      
      {/* ─── Top Control Banner ─── */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#4c1d95] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-white/10">
        
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-violet-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Control Center Active</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin Master Deck
          </h1>
          <p className="text-xs sm:text-sm text-violet-200 max-w-md">
            Manage curriculum, tests, questions, and students across all classes in real time.
          </p>
        </div>

        {/* Quick Hub Buttons */}
        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/subjects"
            onClick={playButtonClick}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            <span>+ Subject</span>
          </Link>

          <Link
            href="/admin/tests"
            onClick={playButtonClick}
            className="flex items-center gap-2 bg-[#ff8c42] hover:bg-[#ff7a24] text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>+ Add Test</span>
          </Link>
        </div>

      </div>

      {/* ─── 4 Hero KPI Metric Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon="group"
          label="Registered Scholars"
          value={loading ? '—' : fmt(stats.totalUsers)}
          delta="+14% this mo"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          accentGradient="from-blue-500/15 to-transparent"
        />

        <StatCard
          icon="quiz"
          label="Active Tests"
          value={loading ? '—' : fmt(stats.totalTests)}
          delta="All classes"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          accentGradient="from-amber-500/15 to-transparent"
        />

        <StatCard
          icon="help"
          label="Questions in DB"
          value={loading ? '—' : fmt(stats.totalQuestions)}
          delta="4-option MCQs"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          accentGradient="from-purple-500/15 to-transparent"
        />

        <StatCard
          icon="bolt"
          label="Test Sessions"
          value={loading ? '—' : fmt(stats.totalAttempts)}
          delta="Live attempts"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          accentGradient="from-emerald-500/15 to-transparent"
        />
      </div>

      {/* ─── Quick Actions Grid ─── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-heading text-sm sm:text-base font-black text-[#1e293b]">
            Quick Management Hubs
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Direct shortcuts</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/subjects"
            onClick={playButtonClick}
            className="p-4 rounded-3xl bg-white border-2 border-[#e2e8f0] hover:border-amber-400 hover:shadow-md transition-all group flex flex-col items-start gap-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">category</span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1e293b]">Curriculum</p>
              <span className="text-[10px] text-slate-400 font-bold">Subjects & chapters</span>
            </div>
          </Link>

          <Link
            href="/admin/tests"
            onClick={playButtonClick}
            className="p-4 rounded-3xl bg-white border-2 border-[#e2e8f0] hover:border-blue-400 hover:shadow-md transition-all group flex flex-col items-start gap-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">quiz</span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1e293b]">Question Studio</p>
              <span className="text-[10px] text-slate-400 font-bold">Mock tests & MCQs</span>
            </div>
          </Link>

          <Link
            href="/admin/users"
            onClick={playButtonClick}
            className="p-4 rounded-3xl bg-white border-2 border-[#e2e8f0] hover:border-purple-400 hover:shadow-md transition-all group flex flex-col items-start gap-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1e293b]">Scholars & Gems</p>
              <span className="text-[10px] text-slate-400 font-bold">Manage users & perks</span>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            onClick={playButtonClick}
            className="p-4 rounded-3xl bg-white border-2 border-[#e2e8f0] hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col items-start gap-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">bar_chart</span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1e293b]">Analytics</p>
              <span className="text-[10px] text-slate-400 font-bold">Scores & breakdown</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── Recent Live Test Sessions ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#e2e8f0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-heading text-sm sm:text-base font-black text-[#1e293b]">
              Live Student Attempt Log
            </h3>
          </div>
          <Link
            href="/admin/analytics"
            onClick={playButtonClick}
            className="text-xs font-black text-[#7c3aed] hover:underline"
          >
            Full Reports &rarr;
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-bold text-xs">
            No live test attempts recorded yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recent.map((att) => {
              const acc = Number(att.accuracy_percent || 0);
              return (
                <div
                  key={att.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] hover:bg-violet-50/30 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {att.profiles?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#1e293b] truncate">
                        {att.profiles?.name || 'Scholar'}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {att.test_title} • <span className="font-bold text-slate-700">{att.score}/{att.total_marks} marks</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      acc >= 75
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : acc >= 40
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {acc}% Acc
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      {fmtDate(att.attempted_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
