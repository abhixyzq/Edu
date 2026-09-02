'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PathNode, NodeStatus } from './PathNode';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { SUBJECTS } from '@/lib/mockData';
import { playButtonClick } from '@/lib/soundEffects';

export interface LessonNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  iconType: string;
  xpReward: number;
  gemsReward: number;
  testId: string;
  isBoss?: boolean;
  unit: number;
  unitTitle: string;
  themeColor: string;
  offset?: number;
  limit?: number;
}

const LESSON_PATH: Record<string, LessonNode[]> = {
  physics: [
    {
      id: 'phy-1',
      code: '01',
      title: 'Questions 01 – 05',
      subtitle: '',
      iconType: 'brain',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'CHAPTER 1 • ELECTRIC CHARGES',
      themeColor: '#10b981',
      offset: 0,
      limit: 5,
    },
    {
      id: 'phy-2',
      code: '02',
      title: 'Questions 06 – 10',
      subtitle: '',
      iconType: 'atom',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'CHAPTER 1 • ELECTRIC CHARGES',
      themeColor: '#10b981',
      offset: 5,
      limit: 5,
    },
    {
      id: 'phy-3',
      code: '03',
      title: 'Questions 11 – 15',
      subtitle: '',
      iconType: 'circuit',
      xpReward: 30,
      gemsReward: 15,
      testId: '1',
      unit: 2,
      unitTitle: 'CHAPTER 2 • POTENTIAL & FLUX',
      themeColor: '#ff6937',
      offset: 10,
      limit: 5,
    },
    {
      id: 'phy-4',
      code: '04',
      title: 'Questions 16 – 20',
      subtitle: '',
      iconType: 'atom',
      xpReward: 30,
      gemsReward: 15,
      testId: '2',
      unit: 2,
      unitTitle: 'CHAPTER 2 • POTENTIAL & FLUX',
      themeColor: '#3b82f6',
      offset: 0,
      limit: 5,
    },
  ],
};

interface Point {
  x: number;
  y: number;
}

