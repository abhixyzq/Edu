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
  code: string; // "101", "102", "201", etc.
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
      unitTitle: 'Unit 1 • Electrostatics',
      themeColor: '#10b981', // Emerald Teal
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
      unitTitle: 'Unit 1 • Electrostatics',
      themeColor: '#10b981', // Emerald Teal
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
      unitTitle: 'Unit 2 • Potential & Flux',
      themeColor: '#3b82f6', // Royal Blue
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
      unitTitle: 'Unit 2 • Potential & Flux',
      themeColor: '#3b82f6', // Royal Blue
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
      unitTitle: 'Unit 2 • Potential & Flux',
      themeColor: '#3b82f6', // Royal Blue
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
      unitTitle: 'Unit 3 • Advanced Circuits',
      themeColor: '#8b5cf6', // Violet Purple
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
      unitTitle: 'Unit 3 • Advanced Circuits',
      themeColor: '#f59e0b', // Amber Gold
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
      subtitle: 'Galvanic Cells & EMF',
      iconType: 'flask',
      xpReward: 35,
      gemsReward: 20,
      testId: '3',
      unit: 2,
      unitTitle: 'Unit 2 • Electrochemistry',
      themeColor: '#3b82f6',
    },
  ],
  mathematics: [
    {
      id: 'math-1',
      code: '01',
      title: 'Matrices & Determinants Basics',
      subtitle: 'Operations & Adjoints',
      iconType: 'brain',
      xpReward: 25,
      gemsReward: 10,
      testId: '4',
      unit: 1,
      unitTitle: 'Unit 1 • Algebra & Matrices',
      themeColor: '#10b981',
    },
    {
      id: 'math-2',
      code: '02',
      title: 'Continuity & Differentiability',
      subtitle: 'Chain Rule & Logarithmic Diff',
      iconType: 'math',
      xpReward: 30,
      gemsReward: 15,
      testId: '4',
      unit: 1,
      unitTitle: 'Unit 1 • Algebra & Matrices',
      themeColor: '#10b981',
    },
    {
      id: 'math-3',
      code: '03',
      title: 'Integral Calculus & By Parts',
      subtitle: 'Standard Substitutions',
      iconType: 'math',
      xpReward: 35,
      gemsReward: 20,
      testId: '4',
      unit: 2,
      unitTitle: 'Unit 2 • Calculus Dominance',
      themeColor: '#3b82f6',
    },
  ],
  biology: [
    {
      id: 'bio-1',
      code: '01',
      title: 'Reproduction in Flowering Plants',
      subtitle: 'Pollination & Fertilization',
      iconType: 'brain',
      xpReward: 25,
      gemsReward: 10,
      testId: '1',
      unit: 1,
      unitTitle: 'Unit 1 • Plant Reproduction',
      themeColor: '#10b981',
    },
    {
      id: 'bio-2',
      code: '02',
      title: 'Human Reproduction & Hormones',
      subtitle: 'Gametogenesis Cycle',
      iconType: 'dna',
      xpReward: 30,
      gemsReward: 15,
      testId: '1',
      unit: 1,
      unitTitle: 'Unit 1 • Plant Reproduction',
      themeColor: '#10b981',
    },
    {
      id: 'bio-3',
      code: '03',
      title: 'Principles of Inheritance & Genetics',
      subtitle: 'Mendelian Genetics',
      iconType: 'dna',
      xpReward: 35,
      gemsReward: 20,
      testId: '1',
      unit: 2,
      unitTitle: 'Unit 2 • Genetics',
      themeColor: '#3b82f6',
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

  // Find index of first incomplete node (active level)
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

  // ─── Mathematical Coordinate Calculation Matching the Exact Screenshot ───
  const CONTAINER_WIDTH = 340;
  const ROW_HEIGHT = 160;
  const Y_OFFSET = 70;

  // Exact Winding Pattern:
  // Node 0: Center (170) -> Text on Right
  // Node 1: Left (75)    -> Text on Right
  // Node 2: Right (265)  -> Text on Left
  // Node 3: Left (75)    -> Text on Right
  // Node 4: Right (265)  -> Text on Left
  // Node 5: Left (75)    -> Text on Right
  // Node 6: Right (265)  -> Text on Left
  const getNodePoint = (index: number): Point => {
    const y = Y_OFFSET + index * ROW_HEIGHT;
    if (index === 0) return { x: 170, y };
    const mod = index % 2;
    const x = mod === 1 ? 75 : 265;
    return { x, y };
  };

  const nodePoints: Point[] = nodes.map((_, i) => getNodePoint(i));
  const totalTrackHeight = Y_OFFSET + (nodes.length - 1) * ROW_HEIGHT + 110;

  // ─── Screenshot Rounded Elbow Generator (90-degree curved pipeline) ───
  const getElbowPath = (p1: Point, p2: Point, r: number = 36) => {
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
    <div className="w-full min-h-screen bg-white text-slate-900 pb-36 font-sans select-none">
      
      {/* ─── Top Header (Screenshot Minimalist "Course progress") ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            onClick={() => playButtonClick()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_left</span>
          </Link>

          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Course progress
          </h1>

          <div className="w-8" />
        </div>
      </header>

      {/* ─── Subject Switcher (Clean Minimalist Pills) ─── */}
      <div className="max-w-md mx-auto px-4 mt-3 mb-2 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
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
              className={`py-1 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isSel
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* ─── The Winding Learning Road Canvas ─── */}
      <div
        className="w-full max-w-[340px] sm:max-w-[360px] mx-auto relative mt-2"
        style={{ height: `${totalTrackHeight}px` }}
      >
        {/* SVG Continuous Elbow Path Tracks */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox={`0 0 ${CONTAINER_WIDTH} ${totalTrackHeight}`}
        >
          {nodes.slice(0, -1).map((node, index) => {
            const p1 = nodePoints[index];
            const p2 = nodePoints[index + 1];
            const d = getElbowPath(p1, p2, 34);

            const isSegmentCompleted = index < currentActiveIdx;
            const isSegmentActive = index === currentActiveIdx - 1;
            
            // Color based on unit theme color or soft inactive ice-blue
            let strokeColor = '#dbeafe'; // Default soft pastel ice-blue
            if (isSegmentCompleted) {
              strokeColor = node.themeColor;
            } else if (isSegmentActive) {
              strokeColor = node.themeColor;
            }

            return (
              <path
                key={`segment-${node.id}`}
                d={d}
                fill="none"
                stroke={strokeColor}
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors duration-300"
              />
            );
          })}
        </svg>

        {/* ─── Nodes Layer ─── */}
        {nodes.map((node, index) => {
          const status = getNodeStatus(node, index);
          const isCurrentActive = status === 'active' && index === currentActiveIdx;
          const pt = nodePoints[index];

          // Text side logic:
          // Node 0: Right
          // Node 1 (x=75): Right
          // Node 2 (x=265): Left
          // Node 3 (x=75): Right
          // Node 4 (x=265): Left
          const textSide: 'left' | 'right' = index === 0 ? 'right' : (index % 2 === 1 ? 'right' : 'left');

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
                code={node.code}
                title={node.title}
                subtitle={node.subtitle}
                status={status}
                isBoss={node.isBoss}
                themeColor={node.themeColor}
                iconType={node.iconType}
                textSide={textSide}
                onClick={() => handleNodeClick(node)}
              />
            </div>
          );
        })}

      </div>

      {/* ─── Clean Lesson Launch Sheet / Modal ─── */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200">
            
            <div className="flex items-start justify-between">
              <div>
                <span
                  style={{ color: selectedNode.themeColor }}
                  className="text-xs font-black uppercase tracking-wider"
                >
                  Lesson {selectedNode.code}
                </span>
                <h3 className="font-heading font-black text-lg text-slate-900 mt-1 leading-snug">
                  {selectedNode.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
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

            {/* Reward Badges */}
            <div className="grid grid-cols-2 gap-2 my-5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2">
                <XpBoltIcon size={20} />
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">XP Reward</span>
                  <span className="text-sm font-black text-amber-950">+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 flex items-center gap-2">
                <GemIcon size={20} />
                <div>
                  <span className="text-[10px] font-bold text-cyan-800 uppercase block">Gems</span>
                  <span className="text-sm font-black text-cyan-950">+{selectedNode.gemsReward} 💎</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={() => startLesson(selectedNode)}
              style={{ backgroundColor: selectedNode.themeColor }}
              className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{user.completedNodes[selectedNode.id] ? 'Practice Again' : 'Start Lesson'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
