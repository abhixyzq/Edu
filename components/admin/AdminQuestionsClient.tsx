'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Modal, FormField, inputCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';

interface Question {
  id: number;
  test_id: string;
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number; // 0=A, 1=B, 2=C, 3=D
  explanation: string;
  admin_notes: string;
}

interface Test { id: string; title: string; subject_id: string }

const OPTIONS = ['A', 'B', 'C', 'D'];
const EMPTY_Q: Omit<Question, 'id' | 'test_id'> = {
  question_number: 1,
  question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: 0, explanation: '', admin_notes: '',
};

export function AdminQuestionsClient() {
  const params = useParams();
  const id = (params?.id as string) || '1';
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Omit<Question, 'id' | 'test_id'>>(EMPTY_Q);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const [testRes, qRes] = await Promise.all([
      supabase.from('tests').select('id, title, subject_id').eq('id', id).single(),
      supabase.from('questions').select('*').eq('test_id', id).order('question_number'),
    ]);
    setTest(testRes.data as Test);
    setQuestions((qRes.data as Question[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  function openAdd() {
    setEditingId(null);
    setEditing({ ...EMPTY_Q, question_number: questions.length + 1 });
    setError('');
    setModalOpen(true);
  }

  function openEdit(q: Question) {
    setEditingId(q.id);
    setEditing({
      question_number: q.question_number, question_text: q.question_text,
      option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d,
      correct_answer: q.correct_answer, explanation: q.explanation, admin_notes: q.admin_notes ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.question_text.trim() || !editing.option_a || !editing.option_b || !editing.option_c || !editing.option_d) {
      setError('Question text and all 4 options are required.'); return;
    }
    if (!editing.explanation.trim()) { setError('Explanation is required.'); return; }
    setSaving(true);
    setError('');
    const payload = { question_number: editing.question_number, question_text: editing.question_text, option_a: editing.option_a, option_b: editing.option_b, option_c: editing.option_c, option_d: editing.option_d, correct_answer: editing.correct_answer, explanation: editing.explanation, admin_notes: editing.admin_notes };
    const { error: err } = editingId !== null
      ? await supabase.from('questions').update(payload).eq('id', editingId)
      : await supabase.from('questions').insert({ test_id: id, ...payload });
    if (err) { setError(err.message); setSaving(false); return; }
    setModalOpen(false);
    await load();
    setSaving(false);
  }

  async function del(qid: number) {
    if (!confirm('Delete this question?')) return;
    await supabase.from('questions').delete().eq('id', qid);
    await load();
  }

  const optionKey = (i: number) => (['option_a', 'option_b', 'option_c', 'option_d'] as const)[i];

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-4xl w-full mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#564338] flex-wrap">
        <Link href="/admin/tests" className="hover:text-[#9b4500] font-medium">Tests</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-bold text-[#161d1f] truncate max-w-xs">{test?.title ?? id}</span>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-[#9b4500] font-bold">Questions</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">Questions</h1>
          <p className="text-sm text-[#564338] mt-0.5">{questions.length} questions · {test?.title}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#9b4500] hover:bg-[#ff8c42] text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Question
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-[#ff8c42] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8eff1] p-12 flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#dde4e6]">quiz</span>
          <p className="font-bold text-[#564338]">No questions yet</p>
          <p className="text-xs text-[#897266]">Click "Add Question" to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-[#e8eff1] overflow-hidden">
              <div
                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-[#f9fbfc] transition-colors"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <div className="w-8 h-8 rounded-full bg-[#ffdbc9] text-[#9b4500] font-extrabold text-sm flex items-center justify-center shrink-0">
                  {q.question_number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#161d1f] text-sm line-clamp-2">{q.question_text}</p>
                  <p className="text-xs text-[#564338] mt-1">Correct: <span className="font-bold text-green-700">{OPTIONS[q.correct_answer]}</span></p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(q); }} className="text-xs font-bold text-[#564338] border border-[#dde4e6] hover:bg-[#f4fafd] px-2.5 py-1.5 rounded-full cursor-pointer">Edit</button>
                  <DangerBtn onClick={() => del(q.id)}><span className="material-symbols-outlined text-[14px]">delete</span></DangerBtn>
                  <span className={`material-symbols-outlined text-[18px] text-[#897266] transition-transform duration-200 ${expandedId === q.id ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
              </div>
              {expandedId === q.id && (
                <div className="px-4 pb-4 border-t border-[#f0f0f0] pt-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {OPTIONS.map((opt, i) => (
                      <div key={opt} className={`flex items-start gap-2 p-2.5 rounded-xl text-xs border ${q.correct_answer === i ? 'bg-green-50 border-green-300 text-green-800' : 'bg-[#f4fafd] border-[#e8eff1] text-[#161d1f]'}`}>
                        <span className="font-extrabold w-4 shrink-0">{opt}.</span>
                        <span>{q[optionKey(i)]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                    <span className="font-bold">Explanation: </span>{q.explanation}
                  </div>
                  {q.admin_notes && <p className="mt-2 text-[10px] text-[#897266] italic">Note: {q.admin_notes}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId !== null ? 'Edit Question' : 'Add Question'} maxWidth="max-w-2xl">
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Question #">
              <input type="number" className={inputCls} value={editing.question_number} min={1} onChange={(e) => setEditing((p) => ({ ...p, question_number: Number(e.target.value) }))} />
            </FormField>
            <FormField label="Correct Answer">
              <select className={`${inputCls} cursor-pointer`} value={editing.correct_answer} onChange={(e) => setEditing((p) => ({ ...p, correct_answer: Number(e.target.value) }))}>
                {OPTIONS.map((o, i) => <option key={o} value={i}>Option {o}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Question Text" required>
            <textarea className={`${inputCls} resize-none`} rows={3} value={editing.question_text} onChange={(e) => setEditing((p) => ({ ...p, question_text: e.target.value }))} placeholder="Enter the question…" />
          </FormField>
          {OPTIONS.map((opt, i) => (
            <FormField key={opt} label={`Option ${opt}`} required>
              <input className={inputCls} value={editing[optionKey(i)]} onChange={(e) => setEditing((p) => ({ ...p, [optionKey(i)]: e.target.value }))} placeholder={`Option ${opt}`} />
            </FormField>
          ))}
          <FormField label="Explanation" required>
            <textarea className={`${inputCls} resize-none`} rows={3} value={editing.explanation} onChange={(e) => setEditing((p) => ({ ...p, explanation: e.target.value }))} placeholder="Explain the correct answer…" />
          </FormField>
          <FormField label="Admin Notes (optional)">
            <input className={inputCls} value={editing.admin_notes} onChange={(e) => setEditing((p) => ({ ...p, admin_notes: e.target.value }))} placeholder="Internal note for editors" />
          </FormField>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white py-2">
            <button onClick={() => setModalOpen(false)} className="text-sm font-bold text-[#564338] px-4 py-2 rounded-full hover:bg-[#e8eff1] cursor-pointer">Cancel</button>
            <PrimaryBtn loading={saving} onClick={save}>{editingId !== null ? 'Save Changes' : 'Add Question'}</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
