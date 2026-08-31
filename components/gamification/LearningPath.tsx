'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PathNode, NodeStatus } from './PathNode';
import { useUser } from '@/context/UserContext';
import { SUBJECTS } from '@/lib/mockData';

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

  // ─── Mathematical Coordinate Calculation for 100% Perfect Conduit Connection ───
  const CONTAINER_WIDTH = 320;
  const ROW_HEIGHT = 160;
  const Y_OFFSET = 60;

  // Coordinate pattern: Center (160) -> Right (245) -> Center (160) -> Left (75)
  const getNodePoint = (index: number): Point => {
    const y = Y_OFFSET + index * ROW_HEIGHT;
    const mod = index % 4;
    let x = 160; // Center
    if (mod === 1) x = 245; // Right
    if (mod === 3) x = 75; // Left
    return { x, y };
  };

  const nodePoints: Point[] = nodes.map((_, i) => getNodePoint(i));
  const totalTrackHeight = Y_OFFSET + (nodes.length - 1) * ROW_HEIGHT + 120;

  // Generate continuous SVG paths for both base track and completed progress
  const generatePathSegment = (p1: Point, p2: Point) => {
    const dy = (p2.y - p1.y) * 0.45;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
  };

  const baseTrackD = nodePoints.slice(0, -1).map((p, i) => generatePathSegment(p, nodePoints[i + 1])).join(' ');
  
  // Completed progress line up to currentActiveIdx
  const completedSegments = Math.max(0, currentActiveIdx);
  const completedTrackD = nodePoints.slice(0, completedSegments).map((p, i) => generatePathSegment(p, nodePoints[i + 1])).join(' ');

  // ─── Auto Scroll to Active Level ───
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
      className="w-full flex flex-col items-center pt-3 pb-24 min-h-screen"
      style={{
        backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* ─── Top Chapter / Unit Card (Ultra-Premium Glass Card) ─── */}
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.04)] mb-4 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] text-[10px] font-black uppercase tracking-wider">
            {activeSubject} • Class 12
          </span>
          <span className="text-xs font-black text-[#7c3aed]">
            {unitProgressPercent}% Mastered
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
          {currentUnit.title}
        </h2>

        {/* Dynamic Glowing Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-200/60">
          <div
            className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(124,58,237,0.4)]"
            style={{ width: `${Math.max(12, unitProgressPercent)}%` }}
          />
        </div>
      </div>

      {/* ─── Subject Switcher (Sleek Modern Glass Tabs) ─── */}
      <div className="w-full max-w-sm flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5 mb-6">
        {SUBJECTS.map((s) => {
          const isSel = activeSubject === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSubject(s.id)}
              className={`flex-1 py-2 px-2 rounded-2xl font-black text-[11px] whitespace-nowrap transition-all border cursor-pointer text-center active:scale-95 ${
                isSel
                  ? 'bg-[#7c3aed] text-white border-[#6d28d9] shadow-[0_4px_14px_rgba(124,58,237,0.35)] scale-102'
                  : 'bg-white/90 text-slate-500 border-slate-200/80 hover:text-slate-800 hover:bg-white'
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* ─── Learning Path with Flawless Mathematical Conduit Connection ─── */}
      <div
        className="w-full max-w-[320px] mx-auto relative select-none"
        style={{ height: `${totalTrackHeight}px` }}
      >
        {/* Continuous Background Conduit SVG Pipes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox={`0 0 ${CONTAINER_WIDTH} ${totalTrackHeight}`}
        >
          <defs>
            <linearGradient id="activePipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="pipeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7c3aed" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Base Inactive Conduit Pipe (Track) */}
          <path
            d={baseTrackD}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Groove Line for 3D Pipe Illusion */}
          <path
            d={baseTrackD}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Completed Active Conduit Pipe (Purple Glowing Track) */}
          {completedTrackD && (
            <>
              <path
                d={completedTrackD}
                fill="none"
                stroke="url(#activePipeGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pipeShadow)"
              />
              <path
                d={completedTrackD}
                fill="none"
                stroke="#c4b5fd"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>

        {/* Nodes Layer: Positioned Centered on the Conduit Points */}
        {nodes.map((node, index) => {
          const status = getNodeStatus(node, index);
          const isCurrentActive = status === 'active' && index === currentActiveIdx;
          const pt = nodePoints[index];
          const isRadialProgress = isCurrentActive && index === 3;
          const mod = index % 4;
          const side: 'left' | 'right' = (mod === 1 || mod === 0) ? 'left' : 'right';

          return (
            <div
              key={node.id}
              id={isCurrentActive ? 'active-level-node' : undefined}
              ref={isCurrentActive ? activeNodeRef : undefined}
              style={{
                position: 'absolute',
                top: `${pt.y}px`,
                left: `${pt.x}px`,
                transform: 'translate(-50%, -50%)', // Centers the 80px button exactly on (pt.x, pt.y)
              }}
              className="z-10 flex items-center justify-center"
            >
              <PathNode
                id={node.id}
                title={node.title}
                status={status}
                side={side}
                progressText={isRadialProgress ? '1/3' : undefined}
                progressPercent={33}
                onClick={() => handleNodeClick(node)}
              />
            </div>
          );
        })}

      </div>
    </div>
  );
};
