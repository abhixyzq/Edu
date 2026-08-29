import React from 'react';
import { TestClient } from '@/components/TestClient';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
}

export default function TestPage() {
  return <TestClient />;
}
