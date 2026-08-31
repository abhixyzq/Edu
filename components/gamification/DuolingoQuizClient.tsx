'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useUser } from '@/context/UserContext';
import { MOCK_QUESTIONS, Question } from '@/lib/mockData';
import {
  playCorrectChime,
  playIncorrectThud,
  playButtonClick,
  playStreakFlame,
  playLevelUpFanfare,
} from '@/lib/soundEffects';
import { Scratchpad } from './Scratchpad';
import { Mascot, MascotMood } from './Mascot';

import { HeartLifeIcon, StreakFlameIcon, GemIcon, XpBoltIcon } from '@/components/icons/AppIcons';

export function DuolingoQuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nodeId = searchParams?.get('nodeId') || 'phy-1';
  const lessonTitle = searchParams?.get('title') || 'Class 12 Concept Quiz';
  const subjectId = searchParams?.get('subject') || 'physics';

  const { user, addXP, addGems, deductHeart, refillHearts, completeNode, toggleSound } = useUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [comboStreak, setComboStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [screenShake, setScreenShake] = useState(false);

  // Lesson Questions (use mock questions or subset)
  const questions: Question[] = MOCK_QUESTIONS;
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + (isAnswerChecked && isCorrect ? 1 : 0)) / questions.length) * 100;

  // Handle Option Select
  const handleSelectOption = (key: string) => {
    if (isAnswerChecked) return;
    playButtonClick();
    setSelectedKey(key);
  };

  // Handle Check Button
  const handleCheck = () => {
    if (!selectedKey || isAnswerChecked) return;

    const correct = selectedKey === currentQ.correctAnswer;
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playCorrectChime();
      const nextCombo = comboStreak + 1;
      setComboStreak(nextCombo);
      setCorrectCount((prev) => prev + 1);
      setMascotMood('cheering');

      if (nextCombo >= 2) {
        setTimeout(() => playStreakFlame(nextCombo), 300);
      }
    } else {
      playIncorrectThud();
      setComboStreak(0);
      setMascotMood('thinking');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      const hasHeartsLeft = deductHeart();
      if (!hasHeartsLeft && !user.infiniteHeartsUntil) {
        setTimeout(() => setShowOutOfHeartsModal(true), 800);
      }
    }
  };

  // Handle Continue to next question or completion
  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedKey(null);
      setIsAnswerChecked(false);
      setMascotMood('idle');
    } else {
      // Completed lesson
      finishLesson();
    }
  };

  // Finish Lesson & Award XP/Gems
  const finishLesson = () => {
    setIsFinished(true);
    playLevelUpFanfare();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const earnedXP = 30 + correctCount * 5;
    const earnedGems = 15;
    addXP(earnedXP);
    addGems(earnedGems);

    const stars = correctCount === questions.length ? 3 : correctCount >= questions.length / 2 ? 2 : 1;
    const score = Math.round((correctCount / questions.length) * 100);

    completeNode(nodeId, stars, score, `phy-${parseInt(nodeId.replace('phy-', ''), 10) + 1 || 2}`);
  };

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (!isAnswerChecked) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleSelectOption('A');
        if (e.key === '2' || e.key.toLowerCase() === 'b') handleSelectOption('B');
        if (e.key === '3' || e.key.toLowerCase() === 'c') handleSelectOption('C');
        if (e.key === '4' || e.key.toLowerCase() === 'd') handleSelectOption('D');
        if (e.key === 'Enter' && selectedKey) handleCheck();
      } else {
        if (e.key === 'Enter') handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKey, isAnswerChecked]);

  // If Finished, render the Victory Screen
  if (isFinished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[#f4fafd] flex flex-col items-center justify-between p-6 sm:p-10 font-sans">
        <div className="w-full max-w-md flex flex-col items-center text-center my-auto">
          <Mascot mood="cheering" size={140} speechText="Brilliant Mastery! 🌟" />

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#161d1f] mt-4">
            Lesson Completed!
          </h1>
          <p className="text-sm text-[#564338] mt-1 font-semibold">
            You conquered <span className="text-[#9b4500] font-bold">{lessonTitle}</span>
          </p>

          {/* Reward Badges Grid */}
          <div className="grid grid-cols-3 gap-3 w-full mt-6">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#ffd700] shadow-sm flex flex-col items-center">
              <XpBoltIcon size={32} className="mb-1" />
              <span className="text-lg font-black text-[#9b4500]">+{30 + correctCount * 5}</span>
              <span className="text-[10px] font-bold text-[#897266] uppercase">XP Earned</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#0060ac] shadow-sm flex flex-col items-center">
              <GemIcon size={32} className="mb-1" />
              <span className="text-lg font-black text-[#0060ac]">+15</span>
              <span className="text-[10px] font-bold text-[#897266] uppercase">Gems</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#58cc02] shadow-sm flex flex-col items-center">
              <span className="material-symbols-outlined text-[30px] text-[#58cc02] mb-1">target</span>
              <span className="text-lg font-black text-[#58cc02]">{accuracy}%</span>
              <span className="text-[10px] font-bold text-[#897266] uppercase">Accuracy</span>
            </div>
          </div>

          {/* Streak Boost Card */}
          <div className="w-full bg-[#ffdbc9]/70 border border-[#ff8c42] rounded-2xl p-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StreakFlameIcon size={36} className="animate-bounce" />
              <div className="text-left">
                <p className="text-xs font-black text-[#6a2d00]">{user.streakDays} Day Streak Active!</p>
                <p className="text-[10px] text-[#564338]">Consistent daily practice boosts exam retention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold text-base border-b-6 border-[#388401] active:border-b-0 active:translate-y-1.5 transition-all shadow-lg cursor-pointer tracking-wider uppercase"
          >
            Continue to Quest Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 w-full h-[100dvh] max-h-[100dvh] bg-white flex flex-col justify-between overflow-hidden font-sans select-none ${screenShake ? 'animate-shake' : ''}`}>
      {/* ─── Top Duolingo Header ─── */}
      <header className="shrink-0 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 border-b border-[#dde4e6] bg-white z-30">
        {/* Exit Button */}
        <Link
          href="/"
          className="p-2 text-[#564338] hover:text-[#161d1f] hover:bg-[#e8eff1] rounded-full transition-colors"
          title="Exit lesson"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>

        {/* Dynamic Animated Progress Bar */}
        <div className="flex-1 max-w-xl mx-2 bg-[#e8eff1] h-3.5 rounded-full overflow-hidden border border-[#dde4e6]">
          <div
            className="bg-[#58cc02] h-full rounded-full transition-all duration-300 relative"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          >
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Tools & Counters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scratchpad Button */}
          <button
            type="button"
            onClick={() => setScratchpadOpen(true)}
            className="flex items-center gap-1 bg-[#f4fafd] hover:bg-[#e8eff1] text-[#9b4500] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#dde4e6] text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
            title="Open Rough Sheet Canvas"
          >
            <span className="material-symbols-outlined text-[18px]">draw</span>
            <span className="hidden sm:inline">Rough Sheet</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl text-[#564338] hover:bg-[#e8eff1] transition-colors"
            title={user.soundMuted ? 'Unmute audio' : 'Mute audio'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {user.soundMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Hearts Indicator */}
          <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-2.5 sm:px-3 py-1 rounded-xl font-black text-xs sm:text-sm border border-[#ffb4ab]">
            <HeartLifeIcon size={20} className="animate-pulse" />
            <span>{user.infiniteHeartsUntil && Date.now() < user.infiniteHeartsUntil ? '∞' : user.hearts}</span>
          </div>
        </div>
      </header>

      {/* ─── Main Scrollable Question Body ─── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex flex-col justify-start">
        {/* Question Type & Combo Badge */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#ffdbc9] text-[#9b4500] border border-[#ff8c42]/30">
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            Question {currentIndex + 1} of {questions.length}
          </span>

          {comboStreak >= 2 && (
            <span className="inline-flex items-center gap-1 text-xs font-black text-[#ff8c42] animate-bounce">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              {comboStreak} In A Row!
            </span>
          )}
        </div>

        {/* Question Statement */}
        <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#161d1f] leading-snug mb-6">
          {currentQ.questionText}
        </h2>

        {/* Options Grid (Tactile 3D Buttons) */}
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5 mb-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            let optStyle = 'bg-white border-[#dde4e6] hover:bg-[#f4fafd] text-[#161d1f] border-b-4';

            if (isSelected) {
              optStyle = 'bg-[#d4e3ff] border-[#0060ac] text-[#0060ac] border-b-4 ring-2 ring-[#0060ac]/30';
            }

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectOption(opt.key)}
                disabled={isAnswerChecked}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-sm sm:text-base flex items-center justify-between transition-all duration-150 active:border-b-0 active:translate-y-1 cursor-pointer shadow-xs ${optStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border ${
                      isSelected
                        ? 'bg-[#0060ac] text-white border-[#0060ac]'
                        : 'bg-[#f4fafd] text-[#564338] border-[#dde4e6]'
                    }`}
                  >
                    {opt.key}
                  </div>
                  <span className="leading-relaxed">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* ─── Bottom Action Bar / Fixed Sticky Dock ─── */}
      <footer
        className={`sticky bottom-0 z-30 w-full border-t transition-all duration-300 py-4 sm:py-5 px-4 sm:px-8 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.06)] ${
          !isAnswerChecked
            ? 'bg-white border-slate-200'
            : isCorrect
            ? 'bg-[#d7ffb8] border-[#58cc02] text-[#2b6401]'
            : 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Status Message & Feedback when answered */}
          {!isAnswerChecked ? (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Press <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md font-bold text-slate-700">1-4</kbd> or click to choose answer</span>
            </div>
          ) : (
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                  isCorrect ? 'bg-[#58cc02]' : 'bg-[#ba1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[26px] font-black">
                  {isCorrect ? 'check' : 'close'}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg">
                  {isCorrect ? 'Nicely Done!' : 'Correct Solution:'}
                </h3>
                {!isCorrect && (
                  <p className="text-xs text-slate-700 font-medium mt-0.5 line-clamp-2 max-w-md">
                    {currentQ.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Button (Full width on mobile, prominent 3D tactile button) */}
          {!isAnswerChecked ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={!selectedKey}
              className={`w-full sm:w-auto sm:min-w-[160px] h-13 sm:h-14 px-8 rounded-2xl font-black text-base border-b-4 active:border-b-0 active:translate-y-1 transition-all duration-150 tracking-wider uppercase shadow-md flex items-center justify-center cursor-pointer ${
                selectedKey
                  ? 'bg-[#58cc02] hover:bg-[#4cb802] text-white border-[#388401] shadow-[#58cc02]/25'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              Check
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className={`w-full sm:w-auto sm:min-w-[160px] h-13 sm:h-14 px-8 rounded-2xl font-black text-base border-b-4 active:border-b-0 active:translate-y-1 transition-all duration-150 tracking-wider uppercase shadow-md flex items-center justify-center cursor-pointer ${
                isCorrect
                  ? 'bg-[#58cc02] hover:bg-[#4cb802] text-white border-[#388401] shadow-[#58cc02]/30'
                  : 'bg-[#ef4444] hover:bg-[#dc2626] text-white border-[#b91c1c] shadow-[#ef4444]/30'
              }`}
            >
              Continue
            </button>
          )}
        </div>
      </footer>

      {/* Digital Rough Sheet (Canvas Scratchpad) */}
      <Scratchpad isOpen={scratchpadOpen} onClose={() => setScratchpadOpen(false)} />

      {/* Out of Hearts Modal */}
      {showOutOfHeartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-2 border-[#dde4e6]">
            <Mascot mood="crying_funny" size={100} speechText="Out of Hearts!" />
            <h3 className="font-heading text-xl font-extrabold text-[#161d1f] mt-3">
              Need More Hearts?
            </h3>
            <p className="text-xs text-[#564338] mt-1 mb-5">
              Refill full 5 hearts with Gems, or practice in Zen Mode without penalties.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  refillHearts();
                  setShowOutOfHeartsModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-[#58cc02] text-white font-extrabold text-xs border-b-4 border-[#388401] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                Refill 5 Hearts
              </button>

              <button
                type="button"
                onClick={() => setShowOutOfHeartsModal(false)}
                className="w-full py-2.5 rounded-2xl bg-white border border-[#dde4e6] text-[#564338] font-bold text-xs hover:bg-[#e8eff1] cursor-pointer"
              >
                Practice Without Hearts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
