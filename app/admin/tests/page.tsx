'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';
import { Modal, FormField, inputCls, selectCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';

interface Test {
  id: string;
  title: string;
  subject_id: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  passing_marks: number;
  created_at: string;
}

interface Subject { id: string; title: string }

const EMPTY: Omit<Test, 'created_at'> = {
  id: '', title: '', subject_id: '', duration_minutes: 30,
  total_questions: 10, total_marks: 40, passing_marks: 14,
};

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Omit<Test, 'created_at'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  async function load() {
    setLoading(true);
    const [testsRes, subjectsRes] = await Promise.all([
      supabase.from('tests').select('*').order('created_at', { ascending: false }),
      supabase.from('subjects').select('id, title').order('title'),
    ]);
    setTests((testsRes.data as Test[]) ?? []);
    setSubjects((subjectsRes.data as Subject[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = filterSubject ? tests.filter((t) => t.subject_id === filterSubject) : tests;

  function openAdd() {
    setIsEdit(false);
    setEditing({ ...EMPTY, subject_id: subjects[0]?.id ?? '' });
    setError('');
    setModalOpen(true);
  }

  function openEdit(t: Test) {
    setIsEdit(true);
    setEditing({ id: t.id, title: t.title, subject_id: t.subject_id, duration_minutes: t.duration_minutes, total_questions: t.total_questions, total_marks: t.total_marks, passing_marks: t.passing_marks });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.id.trim() || !editing.title.trim()) { setError('ID and Title are required.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = isEdit
      ? await supabase.from('tests').update({ title: editing.title, subject_id: editing.subject_id, duration_minutes: editing.duration_minutes, total_questions: editing.total_questions, total_marks: editing.total_marks, passing_marks: editing.passing_marks }).eq('id', editing.id)
      : await supabase.from('tests').insert({ ...editing });
    if (err) { setError(err.message); setSaving(false); return; }
    setModalOpen(false);
    await load();
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm(`Delete test "${id}"? All questions for this test will also be deleted.`)) return;
    await supabase.from('tests').delete().eq('id', id);
    await load();
  }

  const columns = [
    { key: 'id', label: 'ID', render: (r: Test) => <code className="text-xs bg-[#f4fafd] px-2 py-0.5 rounded font-mono">{r.id}</code> },
    { key: 'title', label: 'Title', render: (r: Test) => <span className="font-semibold text-[#161d1f] text-xs">{r.title}</span> },
    { key: 'subject_id', label: 'Subject', render: (r: Test) => <span className="capitalize text-xs font-medium text-[#0060ac]">{r.subject_id}</span> },
    { key: 'duration_minutes', label: 'Duration', render: (r: Test) => <span className="text-xs">{r.duration_minutes} min</span> },
    { key: 'total_questions', label: 'Qs', render: (r: Test) => <span className="font-bold text-xs">{r.total_questions}</span> },
    { key: 'total_marks', label: 'Marks', render: (r: Test) => <span className="text-xs">{r.total_marks}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (r: Test) => (
        <div className="flex gap-2 flex-wrap">
          <Link href={`/admin/tests/${r.id}/questions`}>
            <button className="text-[11px] font-bold text-[#0060ac] border border-[#0060ac]/40 hover:bg-blue-50 px-2.5 py-1.5 rounded-full cursor-pointer">Questions</button>
          </Link>
          <button onClick={() => openEdit(r)} className="text-[11px] font-bold text-[#564338] border border-[#dde4e6] hover:bg-[#f4fafd] px-2.5 py-1.5 rounded-full cursor-pointer">Edit</button>
          <DangerBtn onClick={() => del(r.id)}><span className="material-symbols-outlined text-[14px]">delete</span></DangerBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 max-w-6xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">Tests & Questions</h1>
          <p className="text-sm text-[#564338] mt-0.5">{filtered.length} of {tests.length} tests</p>
        </div>
        <div className="flex gap-2.5 flex-wrap items-center">
          <select className={`${selectCls} w-40 text-xs`} value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#9b4500] hover:bg-[#ff8c42] text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-md">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Test
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} keyField="id" loading={loading} emptyMessage="No tests yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? 'Edit Test' : 'Add Test'} maxWidth="max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormField label="Test ID" required>
              <input className={inputCls} value={editing.id} disabled={isEdit} onChange={(e) => setEditing((p) => ({ ...p, id: e.target.value }))} placeholder="e.g. 5" />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Title" required>
              <input className={inputCls} value={editing.title} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Electric Charges Mock Test" />
            </FormField>
          </div>
          <FormField label="Subject">
            <select className={selectCls} value={editing.subject_id} onChange={(e) => setEditing((p) => ({ ...p, subject_id: e.target.value }))}>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </FormField>
          <FormField label="Duration (min)">
            <input type="number" className={inputCls} value={editing.duration_minutes} min={5} onChange={(e) => setEditing((p) => ({ ...p, duration_minutes: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Total Questions">
            <input type="number" className={inputCls} value={editing.total_questions} min={1} onChange={(e) => setEditing((p) => ({ ...p, total_questions: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Total Marks">
            <input type="number" className={inputCls} value={editing.total_marks} min={1} onChange={(e) => setEditing((p) => ({ ...p, total_marks: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Passing Marks">
            <input type="number" className={inputCls} value={editing.passing_marks} min={1} onChange={(e) => setEditing((p) => ({ ...p, passing_marks: Number(e.target.value) }))} />
          </FormField>
          {error && <p className="sm:col-span-2 text-xs text-red-600 font-medium">{error}</p>}
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="text-sm font-bold text-[#564338] px-4 py-2 rounded-full hover:bg-[#e8eff1] cursor-pointer">Cancel</button>
            <PrimaryBtn loading={saving} onClick={save}>{isEdit ? 'Save Changes' : 'Create Test'}</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
