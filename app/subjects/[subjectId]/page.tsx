import React from 'react';
import { SubjectDetailClient } from '@/components/SubjectDetailClient';

export function generateStaticParams() {
  return [
    { subjectId: 'physics' },
    { subjectId: 'chemistry' },
    { subjectId: 'maths' },
    { subjectId: 'biology' },
    { subjectId: 'english' }
  ];
}

export default function SubjectDetailPage() {
  return <SubjectDetailClient />;
}
