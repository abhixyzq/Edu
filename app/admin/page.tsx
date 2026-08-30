'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/admin/StatCard';

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
  profiles: { name: string; email: string } | null;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats>({ totalUsers: 0, totalTests: 0, totalQuestions: 0, totalAttempts: 0 });
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
            .select('id, test_title, score, total_marks, accuracy_percent, attempted_at, profiles(name, email)')
            .order('attempted_at', { ascending: false })
            .limit(8),
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
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-[#161d1f]">Overview</h1>
          <p className="text-sm text-[#564338] mt-0.5">Platform snapshot at a glance</p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Link href="/admin/subjects">
            <button className="flex items-center gap-2 bg-white border border-[#dde4e6] hover:border-[#ff8c42] px-4 py-2 rounded-full text-sm font-bold text-[#161d1f] transition-colors cursor-pointer shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-[#ff8c42]">add_circle</span>
              Add Subject
            </button>
          </Link>
          <Link href="/admin/tests">
            <button className="flex items-center gap-2 bg-[#9b4500] hover:bg-[#ff8c42] text-white px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-md">
              <span className="material-symbols-outlined text-[18px]">quiz</span>
              Add Test
            </button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="group" label="Registered Users" value={loading ? '—' : fmt(stats.totalUsers)} iconBg="bg-blue-100" />
        <StatCard icon="quiz" label="Total Tests" value={loading ? '—' : fmt(stats.totalTests)} iconBg="bg-[#ff8c42]/15" />
        <StatCard icon="help" label="Questions in DB" value={loading ? '—' : fmt(stats.totalQuestions)} iconBg="bg-purple-100" />
        <StatCard icon="bar_chart" label="Test Attempts" value={loading ? '—' : fmt(stats.totalAttempts)} iconBg="bg-green-100" />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="font-heading text-lg font-bold text-[#161d1f] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/subjects', icon: 'category', label: 'Manage Subjects', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
            { href: '/admin/tests', icon: 'quiz', label: 'Manage Tests', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
            { href: '/admin/users', icon: 'group', label: 'View Users', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
            { href: '/admin/analytics', icon: 'bar_chart', label: 'Analytics', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer border border-transparent hover:border-current/20`}>
                <span className="material-symbols-outlined text-[28px]">{action.icon}</span>
                <span className="text-xs font-bold">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-[#161d1f]">Recent Test Attempts</h2>
          <Link href="/admin/analytics" className="text-xs font-bold text-[#9b4500] hover:underline">
            View Analytics →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8eff1] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-[#ff8c42] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-center py-12 text-xs text-[#897266]">No test attempts yet.</p>
          ) : (
            <div className="divide-y divide-[#f0f0f0]">
              {recent.map((r) => {
                const pct = Number(r.accuracy_percent);
                return (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f9fbfc] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-[#ffdbc9] text-[#6a2d00] font-bold text-sm flex items-center justify-center shrink-0">
                      {r.profiles?.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#161d1f] truncate">{r.test_title}</p>
                      <p className="text-xs text-[#564338] truncate">{r.profiles?.name ?? 'Unknown'} · {fmtDate(r.attempted_at)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-extrabold font-heading ${
                        pct >= 75 ? 'text-green-700' : pct >= 50 ? 'text-blue-600' : 'text-red-600'
                      }`}>{pct.toFixed(0)}%</span>
                      <p className="text-[10px] text-[#564338]">{r.score}/{r.total_marks}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
