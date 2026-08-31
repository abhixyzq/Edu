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

// 3 Position alignments: 0 = Center, 1 = Right, 2 = Center, 3 = Left
const POSITIONS = ['justify-center', 'justify-end pr-6', 'justify-center', 'justify-start pl-6'];

interface LearningPathProps {
  initialSubject?: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({ initialSubject = 'physics' }) => {
  const router = useRouter();
  const { user } = useUser();
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  const nodes = LESSON_PATH[activeSubject] || LESSON_PATH.physics;

  // Find index of first incomplete node in current subject
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

  // Group nodes by Unit
  const units: { unit: number; title: string; nodes: LessonNode[] }[] = [];
  nodes.forEach((n) => {
    let u = units.find((x) => x.unit === n.unit);
    if (!u) {
      u = { unit: n.unit, title: n.unitTitle, nodes: [] };
      units.push(u);
    }
    u.nodes.push(n);
  });

  // Calculate current unit progress
  const currentUnit = units[0] || { unit: 1, title: '1. Intro to Web Development', nodes: [] };
  const completedInUnit = currentUnit.nodes.filter((n) => user.completedNodes[n.id]).length;
  const unitProgressPercent = Math.round((completedInUnit / Math.max(1, currentUnit.nodes.length)) * 100);

  // ─── Automatic Scroll to Active Level on App Startup ───
  useEffect(() => {
    const scrollToActive = () => {
      if (activeNodeRef.current) {
        activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const timer = setTimeout(scrollToActive, 200);
    return () => clearTimeout(timer);
  }, [activeSubject, user.completedNodes]);

  return (
    <div
      className="w-full flex flex-col items-center pt-3 pb-16 min-h-screen"
      style={{
        backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* ─── Top Chapter / Unit Card (Exact match to reference UI) ─── */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-sm mb-6">
        <span className="text-xs font-semibold text-[#64748b]">
          {activeSubject.toUpperCase()} • CLASS 12TH
        </span>
        <h2 className="text-base sm:text-lg font-black text-[#1e293b] mt-0.5 leading-tight">
          {currentUnit.title}
        </h2>

        {/* Purple Progress Bar */}
        <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-[#8b5cf6] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(15, unitProgressPercent)}%` }}
          />
        </div>
      </div>

      {/* ─── Subject Switcher (Pill tabs) ─── */}
      <div className="w-full max-w-sm flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 mb-8">
        {SUBJECTS.map((s) => {
          const isSel = activeSubject === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSubject(s.id)}
              className={`flex-1 py-2 px-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all border-b-3 active:border-b-0 cursor-pointer text-center ${
                isSel
                  ? 'bg-[#8b5cf6] text-white border-[#6d28d9] shadow-xs'
                  : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-slate-50'
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* ─── Learning Path with Purple Conduit Line & Squircle Tiles ─── */}
      <div className="w-full max-w-xs flex flex-col items-center relative py-4">
        
        {nodes.map((node, index) => {
          const status = getNodeStatus(node, index);
          const isCurrentActive = status === 'active' && index === currentActiveIdx;
          const posClass = POSITIONS[index % POSITIONS.length];

          // Determine connector pipe type to next node
          const hasNext = index < nodes.length - 1;
          const currentPos = index % POSITIONS.length;
          const nextPos = (index + 1) % POSITIONS.length;

          // 3rd or 4th item can display as in-progress 1/3 sub-meter if active
          const isRadialProgress = isCurrentActive && index === 3;

          return (
            <div key={node.id} className="w-full flex flex-col relative">
              
              {/* Node Container */}
              <div
                id={isCurrentActive ? 'active-level-node' : undefined}
                ref={isCurrentActive ? activeNodeRef : undefined}
                className={`w-full flex ${posClass} relative z-10`}
              >
                <PathNode
                  id={node.id}
                  title={node.title}
                  status={status}
                  progressText={isRadialProgress ? '1/3' : undefined}
                  progressPercent={33}
                  onClick={() => handleNodeClick(node)}
                />
              </div>

              {/* Purple Conduit Connector Pipe to Next Node */}
              {hasNext && (
                <div className="w-full h-12 relative -my-3 pointer-events-none z-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 48" preserveAspectRatio="none">
                    {/* Center (150) -> Right (240) */}
                    {currentPos === 0 && nextPos === 1 && (
                      <path
                        d="M 150 0 L 150 18 Q 150 30 165 30 L 225 30 Q 240 30 240 42 L 240 48"
                        fill="none"
                        stroke="#b49bf8"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    )}
                    {/* Right (240) -> Center (150) */}
                    {currentPos === 1 && nextPos === 2 && (
                      <path
                        d="M 240 0 L 240 18 Q 240 30 225 30 L 165 30 Q 150 30 150 42 L 150 48"
                        fill="none"
                        stroke="#b49bf8"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    )}
                    {/* Center (150) -> Left (60) */}
                    {currentPos === 2 && nextPos === 3 && (
                      <path
                        d="M 150 0 L 150 18 Q 150 30 135 30 L 75 30 Q 60 30 60 42 L 60 48"
                        fill="none"
                        stroke="#b49bf8"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    )}
                    {/* Left (60) -> Center (150) */}
                    {currentPos === 3 && nextPos === 0 && (
                      <path
                        d="M 60 0 L 60 18 Q 60 30 75 30 L 135 30 Q 150 30 150 42 L 150 48"
                        fill="none"
                        stroke="#b49bf8"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
};
