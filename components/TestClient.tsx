'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTest } from '@/context/TestContext';
import { Timer } from '@/components/Timer';
import { QuestionPalette } from '@/components/QuestionPalette';

export function TestClient() {
  const router = useRouter();
  const {
    questions,
    currentQuestionIndex,
    selectedAnswers,
    markedForReview,
    selectAnswer,
    toggleMarkForReview,
    nextQuestion,
    prevQuestion,
    submitTest,
  } = useTest();

  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const currentQ = questions[currentQuestionIndex];
  const qNumber = currentQuestionIndex + 1;
  const currentSelectedOpt = selectedAnswers[currentQ.id];
  const isMarked = markedForReview.includes(currentQ.id);

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setShowSubmitModal(true);
    } else {
      nextQuestion();
    }
  };

  const confirmFinalSubmit = () => {
    submitTest();
    setShowSubmitModal(false);
    router.push('/results/physics-mock');
  };

  // Keyboard navigation hotkeys for exam taking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if typing inside an input/textarea or if submit modal is open
      if (showSubmitModal) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 'a' || key === '1') {
        if (currentQ?.options[0]) selectAnswer(currentQ.id, currentQ.options[0].key);
      } else if (key === 'b' || key === '2') {
        if (currentQ?.options[1]) selectAnswer(currentQ.id, currentQ.options[1].key);
      } else if (key === 'c' || key === '3') {
        if (currentQ?.options[2]) selectAnswer(currentQ.id, currentQ.options[2].key);
      } else if (key === 'd' || key === '4') {
        if (currentQ?.options[3]) selectAnswer(currentQ.id, currentQ.options[3].key);
      } else if (key === 'arrowright') {
        e.preventDefault();
        handleNext();
      } else if (key === 'arrowleft') {
        e.preventDefault();
        prevQuestion();
      } else if (key === 'm') {
        e.preventDefault();
        toggleMarkForReview(currentQ.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ?.id, showSubmitModal]);

  return (
    <div className="min-h-screen bg-[#f4fafd] text-[#161d1f] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 md:px-6 py-3 bg-white border-b border-[#ddc1b3] sticky top-0 z-40 h-[64px] shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 text-[#161d1f] hover:bg-[#e8eff1] rounded-full transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </Link>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base md:text-lg text-[#9b4500]">
              Physics: Current Electricity
            </span>
            <span className="text-xs text-[#564338]">Class 12 Mid-Term Mock</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Timer />
          <button
            onClick={() => setMobilePaletteOpen(true)}
            className="md:hidden p-2 text-[#9b4500] bg-[#ffdbc9] rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Open Question Palette"
          >
            <span className="material-symbols-outlined text-[22px]">grid_view</span>
          </button>
        </div>
      </header>

      {/* Center Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Question Body */}
        <main className="flex-1 flex flex-col items-center overflow-y-auto p-4 md:p-8 pb-36">
          <div className="w-full max-w-[800px] flex flex-col gap-6 pt-2 md:pt-4">
            {/* Progress Header */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-end w-full">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-[#161d1f]">
                  Question {qNumber}{' '}
                  <span className="text-[#564338] text-base font-normal">
                    / {questions.length}
                  </span>
                </h2>
                <span className="text-xs font-bold text-[#0060ac] bg-[#d4e3ff] px-2.5 py-1 rounded-md border border-[#0060ac]/30">
                  +{currentQ.marks} Marks
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#e2e9ec] rounded-full overflow-hidden border border-[#897266]">
                <div
                  className="h-full bg-[#ff8c42] transition-all duration-300"
                  style={{ width: `${(qNumber / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl p-5 md:p-8 border border-[#161d1f] shadow-[4px_4px_0px_rgba(22,29,31,1)] flex flex-col gap-6 transition-all">
              <div className="text-base md:text-lg text-[#161d1f] leading-relaxed font-medium">
                <p>{currentQ.questionText}</p>
              </div>

              {/* Multiple Choice Options */}
              <div className="flex flex-col gap-3.5 mt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = currentSelectedOpt === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => selectAnswer(currentQ.id, opt.key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left border cursor-pointer transition-all duration-150 active:scale-[0.99] touch-manipulation ${
                        isSelected
                          ? 'border-[#9b4500] bg-[#ffdbc9] shadow-xs'
                          : 'border-[#ddc1b3] bg-white hover:bg-[#eef5f7] hover:border-[#9b4500]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors pointer-events-none ${
                          isSelected ? 'border-[#9b4500] bg-[#9b4500]' : 'border-[#897266]'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white pointer-events-none" />}
                      </div>
                      <span className="font-bold text-sm text-[#161d1f] min-w-[20px] pointer-events-none">
                        {opt.key}.
                      </span>
                      <span className={`text-sm md:text-base flex-1 pointer-events-none ${isSelected ? 'font-bold text-[#6a2d00]' : 'text-[#161d1f]'}`}>
                        {opt.text}
                      </span>
                      <kbd className="hidden md:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#e8eff1] text-[#564338] border border-[#dde4e6] pointer-events-none">
                        {opt.key}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotkey Help Bar for Desktop */}
            <div className="hidden md:flex items-center justify-between text-xs text-[#564338] bg-[#eef5f7] px-4 py-2 rounded-xl border border-[#dde4e6]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#9b4500]">keyboard</span>
                <span>Keyboard Shortcuts:</span>
              </span>
              <div className="flex items-center gap-3 font-medium">
                <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300">1-4</kbd> / <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300">A-D</kbd> Select</span>
                <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300">←</kbd> <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300">→</kbd> Navigate</span>
                <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300">M</kbd> Mark</span>
              </div>
            </div>
          </div>
        </main>

        {/* Desktop Question Palette Sidebar */}
        <aside className="hidden md:flex flex-col w-[320px] shrink-0 border-l border-[#ddc1b3] bg-white">
          <QuestionPalette onRequestSubmit={() => setShowSubmitModal(true)} />
        </aside>
      </div>

      {/* Mobile Question Palette Drawer */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden" onClick={() => setMobilePaletteOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <QuestionPalette
              onCloseMobile={() => setMobilePaletteOpen(false)}
              onRequestSubmit={() => {
                setMobilePaletteOpen(false);
                setShowSubmitModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Custom Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border-2 border-[#161d1f] shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdbc9] flex items-center justify-center text-[#9b4500] shrink-0">
                <span className="material-symbols-outlined text-[28px]">help_outline</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-[#161d1f]">Submit Test?</h3>
                <p className="text-xs text-[#564338] mt-0.5">
                  Are you sure you want to finish and submit your answers?
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f4fafd] border border-[#ddc1b3] text-xs text-[#564338] flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-bold text-[#3a6a00]">{Object.keys(selectedAnswers).length || 1} / 30</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <span className="font-bold text-[#0060ac]">{markedForReview.length}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-full border border-[#897266] text-[#161d1f] font-bold text-sm hover:bg-[#e8eff1] transition-colors"
              >
                Keep Answering
              </button>
              <button
                type="button"
                onClick={confirmFinalSubmit}
                className="flex-1 py-3 rounded-full bg-[#ba1a1a] text-white font-bold text-sm hover:bg-[#93000a] transition-all shadow-md active:scale-95"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Navigation Bar */}
      <footer className="fixed bottom-0 left-0 w-full md:w-[calc(100%-320px)] bg-white border-t border-[#ddc1b3] p-4 md:px-8 md:py-4 flex justify-between items-center z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-5 py-2.5 rounded-full border border-[#9b4500] text-[#9b4500] font-bold text-sm hover:bg-[#ffdbc9]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 active:scale-95 touch-manipulation"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Previous
        </button>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => toggleMarkForReview(currentQ.id)}
            className={`hidden sm:flex px-5 py-2.5 rounded-full border text-sm font-bold transition-all items-center gap-2 touch-manipulation ${
              isMarked
                ? 'bg-[#d4e3ff] border-[#0060ac] text-[#001c39]'
                : 'border-[#ddc1b3] text-[#564338] hover:bg-[#e8eff1]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            {isMarked ? 'Marked' : 'Mark for Review'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-2.5 rounded-full bg-[#9b4500] text-white font-bold text-sm hover:bg-[#ff8c42] transition-all shadow-md flex items-center gap-2 active:scale-95 touch-manipulation"
          >
            Save & Next
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
