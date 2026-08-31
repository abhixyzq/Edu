'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PathNode, NodeStatus } from './PathNode';
import { useUser } from '@/context/UserContext';
import { SUBJECTS } from '@/lib/mockData';
import { playButtonClick } from '@/lib/soundEffects';
import { XpBoltIcon, GemIcon } from '@/components/icons/AppIcons';

export interface LessonNode {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  xpReward: number;
  gemsReward: number;
  testId: string;
  isBoss?: boolean;
  unit: number;
  unitTitle: string;
}

const LESSON_PATH: Record<string, LessonNode[]> = {
  physics: [
    { id: 'phy-1', number: 1, title: 'Coulomb Force', subtitle: 'Vectors & Charges', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: '1. Electrostatics & Coulomb Force' },
    { id: 'phy-2', number: 2, title: 'Electric Fields', subtitle: 'Dipoles & Lines', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: '1. Electrostatics & Coulomb Force' },
    { id: 'phy-3', number: 3, title: 'Gauss Law & Flux', subtitle: 'Surface Integrals', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '2', unit: 1, unitTitle: '1. Electrostatics & Coulomb Force' },
    { id: 'phy-4', number: 4, title: 'Electrostatic Potential', subtitle: 'Work & Energy', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '2', unit: 1, unitTitle: '1. Electrostatics & Coulomb Force' },
    { id: 'phy-boss-1', number: 5, title: 'Unit 1 Mastery Boss', subtitle: '40 Marks Exam Drill', icon: 'bolt', xpReward: 60, gemsReward: 30, testId: '1', isBoss: true, unit: 1, unitTitle: '1. Electrostatics & Coulomb Force' },

    { id: 'phy-5', number: 6, title: 'Current & Drift Speed', subtitle: 'Ohm Law Rigor', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '2', unit: 2, unitTitle: '2. Current Electricity' },
    { id: 'phy-6', number: 7, title: 'Kirchhoff Laws', subtitle: 'Loop & Junction Rules', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '2', unit: 2, unitTitle: '2. Current Electricity' },
    { id: 'phy-7', number: 8, title: 'Potentiometer & Bridge', subtitle: 'Null Deflection Drills', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '1', unit: 2, unitTitle: '2. Current Electricity' },
    { id: 'phy-boss-2', number: 9, title: 'Current Electricity Boss', subtitle: 'Full Unit Challenge', icon: 'bolt', xpReward: 60, gemsReward: 30, testId: '2', isBoss: true, unit: 2, unitTitle: '2. Current Electricity' },
  ],
  chemistry: [
    { id: 'chem-1', number: 1, title: 'Solutions & Raoult Law', subtitle: 'Colligative Properties', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '3', unit: 1, unitTitle: '1. Solutions & Raoult Law' },
    { id: 'chem-2', number: 2, title: 'Electrochemistry', subtitle: 'Nernst Equation', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '3', unit: 1, unitTitle: '1. Solutions & Raoult Law' },
    { id: 'chem-3', number: 3, title: 'Chemical Kinetics', subtitle: 'Arrhenius Equation & Rates', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '3', unit: 1, unitTitle: '1. Solutions & Raoult Law' },
    { id: 'chem-boss-1', number: 4, title: 'Physical Chem Boss', subtitle: 'Numerical Gauntlet', icon: 'bolt', xpReward: 60, gemsReward: 30, testId: '3', isBoss: true, unit: 1, unitTitle: '1. Solutions & Raoult Law' },
  ],
  mathematics: [
    { id: 'math-1', number: 1, title: 'Matrices & Determinants', subtitle: 'Inverse & Properties', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '4', unit: 1, unitTitle: '1. Matrices & Determinants' },
    { id: 'math-2', number: 2, title: 'Continuity & Differentiability', subtitle: 'Chain Rule Mastery', icon: 'bolt', xpReward: 30, gemsReward: 15, testId: '4', unit: 1, unitTitle: '1. Matrices & Determinants' },
    { id: 'math-3', number: 3, title: 'Indefinite Integrals', subtitle: 'Substitution & By Parts', icon: 'bolt', xpReward: 35, gemsReward: 20, testId: '4', unit: 2, unitTitle: '2. Calculus Dominance' },
  ],
  biology: [
    { id: 'bio-1', number: 1, title: 'Sexual Reproduction', subtitle: 'Flowering Plants', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: '1. Reproduction in Plants' },
    { id: 'bio-2', number: 2, title: 'Human Reproduction', subtitle: 'Gametogenesis & Hormones', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: '1. Reproduction in Plants' },
    { id: 'bio-boss-1', number: 3, title: 'Reproduction Unit Boss', subtitle: 'High-Yield Diagrams', icon: 'bolt', xpReward: 60, gemsReward: 30, testId: '1', isBoss: true, unit: 1, unitTitle: '1. Reproduction in Plants' },
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
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  const nodes = LESSON_PATH[activeSubject] || LESSON_PATH.physics;

  // Find index of first incomplete node
  const firstIncompleteIdx = nodes.findIndex((n) => !user.completedNodes[n.id]);
  const currentActiveIdx = firstIncompleteIdx === -1 ? nodes.length - 1 : firstIncompleteIdx;

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
    router.push(`/test/${node.testId}?nodeId=${node.id}&subject=${activeSubject}&title=${encodeURIComponent(node.title)}`);
  };

  // Group nodes by Unit for progress display
  const units: { unit: number; title: string; nodes: LessonNode[] }[] = [];
  nodes.forEach((n) => {
    let u = units.find((x) => x.unit === n.unit);
    if (!u) {
      u = { unit: n.unit, title: n.unitTitle, nodes: [] };
      units.push(u);
    }
    u.nodes.push(n);
  });

  const currentUnit = units[0] || { unit: 1, title: '1. Electrostatics & Coulomb Force', nodes: [] };
  const completedInUnit = currentUnit.nodes.filter((n) => user.completedNodes[n.id]).length;
  const unitProgressPercent = Math.round((completedInUnit / Math.max(1, currentUnit.nodes.length)) * 100);

  // ─── Mathematical Coordinate Calculation for S-Curve Track ───
  const CONTAINER_WIDTH = 320;
  const ROW_HEIGHT = 150;
  const Y_OFFSET = 50;

  // S-Curve Pattern: Center (160) -> Right (235) -> Center (160) -> Left (85)
  const getNodePoint = (index: number, isBoss?: boolean): Point => {
    const y = Y_OFFSET + index * ROW_HEIGHT;
    if (isBoss) return { x: 160, y }; // Boss is always center aligned
    const mod = index % 4;
    let x = 160;
    if (mod === 1) x = 235;
    if (mod === 3) x = 85;
    return { x, y };
  };

  const nodePoints: Point[] = nodes.map((n, i) => getNodePoint(i, n.isBoss));
  const totalTrackHeight = Y_OFFSET + (nodes.length - 1) * ROW_HEIGHT + 100;

  // Generate continuous SVG Bezier curves
  const generatePathSegment = (p1: Point, p2: Point) => {
    const dy = (p2.y - p1.y) * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
  };

  const baseTrackD = nodePoints.slice(0, -1).map((p, i) => generatePathSegment(p, nodePoints[i + 1])).join(' ');
  const completedSegments = Math.max(0, currentActiveIdx);
  const completedTrackD = nodePoints.slice(0, completedSegments).map((p, i) => generatePathSegment(p, nodePoints[i + 1])).join(' ');

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
    <div className="w-full flex flex-col items-center pt-2 pb-28 min-h-screen">
      
      {/* ─── Chapter / Unit Master Card ─── */}
      <div className="w-full max-w-sm bg-white/95 rounded-3xl p-5 border-2 border-slate-200 shadow-sm mb-4 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-[11px] font-black uppercase tracking-wider">
            {activeSubject} • Class 12
          </span>
          <span className="text-xs font-black text-violet-700">
            {unitProgressPercent}% Mastered
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
          {currentUnit.title}
        </h2>

        {/* Glowing Progress Track */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${Math.max(10, unitProgressPercent)}%` }}
          />
        </div>
      </div>

      {/* ─── Subject Switcher (Clean Pills) ─── */}
      <div className="w-full max-w-sm flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5 mb-6">
        {SUBJECTS.map((s) => {
          const isSel = activeSubject === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                playButtonClick();
                setActiveSubject(s.id);
              }}
              className={`flex-1 py-2 px-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all border cursor-pointer text-center active:scale-95 ${
                isSel
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* ─── Modern Learning Path S-Curve Track ─── */}
      <div
        className="w-full max-w-[320px] mx-auto relative select-none"
        style={{ height: `${totalTrackHeight}px` }}
      >
        {/* SVG Conduit Paths */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox={`0 0 ${CONTAINER_WIDTH} ${totalTrackHeight}`}
        >
          <defs>
            <linearGradient id="activeGradLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Inactive Base Track */}
          <path
            d={baseTrackD}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Completed Progress Line */}
          {completedTrackD && (
            <path
              d={completedTrackD}
              fill="none"
              stroke="url(#activeGradLine)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* Level Nodes */}
        {nodes.map((node, index) => {
          const status = getNodeStatus(node, index);
          const isCurrentActive = status === 'active' && index === currentActiveIdx;
          const pt = nodePoints[index];
          const mod = index % 4;
          const side: 'left' | 'right' | 'center' = node.isBoss
            ? 'center'
            : mod === 1 || mod === 0
            ? 'left'
            : 'right';

          return (
            <div
              key={node.id}
              id={isCurrentActive ? 'active-level-node' : undefined}
              ref={isCurrentActive ? activeNodeRef : undefined}
              style={{
                position: 'absolute',
                top: `${pt.y}px`,
                left: `${pt.x}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="z-10 flex items-center justify-center"
            >
              <PathNode
                id={node.id}
                number={node.number}
                title={node.title}
                subtitle={node.subtitle}
                status={status}
                isBoss={node.isBoss}
                xpReward={node.xpReward}
                gemsReward={node.gemsReward}
                side={side}
                onClick={() => handleNodeClick(node)}
              />
            </div>
          );
        })}

      </div>

      {/* ─── Node Interactive Launch Sheet / Modal ─── */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-black text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-violet-200">
                  {selectedNode.isBoss ? 'Unit Boss Checkpoint' : `Lesson #${selectedNode.number}`}
                </span>
                <h3 className="font-heading font-black text-lg text-slate-900 mt-2 leading-snug">
                  {selectedNode.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {selectedNode.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Reward & Info Badges */}
            <div className="grid grid-cols-2 gap-2 my-5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5">
                <XpBoltIcon size={22} />
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">XP Reward</span>
                  <span className="text-sm font-black text-amber-950">+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 flex items-center gap-2.5">
                <GemIcon size={22} />
                <div>
                  <span className="text-[10px] font-bold text-cyan-800 uppercase block">Gem Bonus</span>
                  <span className="text-sm font-black text-cyan-950">+{selectedNode.gemsReward} 💎</span>
                </div>
              </div>
            </div>

            {/* Start / Practice CTA */}
            <button
              type="button"
              onClick={() => startLesson(selectedNode)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-violet-300/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{user.completedNodes[selectedNode.id] ? 'Practice Again' : 'Start Lesson'}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
