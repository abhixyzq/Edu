import React from 'react';
import { SubjectDetailClient } from '@/components/SubjectDetailClient';

export function generateStaticParams() {
  return [
    { subjectId: 'physics' },
    { subjectId: 'chemistry' },
    { subjectId: 'mathematics' },
    { subjectId: 'maths' },
    { subjectId: 'biology' },
    { subjectId: 'english' },
    { subjectId: 'hindi' },
  ];
}

export default function SubjectDetailPage() {
  return <SubjectDetailClient />;
}
