'use client';

import React from 'react';
import { useTest } from '@/context/TestContext';

interface QuestionPaletteProps {
  onCloseMobile?: () => void;
  onRequestSubmit?: () => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  onCloseMobile,
  onRequestSubmit,
}) => {
  const {
    questions,
    currentQuestionIndex,
    selectedAnswers,
    markedForReview,
    setCurrentQuestionIndex,
    submitTest,
  } = useTest();

  const TOTAL_PALETTE_ITEMS = 30;

  const getQuestionStatus = (index: number) => {
    const question = questions[index % questions.length];
    const qId = index + 1;
    const isAnswered = Boolean(selectedAnswers[qId] || (qId === 15 && selectedAnswers[15]));
    const isMarked = markedForReview.includes(qId);

    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    if (index < 15) return 'not-answered';
    return 'not-visited';
  };

  const answeredCount = Object.keys(selectedAnswers).length || 1;
  const markedCount = markedForReview.length;
  const notAnsweredCount = Math.max(0, 15 - answeredCount);
  const notVisitedCount = TOTAL_PALETTE_ITEMS - 15;

  const handlePaletteSubmit = () => {
    if (onRequestSubmit) {
      onRequestSubmit();
    } else {
      submitTest();
    }
  };

  return (
    <aside className="w-full flex flex-col h-full bg-white p-5 border-l border-[#ddc1b3]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-[#161d1f]">Question Palette</h3>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-xs bg-[#e8eff1] text-[#564338] px-3 py-1.5 rounded-lg font-bold"
          >
            Close
          </button>
        )}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-[#564338] bg-[#f4fafd] p-3 rounded-xl border border-[#dde4e6]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#a1fa49] border border-[#3a6a00] flex items-center justify-center text-[10px] text-[#0e2000] font-bold">
            {answeredCount}
          </div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#dde4e6] border border-[#897266] flex items-center justify-center text-[10px] text-[#161d1f] font-bold">
            {notAnsweredCount}
          </div>
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#d4e3ff] border border-[#0060ac] flex items-center justify-center text-[10px] text-[#001c39] font-bold">
            {markedCount}
          </div>
          <span>Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white border border-[#897266] border-dashed flex items-center justify-center text-[10px] text-[#161d1f] font-bold">
            {notVisitedCount}
          </div>
          <span>Not Visited</span>
        </div>
      </div>

      {/* Question Grid Numbers */}
      <div className="grid grid-cols-5 gap-2.5 overflow-y-auto max-h-[340px] p-1 pb-4">
        {Array.from({ length: TOTAL_PALETTE_ITEMS }).map((_, idx) => {
          const qNumber = idx + 1;
          const status = getQuestionStatus(idx);
          const isCurrent = currentQuestionIndex === (idx % questions.length);

          let buttonClasses = 'w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all relative active:scale-95 touch-manipulation ';

          if (isCurrent) {
            buttonClasses += 'bg-[#ff8c42] text-white border-2 border-[#9b4500] shadow-md scale-105 z-10 ';
          } else if (status === 'answered') {
            buttonClasses += 'bg-[#a1fa49] text-[#0e2000] border border-[#3a6a00] hover:opacity-80 ';
          } else if (status === 'marked' || status === 'answered-marked') {
            buttonClasses += 'bg-[#d4e3ff] text-[#001c39] border border-[#0060ac] rounded-full hover:opacity-80 ';
          } else if (status === 'not-answered') {
            buttonClasses += 'bg-[#dde4e6] text-[#161d1f] border border-[#897266] hover:opacity-80 ';
          } else {
            buttonClasses += 'bg-white text-[#161d1f] border border-[#897266] border-dashed hover:bg-[#e8eff1] ';
          }

          return (
            <button
              key={qNumber}
              type="button"
              onClick={() => {
                setCurrentQuestionIndex(idx % questions.length);
                if (onCloseMobile) onCloseMobile();
              }}
              className={buttonClasses}
            >
              {qNumber}
              {isCurrent && (
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#9b4500] rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit Action */}
      <div className="mt-auto pt-6 border-t border-[#ddc1b3]">
        <button
          type="button"
          onClick={handlePaletteSubmit}
          className="w-full py-3 rounded-full bg-[#ba1a1a] text-white font-bold text-sm hover:bg-[#93000a] transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 touch-manipulation"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          Submit Test
        </button>
      </div>
    </aside>
  );
};
