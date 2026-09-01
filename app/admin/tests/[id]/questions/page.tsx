import React, { Suspense } from 'react';
import { AdminQuestionsClient } from '@/components/admin/AdminQuestionsClient';

export function generateStaticParams() {
  const ids = Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
  return [
    ...ids,
    { id: 'phy-mock-01' },
    { id: 'chem-mock-01' },
    { id: 'math-mock-01' },
    { id: 'bio-mock-01' },
    { id: 'physics' },
    { id: 'chemistry' },
    { id: 'mathematics' },
  ];
}

export default function AdminQuestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400">Loading Questions Studio...</div>}>
      <AdminQuestionsClient />
    </Suspense>
  );
}
