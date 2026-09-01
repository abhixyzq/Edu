import React, { Suspense } from 'react';
import { AdminChaptersClient } from '@/components/admin/AdminChaptersClient';

export function generateStaticParams() {
  const numIds = Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
  return [
    ...numIds,
    { id: 'physics' },
    { id: 'chemistry' },
    { id: 'mathematics' },
    { id: 'maths' },
    { id: 'biology' },
    { id: 'english' },
  ];
}

export default function AdminChaptersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400">Loading Chapters...</div>}>
      <AdminChaptersClient />
    </Suspense>
  );
}
