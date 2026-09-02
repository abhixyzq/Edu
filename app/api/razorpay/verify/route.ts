import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { GEM_PACKAGES_CONFIG } from '@/lib/gemPacks';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      packageId,
      userId,
      isSandbox,
    } = body;

    // 1. Verify package exists
    const pack = GEM_PACKAGES_CONFIG[packageId];
    if (!pack) {
      return NextResponse.json(
        { success: false, error: 'Invalid gem package identifier.' },
        { status: 400 }
      );
    }

    const totalGemsToAdd = pack.gems + pack.bonusGems;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 2. Sandbox Verification (if secret not set or sandbox requested)
    if (isSandbox || !keySecret || keySecret === 'your-razorpay-secret-key') {
      let updatedUserGems: number | null = null;

      // Update Supabase profile if userId is valid UUID
      if (userId && userId.length > 10) {
        try {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('gems')
            .eq('id', userId)
            .single();

          const currentGems = profile?.gems || 0;
          const nextGems = currentGems + totalGemsToAdd;

          await supabaseAdmin
            .from('profiles')
            .update({ gems: nextGems })
            .eq('id', userId);

          updatedUserGems = nextGems;
        } catch (dbErr) {
          console.warn('[Razorpay Verify] Supabase update warning:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        verified: true,
        isSandbox: true,
        packageId: pack.id,
        packageName: pack.name,
        gemsAdded: totalGemsToAdd,
        updatedGems: updatedUserGems,
        paymentId: razorpay_payment_id || `pay_test_${Date.now()}`,
        message: 'Sandbox payment verified successfully.',
      });
    }

    // 3. Official Cryptographic HMAC SHA-256 Signature Verification
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment signature parameters.' },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(razorpay_signature, 'utf-8')
    );

    if (!isAuthentic) {
      console.error('[Razorpay Verify] Tampered signature detected!');
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Transaction rejected.' },
        { status: 400 }
      );
    }

    // 4. Payment is 100% Genuine & Verified — Credit Gems in Supabase via Admin Client
    let newBalance: number | null = null;
    if (userId && userId.length > 10) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('gems')
          .eq('id', userId)
          .single();

        const currentGems = Number(profile?.gems) || 0;
        newBalance = currentGems + totalGemsToAdd;

        await supabaseAdmin
          .from('profiles')
          .update({ gems: newBalance })
          .eq('id', userId);
      } catch (err) {
        console.error('[Razorpay Verify] Failed to update gems in Supabase:', err);
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      isSandbox: false,
      packageId: pack.id,
      packageName: pack.name,
      gemsAdded: totalGemsToAdd,
      updatedGems: newBalance,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      message: 'Payment verified and gems credited.',
    });
  } catch (error: any) {
    console.error('[Razorpay Verify API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
