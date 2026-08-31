'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PathNode, NodeStatus } from './PathNode';
import { Mascot } from './Mascot';
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
    { id: 'phy-1', number: 1, title: 'Coulomb Force', subtitle: 'Vectors & Charges', icon: 'bolt', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: 'Unit 1: Electrostatics' },
    { id: 'phy-2', number: 2, title: 'Electric Fields', subtitle: 'Dipoles & Lines', icon: 'psychology', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: 'Unit 1: Electrostatics' },
    { id: 'phy-3', number: 3, title: 'Gauss Law & Flux', subtitle: 'Surface Integrals', icon: 'all_inclusive', xpReward: 30, gemsReward: 15, testId: '2', unit: 1, unitTitle: 'Unit 1: Electrostatics' },
    { id: 'phy-4', number: 4, title: 'Electrostatic Potential', subtitle: 'Work & Energy', icon: 'energy_savings_leaf', xpReward: 30, gemsReward: 15, testId: '2', unit: 1, unitTitle: 'Unit 1: Electrostatics' },
    { id: 'phy-boss-1', number: 5, title: 'Unit 1 Mastery Boss', subtitle: '40 Marks Exam Drill', icon: 'military_tech', xpReward: 60, gemsReward: 30, testId: '1', isBoss: true, unit: 1, unitTitle: 'Unit 1: Electrostatics' },

    { id: 'phy-5', number: 6, title: 'Current & Drift Speed', subtitle: 'Ohm Law Rigor', icon: 'offline_bolt', xpReward: 25, gemsReward: 10, testId: '2', unit: 2, unitTitle: 'Unit 2: Current Electricity' },
    { id: 'phy-6', number: 7, title: 'Kirchhoff Laws', subtitle: 'Loop & Junction Rules', icon: 'schema', xpReward: 30, gemsReward: 15, testId: '2', unit: 2, unitTitle: 'Unit 2: Current Electricity' },
    { id: 'phy-7', number: 8, title: 'Potentiometer & Meter Bridge', subtitle: 'Null Deflection Drills', icon: 'tune', xpReward: 30, gemsReward: 15, testId: '1', unit: 2, unitTitle: 'Unit 2: Current Electricity' },
    { id: 'phy-boss-2', number: 9, title: 'Current Electricity Boss', subtitle: 'Full Unit Challenge', icon: 'military_tech', xpReward: 60, gemsReward: 30, testId: '2', isBoss: true, unit: 2, unitTitle: 'Unit 2: Current Electricity' },
  ],
  chemistry: [
    { id: 'chem-1', number: 1, title: 'Solutions & Raoult Law', subtitle: 'Colligative Properties', icon: 'science', xpReward: 25, gemsReward: 10, testId: '3', unit: 1, unitTitle: 'Unit 1: Physical Chemistry' },
    { id: 'chem-2', number: 2, title: 'Electrochemistry', subtitle: 'Nernst Equation', icon: 'battery_charging_full', xpReward: 30, gemsReward: 15, testId: '3', unit: 1, unitTitle: 'Unit 1: Physical Chemistry' },
    { id: 'chem-3', number: 3, title: 'Chemical Kinetics', subtitle: 'Arrhenius Equation & Rates', icon: 'timer', xpReward: 30, gemsReward: 15, testId: '3', unit: 1, unitTitle: 'Unit 1: Physical Chemistry' },
    { id: 'chem-boss-1', number: 4, title: 'Physical Chem Boss', subtitle: 'Numerical Gauntlet', icon: 'military_tech', xpReward: 60, gemsReward: 30, testId: '3', isBoss: true, unit: 1, unitTitle: 'Unit 1: Physical Chemistry' },
    { id: 'chem-4', number: 5, title: 'Haloalkanes & Haloarenes', subtitle: 'SN1 vs SN2 Mechanisms', icon: 'biotech', xpReward: 25, gemsReward: 10, testId: '3', unit: 2, unitTitle: 'Unit 2: Organic Chemistry' },
  ],
  mathematics: [
    { id: 'math-1', number: 1, title: 'Matrices & Determinants', subtitle: 'Inverse & Properties', icon: 'grid_view', xpReward: 25, gemsReward: 10, testId: '4', unit: 1, unitTitle: 'Unit 1: Algebra & Vectors' },
    { id: 'math-2', number: 2, title: 'Continuity & Differentiability', subtitle: 'Chain Rule Mastery', icon: 'show_chart', xpReward: 30, gemsReward: 15, testId: '4', unit: 1, unitTitle: 'Unit 1: Algebra & Vectors' },
    { id: 'math-3', number: 3, title: 'Indefinite Integrals', subtitle: 'Substitution & By Parts', icon: 'functions', xpReward: 35, gemsReward: 20, testId: '4', unit: 2, unitTitle: 'Unit 2: Calculus Dominance' },
    { id: 'math-boss-1', number: 4, title: 'Calculus Boss Exam', subtitle: 'Definite Integrals & Areas', icon: 'military_tech', xpReward: 70, gemsReward: 35, testId: '4', isBoss: true, unit: 2, unitTitle: 'Unit 2: Calculus Dominance' },
  ],
  biology: [
    { id: 'bio-1', number: 1, title: 'Sexual Reproduction', subtitle: 'Flowering Plants', icon: 'eco', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: 'Unit 1: Reproduction' },
    { id: 'bio-2', number: 2, title: 'Human Reproduction', subtitle: 'Gametogenesis & Hormones', icon: 'favorite', xpReward: 25, gemsReward: 10, testId: '1', unit: 1, unitTitle: 'Unit 1: Reproduction' },
    { id: 'bio-boss-1', number: 3, title: 'Reproduction Unit Boss', subtitle: 'High-Yield Diagrams', icon: 'military_tech', xpReward: 60, gemsReward: 30, testId: '1', isBoss: true, unit: 1, unitTitle: 'Unit 1: Reproduction' },
  ],
};

