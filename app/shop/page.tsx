import React from 'react';
import { StoreClient } from '@/components/gamification/StoreClient';

export const metadata = {
  title: 'Store - nainixOne',
  description: 'Scholar store for gems, lives, and study power-ups.',
};

export default function ShopPage() {
  return <StoreClient />;
}
