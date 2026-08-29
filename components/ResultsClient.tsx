'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTest } from '@/context/TestContext';

export function ResultsClient() {
  const { questions, selectedAnswers, score, resetTest } = useTest();
  const [filterTab, setFilterTab] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  const filteredQuestions = questions.filter((q) => {
    const userAns = selectedAnswers[q.id];
    if (filterTab === 'correct') return userAns === q.correctAnswer;
    if (filterTab === 'incorrect') return userAns && userAns !== q.correctAnswer;
    if (filterTab === 'unattempted') return !userAns;
    return true;
  });

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16 font-sans">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-[#564338] mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href="/results" className="hover:underline">Test Results</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-semibold text-[#161d1f]">Score Analysis</span>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-[#161d1f] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9b4500]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-[#ffdbc9] text-[#9b4500] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Official Assessment Completed
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
              Performance Summary
            </h1>
            <p className="text-xs text-[#dde4e6] max-w-md">
              Review your question breakdown, correct answers, and explanation keys below.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#1c2528] border border-[#564338]/40 p-4 px-6 rounded-2xl">
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-extrabold text-[#ff8c42]">
                {score.accuracyPercent}%
              </span>
              <p className="text-[11px] text-[#dde4e6] font-semibold mt-1">Final Score</p>
            </div>
            <div className="h-10 w-px bg-[#564338]/40" />
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold text-emerald-400">
                {score.correctCount}/{questions.length}
              </span>
              <p className="text-[11px] text-[#dde4e6] font-semibold mt-1">Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
              filterTab === tab
                ? 'bg-[#9b4500] text-white shadow-xs'
                : 'bg-white border border-[#ddc1b3]/60 text-[#564338] hover:bg-[#f4fafd]'
            }`}
          >
            {tab} Questions
          </button>
        ))}
      </div>

      {/* Questions Review List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          const isAttempted = !!userAns;

          return (
            <div
              key={q.id}
              className="bg-white border border-[#ddc1b3]/60 rounded-2xl p-5 shadow-xs transition-all hover:border-[#9b4500]/40"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#f4fafd] text-[#9b4500] font-bold text-xs flex items-center justify-center border border-[#ddc1b3]/40">
                    Q{q.id}
                  </span>
                  <span className="text-xs font-semibold text-[#897266] uppercase tracking-wider">
                    {q.subject || 'Class 12 Prep'}
                  </span>
                </div>
                <div>
                  {!isAttempted ? (
                    <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      Unattempted
                    </span>
                  ) : isCorrect ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Correct
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">cancel</span> Incorrect
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-bold text-[#161d1f] mb-4">{q.questionText}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {q.options.map((opt) => {
                  let optStyle = 'bg-white border-[#ddc1b3]/60 text-[#161d1f]';
                  if (opt.key === q.correctAnswer) {
                    optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                  } else if (opt.key === userAns && !isCorrect) {
                    optStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt.key}. {opt.text}</span>
                      {opt.key === q.correctAnswer && (
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                      )}
                      {opt.key === userAns && !isCorrect && (
                        <span className="material-symbols-outlined text-[16px] text-rose-600">close</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="bg-[#f4fafd] border border-[#ddc1b3]/40 rounded-xl p-3.5 text-xs text-[#564338]">
                  <span className="font-bold text-[#9b4500] block mb-1">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/tests"
          onClick={resetTest}
          className="bg-[#9b4500] hover:bg-[#ff8c42] text-white font-bold text-xs py-3 px-6 rounded-full transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">replay</span>
          Take Another Test
        </Link>
      </div>
    </main>
  );
}
