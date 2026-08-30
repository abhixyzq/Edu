'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';
import { Modal, FormField, inputCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';

interface Chapter {
  id: number;
  subject_id: string;
  chapter_number: number;
  title: string;
  question_count: number;
  created_at: string;
}

interface Subject { id: string; title: string }

const EMPTY = { chapter_number: 1, title: '', question_count: 15 };

export default function AdminChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const [subjectRes, chaptersRes] = await Promise.all([
      supabase.from('subjects').select('id, title').eq('id', id).single(),
      supabase.from('chapters').select('*').eq('subject_id', id).order('chapter_number'),
    ]);
    setSubject(subjectRes.data as Subject);
    setChapters((chaptersRes.data as Chapter[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  function openAdd() {
    setEditingId(null);
    setEditing({ chapter_number: (chapters.length + 1), title: '', question_count: 15 });
    setError('');
    setModalOpen(true);
  }

  function openEdit(c: Chapter) {
    setEditingId(c.id);
    setEditing({ chapter_number: c.chapter_number, title: c.title, question_count: c.question_count });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = editingId !== null
      ? await supabase.from('chapters').update({ chapter_number: editing.chapter_number, title: editing.title, question_count: editing.question_count }).eq('id', editingId)
      : await supabase.from('chapters').insert({ subject_id: id, ...editing });
    if (err) { setError(err.message); setSaving(false); return; }
    setModalOpen(false);
    await load();
    setSaving(false);
  }

  async function del(cid: number) {
    if (!confirm('Delete this chapter?')) return;
    await supabase.from('chapters').delete().eq('id', cid);
    await load();
  }

  const columns = [
    { key: 'chapter_number', label: '#', render: (r: Chapter) => <span className="font-bold text-[#9b4500]">{r.chapter_number}</span> },
    { key: 'title', label: 'Chapter Title', render: (r: Chapter) => <span className="font-semibold">{r.title}</span> },
    { key: 'question_count', label: 'Questions', render: (r: Chapter) => <span className="font-bold">{r.question_count}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (r: Chapter) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-xs font-bold text-[#564338] border border-[#dde4e6] hover:bg-[#f4fafd] px-3 py-1.5 rounded-full cursor-pointer transition-colors">Edit</button>
          <DangerBtn onClick={() => del(r.id)}><span className="material-symbols-outlined text-[14px]">delete</span></DangerBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 max-w-4xl w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#564338]">
        <Link href="/admin/subjects" className="hover:text-[#9b4500] font-medium">Subjects</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-bold text-[#161d1f]">{subject?.title ?? id}</span>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-[#9b4500] font-bold">Chapters</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">Chapters</h1>
          <p className="text-sm text-[#564338] mt-0.5">{chapters.length} chapters for {subject?.title}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#9b4500] hover:bg-[#ff8c42] text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Chapter
        </button>
      </div>

      <DataTable columns={columns} data={chapters} keyField="id" loading={loading} emptyMessage="No chapters yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId !== null ? 'Edit Chapter' : 'Add Chapter'}>
        <div className="flex flex-col gap-4">
          <FormField label="Chapter Number" required>
            <input type="number" className={inputCls} value={editing.chapter_number} min={1} onChange={(e) => setEditing((p) => ({ ...p, chapter_number: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Chapter Title" required>
            <input className={inputCls} value={editing.title} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Electric Charges & Fields" />
          </FormField>
          <FormField label="Question Count">
            <input type="number" className={inputCls} value={editing.question_count} min={1} onChange={(e) => setEditing((p) => ({ ...p, question_count: Number(e.target.value) }))} />
          </FormField>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="text-sm font-bold text-[#564338] px-4 py-2 rounded-full hover:bg-[#e8eff1] cursor-pointer">Cancel</button>
            <PrimaryBtn loading={saving} onClick={save}>{editingId !== null ? 'Save Changes' : 'Create Chapter'}</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
