import React from 'react';
import { TestPageClient } from '@/components/gamification/TestPageClient';

export function generateStaticParams() {
  const ids = Array.from({ length: 100 }, (_, i) => ({ id: (i + 1).toString() }));
  const slugs = [
    { id: 'physics-1' },
    { id: 'physics-2' },
    { id: 'chemistry-1' },
    { id: 'chemistry-2' },
    { id: 'mathematics-1' },
    { id: 'mathematics-2' },
    { id: 'biology-1' },
    { id: 'biology-2' },
  ];
  return [...ids, ...slugs];
}

export default function TestPage() {
  return <TestPageClient />;
}
