'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PathNode, NodeStatus } from './PathNode';
import { useUser } from '@/context/UserContext';
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
}

const LESSON_PATH: Record<string, LessonNode[]> = {
  physics: [
    {
      id: 'phy-1',
      code: '01',
      title: 'Introduction to Charges & Coulomb Force',
      subtitle: 'Quantization & Vectors',
      iconType: 'brain',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'Unit 1 • Electrostatics & Fields',
      themeColor: '#10b981',
    },
    {
      id: 'phy-2',
      code: '02',
      title: 'Electric Fields & Dipole Moment',
      subtitle: 'Field Lines & Torque',
      iconType: 'atom',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'Unit 1 • Electrostatics & Fields',
      themeColor: '#10b981',
    },
    {
      id: 'phy-3',
      code: '03',
      title: 'Gauss Law & Electric Flux',
      subtitle: 'Cylindrical & Spherical Surfaces',
      iconType: 'circuit',
      xpReward: 30,
      gemsReward: 15,
      testId: '2',
      unit: 2,
      unitTitle: 'Unit 2 • Potential & Capacitance',
      themeColor: '#3b82f6',
    },
    {
      id: 'phy-4',
      code: '04',
      title: 'Electrostatic Potential & Capacitors',
      subtitle: 'Dielectrics & Energy Stored',
      iconType: 'atom',
      xpReward: 30,
      gemsReward: 15,
      testId: '2',
      unit: 2,
      unitTitle: 'Unit 2 • Potential & Capacitance',
      themeColor: '#3b82f6',
    },
    {
      id: 'phy-5',
      code: '05',
      title: 'Current Electricity & Drift Speed',
      subtitle: 'Ohm Law & Resistance Networks',
      iconType: 'circuit',
      xpReward: 35,
      gemsReward: 15,
      testId: '1',
      unit: 2,
      unitTitle: 'Unit 2 • Potential & Capacitance',
      themeColor: '#3b82f6',
    },
    {
      id: 'phy-6',
      code: '06',
      title: 'Kirchhoff Rules & Wheatstone Bridge',
      subtitle: 'Complex Loop Analysis',
      iconType: 'math',
      xpReward: 35,
      gemsReward: 20,
      testId: '2',
      unit: 3,
      unitTitle: 'Unit 3 • Advanced Circuit Mastery',
      themeColor: '#8b5cf6',
    },
    {
      id: 'phy-boss-1',
      code: '07',
      title: 'Term 1 Mastery Exam Drill',
      subtitle: '40 Marks Board Level Test',
      iconType: 'trophy',
      xpReward: 75,
      gemsReward: 35,
      testId: '1',
      isBoss: true,
      unit: 3,
      unitTitle: 'Unit 3 • Advanced Circuit Mastery',
      themeColor: '#f59e0b',
    },
  ],
  chemistry: [
    {
      id: 'chem-1',
      code: '01',
      title: 'Solutions & Concentration Terms',
      subtitle: 'Molarity & Raoult Law',
      iconType: 'brain',
      xpReward: 25,
      gemsReward: 10,
      testId: '3',
      unit: 1,
      unitTitle: 'Unit 1 • Physical Solutions',
      themeColor: '#10b981',
    },
    {
      id: 'chem-2',
      code: '02',
      title: 'Colligative Properties & Osmosis',
      subtitle: 'Vant Hoff Factor',
      iconType: 'flask',
      xpReward: 30,
      gemsReward: 15,
      testId: '3',
      unit: 1,
      unitTitle: 'Unit 1 • Physical Solutions',
      themeColor: '#10b981',
    },
    {
      id: 'chem-3',
      code: '03',
      title: 'Electrochemistry & Nernst Equation',
      subtitle: 'EMF & Gibbs Energy',
      iconType: 'atom',
      xpReward: 35,
      gemsReward: 20,
      testId: '3',
      unit: 2,
      unitTitle: 'Unit 2 • Electrochemistry & Kinetics',
      themeColor: '#3b82f6',
    },
    {
      id: 'chem-boss-1',
      code: '04',
      title: 'Chemical Kinetics & Arrhenius Equation',
      subtitle: 'Rate Laws & Half Life',
      iconType: 'trophy',
      xpReward: 75,
      gemsReward: 35,
      testId: '3',
      isBoss: true,
      unit: 2,
      unitTitle: 'Unit 2 • Electrochemistry & Kinetics',
      themeColor: '#f59e0b',
    },
  ],
  mathematics: [
    {
      id: 'math-1',
      code: '01',
      title: 'Relations & Functions Types',
      subtitle: 'Bijective & Invertible',
      iconType: 'math',
      xpReward: 25,
      gemsReward: 10,
      testId: '2',
      unit: 1,
      unitTitle: 'Unit 1 • Functions & Calculus',
      themeColor: '#10b981',
    },
    {
      id: 'math-2',
      code: '02',
      title: 'Inverse Trigonometric Functions',
      subtitle: 'Principal Values & Graphs',
      iconType: 'brain',
      xpReward: 30,
      gemsReward: 15,
      testId: '2',
      unit: 1,
      unitTitle: 'Unit 1 • Functions & Calculus',
      themeColor: '#10b981',
    },
    {
      id: 'math-3',
      code: '03',
      title: 'Matrices & Determinants',
      subtitle: 'Adjoint & Inverse Operations',
      iconType: 'math',
      xpReward: 35,
      gemsReward: 20,
      testId: '2',
      unit: 2,
      unitTitle: 'Unit 2 • Linear Algebra',
      themeColor: '#3b82f6',
    },
    {
      id: 'math-boss-1',
      code: '04',
      title: 'Continuity, Differentiability & Derivatives',
      subtitle: 'Chain Rule & Log Differentiation',
      iconType: 'trophy',
      xpReward: 80,
      gemsReward: 40,
      testId: '2',
      isBoss: true,
      unit: 2,
      unitTitle: 'Unit 2 • Calculus Peak',
      themeColor: '#f59e0b',
    },
  ],
  biology: [
    {
      id: 'bio-1',
      code: '01',
      title: 'Sexual Reproduction in Flowering Plants',
      subtitle: 'Microsporogenesis & Pollination',
      iconType: 'dna',
      xpReward: 25,
      gemsReward: 10,
      testId: '4',
      unit: 1,
      unitTitle: 'Unit 1 • Plant Reproduction',
      themeColor: '#10b981',
    },
    {
      id: 'bio-2',
      code: '02',
      title: 'Human Reproduction & Embryogenesis',
      subtitle: 'Gametes & Fertilization',
      iconType: 'dna',
      xpReward: 30,
      gemsReward: 15,
      testId: '4',
      unit: 1,
      unitTitle: 'Unit 1 • Human Reproduction',
      themeColor: '#10b981',
    },
    {
      id: 'bio-boss-1',
      code: '03',
      title: 'Principles of Inheritance & Variation',
      subtitle: 'Mendelian Genetics & Linkage',
      iconType: 'trophy',
      xpReward: 75,
      gemsReward: 35,
      testId: '4',
      isBoss: true,
      unit: 2,
      unitTitle: 'Unit 2 • Genetics & Evolution',
      themeColor: '#f59e0b',
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
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  const nodes = LESSON_PATH[activeSubject] || LESSON_PATH.physics;

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
    router.push(`/test/${node.testId}?nodeId=${node.id}&subject=${activeSubject}&title=${encodeURIComponent(node.title)}`);
  };

  // Winding Coordinates
  const CONTAINER_WIDTH = 340;
  const ROW_HEIGHT = 160;
  const Y_OFFSET = 70;

  const getNodePoint = (index: number): Point => {
    const y = Y_OFFSET + index * ROW_HEIGHT;
    if (index === 0) return { x: 170, y };
    const mod = index % 2;
    const x = mod === 1 ? 75 : 265;
    return { x, y };
  };

  const nodePoints: Point[] = nodes.map((_, i) => getNodePoint(i));
  const totalTrackHeight = Y_OFFSET + (nodes.length - 1) * ROW_HEIGHT + 110;

  const getElbowPath = (p1: Point, p2: Point, r: number = 38) => {
    if (p1.x === p2.x) {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    }
    const midY = (p1.y + p2.y) / 2;
    const isRight = p2.x > p1.x;
    const dir = isRight ? 1 : -1;
    const radius = Math.min(r, Math.abs(p2.x - p1.x) / 2, Math.abs(midY - p1.y) / 2);

    return [
      `M ${p1.x} ${p1.y}`,
      `L ${p1.x} ${midY - radius}`,
      `Q ${p1.x} ${midY} ${p1.x + dir * radius} ${midY}`,
      `L ${p2.x - dir * radius} ${midY}`,
      `Q ${p2.x} ${midY} ${p2.x} ${midY + radius}`,
      `L ${p2.x} ${p2.y}`,
    ].join(' ');
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
    <div className="w-full min-h-screen bg-[#9574ea] text-slate-900 pb-36 font-sans select-none relative overflow-hidden">
      
      {/* ─── Atmospheric Dreamy Lavender Background Canvas with Cloud Hills ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#9e7df1] via-[#9472e9] to-[#8660dd] pointer-events-none" />

      {/* Floating Cloud Silhouettes in Background */}
      <div className="absolute top-28 -left-20 w-80 h-32 rounded-full bg-[#8b65e2]/40 blur-sm pointer-events-none" />
      <div className="absolute top-96 -right-20 w-96 h-40 rounded-full bg-[#825cd9]/45 blur-sm pointer-events-none" />
      <div className="absolute top-[680px] -left-10 w-80 h-36 rounded-full bg-[#825cd9]/50 blur-sm pointer-events-none" />
      <div className="absolute top-[1020px] right-0 w-88 h-40 rounded-full bg-[#784ecc]/50 blur-sm pointer-events-none" />

      {/* Twinkling Dream Stars */}
      <div className="absolute top-16 left-12 text-white/35 text-xs font-black pointer-events-none animate-pulse">✦</div>
      <div className="absolute top-44 right-16 text-white/40 text-sm font-black pointer-events-none animate-pulse">✦</div>
      <div className="absolute top-80 left-8 text-white/30 text-xs font-black pointer-events-none">✦</div>
      <div className="absolute top-[520px] right-10 text-white/35 text-sm font-black pointer-events-none">✦</div>
      <div className="absolute top-[720px] left-16 text-white/40 text-xs font-black pointer-events-none animate-pulse">✦</div>
      <div className="absolute top-[920px] right-20 text-white/35 text-sm font-black pointer-events-none">✦</div>

      {/* Circus Tent on the Left */}
      <div className="absolute top-52 -left-6 w-32 h-32 pointer-events-none opacity-90 z-0 select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path d="M50 15 L15 55 L85 55 Z" fill="#f3e8ff" stroke="#c084fc" strokeWidth="2" />
          <path d="M50 15 L35 55 L65 55 Z" fill="#fed7aa" />
          <path d="M50 15 L50 6 L64 10 L50 15" fill="#f59e0b" />
          <path d="M18 55 L82 55 L82 85 L18 85 Z" fill="#faf5ff" stroke="#c084fc" strokeWidth="2" />
          <path d="M40 85 C40 70 60 70 60 85 Z" fill="#7e22ce" />
        </svg>
      </div>

      {/* Gift Box with Balloons on the Right */}
      <div className="absolute top-[470px] right-2 w-28 h-36 pointer-events-none opacity-90 z-0 select-none">
        <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
          <ellipse cx="35" cy="30" rx="16" ry="20" fill="#fef08a" />
          <ellipse cx="65" cy="25" rx="16" ry="20" fill="#fbcfe8" />
          <ellipse cx="50" cy="42" rx="16" ry="20" fill="#fed7aa" />
          <path d="M35 50 Q45 65 50 80" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M65 45 Q55 65 50 80" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />
          <rect x="25" y="80" width="50" height="42" rx="6" fill="#d8b4fe" stroke="#a855f7" strokeWidth="2" />
          <rect x="20" y="75" width="60" height="14" rx="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2" />
          <rect x="44" y="75" width="12" height="47" fill="#fde047" />
        </svg>
      </div>

      {/* Candy Cane on the Bottom Left */}
      <div className="absolute top-[780px] left-3 w-20 h-28 pointer-events-none opacity-85 z-0 select-none">
        <svg viewBox="0 0 60 90" className="w-full h-full drop-shadow-sm">
          <path d="M20 80 L20 30 C20 10 50 10 50 30" stroke="#f472b6" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M20 80 L20 30 C20 10 50 10 50 30" stroke="#ffffff" strokeWidth="8" strokeDasharray="6 8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Rocking Unicorn on the Top Right */}
      <div className="absolute top-24 right-4 w-28 h-28 pointer-events-none opacity-90 z-0 select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <path d="M20 75 Q50 85 80 75" stroke="#fde047" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M35 75 L45 45 L65 45 L70 75" fill="#f3e8ff" stroke="#c084fc" strokeWidth="2" />
          <circle cx="42" cy="35" r="14" fill="#fbcfe8" />
        </svg>
      </div>

      {/* ─── Top Subject Navigation Header ─── */}
      <div className="relative z-20 max-w-md mx-auto px-4 pt-3 pb-1">
        
        {/* Subject Segmented Pills */}
        <div className="bg-white/85 backdrop-blur-md p-1.5 rounded-2xl border-2 border-white/60 shadow-md flex items-center justify-between gap-1 overflow-x-auto no-scrollbar mb-3">
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
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap text-center ${
                  isSel
                    ? 'bg-[#7c3aed] text-white shadow-sm scale-[1.02]'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Current Active Unit Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border-2 border-b-4 border-white/80 shadow-lg relative overflow-hidden flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-violet-100 text-[#6d28d9] px-2.5 py-0.5 rounded-full border border-violet-200">
                {user.classLevel || 'Class 12'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {progressPercent}% Complete
              </span>
            </div>

            <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 truncate">
              {currentActiveNode.unitTitle}
            </h2>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Next: <span className="font-bold text-slate-800">{currentActiveNode.title}</span>
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] to-emerald-500 rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${Math.max(progressPercent, 8)}%` }}
              />
            </div>
          </div>

          {/* Mascot Graphic */}
          <div className="w-14 sm:w-16 shrink-0 flex items-center justify-center">
            <img
              src="/images/trophy_cat.png"
              alt="Mascot"
              className="w-full h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform"
            />
          </div>
        </div>

      </div>

      {/* ─── The Winding Road Canvas with Dashed Center Markings (Exact Reference) ─── */}
      <div
        className="w-full max-w-[340px] sm:max-w-[360px] mx-auto relative mt-3 z-10"
        style={{ height: `${totalTrackHeight}px` }}
      >
        {/* SVG Road Pathway */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox={`0 0 ${CONTAINER_WIDTH} ${totalTrackHeight}`}
        >
          {/* Broad Translucent White Road Ribbon (Exact Screenshot) */}
          {nodes.slice(0, -1).map((node, index) => {
            const p1 = nodePoints[index];
            const p2 = nodePoints[index + 1];
            const d = getElbowPath(p1, p2, 42);

            return (
              <path
                key={`road-base-${node.id}`}
                d={d}
                fill="none"
                stroke="rgba(255, 255, 255, 0.28)"
                strokeWidth="56"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Road Surface */}
          {nodes.slice(0, -1).map((node, index) => {
            const p1 = nodePoints[index];
            const p2 = nodePoints[index + 1];
            const d = getElbowPath(p1, p2, 42);

            return (
              <path
                key={`road-surface-${node.id}`}
                d={d}
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Dashed Center Road Line (Exact Screenshot) */}
          {nodes.slice(0, -1).map((node, index) => {
            const p1 = nodePoints[index];
            const p2 = nodePoints[index + 1];
            const d = getElbowPath(p1, p2, 42);

            return (
              <path
                key={`road-dash-${node.id}`}
                d={d}
                fill="none"
                stroke="rgba(147, 112, 230, 0.65)"
                strokeWidth="3.5"
                strokeDasharray="9 9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </svg>

        {/* ─── 3D Stepping Nodes Layer ─── */}
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

      {/* ─── Interactive Node Lesson Detail Popup Sheet ─── */}
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
              {selectedNode.subtitle}. Complete this checkpoint test to earn gems and advance your streak.
            </p>

            {/* Rewards Strip */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <XpBoltIcon size={20} />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Reward</span>
                  <span className="text-xs font-black text-slate-800">+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <GemIcon size={20} />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Gems</span>
                  <span className="text-xs font-black text-slate-800">+{selectedNode.gemsReward} Gems</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={() => startLesson(selectedNode)}
              className="w-full py-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{user.completedNodes[selectedNode.id] ? 'Practice Again' : 'Start Lesson Test'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
