'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PathNode, NodeStatus } from './PathNode';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { SUBJECTS } from '@/lib/mockData';
import { playButtonClick } from '@/lib/soundEffects';
import { XpBoltIcon, GemIcon } from '@/components/icons/AppIcons';

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
      title: 'Electric Charges & Fields',
      subtitle: '5 Questions • Part 1',
      iconType: 'brain',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'Unit 1 • Electrostatics',
      themeColor: '#7c3aed',
      offset: 0,
      limit: 5,
    },
    {
      id: 'phy-2',
      code: '02',
      title: 'Coulomb Law & Field Lines',
      subtitle: '5 Questions • Part 2',
      iconType: 'atom',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'Unit 1 • Electrostatics',
      themeColor: '#7c3aed',
      offset: 5,
      limit: 5,
    },
    {
      id: 'phy-3',
      code: '03',
      title: 'Gauss Law & Flux',
      subtitle: '5 Questions • Part 3',
      iconType: 'circuit',
      xpReward: 30,
      gemsReward: 15,
      testId: '1',
      unit: 2,
      unitTitle: 'Unit 2 • Potential & Flux',
      themeColor: '#3b82f6',
      offset: 10,
      limit: 5,
    },
    {
      id: 'phy-4',
      code: '04',
      title: 'Capacitance & Dielectrics',
      subtitle: '5 Questions • Part 4',
      iconType: 'atom',
      xpReward: 30,
      gemsReward: 15,
      testId: '2',
      unit: 2,
      unitTitle: 'Unit 2 • Potential & Flux',
      themeColor: '#3b82f6',
      offset: 0,
      limit: 5,
    },
    {
      id: 'phy-boss-1',
      code: '05',
      title: 'Electrostatics Mastery Exam',
      subtitle: '5 Questions • Final Drill',
      iconType: 'trophy',
      xpReward: 50,
      gemsReward: 25,
      testId: '1',
      isBoss: true,
      unit: 2,
      unitTitle: 'Unit 2 • Mastery Challenge',
      themeColor: '#f59e0b',
      offset: 15,
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
  const [loadingNodes, setLoadingNodes] = useState(false);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

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

  // 2. Fetch Dynamic Chapters & Tests for Active Subject with 5-Question Chunking
  useEffect(() => {
    let isMounted = true;

    async function loadDynamicChapters() {
      setLoadingNodes(true);
      try {
        const [chaptersRes, testsRes] = await Promise.all([
          supabase.from('chapters').select('*').eq('subject_id', activeSubject).order('chapter_number'),
          supabase.from('tests').select('id, title, subject_id').eq('subject_id', activeSubject),
        ]);

        if (isMounted && chaptersRes.data && chaptersRes.data.length > 0) {
          const tests = testsRes.data || [];
          const defaultTestId = tests[0]?.id || '1';

          const colors = ['#7c3aed', '#3b82f6', '#10b981', '#ec4899', '#f59e0b', '#06b6d4'];
          const icons = ['brain', 'atom', 'circuit', 'flask', 'math', 'dna'];

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

              let partTitle = `${chap.title} • Part ${p + 1}`;
              if (numParts === 1) {
                partTitle = chap.title;
              } else if (isChapterLast) {
                partTitle = `${chap.title} • Mastery Drill`;
              }

              generatedNodes.push({
                id: `chap-${chap.id}-p${p + 1}`,
                code: levelCode,
                title: partTitle,
                subtitle: `${endQ - startQ + 1} Questions • Q${startQ}-Q${endQ}`,
                iconType: isSubjectBoss ? 'trophy' : (isChapterLast ? 'trophy' : icons[(globalLevelCounter - 1) % icons.length]),
                xpReward: 20 + p * 5,
                gemsReward: 10 + p * 2,
                testId: targetTestId,
                offset: p * CHUNK_SIZE,
                limit: CHUNK_SIZE,
                isBoss: isChapterLast,
                unit: unitNum,
                unitTitle: `Unit ${unitNum} • ${chap.title}`,
                themeColor: isSubjectBoss ? '#f59e0b' : colors[(unitNum - 1) % colors.length],
              });
            }
          });

          setDbNodes(generatedNodes);
        } else if (isMounted) {
          setDbNodes(null);
        }
      } catch {
        if (isMounted) setDbNodes(null);
      } finally {
        if (isMounted) setLoadingNodes(false);
      }
    }

    loadDynamicChapters();

    // Realtime listener for chapter changes
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

  const fallbackNodes = LESSON_PATH[activeSubject] || LESSON_PATH.physics;
  const nodes = dbNodes && dbNodes.length > 0 ? dbNodes : fallbackNodes;

  const subjectList = dbSubjects.length > 0
    ? dbSubjects
    : SUBJECTS.map((s) => ({ id: s.id, name: s.name }));

  const firstIncompleteIdx = nodes.findIndex((n) => !user.completedNodes[n.id]);
  const currentActiveIdx = firstIncompleteIdx === -1 ? nodes.length - 1 : firstIncompleteIdx;
  const currentActiveNode = nodes[currentActiveIdx] || nodes[0];

  const completedCount = nodes.filter((n) => user.completedNodes[n.id]).length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);

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

  const handleNodeClick = (node: LessonNode) => {
    setSelectedNode(node);
  };

  const startLesson = (node: LessonNode) => {
    playButtonClick();
    const offset = node.offset ?? 0;
    const limit = node.limit ?? 5;
    router.push(`/test/${node.testId}?nodeId=${node.id}&subject=${activeSubject}&title=${encodeURIComponent(node.title)}&offset=${offset}&limit=${limit}`);
  };

  // Clean Geometry Coordinates
  const CONTAINER_WIDTH = 320;
  const ROW_HEIGHT = 150;
  const Y_OFFSET = 65;

  const getNodePoint = (index: number): Point => {
    const y = Y_OFFSET + index * ROW_HEIGHT;
    if (index === 0) return { x: 160, y };
    const mod = index % 2;
    const x = mod === 1 ? 80 : 240;
    return { x, y };
  };

  const nodePoints: Point[] = nodes.map((_, i) => getNodePoint(i));
  const totalTrackHeight = Y_OFFSET + (nodes.length - 1) * ROW_HEIGHT + 100;

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

  return (
    <div
      className="w-full min-h-screen bg-[#f8fafc] text-slate-900 pb-36 font-sans select-none relative"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ─── Top Subject Navigation Header ─── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-md mx-auto px-4 py-2.5">
          {/* Subject Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {subjectList.map((s) => {
              const isSel = activeSubject === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    playButtonClick();
                    setActiveSubject(s.id);
                  }}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSel
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-sm scale-[1.02]'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Smart Quest Mission Banner ─── */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-2 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-violet-50 text-[#7c3aed] px-2.5 py-0.5 rounded-full border border-violet-100">
                {user.classLevel || 'Class 12'} Quest
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {progressPercent}% Cleared
              </span>
            </div>

            <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 truncate">
              {currentActiveNode.unitTitle}
            </h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              Current Mission: <span className="font-bold text-slate-800">{currentActiveNode.title}</span>
            </p>

            {/* Smart Progress Conduit Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progressPercent, 6)}%` }}
              />
            </div>
          </div>

          {/* Scholar Mascot */}
          <div className="w-12 sm:w-14 shrink-0 flex items-center justify-center">
            <img
              src="/images/trophy_cat.png"
              alt="Mascot"
              className="w-full h-auto object-contain hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* ─── Smart Energy Track Canvas ─── */}
      <div
        className="w-full max-w-[320px] sm:max-w-[340px] mx-auto relative mt-3 z-10"
        style={{ height: `${totalTrackHeight}px` }}
      >
        {/* SVG Energy Conduit Trajectory */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox={`0 0 ${CONTAINER_WIDTH} ${totalTrackHeight}`}
        >
          {/* Base Energy Conduit Line */}
          {nodes.slice(0, -1).map((node, index) => {
            const p1 = nodePoints[index];
            const p2 = nodePoints[index + 1];
            const d = getSPath(p1, p2);

            return (
              <g key={`track-group-${node.id}`}>
                {/* Outer Shadow/Glow */}
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(226, 232, 240, 0.9)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Inner Core Rail */}
                <path
                  d={d}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Active / Cleared Purple Neon Energy Conduit */}
          {nodes.slice(0, -1).map((node, index) => {
            if (index >= currentActiveIdx) return null;
            const p1 = nodePoints[index];
            const p2 = nodePoints[index + 1];
            const d = getSPath(p1, p2);

            return (
              <g key={`track-active-${node.id}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(124, 58, 237, 0.2)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* ─── Smart Stepping Quest Nodes ─── */}
        {nodes.map((node, index) => {
          const status = getNodeStatus(node, index);
          const isCurrentActive = status === 'active' && index === currentActiveIdx;
          const pt = nodePoints[index];

          const textSide: 'left' | 'right' = index === 0 ? 'right' : (index % 2 === 1 ? 'right' : 'left');

          return (
            <div
              key={node.id}
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
                onClick={() => handleNodeClick(node)}
                textSide={textSide}
              />
            </div>
          );
        })}
      </div>

      {/* ─── Smart Quest Brief Popup Sheet ─── */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 bg-violet-100 text-[#7c3aed] border border-violet-200">
                  {selectedNode.unitTitle}
                </span>
                <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {selectedNode.subtitle}. Complete this 5-question mission to earn XP, collect gems, and advance your rank!
            </p>

            {/* Mission Loot Rewards Strip */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <XpBoltIcon size={22} />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">XP Bounty</span>
                  <span className="text-xs font-black text-slate-800">+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <GemIcon size={22} />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Gem Bonus</span>
                  <span className="text-xs font-black text-slate-800">+{selectedNode.gemsReward} Gems</span>
                </div>
              </div>
            </div>

            {/* Action Launch Quest Button */}
            <button
              type="button"
              onClick={() => startLesson(selectedNode)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] border-b-4 border-[#5b21b6] text-white font-black text-sm transition-all active:border-b-0 active:translate-y-1 shadow-lg shadow-[#7c3aed]/25 flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span>{user.completedNodes[selectedNode.id] ? 'Replay Quest' : 'Start 5-MCQ Quest'}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
