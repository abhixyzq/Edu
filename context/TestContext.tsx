'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_QUESTIONS, Question } from '@/lib/mockData';

interface TestState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>; // questionId -> option key ('A', 'B', 'C', 'D')
  markedForReview: number[]; // list of questionIds
  timeRemaining: number; // in seconds
  isSubmitted: boolean;
  score: {
    totalMarks: number;
    obtainedMarks: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    accuracyPercent: number;
  };
}

interface TestContextType extends TestState {
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  selectAnswer: (questionId: number, answerKey: string) => void;
  toggleMarkForReview: (questionId: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitTest: () => void;
  resetTest: () => void;
}

const INITIAL_TIME = 45 * 60 + 20; // 45:20

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({
    15: 'B', // default selected answer for mock demonstration
  });
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(INITIAL_TIME);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Timer effect setup once
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const selectAnswer = useCallback((questionId: number, answerKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerKey,
    }));
  }, []);

  const toggleMarkForReview = useCallback((questionId: number) => {
    setMarkedForReview((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, MOCK_QUESTIONS.length - 1));
  }, []);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const score = useMemo(() => {
    let obtainedMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (!userAns) {
        unattemptedCount++;
      } else if (userAns === q.correctAnswer) {
        obtainedMarks += q.marks;
        correctCount++;
      } else {
        obtainedMarks -= 1; // negative marking -1
        incorrectCount++;
      }
    });

    const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);
    const attempted = correctCount + incorrectCount;
    const accuracyPercent = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;

    return {
      totalMarks,
      obtainedMarks: Math.max(0, obtainedMarks),
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracyPercent,
    };
  }, [questions, selectedAnswers]);

  const submitTest = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const resetTest = useCallback(() => {
    setSelectedAnswers({});
    setMarkedForReview([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(INITIAL_TIME);
    setIsSubmitted(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      questions,
      currentQuestionIndex,
      selectedAnswers,
      markedForReview,
      timeRemaining,
      isSubmitted,
      score,
      setCurrentQuestionIndex,
      selectAnswer,
      toggleMarkForReview,
      nextQuestion,
      prevQuestion,
      submitTest,
      resetTest,
    }),
    [
      questions,
      currentQuestionIndex,
      selectedAnswers,
      markedForReview,
      timeRemaining,
      isSubmitted,
      score,
      selectAnswer,
      toggleMarkForReview,
      nextQuestion,
      prevQuestion,
      submitTest,
      resetTest,
    ]
  );

  return <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>;
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
