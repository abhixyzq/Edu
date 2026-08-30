'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/admin/StatCard';

interface SubjectStat { subject_id: string; attempts: number; avg_accuracy: number }
interface ScoreBucket { label: string; count: number; color: string }
interface LeaderboardEntry { user_id: string; name: string; email: string; avg_accuracy: number; attempts: number }
interface BoardBreakdown { target_board: string; count: number }

function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-20 text-xs font-semibold text-[#564338] capitalize shrink-0">{d.label}</span>
          <div className="flex-1 h-6 bg-[#f0f0f0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: maxVal > 0 ? `${(d.value / maxVal) * 100}%` : '0%', backgroundColor: d.color }}
            />
          </div>
          <span className="text-xs font-bold text-[#161d1f] w-8 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

const SUBJECT_COLORS: Record<string, string> = {
  physics: '#0060ac', chemistry: '#6dbf00', maths: '#9b4500', biology: '#3a6a00', english: '#9c27b0',
};

const BOARD_COLORS = ['#ff8c42', '#0060ac', '#6dbf00', '#9b4500', '#9c27b0'];

export default function AdminAnalyticsPage() {
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [scoreBuckets, setScoreBuckets] = useState<ScoreBucket[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [boardBreakdown, setBoardBreakdown] = useState<BoardBreakdown[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all raw data in parallel
        const [resultsRes, profilesRes] = await Promise.all([
          supabase.from('user_test_results').select('user_id, subject_id, accuracy_percent, score, total_marks'),
          supabase.from('profiles').select('id, name, email, target_board'),
        ]);

        const results = resultsRes.data ?? [];
        const profiles = profilesRes.data ?? [];

        // -- Subject breakdown --
        const subjectMap: Record<string, { attempts: number; totalAcc: number }> = {};
        for (const r of results) {
          const sid = r.subject_id as string;
          if (!subjectMap[sid]) subjectMap[sid] = { attempts: 0, totalAcc: 0 };
          subjectMap[sid].attempts++;
          subjectMap[sid].totalAcc += Number(r.accuracy_percent);
        }
        setSubjectStats(
          Object.entries(subjectMap).map(([subject_id, d]) => ({
            subject_id,
            attempts: d.attempts,
            avg_accuracy: Math.round(d.totalAcc / d.attempts),
          })).sort((a, b) => b.attempts - a.attempts)
        );

        // -- Score distribution --
        const buckets = [
          { range: [0, 25], label: '0–25%', color: '#ba1a1a' },
          { range: [25, 50], label: '25–50%', color: '#ff8c42' },
          { range: [50, 75], label: '50–75%', color: '#0060ac' },
          { range: [75, 100], label: '75–100%', color: '#3a6a00' },
        ];
        setScoreBuckets(
          buckets.map((b) => ({
            label: b.label,
            color: b.color,
            count: results.filter((r) => {
              const p = Number(r.accuracy_percent);
              return p >= b.range[0] && p < b.range[1];
            }).length,
          }))
        );

        // -- Total & avg --
        setTotalAttempts(results.length);
        if (results.length > 0) {
          setAvgAccuracy(Math.round(results.reduce((s, r) => s + Number(r.accuracy_percent), 0) / results.length));
        }

        // -- Leaderboard: per user avg accuracy --
        const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
        const userMap: Record<string, { totalAcc: number; attempts: number }> = {};
        for (const r of results) {
          const uid = r.user_id as string;
          if (!userMap[uid]) userMap[uid] = { totalAcc: 0, attempts: 0 };
          userMap[uid].totalAcc += Number(r.accuracy_percent);
          userMap[uid].attempts++;
        }
        setLeaderboard(
          Object.entries(userMap)
            .map(([uid, d]) => ({
              user_id: uid,
              name: profileMap[uid]?.name ?? 'Unknown',
              email: profileMap[uid]?.email ?? '',
              avg_accuracy: Math.round(d.totalAcc / d.attempts),
              attempts: d.attempts,
            }))
            .sort((a, b) => b.avg_accuracy - a.avg_accuracy)
            .slice(0, 10)
        );

        // -- Board breakdown --
        const boardMap: Record<string, number> = {};
        for (const p of profiles) {
          const b = p.target_board as string;
          boardMap[b] = (boardMap[b] ?? 0) + 1;
        }
        setBoardBreakdown(Object.entries(boardMap).map(([target_board, count]) => ({ target_board, count })).sort((a, b) => b.count - a.count));
      } catch (e) {
        console.error('Analytics load error', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxAttempts = Math.max(...subjectStats.map((s) => s.attempts), 1);
  const maxBoardCount = Math.max(...boardBreakdown.map((b) => b.count), 1);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl w-full">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">Analytics</h1>
        <p className="text-sm text-[#564338] mt-0.5">Platform-wide performance insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="bar_chart" label="Total Attempts" value={loading ? '—' : totalAttempts.toLocaleString()} iconBg="bg-blue-100" />
        <StatCard icon="target" label="Avg. Accuracy" value={loading ? '—' : `${avgAccuracy}%`} iconBg="bg-green-100" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#ff8c42] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Popularity */}
          <div className="bg-white rounded-2xl border border-[#e8eff1] p-5">
            <h2 className="font-heading text-base font-bold text-[#161d1f] mb-4">Subject Popularity</h2>
            {subjectStats.length === 0 ? (
              <p className="text-xs text-[#897266]">No attempts yet.</p>
            ) : (
              <BarChart
                data={subjectStats.map((s) => ({ label: s.subject_id, value: s.attempts, color: SUBJECT_COLORS[s.subject_id] ?? '#ff8c42' }))}
                maxVal={maxAttempts}
              />
            )}
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-2xl border border-[#e8eff1] p-5">
            <h2 className="font-heading text-base font-bold text-[#161d1f] mb-4">Score Distribution</h2>
            {scoreBuckets.every((b) => b.count === 0) ? (
              <p className="text-xs text-[#897266]">No attempts yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {scoreBuckets.map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="w-16 text-xs font-semibold text-[#564338] shrink-0">{b.label}</span>
                    <div className="flex-1 h-6 bg-[#f0f0f0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: totalAttempts > 0 ? `${(b.count / totalAttempts) * 100}%` : '0%', backgroundColor: b.color }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#161d1f] w-8 text-right">{b.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Board Breakdown */}
          <div className="bg-white rounded-2xl border border-[#e8eff1] p-5">
            <h2 className="font-heading text-base font-bold text-[#161d1f] mb-4">Board Breakdown</h2>
            {boardBreakdown.length === 0 ? (
              <p className="text-xs text-[#897266]">No users yet.</p>
            ) : (
              <BarChart
                data={boardBreakdown.map((b, i) => ({ label: b.target_board, value: b.count, color: BOARD_COLORS[i % BOARD_COLORS.length] }))}
                maxVal={maxBoardCount}
              />
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl border border-[#e8eff1] p-5">
            <h2 className="font-heading text-base font-bold text-[#161d1f] mb-4">Top 10 Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p className="text-xs text-[#897266]">No attempts yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {leaderboard.map((entry, idx) => (
                  <div key={entry.user_id} className="flex items-center gap-3 py-2 border-b border-[#f5f5f5] last:border-b-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-[#f4fafd] text-[#564338]'
                    }`}>{idx + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-[#ffdbc9] text-[#6a2d00] font-bold text-xs flex items-center justify-center shrink-0">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#161d1f] truncate">{entry.name}</p>
                      <p className="text-[10px] text-[#897266]">{entry.attempts} attempts</p>
                    </div>
                    <span className={`text-sm font-extrabold font-heading ${
                      entry.avg_accuracy >= 75 ? 'text-green-700' : entry.avg_accuracy >= 50 ? 'text-blue-600' : 'text-red-600'
                    }`}>{entry.avg_accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
