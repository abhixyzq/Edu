'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/admin/DataTable';
import { Modal, FormField, inputCls, selectCls, PrimaryBtn, DangerBtn } from '@/components/admin/Modal';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

interface Subject {
  id: string;
  title: string;
  category: string;
  icon: string;
  total_chapters: number;
}

const EMPTY: Subject = {
  id: '',
  title: '',
  category: 'Class 12',
  icon: 'menu_book',
  total_chapters: 0,
};

const CATEGORIES = [
  'Class 12',
  'Class 11',
  'Class 10',
  'Class 9',
  'JEE Main / Adv',
  'NEET UG',
  'Science',
  'General',
];

const ICONS = ['auto_stories', 'menu_book', 'calculate', 'science', 'psychology', 'biotech', 'language', 'history_edu', 'menu_book', 'bolt'];

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject>(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('subjects').select('*').order('title');
    setSubjects((data as Subject[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    playButtonClick();
    setIsEdit(false);
    setEditing(EMPTY);
    setError('');
    setModalOpen(true);
  }

  function openEdit(s: Subject) {
    playButtonClick();
    setIsEdit(true);
    setEditing({ id: s.id, title: s.title, category: s.category || 'Class 12', icon: s.icon, total_chapters: s.total_chapters });
    setError('');
    setModalOpen(true);
  }

  async function save() {
    if (!editing.id.trim() || !editing.title.trim()) {
      setError('ID and Title are required.');
      return;
    }
    setSaving(true);
    setError('');
    const { error: err } = isEdit
      ? await supabase.from('subjects').update({
          title: editing.title,
          category: editing.category,
          icon: editing.icon,
          total_chapters: Number(editing.total_chapters),
        }).eq('id', editing.id)
      : await supabase.from('subjects').insert({ ...editing, total_chapters: Number(editing.total_chapters) });

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
    if (!confirm(`Delete subject "${id}"? This will also delete all its associated chapters and test nodes.`)) return;
    await supabase.from('subjects').delete().eq('id', id);
    await load();
  }

  const filteredSubjects = categoryFilter === 'all'
    ? subjects
    : subjects.filter((s) => s.category?.toLowerCase() === categoryFilter.toLowerCase());

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (r: Subject) => (
        <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#7c3aed] flex items-center justify-center border border-violet-200 shadow-2xs">
          <span className="material-symbols-outlined text-[20px]">{r.icon || 'menu_book'}</span>
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Subject Code',
      render: (r: Subject) => (
        <code className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl font-mono border border-slate-200 font-bold">
          {r.id}
        </code>
      ),
    },
    {
      key: 'title',
      label: 'Subject Title',
      render: (r: Subject) => (
        <div>
          <p className="font-black text-[#1e293b] text-xs sm:text-sm">{r.title}</p>
          <span className="text-[10px] text-slate-400 font-bold">{r.category || 'General'}</span>
        </div>
      ),
    },
    {
      key: 'total_chapters',
      label: 'Chapters',
      render: (r: Subject) => (
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs">
          {r.total_chapters || 0} Units
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r: Subject) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/admin/subjects/${r.id}`}>
            <button className="text-[11px] font-black text-[#7c3aed] bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-2xs cursor-pointer">
              Chapters &rarr;
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
              Curriculum & Subjects
            </h1>
            <span className="text-xs font-black text-[#7c3aed] bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
              {subjects.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure learning trees, units, and subject modules across all classes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border-2 border-[#e2e8f0] rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="all">All Classes & Streams</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Subject Table */}
      <DataTable
        columns={columns}
        data={filteredSubjects}
        keyField="id"
        loading={loading}
        emptyMessage="No subjects found in this category."
        searchable
        searchPlaceholder="Search subjects by title or code..."
        searchKeys={['title', 'id', 'category']}
      />

      {/* Add / Edit Subject Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEdit ? 'Edit Subject' : 'Add New Subject'}
        subtitle="Manage subject curriculum and class assignment"
      >
        <div className="space-y-4">
          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          <FormField label="Subject Code / ID" required hint="e.g. physics, maths, chemistry">
            <input
              className={inputCls}
              placeholder="physics"
              value={editing.id}
              disabled={isEdit}
              onChange={(e) => setEditing({ ...editing, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
            />
          </FormField>

          <FormField label="Subject Title" required hint="e.g. Physics Core">
            <input
              className={inputCls}
              placeholder="Physics Core"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Class / Stream Category">
              <select
                className={selectCls}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Estimated Total Chapters">
              <input
                type="number"
                min={0}
                className={inputCls}
                value={editing.total_chapters}
                onChange={(e) => setEditing({ ...editing, total_chapters: Number(e.target.value) })}
              />
            </FormField>
          </div>

          <FormField label="Icon Preset">
            <div className="grid grid-cols-5 gap-2 pt-1">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setEditing({ ...editing, icon: ic })}
                  className={`p-2.5 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    editing.icon === ic
                      ? 'bg-violet-600 text-white border-violet-700 shadow-xs scale-105'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic}</span>
                </button>
              ))}
            </div>
          </FormField>

          <div className="pt-2">
            <PrimaryBtn onClick={save} loading={saving}>
              {isEdit ? 'Save Changes' : 'Create Subject'}
            </PrimaryBtn>
          </div>
        </div>
      </Modal>

    </div>
  );
}
