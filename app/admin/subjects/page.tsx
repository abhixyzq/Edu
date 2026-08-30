'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';
import { Modal, FormField, inputCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';

interface Subject {
  id: string;
  title: string;
  category: string;
  icon: string;
  total_chapters: number;
  created_at: string;
}

const EMPTY: Omit<Subject, 'created_at'> = { id: '', title: '', category: '', icon: '', total_chapters: 0 };

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Omit<Subject, 'created_at'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('subjects').select('*').order('title');
    setSubjects((data as Subject[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setIsEdit(false);
    setEditing(EMPTY);
    setError('');
    setModalOpen(true);
  }

  function openEdit(s: Subject) {
    setIsEdit(true);
    setEditing({ id: s.id, title: s.title, category: s.category, icon: s.icon, total_chapters: s.total_chapters });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.id.trim() || !editing.title.trim()) { setError('ID and Title are required.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = isEdit
      ? await supabase.from('subjects').update({ title: editing.title, category: editing.category, icon: editing.icon, total_chapters: editing.total_chapters }).eq('id', editing.id)
      : await supabase.from('subjects').insert({ ...editing });
    if (err) { setError(err.message); setSaving(false); return; }
    setModalOpen(false);
    await load();
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm(`Delete subject "${id}"? This will also delete all its chapters and tests.`)) return;
    await supabase.from('subjects').delete().eq('id', id);
    await load();
  }

  const columns = [
    { key: 'icon', label: 'Icon', render: (r: Subject) => <span className="material-symbols-outlined text-[20px] text-[#9b4500]">{r.icon}</span> },
    { key: 'id', label: 'ID', render: (r: Subject) => <code className="text-xs bg-[#f4fafd] px-2 py-0.5 rounded font-mono">{r.id}</code> },
    { key: 'title', label: 'Title', render: (r: Subject) => <span className="font-semibold text-[#161d1f]">{r.title}</span> },
    { key: 'category', label: 'Category' },
    { key: 'total_chapters', label: 'Chapters', render: (r: Subject) => <span className="font-bold">{r.total_chapters}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (r: Subject) => (
        <div className="flex gap-2">
          <Link href={`/admin/subjects/${r.id}`}>
            <button className="text-xs font-bold text-[#0060ac] border border-[#0060ac]/40 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
              Chapters
            </button>
          </Link>
          <button onClick={() => openEdit(r)} className="text-xs font-bold text-[#564338] border border-[#dde4e6] hover:bg-[#f4fafd] px-3 py-1.5 rounded-full transition-colors cursor-pointer">
            Edit
          </button>
          <DangerBtn onClick={() => del(r.id)}>
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </DangerBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 max-w-5xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">Subjects</h1>
          <p className="text-sm text-[#564338] mt-0.5">{subjects.length} subjects in database</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#9b4500] hover:bg-[#ff8c42] text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Subject
        </button>
      </div>

      <DataTable columns={columns} data={subjects} keyField="id" loading={loading} emptyMessage="No subjects yet. Add your first one!" />

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? 'Edit Subject' : 'Add Subject'}>
        <div className="flex flex-col gap-4">
          <FormField label="Subject ID (slug)" required>
            <input className={inputCls} value={editing.id} disabled={isEdit} onChange={(e) => setEditing((p) => ({ ...p, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="e.g. physics" />
            {!isEdit && <p className="text-[10px] text-[#897266]">Lowercase slug — cannot be changed after creation.</p>}
          </FormField>
          <FormField label="Title" required>
            <input className={inputCls} value={editing.title} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Physics (Class 12)" />
          </FormField>
          <FormField label="Category">
            <input className={inputCls} value={editing.category} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Science Stream" />
          </FormField>
          <FormField label="Material Symbol Icon">
            <input className={inputCls} value={editing.icon} onChange={(e) => setEditing((p) => ({ ...p, icon: e.target.value }))} placeholder="e.g. bolt, science, eco" />
            {editing.icon && <span className="material-symbols-outlined text-[28px] text-[#9b4500]">{editing.icon}</span>}
          </FormField>
          <FormField label="Total Chapters">
            <input type="number" className={inputCls} value={editing.total_chapters} onChange={(e) => setEditing((p) => ({ ...p, total_chapters: Number(e.target.value) }))} min={0} />
          </FormField>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="text-sm font-bold text-[#564338] px-4 py-2 rounded-full hover:bg-[#e8eff1] cursor-pointer transition-colors">Cancel</button>
            <PrimaryBtn loading={saving} onClick={save}>{isEdit ? 'Save Changes' : 'Create Subject'}</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
