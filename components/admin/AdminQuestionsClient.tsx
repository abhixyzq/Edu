'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Modal, FormField, inputCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';
import { LatexPreview } from '@/components/admin/LatexPreview';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

interface Question {
  id: number;
  test_id: string;
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation: string;
}

interface TestInfo {
  id: string;
  title: string;
  subject_id: string;
  total_marks: number;
}

const EMPTY_Q: Omit<Question, 'id'> = {
  test_id: '',
  question_number: 1,
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 0,
  explanation: '',
};

const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d'] as const;
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function AdminQuestionsClient() {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Omit<Question, 'id'>>({ ...EMPTY_Q, test_id: id });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const [tRes, qRes] = await Promise.all([
      supabase.from('tests').select('id, title, subject_id, total_marks').eq('id', id).single(),
      supabase.from('questions').select('*').eq('test_id', id).order('question_number'),
    ]);
    setTest((tRes.data as TestInfo) ?? null);
    setQuestions((qRes.data as Question[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  function openAdd() {
    playButtonClick();
    setEditId(null);
    setEditing({
      ...EMPTY_Q,
      test_id: id,
      question_number: questions.length + 1,
    });
    setError('');
    setModalOpen(true);
  }

  function openEdit(q: Question) {
    playButtonClick();
    setEditId(q.id);
    setEditing({
      test_id: q.test_id,
      question_number: q.question_number,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      explanation: q.explanation ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.question_text.trim()) {
      setError('Question text is required.');
      return;
    }
    if (!editing.option_a.trim() || !editing.option_b.trim()) {
      setError('At least options A and B are required.');
      return;
    }

    setSaving(true);
    setError('');
    const payload = {
      test_id: id,
      question_number: Number(editing.question_number),
      question_text: editing.question_text,
      option_a: editing.option_a,
      option_b: editing.option_b,
      option_c: editing.option_c,
      option_d: editing.option_d,
      correct_answer: Number(editing.correct_answer),
      explanation: editing.explanation,
    };

    const { error: err } = editId !== null
      ? await supabase.from('questions').update(payload).eq('id', editId)
      : await supabase.from('questions').insert(payload);

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    playGemDing();
    setModalOpen(false);
    setSaving(false);
    await load();
  }

  async function del(qid: number) {
    if (!confirm('Delete this question from test paper?')) return;
    await supabase.from('questions').delete().eq('id', qid);
    await load();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link href="/admin/tests" onClick={playButtonClick} className="hover:text-[#7c3aed] font-bold">
          Tests Studio
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-black text-[#1e293b] truncate max-w-xs">{test?.title ?? id}</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#7c3aed] font-black">Question Bank ({questions.length})</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg sm:text-xl font-black text-[#1e293b]">
              {test?.title || 'Test Questions'}
            </h1>
            <span className="text-[10px] font-black bg-violet-100 text-[#7c3aed] px-2.5 py-0.5 rounded-full border border-violet-200 uppercase">
              {test?.subject_id || 'Subject'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {questions.length} questions configured • {test?.total_marks || 0} Total Marks
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-md cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Add Question</span>
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-[#7c3aed] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-500">Loading question bank...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-[#e2e8f0] text-center space-y-2">
          <span className="material-symbols-outlined text-[48px] text-slate-300">quiz</span>
          <h3 className="font-heading font-black text-slate-800 text-sm">No Questions Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ Add Question" to start building MCQ questions with real-time formula rendering.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border-2 border-[#e2e8f0] overflow-hidden shadow-xs hover:border-violet-300 transition-all"
              >
                <div
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#7c3aed] font-black text-xs flex items-center justify-center shrink-0 border border-violet-200">
                      Q{q.question_number}
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-[#1e293b] text-xs sm:text-sm leading-relaxed">
                        {q.question_text}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Correct: Option {OPTION_LABELS[q.correct_answer]}
                        </span>
                        {q.explanation && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Has explanation note
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEdit(q)}
                      className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Edit Question"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <DangerBtn onClick={() => del(q.id)}>
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </DangerBtn>
                  </div>
                </div>

                {/* Collapsible Options Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {OPTION_KEYS.map((key, idx) => {
                        const isCorrect = q.correct_answer === idx;
                        return (
                          <div
                            key={key}
                            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
                              isCorrect
                                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-black'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {OPTION_LABELS[idx]}
                            </span>
                            <span className="truncate">{q[key] || '—'}</span>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 text-xs text-violet-950">
                        <span className="font-black text-[10px] uppercase text-violet-700 block mb-0.5">Solution Note:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Question Studio Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId !== null ? 'Edit Question' : 'Add MCQ Question'}
        subtitle="Configure 4 options, solution notes, and formula notation"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2">
            <FormField label="Question Number" required>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={editing.question_number}
                onChange={(e) => setEditing({ ...editing, question_number: Number(e.target.value) })}
              />
            </FormField>

            <div className="col-span-2">
              <FormField label="Correct Option" required>
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {OPTION_LABELS.map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setEditing({ ...editing, correct_answer: idx })}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        editing.correct_answer === idx
                          ? 'bg-emerald-600 text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Option {label}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
          </div>

          <FormField label="Question Text / Problem Statement" required hint="LaTeX notation supported">
            <textarea
              rows={3}
              className={inputCls}
              placeholder="e.g. What is the magnetic flux through a closed Gaussian surface?"
              value={editing.question_text}
              onChange={(e) => setEditing({ ...editing, question_text: e.target.value })}
            />
          </FormField>

          <LatexPreview content={editing.question_text} label="Problem Statement Preview" />

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {OPTION_KEYS.map((key, idx) => (
              <FormField
                key={key}
                label={`Option ${OPTION_LABELS[idx]}`}
                required={idx < 2}
              >
                <div className="relative">
                  <input
                    className={`${inputCls} pr-8`}
                    placeholder={`Choice ${OPTION_LABELS[idx]}`}
                    value={editing[key]}
                    onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                  />
                  {editing.correct_answer === idx && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xs">
                      ✓
                    </span>
                  )}
                </div>
              </FormField>
            ))}
          </div>

          <FormField label="Solution Explanation (Optional)" hint="Revealed after test submission">
            <textarea
              rows={2}
              className={inputCls}
              placeholder="Step-by-step reasoning for the correct option..."
              value={editing.explanation}
              onChange={(e) => setEditing({ ...editing, explanation: e.target.value })}
            />
          </FormField>

          <div className="pt-2">
            <PrimaryBtn onClick={save} loading={saving}>
              {editId !== null ? 'Save Question Changes' : 'Add Question to Paper'}
            </PrimaryBtn>
          </div>
        </div>
      </Modal>

    </div>
  );
}
