import React from 'react';
import { AdminChaptersClient } from '@/components/admin/AdminChaptersClient';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: 'physics' }, { id: 'chemistry' }, { id: 'maths' }];
}

export default function AdminChaptersPage() {
  return <AdminChaptersClient />;
}
