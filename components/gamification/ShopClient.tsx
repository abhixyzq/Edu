'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Mascot } from './Mascot';

import { GemIcon } from '@/components/icons/AppIcons';

interface ShopItem {
  id: 'heart_refill' | 'streak_freeze' | 'infinite_hearts' | 'double_xp';
  name: string;
  desc: string;
  icon: string;
  cost: number;
  badge?: string;
  ownedCount?: number;
}

export function ShopClient() {
  const { user, buyShopItem } = useUser();
  const [purchaseMsg, setPurchaseMsg] = useState<{ text: string; success: boolean } | null>(null);

  const shopItems: ShopItem[] = [
    {
      id: 'heart_refill',
      name: 'Full Heart Refill',
      desc: 'Instantly restores your hearts back to full 5/5 lives so you never miss a beat.',
      icon: 'favorite',
      cost: 50,
      badge: 'Popular',
    },
    {
      id: 'infinite_hearts',
      name: 'Infinite Hearts Pass',
      desc: '2 hours of unlimited practice with zero heart loss penalty. Perfect for weekend study marathons!',
      icon: 'all_inclusive',
      cost: 150,
      badge: 'Weekend Hero',
    },
    {
      id: 'streak_freeze',
      name: 'Streak Freeze',
      desc: 'Equip to protect your study streak if you are unable to log in for a day.',
      icon: 'ac_unit',
      cost: 100,
      ownedCount: user.inventory.streakFreeze,
    },
    {
      id: 'double_xp',
      name: 'Double XP Booster',
      desc: 'Doubles all XP gained from lessons and mock tests for the next 3 lessons.',
      icon: 'bolt',
      cost: 80,
      ownedCount: user.inventory.doubleXpCount,
    },
  ];

  const handleBuy = (item: ShopItem) => {
    if (user.gems < item.cost) {
      setPurchaseMsg({ text: 'Not enough Gems! Complete more quests to earn Gems.', success: false });
      setTimeout(() => setPurchaseMsg(null), 3000);
      return;
    }

    const success = buyShopItem(item.id, item.cost);
    if (success) {
      setPurchaseMsg({ text: `Successfully purchased ${item.name}! 🎉`, success: true });
      setTimeout(() => setPurchaseMsg(null), 3000);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16 font-sans">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-[#0060ac] to-[#004278] text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b-6 border-[#002f57]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#d4e3ff]">Power-Ups & Inventory</span>
            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-extrabold text-white">
              <GemIcon size={16} />
              <span>{user.gems} Gems</span>
            </div>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black">Scholar Store</h1>
          <p className="text-xs sm:text-sm text-[#d4e3ff] mt-1">
            Spend your hard-earned gems on heart refills, streak freezes, and study boosts!
          </p>
        </div>
        <Mascot mood="happy" size={110} />
      </div>

      {/* Notification Toast */}
      {purchaseMsg && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md animate-in fade-in ${
            purchaseMsg.success ? 'bg-[#d7ffb8] text-[#2b6401] border border-[#58cc02]' : 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {purchaseMsg.success ? 'check_circle' : 'error'}
          </span>
          <span>{purchaseMsg.text}</span>
        </div>
      )}

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shopItems.map((item) => {
          const canAfford = user.gems >= item.cost;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border-2 border-[#dde4e6] shadow-sm flex flex-col justify-between hover:border-[#0060ac] transition-all relative overflow-hidden"
            >
              {item.badge && (
                <span className="absolute top-3 right-3 bg-[#ffdbc9] text-[#9b4500] text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#ff8c42]/40">
                  {item.badge}
                </span>
              )}

              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#d4e3ff] text-[#0060ac] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                </div>
                <h3 className="font-heading font-extrabold text-base text-[#161d1f]">{item.name}</h3>
                <p className="text-xs text-[#564338] mt-1 leading-relaxed">{item.desc}</p>

                {item.ownedCount !== undefined && (
                  <p className="text-[11px] font-extrabold text-[#3a6a00] mt-2">
                    In Inventory: {item.ownedCount}
                  </p>
                )}
              </div>

              {/* Price & Buy Button */}
              <div className="mt-5 pt-3 border-t border-[#dde4e6] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-sm text-[#0060ac]">
                  <GemIcon size={18} />
                  <span>{item.cost}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                    canAfford
                      ? 'bg-[#0060ac] hover:bg-[#004e8c] text-white border-[#003866] cursor-pointer shadow-md'
                      : 'bg-[#e5e5e5] text-[#afafaf] border-[#afafaf] cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Purchase' : 'Need Gems'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