// Zigzag horizontal offsets for authentic Duolingo curve feel
const ZIGZAG_OFFSETS = [
  'translate-x-0',
  'translate-x-8 sm:translate-x-12',
  'translate-x-16 sm:translate-x-20',
  'translate-x-8 sm:translate-x-12',
  'translate-x-0',
  '-translate-x-8 sm:-translate-x-12',
  '-translate-x-16 sm:-translate-x-20',
  '-translate-x-8 sm:-translate-x-12',
];

interface LearningPathProps {
  initialSubject?: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({ initialSubject = 'physics' }) => {
  const router = useRouter();
  const { user } = useUser();
  const [activeSubject, setActiveSubject] = useState(initialSubject);

  const nodes = LESSON_PATH[activeSubject] || LESSON_PATH.physics;

  const getNodeStatus = (node: LessonNode, index: number): NodeStatus => {
    if (user.completedNodes[node.id]) {
      return 'completed';
    }
    if (user.unlockedNodes.includes(node.id)) {
      return 'active';
    }
    // If it's the first node of a subject, make it active
    if (index === 0) return 'active';
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Subject Switcher Tabs */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2 px-1 mb-6">
        {SUBJECTS.map((s) => {
          const isSel = activeSubject === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSubject(s.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer shadow-xs ${
                isSel
                  ? 'bg-[#9b4500] text-white border-[#6a2d00] shadow-md scale-105'
                  : 'bg-white text-[#564338] border-[#dde4e6] hover:bg-[#ffdbc9]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Learning Path */}
      <div className="w-full max-w-md flex flex-col items-center pb-12">
        {units.map((unitGroup, uIdx) => (
          <div key={unitGroup.unit} className="w-full flex flex-col items-center mb-8">
            {/* Unit Milestone Banner */}
            <div className="w-full bg-gradient-to-r from-[#ff8c42] to-[#ba5600] text-white rounded-3xl p-4 sm:p-5 shadow-lg flex items-center justify-between mb-8 border-b-4 border-[#823b00] relative overflow-hidden">
              <div className="z-10">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#ffdbc9]">
                  {activeSubject.toUpperCase()} PATH
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-extrabold">{unitGroup.title}</h3>
                <p className="text-xs text-[#ffdbc9] mt-0.5">
                  Complete all {unitGroup.nodes.length} nodes to claim the Unit Crown!
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 z-10">
                <span className="material-symbols-outlined text-[28px]">trophy</span>
              </div>
              {/* Background decorative circles */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
            </div>

            {/* Nodes Chain */}
            <div className="relative flex flex-col items-center w-full">
              {unitGroup.nodes.map((node, nIdx) => {
                const globalIndex = uIdx * 4 + nIdx;
                const status = getNodeStatus(node, globalIndex);
                const offsetCls = ZIGZAG_OFFSETS[globalIndex % ZIGZAG_OFFSETS.length];
                const stars = user.completedNodes[node.id]?.stars || 0;

                return (
                  <div key={node.id} className={`flex flex-col items-center transition-all ${offsetCls}`}>
                    {/* If Active node, render Mascot cheering above it! */}
                    {status === 'active' && (
                      <div className="mb-[-10px] z-20">
                        <Mascot mood="happy" size={75} speechText="Let's crush this!" />
                      </div>
                    )}

                    <PathNode
                      id={node.id}
                      number={node.number}
                      title={node.title}
                      subtitle={node.subtitle}
                      icon={node.icon}
                      status={status}
                      stars={stars}
                      xpReward={node.xpReward}
                      gemsReward={node.gemsReward}
                      isBoss={node.isBoss}
                      onClick={() => handleNodeClick(node)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
