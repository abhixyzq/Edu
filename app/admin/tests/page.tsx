'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';
import { Modal, FormField, inputCls, selectCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';
import { MasterCurriculumImporterModal } from '@/components/admin/MasterCurriculumImporterModal';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

interface Test {
  id: string;
  title: string;
  subject_id: string;
  category: string;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
}

interface Subject {
  id: string;
  title: string;
}

const EMPTY: Test = {
  id: '',
  title: '',
  subject_id: '',
  category: 'Class 12',
  total_questions: 10,
  total_marks: 40,
  duration_minutes: 20,
};

const CATEGORIES = [
  'Class 12',
  'Class 11',
  'Class 10',
  'Class 9',
  'JEE Main / Adv',
  'NEET UG',
  'Mock Test',
  'Unit Quiz',
];

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [masterModalOpen, setMasterModalOpen] = useState(false);
  const [editing, setEditing] = useState<Test>(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  async function load() {
    setLoading(true);
    const [testsRes, subsRes] = await Promise.all([
      supabase.from('tests').select('*').order('subject_id'),
      supabase.from('subjects').select('id, title').order('title'),
    ]);
    setTests((testsRes.data as Test[]) ?? []);
    setSubjects((subsRes.data as Subject[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    playButtonClick();
    setIsEdit(false);
    setEditing({
      ...EMPTY,
      id: `test-${Date.now()}`,
      subject_id: subjects[0]?.id ?? 'physics',
    });
    setError('');
    setModalOpen(true);
  }

  function openEdit(t: Test) {
    playButtonClick();
    setIsEdit(true);
    setEditing({ ...t });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.id.trim() || !editing.title.trim() || !editing.subject_id) {
      setError('ID, Title, and Subject are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      title: editing.title,
      subject_id: editing.subject_id,
      category: editing.category,
      total_questions: Number(editing.total_questions),
      total_marks: Number(editing.total_marks),
      duration_minutes: Number(editing.duration_minutes),
    };
    const { error: err } = isEdit
      ? await supabase.from('tests').update(payload).eq('id', editing.id)
      : await supabase.from('tests').insert({ ...payload, id: editing.id });

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

  async function del(id: string) {
    if (!confirm(`Delete test "${id}" and all its questions?`)) return;
    await supabase.from('tests').delete().eq('id', id);
    await load();
  }

  const filtered = tests.filter((t) => {
    const matchSub = filterSubject === 'all' || t.subject_id === filterSubject;
    const matchCat = filterCategory === 'all' || t.category === filterCategory;
    return matchSub && matchCat;
  });

  const columns = [
    {
      key: 'title',
      label: 'Test Name',
      render: (r: Test) => (
        <div>
          <p className="font-black text-[#1e293b] text-xs sm:text-sm">{r.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-[#7c3aed] uppercase bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
              {r.subject_id}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">{r.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'total_questions',
      label: 'Questions',
      render: (r: Test) => (
        <span className="font-bold text-slate-700 text-xs">{r.total_questions} Questions</span>
      ),
    },
    {
      key: 'duration_minutes',
      label: 'Duration & Marks',
      render: (r: Test) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800">⏱️ {r.duration_minutes} mins</span>
          <span className="text-slate-400 font-medium"> • {r.total_marks} marks</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r: Test) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/admin/tests/${r.id}/questions`}>
            <button className="text-[11px] font-black text-white bg-[#7c3aed] hover:bg-[#6d28d9] px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1">
              <span>MCQs</span>
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
            </button>
          </Link>
          <button
            onClick={() => openEdit(r)}
            className="text-[11px] font-bold text-slate-700 border border-slate-200 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            Edit
          </button>
          <DangerBtn onClick={() => del(r.id)}>
            <span className="material-symbols-outlined text-[15px]">delete</span>
          </DangerBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-6xl w-full mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-black text-[#1e293b]">
              Tests & Question Banks
            </h1>
            <span className="text-xs font-black text-[#7c3aed] bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
              {filtered.length} of {tests.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure timed tests, mock papers, and unit quizzes for all classes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-white border-2 border-[#e2e8f0] rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border-2 border-[#e2e8f0] rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              playButtonClick();
              setMasterModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-3.5 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span>⚡ Master CSV Import</span>
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-[#ff8c42] hover:bg-[#ff7a24] text-white px-4 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Create Test</span>
          </button>
        </div>
      </div>

      {/* Tests Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        loading={loading}
        emptyMessage="No tests match the selected filters."
        searchable
        searchPlaceholder="Search tests by title or ID..."
        searchKeys={['title', 'id', 'subject_id']}
      />

      {/* Add / Edit Test Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEdit ? 'Edit Test Properties' : 'Create New Test Paper'}
        subtitle="Manage marks, duration, and subject assignment"
      >
        <div className="space-y-4">
          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          <FormField label="Test ID / Identifier" required hint="Unique alphanumeric string">
            <input
              className={inputCls}
              placeholder="e.g. phy-mock-01"
              value={editing.id}
              disabled={isEdit}
              onChange={(e) => setEditing({ ...editing, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            />
          </FormField>

          <FormField label="Test Title" required hint="e.g. Ray Optics Comprehensive Mock">
            <input
              className={inputCls}
              placeholder="Ray Optics Comprehensive Mock"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Subject" required>
              <select
                className={selectCls}
                value={editing.subject_id}
                onChange={(e) => setEditing({ ...editing, subject_id: e.target.value })}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Category / Class">
              <select
                className={selectCls}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FormField label="Questions Count">
              <input
                type="number"
                min={1}
                className={inputCls}
                value={editing.total_questions}
                onChange={(e) => setEditing({ ...editing, total_questions: Number(e.target.value) })}
              />
            </FormField>

            <FormField label="Total Marks">
              <input
                type="number"
                min={1}
                className={inputCls}
                value={editing.total_marks}
                onChange={(e) => setEditing({ ...editing, total_marks: Number(e.target.value) })}
              />
            </FormField>

            <FormField label="Duration (Mins)">
              <input
                type="number"
                min={1}
                className={inputCls}
                value={editing.duration_minutes}
                onChange={(e) => setEditing({ ...editing, duration_minutes: Number(e.target.value) })}
              />
            </FormField>
          </div>

          <div className="pt-2">
            <PrimaryBtn onClick={save} loading={saving}>
              {isEdit ? 'Save Changes' : 'Create Test & Open Questions'}
            </PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* Master All-in-One Importer Modal */}
      <MasterCurriculumImporterModal
        open={masterModalOpen}
        onClose={() => setMasterModalOpen(false)}
        onSuccess={() => {
          load();
        }}
      />

    </div>
  );
}
