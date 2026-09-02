'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick, playGemDing, playLevelUpFanfare } from '@/lib/soundEffects';
import { GemIcon } from '@/components/icons/AppIcons';
import { GEM_PACKAGES_CONFIG, GemPackageConfig } from '@/lib/gemPacks';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface PowerUpItem {
  id: 'heart_refill' | 'streak_freeze' | 'infinite_hearts' | 'double_xp';
  name: string;
  desc: string;
  icon: string;
  cost: number;
  badge?: string;
  ownedCount?: number;
}

export function StoreClient() {
  const router = useRouter();
  const { user, addGems, buyShopItem } = useUser();

  const [selectedPack, setSelectedPack] = useState<GemPackageConfig | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'initiating' | 'sandbox_modal' | 'processing' | 'success'>('idle');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [successData, setSuccessData] = useState<{ gems: number; packName: string; paymentId?: string } | null>(null);

  // ─── 1. Dynamically Load Razorpay Script ───
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('razorpay-checkout-sdk')) return;

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const powerUpItems: PowerUpItem[] = [
    {
      id: 'heart_refill',
      name: 'Full Heart Refill',
      desc: 'Instantly restores your lives back to full 5/5 so you can resume practice immediately.',
      icon: 'favorite',
      cost: 50,
      badge: 'Quick Refill',
    },
    {
      id: 'infinite_hearts',
      name: 'Infinite Hearts Pass',
      desc: '2 hours of unlimited practice without heart penalties. Perfect for deep study sessions!',
      icon: 'all_inclusive',
      cost: 150,
      badge: '2 Hours Unlimited',
    },
    {
      id: 'streak_freeze',
      name: 'Streak Freeze',
      desc: 'Automatically protects your study streak if you miss practicing for one calendar day.',
      icon: 'ac_unit',
      cost: 100,
      ownedCount: user.inventory.streakFreeze,
    },
    {
      id: 'double_xp',
      name: 'Double XP Booster',
      desc: 'Doubles all XP earned from quizzes and practice mocks for the next 3 tests.',
      icon: 'bolt',
      cost: 80,
      ownedCount: user.inventory.doubleXpCount,
    },
  ];

  // ─── 2. Secure Razorpay Order Creation & Verification ───
  const handleBuyPackage = async (pack: GemPackageConfig) => {
    playButtonClick();
    setSelectedPack(pack);
    setPaymentStep('initiating');

    try {
      // Create Order on Server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pack.id,
          userId: user.id || undefined,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setToastMsg({ text: orderData.error || 'Failed to initialize payment.', success: false });
        setPaymentStep('idle');
        return;
      }

      // If Razorpay live/test keys are present and SDK loaded, open official Razorpay Popup
      if (!orderData.isSandbox && typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'nainixOne Store',
          description: `${pack.name} (${pack.gems + pack.bonusGems} Gems)`,
          image: '/images/nainix_logo.png',
          order_id: orderData.orderId,
          prefill: {
            name: user.name || '',
            email: user.email || '',
          },
          theme: {
            color: '#7c3aed',
          },
          handler: async function (response: any) {
            setPaymentStep('processing');
            // Verify HMAC signature on Server
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                packageId: pack.id,
                userId: user.id || undefined,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const totalGems = pack.gems + pack.bonusGems;
              addGems(totalGems);
              playLevelUpFanfare();
              setSuccessData({
                gems: totalGems,
                packName: pack.name,
                paymentId: response.razorpay_payment_id,
              });
              setPaymentStep('success');
            } else {
              setToastMsg({ text: 'Payment verification failed. Please contact support.', success: false });
              setPaymentStep('idle');
            }
          },
          modal: {
            ondismiss: function () {
              setPaymentStep('idle');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback to Sandbox UPI Modal (Instant testing mode before keys are pasted)
        setPaymentStep('sandbox_modal');
      }
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      setToastMsg({ text: 'Could not connect to payment gateway.', success: false });
      setPaymentStep('idle');
    }
  };

  // ─── 3. Complete Sandbox Payment (Dev Testing) ───
  const completeSandboxPayment = async () => {
    if (!selectedPack) return;
    playButtonClick();
    setPaymentStep('processing');

    try {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPack.id,
          userId: user.id || undefined,
          isSandbox: true,
          razorpay_payment_id: `pay_sandbox_${Date.now()}`,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        const totalGems = selectedPack.gems + selectedPack.bonusGems;
        addGems(totalGems);
        playLevelUpFanfare();
        setSuccessData({
          gems: totalGems,
          packName: selectedPack.name,
          paymentId: verifyData.paymentId,
        });
        setPaymentStep('success');
      } else {
        setToastMsg({ text: 'Payment processing error.', success: false });
        setPaymentStep('idle');
      }
    } catch {
      setToastMsg({ text: 'Payment verification error.', success: false });
      setPaymentStep('idle');
    }
  };

  const closePaymentModal = () => {
    playButtonClick();
    setSelectedPack(null);
    setPaymentStep('idle');
    setSuccessData(null);
  };

  // ─── 4. Spend Gems on In-App Power-Ups ───
  const handleSpendGems = (item: PowerUpItem) => {
    playButtonClick();
    if (user.gems < item.cost) {
      setToastMsg({
        text: `You need ${item.cost - user.gems} more Gems! Buy a gem bundle above to recharge.`,
        success: false,
      });
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    const success = buyShopItem(item.id, item.cost);
    if (success) {
      setToastMsg({
        text: `Unlocked ${item.name}! 🎉`,
        success: true,
      });
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const packList = Object.values(GEM_PACKAGES_CONFIG);

  return (
    <main className="w-full min-h-screen bg-[#faf6f0] pb-32 font-sans select-none">
      
      {/* ─── 1. Header Banner ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#faf6f0] pt-4 pb-4 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          
          {/* Top Row: Back button + Live Gem Balance */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>

            {/* Live Gems Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border-2 border-[#c4b5fd] shadow-sm">
              <GemIcon size={20} className="animate-pulse" />
              <div className="leading-none">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Balance</span>
                <span className="text-sm font-black text-violet-950">{user.gems.toLocaleString()} Gems</span>
              </div>
            </div>
          </div>

          {/* Banner Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-b-4 border-[#e2e8f0] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-[#7c3aed] text-[10px] font-black uppercase tracking-wider inline-block mb-1.5">
                  Verified Store 💎
                </span>
                <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Power Up Your Study Journey
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Refill test lives, protect study streaks, activate 2x XP, and practice uninterrupted.
                </p>
              </div>

              <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                <img
                  src="/images/trophy_cat.png"
                  alt="Store Mascot"
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Notification Toast ─── */}
      {toastMsg && (
        <div className="max-w-md mx-auto px-4 mb-3">
          <div
            className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md animate-in fade-in ${
              toastMsg.success
                ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-2 border-rose-300'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toastMsg.success ? 'check_circle' : 'error'}
            </span>
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-6">

        {/* ─── 2. GEM PACKAGES (RAZORPAY VERIFIED EARNING) ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-1.5">
                <span>💎</span>
                <span>Get More Gems</span>
              </h2>
              <p className="text-[11px] text-slate-500">Verified Razorpay UPI & Cards &bull; Instant Delivery</p>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <span>🛡️</span>
              <span>Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packList.map((pack) => (
              <div
                key={pack.id}
                onClick={() => handleBuyPackage(pack)}
                className={`bg-white rounded-3xl p-4 border-2 border-b-4 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex flex-col justify-between relative shadow-xs ${
                  pack.popular
                    ? 'border-[#7c3aed] shadow-violet-100 ring-2 ring-violet-200'
                    : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                {/* Badge */}
                {pack.badge && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-xs border border-white">
                    {pack.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{pack.icon}</span>
                      <div>
                        <h3 className="font-heading font-black text-slate-900 text-sm leading-tight">
                          {pack.name}
                        </h3>
                        <p className="text-[10px] font-bold text-[#7c3aed]">
                          {pack.gems.toLocaleString()} Gems
                          {pack.bonusGems > 0 && (
                            <span className="text-emerald-600 ml-1">+{pack.bonusGems} Bonus</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    {pack.description}
                  </p>
                </div>

                {/* Price & Buy Button */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 block">Price</span>
                    <span className="text-base font-black text-slate-900 leading-none">
                      ₹{pack.priceInr}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyPackage(pack);
                    }}
                    className="px-4 py-2 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-xs shadow-md shadow-purple-500/20 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="py-2 px-3 rounded-2xl bg-slate-100/80 border border-slate-200 text-center flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-black">✓</span> 100% Razorpay Protected
            </span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-black">✓</span> Instant Automatic Wallet Credit
            </span>
          </div>
        </section>

        {/* ─── 3. POWER-UPS & INVENTORY (SPEND GEMS) ─── */}
        <section className="space-y-3 pt-2">
          <div>
            <h2 className="font-heading text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-1.5">
              <span>⚡</span>
              <span>Power-Ups & Practice Passes</span>
            </h2>
            <p className="text-[11px] text-slate-500">Use your gems to refill lives and boost practice results</p>
          </div>

          <div className="space-y-2.5">
            {powerUpItems.map((item) => {
              const canAfford = user.gems >= item.cost;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 border-2 border-b-4 border-[#e2e8f0] shadow-2xs flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 text-[#7c3aed] border border-violet-200 flex items-center justify-center shrink-0 shadow-2xs">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate">
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[8px] font-black uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Cost & Buy Button */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 font-black text-xs text-violet-950">
                      <GemIcon size={16} />
                      <span>{item.cost}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpendGems(item)}
                      className={`px-3 py-1.5 rounded-xl font-heading font-black text-xs transition-all active:scale-95 cursor-pointer ${
                        canAfford
                          ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {canAfford ? 'Redeem' : 'Need Gems'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. FREE GEMS SECTION ─── */}
        <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-black uppercase tracking-wider inline-block mb-1">
                Zero Cost
              </span>
              <h3 className="font-heading font-black text-base sm:text-lg leading-tight">
                Want Free Gems?
              </h3>
              <p className="text-xs text-amber-100 mt-1 leading-snug">
                Invite your school & coaching classmates. You both get <b>50 FREE Gems 💎</b> when they join!
              </p>

              <Link
                href="/friends"
                onClick={playButtonClick}
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-2xl bg-white text-orange-600 font-black text-xs shadow-md active:scale-95 transition-all"
              >
                <span>Invite Classmates (+50 Gems)</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>

            <div className="w-20 shrink-0 text-center">
              <span className="text-4xl">🎁</span>
            </div>
          </div>
        </section>

      </div>

      {/* ─── 5. SECURE CHECKOUT / SANDBOX MODAL ─── */}
      {selectedPack && (paymentStep === 'sandbox_modal' || paymentStep === 'processing' || paymentStep === 'success') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[36px] sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPack.icon}</span>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    {selectedPack.name}
                  </h3>
                  <p className="text-xs font-bold text-[#7c3aed]">
                    {selectedPack.gems + selectedPack.bonusGems} Total Gems
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePaymentModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: PAYMENT METHOD SELECT */}
            {paymentStep === 'sandbox_modal' && (
              <div className="space-y-3.5 my-4">
                
                {/* Order Summary Box */}
                <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-violet-700 tracking-wider block">Total Payable</span>
                    <span className="text-xl font-black text-violet-950">₹{selectedPack.priceInr}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-violet-200/80 text-violet-900 font-bold text-xs">
                    💎 +{selectedPack.gems + selectedPack.bonusGems} Gems
                  </span>
                </div>

                {/* UPI Method Selection Tabs */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Select UPI Payment Mode
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { id: 'gpay', label: 'Google Pay', icon: '📱' },
                      { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', label: 'Paytm', icon: '🔵' },
                      { id: 'qr', label: 'Scan QR', icon: '📷' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(m.id as any)}
                        className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedUpiApp === m.id
                            ? 'bg-violet-50 border-[#7c3aed] text-[#7c3aed] font-black shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base block mb-0.5">{m.icon}</span>
                        <span className="text-[10px] block leading-tight">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR Code Preview or UPI ID input */}
                {selectedUpiApp === 'qr' ? (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                    <div className="w-28 h-28 bg-white border-2 border-slate-300 rounded-2xl p-1.5 flex items-center justify-center shadow-xs">
                      <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-4xl">qr_code_2</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-2">
                      Scan with any UPI app to pay ₹{selectedPack.priceInr}
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      Enter UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#7c3aed] transition-colors"
                    />
                  </div>
                )}

                {/* Pay Button */}
                <button
                  type="button"
                  onClick={completeSandboxPayment}
                  className="w-full py-3 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-sm shadow-md shadow-purple-500/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Pay ₹{selectedPack.priceInr} via UPI</span>
                </button>

                <p className="text-[9px] text-center text-slate-400 font-semibold">
                  🔒 Server-Verified Cryptographic Check &bull; Safe Checkout
                </p>
              </div>
            )}

            {/* STEP 2: PROCESSING ANIMATION */}
            {paymentStep === 'processing' && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full border-4 border-violet-200 border-t-[#7c3aed] animate-spin" />
                <h4 className="font-heading font-black text-slate-900 text-base">
                  Verifying Payment Signature...
                </h4>
                <p className="text-xs text-slate-500">
                  Cryptographically validating order and crediting gems into your wallet.
                </p>
              </div>
            )}

            {/* STEP 3: SUCCESS STATE */}
            {paymentStep === 'success' && successData && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h4 className="font-heading font-black text-slate-900 text-lg">
                  Payment Verified! 🎉
                </h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  <b className="text-[#7c3aed]">+{successData.gems} Gems</b> have been securely credited to your wallet. You now have <b>{user.gems} Gems</b>!
                </p>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="w-full py-2.5 mt-2 rounded-2xl bg-[#7c3aed] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Awesome! Continue Learning 🚀
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