interface LearningPathProps {
  initialSubject?: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({ initialSubject = 'physics' }) => {
  const router = useRouter();
  const { user } = useUser();
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [dbSubjects, setDbSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [dbNodes, setDbNodes] = useState<LessonNode[] | null>(null);
  const [loadingNodes, setLoadingNodes] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch Dynamic Subjects from Supabase
  useEffect(() => {
    async function loadSubjects() {
      const { data } = await supabase.from('subjects').select('id, title').order('title');
      if (data && data.length > 0) {
        setDbSubjects(data.map((s: any) => ({ id: s.id, name: s.title })));
      }
    }
    loadSubjects();
  }, []);

  // 2. Fetch Dynamic Chapters & Tests with 5-Question Chunking + Instant LocalStorage Cache
  useEffect(() => {
    let isMounted = true;

    // Try reading cache immediately on subject change
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`edu_path_cache_${activeSubject}`);
        if (cached) {
          setDbNodes(JSON.parse(cached));
          setLoadingNodes(false);
        } else {
          setLoadingNodes(true);
        }
      } catch {
        setLoadingNodes(true);
      }
    }

    async function loadDynamicChapters() {
      try {
        const [chaptersRes, testsRes] = await Promise.all([
          supabase.from('chapters').select('*').eq('subject_id', activeSubject).order('chapter_number'),
          supabase.from('tests').select('id, title, subject_id').eq('subject_id', activeSubject),
        ]);

        if (isMounted && chaptersRes.data && chaptersRes.data.length > 0) {
          const tests = testsRes.data || [];
          const defaultTestId = tests[0]?.id || '1';

          const generatedNodes: LessonNode[] = [];
          const CHUNK_SIZE = 5;
          let globalLevelCounter = 1;

          chaptersRes.data.forEach((chap: any, chapIdx: number) => {
            const matchingTest = tests.find((t: any) =>
              t.title.toLowerCase().includes(chap.title.toLowerCase()) ||
              chap.title.toLowerCase().includes(t.title.toLowerCase())
            );
            const targetTestId = matchingTest?.id || defaultTestId;
            const totalQ = chap.question_count && chap.question_count > 0 ? chap.question_count : 15;
            const numParts = Math.max(1, Math.ceil(totalQ / CHUNK_SIZE));
            const isLastChapter = chapIdx === chaptersRes.data.length - 1;

            for (let p = 0; p < numParts; p++) {
              const startQ = p * CHUNK_SIZE + 1;
              const endQ = Math.min((p + 1) * CHUNK_SIZE, totalQ);
              const isChapterLast = p === numParts - 1;
              const isSubjectBoss = isLastChapter && isChapterLast;

              const unitNum = chap.chapter_number || chapIdx + 1;
              const levelCode = String(globalLevelCounter++).padStart(2, '0');

              const partTitle = `Questions ${String(startQ).padStart(2, '0')} – ${String(endQ).padStart(2, '0')}`;

              generatedNodes.push({
                id: `chap-${chap.id}-p${p + 1}`,
                code: levelCode,
                title: partTitle,
                subtitle: '',
                iconType: 'brain',
                xpReward: 25 + p * 5,
                gemsReward: 10 + p * 2,
                testId: targetTestId,
                offset: p * CHUNK_SIZE,
                limit: CHUNK_SIZE,
                isBoss: isChapterLast,
                unit: unitNum,
                unitTitle: `CHAPTER ${unitNum} • ${chap.title.toUpperCase()}`,
                themeColor: '#ff6937',
              });
            }
          });

          setDbNodes(generatedNodes);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`edu_path_cache_${activeSubject}`, JSON.stringify(generatedNodes));
            } catch {}
          }
        }
      } catch {
        // preserve cache or fallback
      } finally {
        if (isMounted) setLoadingNodes(false);
      }
    }

    loadDynamicChapters();

    const channel = supabase
      .channel(`realtime:chapters:${activeSubject}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chapters' }, () => {
        loadDynamicChapters();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tests' }, () => {
        loadDynamicChapters();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [activeSubject]);

  const nodes = dbNodes && dbNodes.length > 0 ? dbNodes : [];

  const subjectList = dbSubjects.length > 0
    ? dbSubjects
    : SUBJECTS.map((s) => ({ id: s.id, name: s.name }));

  const currentSubjectObj = subjectList.find((s) => s.id === activeSubject) || subjectList[0] || { name: 'Physics' };

  const firstIncompleteIdx = nodes.findIndex((n) => !user.completedNodes[n.id]);
  const currentActiveIdx = firstIncompleteIdx === -1 ? nodes.length - 1 : firstIncompleteIdx;
  const currentActiveNode = nodes[currentActiveIdx] || nodes[0];

  const getNodeStatus = (node: LessonNode, index: number): NodeStatus => {
    if (user.completedNodes[node.id]) {
      return 'completed';
    }
    if (index === currentActiveIdx) {
      return 'active';
    }
    if (user.unlockedNodes.includes(node.id) || index < currentActiveIdx) {
      return 'active';
    }
    return 'locked';
  };

  const startLesson = (node: LessonNode) => {
    playButtonClick();
    const offset = node.offset ?? 0;
    const limit = node.limit ?? 5;
    router.push(`/test/${node.testId}?nodeId=${node.id}&subject=${activeSubject}&title=${encodeURIComponent(node.title)}&offset=${offset}&limit=${limit}`);
  };

  // Dynamic Coordinate & Geometry Engine:
  // Dynamically adds vertical spacing for Chapter dividers so nothing EVER overlaps!
  const CONTAINER_WIDTH = 340;
  const ROW_STEP = 155;
  const CHAPTER_BANNER_GAP = 85;

  const calculatedTrack = React.useMemo(() => {
    let currentY = 12;
    const points: { pt: Point; dividerY?: number; showDivider: boolean }[] = [];

    nodes.forEach((node, index) => {
      const showDivider = index === 0 || (nodes[index - 1] && nodes[index - 1].unit !== node.unit);
      let dividerY: number | undefined = undefined;

      if (showDivider) {
        dividerY = currentY;
        currentY += CHAPTER_BANNER_GAP;
      }

      const isRightSide = index % 2 === 0;
      const x = isRightSide ? 285 : 55;
      const pt = { x, y: currentY };

      points.push({ pt, dividerY, showDivider });
      currentY += ROW_STEP;
    });

    const totalHeight = currentY + 50;
    return { points, totalHeight };
  }, [nodes]);

  const { points: nodeLayouts, totalHeight: totalTrackHeight } = calculatedTrack;

  const getSPath = (p1: Point, p2: Point) => {
    const midY = (p1.y + p2.y) / 2;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
  };

  // Auto scroll to active node
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNodeRef.current) {
        activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [activeSubject, user.completedNodes]);

  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-[#faf6f0] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#ff6937] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#faf6f0] text-slate-900 pb-36 font-sans select-none relative">
      
      {/* ─── Background Subtle Micro-Elements (Exact Reference) ─── */}
      <div className="absolute top-28 left-8 text-emerald-400 text-sm font-bold opacity-60 pointer-events-none">+</div>
      <div className="absolute top-52 right-10 text-orange-400 text-xs font-bold opacity-60 pointer-events-none">✦</div>
      <div className="absolute top-[420px] left-10 text-emerald-400 text-xs font-bold opacity-50 pointer-events-none">+</div>
      <div className="absolute top-[600px] right-8 text-pink-400 text-sm font-bold opacity-60 pointer-events-none">✦</div>
      <div className="absolute top-[820px] left-6 text-orange-400 text-xs font-bold opacity-50 pointer-events-none">✦</div>
      <div className="absolute top-[1020px] right-12 text-emerald-400 text-sm font-bold opacity-60 pointer-events-none">+</div>

      {/* ─── Top White Rounded Header Card (Only Curved Card Fixed) ─── */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-white rounded-b-[36px] px-5 pt-3 pb-4 shadow-lg border-b border-orange-100/80">
            
            {/* Top Bar: Left Action / Center Avatar / Right Dark Flame */}
            <div className="w-full flex items-center justify-between">
              {/* Share / Profile Button */}
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="w-10 h-10 rounded-full bg-[#fbf4eb] flex items-center justify-center text-[#8c6b4e] shadow-2xs hover:bg-[#f5ebd9] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">ios_share</span>
              </button>

              {/* Center User Avatar */}
              <div className="relative flex flex-col items-center">
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-orange-400 via-pink-400 to-purple-400 shadow-md">
                  <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden flex items-center justify-center">
                    <img
                      src={user.avatarUrl || '/images/trophy_cat.png'}
                      alt="Avatar"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Right Dark Bonfire Streak Button */}
              <button
                type="button"
                onClick={() => router.push('/leaderboard')}
                className="w-10 h-10 rounded-full bg-[#1e1b2e] flex items-center justify-center text-orange-400 shadow-md hover:bg-[#2c2842] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
              </button>
            </div>

            {/* Stats Counters Row (⚡ 0 | ⚡ 0 / 10,000 | 💎 0) */}
            <div className="w-full flex items-center justify-around mt-3.5 pt-3 border-t border-slate-100">
              {/* XP */}
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm font-black">⚡</span>
                <span className="font-black text-xs text-slate-800">{user.xp || 0}</span>
              </div>

              {/* Daily Goal */}
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm font-black">⚡</span>
                <span className="font-bold text-xs text-slate-500">{user.xp || 0} / 10,000</span>
              </div>

              {/* Gems */}
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-500 text-sm font-black">💎</span>
                <span className="font-black text-xs text-slate-800">{user.gems || 0}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── Winding Pathway Canvas (Coordinated Coordinate Space) ─── */}
      {nodes.length === 0 ? (
        <div className="w-full max-w-[340px] mx-auto relative mt-[145px] min-h-[500px] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full border-4 border-orange-200 border-t-[#ff6937] animate-spin" />
            <p className="text-xs font-black tracking-wider text-slate-400 uppercase">Loading Curriculum...</p>
          </div>
        </div>
      ) : (
        <div
          className="w-full max-w-[340px] sm:max-w-[360px] mx-auto relative mt-[145px] z-10 animate-in fade-in duration-300"
          style={{ height: `${totalTrackHeight}px` }}
        >
        {/* SVG Path Tracks (Solid Green + Dashed Dark Road) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox={`0 0 ${CONTAINER_WIDTH} ${totalTrackHeight}`}
        >
          {nodes.slice(0, -1).map((node, index) => {
            const p1 = nodeLayouts[index]?.pt || { x: 285, y: 0 };
            const p2 = nodeLayouts[index + 1]?.pt || { x: 55, y: 0 };
            const d = getSPath(p1, p2);
            const isCompletedSegment = index < currentActiveIdx;

            return (
              <path
                key={`track-${node.id}`}
                d={d}
                fill="none"
                stroke={isCompletedSegment ? '#22c55e' : '#334155'}
                strokeWidth={isCompletedSegment ? '3.5' : '2.5'}
                strokeDasharray={isCompletedSegment ? 'none' : '7 7'}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* ─── Alternating Stepping Milestone Nodes (Centered at pt.x, pt.y) ─── */}
        {nodes.map((node, index) => {
          const status = getNodeStatus(node, index);
          const isCurrentActive = status === 'active' && index === currentActiveIdx;
          const layout = nodeLayouts[index] || { pt: { x: 285, y: 0 }, showDivider: false };
          const pt = layout.pt;

          // Even index -> Node on Right (Text on Left)
          // Odd index  -> Node on Left (Text on Right)
          const textSide: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';

          return (
            <React.Fragment key={node.id}>
              {/* Day / Chapter Divider Banner with Full Title & No Truncation */}
              {layout.showDivider && layout.dividerY !== undefined && (
                <div
                  className="absolute left-0 right-0 flex items-center justify-center gap-2 pointer-events-none px-2 z-20"
                  style={{ top: `${layout.dividerY}px` }}
                >
                  <div className="flex-1 h-[1.5px] border-t-2 border-dashed border-slate-300" />
                  <div className="max-w-[280px] bg-[#faf6f0] px-3.5 py-1.5 rounded-2xl border border-orange-200/90 shadow-2xs text-center">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#ff6937] flex items-center justify-center gap-1 uppercase leading-normal">
                      <span className="text-amber-500 shrink-0">⚡</span>
                      <span>{node.unitTitle || `CHAPTER ${node.unit}`}</span>
                    </span>
                  </div>
                  <div className="flex-1 h-[1.5px] border-t-2 border-dashed border-slate-300" />
                </div>
              )}

              {/* Circle Node Container Centered on Point */}
              <div
                id={isCurrentActive ? 'active-level-node' : undefined}
                ref={isCurrentActive ? activeNodeRef : undefined}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${pt.x}px`,
                  top: `${pt.y}px`,
                }}
              >
                <PathNode
                  id={node.id}
                  code={node.code}
                  title={node.title}
                  subtitle={node.subtitle}
                  status={status}
                  isBoss={node.isBoss}
                  themeColor={node.themeColor}
                  iconType={node.iconType}
                  userAvatarUrl={user.avatarUrl}
                  userName={user.name}
                  onClick={() => startLesson(node)}
                  textSide={textSide}
                />
              </div>
            </React.Fragment>
          );
        })}
        </div>
      )}

      {/* ─── Floating Bottom Subject Switcher Pill: [ My Exercises • Physics 🎛️ ] ─── */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
        {/* Subject Dropdown Menu popping UP */}
        {showSubjectMenu && (
          <div className="mb-2.5 bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 min-w-[240px] animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">Switch Curriculum</p>
            {subjectList.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  playButtonClick();
                  setActiveSubject(s.id);
                  setShowSubjectMenu(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  activeSubject === s.id ? 'bg-orange-50 text-[#ff6937] font-black' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{s.name}</span>
                {activeSubject === s.id && <span className="text-[#ff6937] text-xs font-black">✓</span>}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowSubjectMenu(!showSubjectMenu)}
          className="px-6 py-2.5 rounded-full bg-[#241f31] hover:bg-[#342d45] text-white font-black text-xs shadow-2xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer border border-slate-700/60 ring-2 ring-white/60"
        >
          <span>My Exercises • {currentSubjectObj.name}</span>
          <span className="material-symbols-outlined text-[15px]">tune</span>
        </button>
      </div>

    </div>
  );
};
