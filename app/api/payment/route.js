import { NextResponse } from 'next/server';
import { createPaymentData } from '@/lib/payu-utils';

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, productInfo, customerName, customerEmail, customerPhone } = body;

    // Validate required fields
    if (!amount || !productInfo || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const merchantKey = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY;
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;

    if (!merchantKey || !merchantSalt) {
      return NextResponse.json(
        { error: 'PayU configuration missing' },
        { status: 500 }
      );
    }

    // Create payment data with hash
    const paymentData = createPaymentData({
      amount,
      productInfo,
      customerName,
      customerEmail,
      customerPhone,
      merchantKey,
      salt: merchantSalt,
    });

    return NextResponse.json({
      success: true,
      paymentData,
      payuUrl: process.env.NEXT_PUBLIC_PAYU_BASE_URL,
    });

  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}