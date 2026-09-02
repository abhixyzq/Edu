import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { GEM_PACKAGES_CONFIG } from '@/lib/gemPacks';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { packageId, userId } = body;

    // 1. Strict Server-Side Validation of Package & Price
    const pack = GEM_PACKAGES_CONFIG[packageId];
    if (!pack) {
      return NextResponse.json(
        { success: false, error: 'Invalid gem package selected.' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 2. Sandbox / Test Fallback if keys are not set in environment yet
    if (!keyId || !keySecret || keyId === 'rzp_test_placeholder') {
      return NextResponse.json({
        success: true,
        isSandbox: true,
        orderId: `order_test_${Date.now()}`,
        amount: pack.pricePaise,
        currency: 'INR',
        packageId: pack.id,
        packageName: pack.name,
        totalGems: pack.gems + pack.bonusGems,
        keyId: 'rzp_test_placeholder',
      });
    }

    // 3. Official Razorpay Order Creation
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: pack.pricePaise, // Amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${(userId || 'guest').slice(0, 6)}`,
      notes: {
        packageId: pack.id,
        packageName: pack.name,
        totalGems: String(pack.gems + pack.bonusGems),
        userId: userId || 'anonymous',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      isSandbox: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      packageId: pack.id,
      packageName: pack.name,
      totalGems: pack.gems + pack.bonusGems,
      keyId,
    });
  } catch (error: any) {
    console.error('[Razorpay Order API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment order.' },
      { status: 500 }
    );
  }
}
