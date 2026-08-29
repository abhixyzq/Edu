'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTest } from '@/context/TestContext';

export default function ResultsPage() {
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
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-[#564338] mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href="/results" className="hover:underline">Test Results</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-semibold text-[#161d1f]">Physics Mock Scorecard</span>
      </div>

      {/* Main Score Banner */}
      <div className="card-outline rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white via-[#ffdbc9]/20 to-[#f4fafd] border-[#ff8c42] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#ff8c42] flex items-center justify-center text-white font-heading font-bold text-2xl md:text-3xl shadow-lg ring-4 ring-[#ffdbc9]">
            {score.accuracyPercent}%
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#6dbf00]/20 text-[#254700] px-3 py-1 rounded-md text-xs font-bold border border-[#6dbf00]/40 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#3a6a00]">auto_awesome</span>
              Great Performance!
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#161d1f]">
              Physics Mock Test Completed
            </h1>
            <p className="text-sm text-[#564338] mt-1">
              Class 12 Board Prep • {score.obtainedMarks} / {score.totalMarks} Marks
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/test/physics-mock" className="flex-1 md:flex-none">
            <button
              onClick={resetTest}
              className="w-full py-3 px-5 rounded-full border border-[#9b4500] text-[#9b4500] font-bold text-xs md:text-sm hover:bg-[#ffdbc9]/40 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Retake Test
            </button>
          </Link>
          <Link href="/" className="flex-1 md:flex-none">
            <button className="w-full py-3 px-6 rounded-full bg-[#9b4500] text-white font-bold text-xs md:text-sm hover:bg-[#ff8c42] transition-colors shadow-md flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">home</span>
              Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Performance Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-outline rounded-2xl p-4 bg-white">
          <span className="text-xs text-[#564338] font-medium">Accuracy Rate</span>
          <h3 className="font-heading text-2xl font-bold text-[#3a6a00] mt-1">
            {score.accuracyPercent}%
          </h3>
          <p className="text-[11px] text-[#564338] mt-0.5">High precision</p>
        </div>

        <div className="card-outline rounded-2xl p-4 bg-white">
          <span className="text-xs text-[#564338] font-medium">Correct Answers</span>
          <h3 className="font-heading text-2xl font-bold text-[#3a6a00] mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3a6a00]">check_circle</span>
            {score.correctCount}
          </h3>
          <p className="text-[11px] text-[#564338] mt-0.5">+{score.correctCount * 4} Marks</p>
        </div>

        <div className="card-outline rounded-2xl p-4 bg-white">
          <span className="text-xs text-[#564338] font-medium">Incorrect</span>
          <h3 className="font-heading text-2xl font-bold text-[#ba1a1a] mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
            {score.incorrectCount}
          </h3>
          <p className="text-[11px] text-[#564338] mt-0.5">-{score.incorrectCount} Negative</p>
        </div>

        <div className="card-outline rounded-2xl p-4 bg-white">
          <span className="text-xs text-[#564338] font-medium">Unattempted</span>
          <h3 className="font-heading text-2xl font-bold text-[#564338] mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#564338]">help</span>
            {score.unattemptedCount}
          </h3>
          <p className="text-[11px] text-[#564338] mt-0.5">Skipped questions</p>
        </div>
      </div>

      {/* Solutions & Answer Breakdown Section */}
      <div className="card-outline rounded-2xl p-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#ddc1b3] mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#161d1f]">
              Detailed Solutions & Explanations
            </h2>
            <p className="text-xs text-[#564338] mt-0.5">
              Review correct answers and step-by-step physics formulas.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 bg-[#f4fafd] p-1 rounded-xl border border-[#dde4e6]">
            {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterTab === tab
                    ? 'bg-[#9b4500] text-white shadow-xs'
                    : 'text-[#564338] hover:bg-[#e2e9ec]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Question Solutions List */}
        <div className="flex flex-col gap-6">
          {filteredQuestions.map((q, idx) => {
            const userAns = selectedAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isSkipped = !userAns;

            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-[#e0e0e0] bg-[#f4fafd] flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-heading font-bold text-sm text-[#9b4500]">
                    Question {idx + 1}
                  </span>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 bg-[#6dbf00]/20 text-[#254700] px-2.5 py-0.5 rounded-md text-xs font-bold border border-[#6dbf00]/40">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Correct (+4)
                    </span>
                  ) : isSkipped ? (
                    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-gray-300">
                      <span className="material-symbols-outlined text-[16px]">help</span> Skipped (0)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#ffdad6] text-[#93000a] px-2.5 py-0.5 rounded-md text-xs font-bold border border-[#ba1a1a]/30">
                      <span className="material-symbols-outlined text-[16px]">cancel</span> Incorrect (-1)
                    </span>
                  )}
                </div>

                <p className="font-medium text-sm text-[#161d1f] leading-relaxed">
                  {q.questionText}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {q.options.map((opt) => {
                    const isUserChoice = userAns === opt.key;
                    const isRightChoice = q.correctAnswer === opt.key;

                    let bgClass = 'bg-white border-[#ddc1b3] text-[#161d1f]';
                    if (isRightChoice) bgClass = 'bg-[#6dbf00]/20 border-[#3a6a00] text-[#0e2000] font-bold';
                    else if (isUserChoice && !isRightChoice) bgClass = 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]';

                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${bgClass}`}
                      >
                        <span className="font-bold">{opt.key}.</span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-xl bg-white border border-[#ddc1b3] text-xs text-[#564338] flex flex-col gap-1.5">
                  <span className="font-bold text-[#9b4500] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">description</span> Step-by-Step Solution:
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
