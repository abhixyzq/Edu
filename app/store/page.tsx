import React from 'react';
import { StoreClient } from '@/components/gamification/StoreClient';

export const metadata = {
  title: 'Store - Buy Gems & Power-Ups | nainixOne',
  description: 'Get gems to refill test lives, activate infinite hearts, freeze streaks, and master your exams on nainixOne.',
};

export default function StorePage() {
  return <StoreClient />;
}
