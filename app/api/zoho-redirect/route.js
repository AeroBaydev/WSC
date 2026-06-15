import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect.js';
import { getBasePriceInPaise } from '@/lib/pricing.js';
import { validateAndPriceWithCoupon } from '@/lib/coupon.js';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit.js';

export const runtime = 'nodejs';
export const preferredRegion = ['bom1'];
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const rate = await checkRateLimit(`zoho-redirect:${getClientIp(request)}`, {
      limit: 5,
      windowSec: 60,
    });
    if (!rate.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get('clerkUserId');
    const category = searchParams.get('category');
    const email = searchParams.get('email');
    const coupon = searchParams.get('coupon') || '';

    if (!clerkUserId || !category || !email) {
      return NextResponse.json({ error: 'Missing required params' }, { status: 400 });
    }

    await dbConnect();

    let basePricePaise;
    try {
      basePricePaise = getBasePriceInPaise(category);
    } catch {
      return NextResponse.json({ error: 'Unknown category' }, { status: 400 });
    }

    const { finalPricePaise } = await validateAndPriceWithCoupon({
      category,
      basePricePaise,
      couponCode: coupon,
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const baseUrl = 'https://api.razorpay.com/v1';

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const successUrl = `https://worldskillchallenge.com/registration-success?clerkUserId=${encodeURIComponent(clerkUserId)}&category=${encodeURIComponent(category)}`;

    const payload = {
      amount: finalPricePaise,
      currency: 'INR',
      accept_partial: false,
      description: `Registration for ${category}`,
      customer: {
        name: email,
        email,
      },
      notify: { sms: false, email: true },
      reminder_enable: true,
      notes: {
        clerkUserId,
        category,
        email,
        coupon,
        app: 'wsc',
      },
      callback_url: successUrl,
      callback_method: 'get',
    };

    const resp = await fetch(`${baseUrl}/payment_links`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!resp.ok) {
      console.error('[zoho-redirect] Razorpay payment link error');
      return NextResponse.json({ error: 'Failed to create payment link' }, { status: 502 });
    }

    const data = await resp.json();
    return NextResponse.redirect(data.short_url);
  } catch (err) {
    console.error('[zoho-redirect] error:', err?.message || err);

    if (err.name === 'AbortError') {
      return NextResponse.json({ error: 'Payment service timeout - please try again' }, { status: 504 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
