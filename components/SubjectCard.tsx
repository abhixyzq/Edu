'use client';

import React from 'react';
import Link from 'next/link';
import { Subject } from '@/lib/mockData';

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link href={`/subjects/${subject.id}`}>
      <div className="card-outline rounded-xl p-4 md:p-5 flex flex-col gap-3 cursor-pointer group hover:border-[#9b4500] hover:shadow-md transition-all duration-200 bg-white">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-lg ${subject.bgColor} flex items-center justify-center ${subject.color} group-hover:scale-110 transition-transform duration-200`}>
            <span className="material-symbols-outlined">{subject.icon}</span>
          </div>
          <span className="text-xs font-bold text-[#564338] bg-[#eef5f7] px-2 py-0.5 rounded-full border border-[#dde4e6]">
            {subject.progress}%
          </span>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[#161d1f] group-hover:text-[#9b4500] transition-colors">
            {subject.name}
          </h3>
          <p className="text-xs text-[#564338] mt-0.5">
            {subject.chaptersCount} Chapters • {subject.topics[0]}
          </p>
        </div>

        <div className="w-full bg-[#e8eff1] h-2 rounded-full overflow-hidden mt-1 border border-[#dde4e6]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              subject.progress >= 75
                ? 'bg-[#9b4500]'
                : subject.progress >= 50
                ? 'bg-[#3a6a00]'
                : 'bg-[#0060ac]'
            }`}
            style={{ width: `${subject.progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
};
