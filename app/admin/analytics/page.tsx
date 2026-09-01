'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/admin/StatCard';
import { playButtonClick } from '@/lib/soundEffects';

interface SubjectStats {
  subject_id: string;
  attempts: number;
  avg_accuracy: number;
}

interface ScoreBucket {
  range: string;
  count: number;
}

interface TopUser {
  user_id: string;
  name: string;
  email: string;
  avg_accuracy: number;
  attempts: number;
}

const SUBJECT_COLORS: Record<string, string> = {
  physics: '#7c3aed',
  chemistry: '#0891b2',
  mathematics: '#ea580c',
  biology: '#059669',
  maths: '#ea580c',
  english: '#4f46e5',
};

function BarChart({ data, maxVal }: { data: { label: string; value: number; color?: string }[]; maxVal: number }) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => {
        const pct = Math.max(Math.round((d.value / maxVal) * 100), 4);
        return (
          <div key={d.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="capitalize">{d.label}</span>
              <span className="text-slate-400 font-bold">{d.value.toLocaleString()} attempts</span>
            </div>
            <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${pct}%`, backgroundColor: d.color ?? '#7c3aed' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [scoreBuckets, setScoreBuckets] = useState<ScoreBucket[]>([]);
  const [leaderboard, setLeaderboard] = useState<TopUser[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState(0);
  const [boardBreakdown, setBoardBreakdown] = useState<{ board: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [resultsRes, profilesRes] = await Promise.all([
          supabase.from('user_test_results').select('user_id, subject_id, accuracy_percent, score, total_marks'),
          supabase.from('profiles').select('id, name, email, target_board'),
        ]);

        const results = resultsRes.data ?? [];
        const profiles = profilesRes.data ?? [];

        // Subject breakdown
        const subjectMap: Record<string, { attempts: number; totalAcc: number }> = {};
        for (const r of results) {
          const sid = (r.subject_id as string) || 'General';
          if (!subjectMap[sid]) subjectMap[sid] = { attempts: 0, totalAcc: 0 };
          subjectMap[sid].attempts++;
          subjectMap[sid].totalAcc += Number(r.accuracy_percent || 0);
        }
        setSubjectStats(
          Object.entries(subjectMap).map(([subject_id, d]) => ({
            subject_id,
            attempts: d.attempts,
            avg_accuracy: Math.round(d.totalAcc / d.attempts),
          }))
        );

        // Score Distribution
        const buckets = [
          { range: '0–39% (Needs Help)', count: 0 },
          { range: '40–69% (Average)', count: 0 },
          { range: '70–89% (Proficient)', count: 0 },
          { range: '90–100% (Mastery)', count: 0 },
        ];
        for (const r of results) {
          const acc = Number(r.accuracy_percent || 0);
          if (acc < 40) buckets[0].count++;
          else if (acc < 70) buckets[1].count++;
          else if (acc < 90) buckets[2].count++;
          else buckets[3].count++;
        }
        setScoreBuckets(buckets);

        // Top Accuracy Users
        const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
        const userMap: Record<string, { totalAcc: number; attempts: number }> = {};
        for (const r of results) {
          const uid = r.user_id as string;
          if (!userMap[uid]) userMap[uid] = { totalAcc: 0, attempts: 0 };
          userMap[uid].totalAcc += Number(r.accuracy_percent || 0);
          userMap[uid].attempts++;
        }
        setLeaderboard(
          Object.entries(userMap)
            .map(([uid, d]) => ({
              user_id: uid,
              name: profileMap[uid]?.name ?? 'Scholar',
              email: profileMap[uid]?.email ?? '',
              avg_accuracy: Math.round(d.totalAcc / d.attempts),
              attempts: d.attempts,
            }))
            .sort((a, b) => b.avg_accuracy - a.avg_accuracy)
            .slice(0, 8)
        );

        // Board breakdown
        const boardMap: Record<string, number> = {};
        for (const p of profiles) {
          const b = (p.target_board as string) || 'cbse';
          boardMap[b] = (boardMap[b] ?? 0) + 1;
        }
        setBoardBreakdown(
          Object.entries(boardMap).map(([board, count]) => ({ board: board.toUpperCase(), count }))
        );

        setTotalAttempts(results.length);
        const overallAcc =
          results.length > 0
            ? Math.round(results.reduce((acc, r) => acc + Number(r.accuracy_percent || 0), 0) / results.length)
            : 0;
        setAvgAccuracy(overallAcc);
      } catch (e) {
        console.error('Analytics load error', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxAttempts = Math.max(...subjectStats.map((s) => s.attempts), 1);
  const maxBucket = Math.max(...scoreBuckets.map((b) => b.count), 1);

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 max-w-6xl w-full mx-auto font-sans">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-xl sm:text-2xl font-black text-[#1e293b]">
            Platform Analytics & Insights
          </h1>
          <span className="text-xs font-black text-[#7c3aed] bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
            Live Telemetry
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive test performance, accuracy percentiles, and board engagement statistics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon="bar_chart"
          label="Total Test Sessions"
          value={loading ? '—' : totalAttempts.toLocaleString()}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="target"
          label="Average Accuracy"
          value={loading ? '—' : `${avgAccuracy}%`}
          delta={avgAccuracy >= 60 ? 'Healthy' : 'Needs attention'}
          deltaPositive={avgAccuracy >= 60}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <StatCard
          icon="school"
          label="Top Performing Subject"
          value={subjectStats[0]?.subject_id?.toUpperCase() || 'Physics'}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />

        <StatCard
          icon="group"
          label="Board Categories"
          value={loading ? '—' : `${boardBreakdown.length} Boards`}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Subject Popularity */}
        <div className="bg-white rounded-3xl border-2 border-[#e2e8f0] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm sm:text-base font-black text-[#1e293b]">
              Subject Test Volume
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Total Attempts</span>
          </div>

          {subjectStats.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold py-6 text-center">No test attempts recorded yet.</p>
          ) : (
            <BarChart
              data={subjectStats.map((s) => ({
                label: s.subject_id,
                value: s.attempts,
                color: SUBJECT_COLORS[s.subject_id] ?? '#7c3aed',
              }))}
              maxVal={maxAttempts}
            />
          )}
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-3xl border-2 border-[#e2e8f0] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm sm:text-base font-black text-[#1e293b]">
              Score Distribution
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Percentile Bands</span>
          </div>

          {scoreBuckets.every((b) => b.count === 0) ? (
            <p className="text-xs text-slate-400 font-bold py-6 text-center">No scores computed yet.</p>
          ) : (
            <BarChart
              data={scoreBuckets.map((b, i) => ({
                label: b.range,
                value: b.count,
                color: ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981'][i],
              }))}
              maxVal={maxBucket}
            />
          )}
        </div>

      </div>

      {/* Top Performing Scholars Table */}
      <div className="bg-white rounded-3xl border-2 border-[#e2e8f0] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm sm:text-base font-black text-[#1e293b]">
            High Accuracy Leaderboard
          </h3>
          <span className="text-[10px] font-bold text-slate-400">Top 8 Scholars</span>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold py-6 text-center">No scholar attempts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Scholar</th>
                  <th className="py-2.5 px-3">Tests Taken</th>
                  <th className="py-2.5 px-3 text-right">Avg. Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((u, i) => (
                  <tr key={u.user_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-black text-slate-700">#{i + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-black text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700">{u.attempts} tests</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs">
                        {u.avg_accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
