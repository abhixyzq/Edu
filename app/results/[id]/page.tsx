import React from 'react';
import { ResultsClient } from '@/components/ResultsClient';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function ResultsPage() {
  return <ResultsClient />;
}
