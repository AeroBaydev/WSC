import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect.js';
import CategoryRegistration from '@/lib/categoryRegistrationModel.js';
import { secureCompare } from '@/lib/secureCompare.js';

export async function POST(request) {
  try {
    const webhookSecret = request.headers.get('x-zoho-webhook-secret');
    const body = await request.text();

    if (!webhookSecret || !process.env.ZOHO_WEBHOOK_SECRET) {
      console.error('[zoho-success] Missing webhook secret configuration');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!secureCompare(webhookSecret, process.env.ZOHO_WEBHOOK_SECRET)) {
      console.error('[zoho-success] Invalid webhook secret');
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const email = payload.Field_6;
    const clerkUserId = payload.Field_7;
    const category = payload.Field_8;
    const couponFromForm = payload.Field_9;
    const transactionId = payload.transaction_id || `webhook_${Date.now()}`;

    if (!email || !clerkUserId || !category) {
      console.error('[zoho-success] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const existingRegistration = await CategoryRegistration.findOne({
      clerkUserId,
      category,
    });

    if (existingRegistration) {
      existingRegistration.email = email || existingRegistration.email;
      existingRegistration.zohoFormData = {
        category,
        coupon: couponFromForm || undefined,
        transactionId,
      };
      await existingRegistration.save();
      return NextResponse.json({
        success: true,
        message: 'Registration metadata synced from Zoho',
        category,
        paymentStatus: existingRegistration.paymentStatus,
        registrationId: existingRegistration._id,
      });
    }

    const newRegistration = await CategoryRegistration.create({
      clerkUserId,
      email,
      category,
      paymentStatus: 'pending',
      transactionId,
      zohoFormData: {
        category,
        coupon: couponFromForm || undefined,
        transactionId,
      },
    });

    console.log('[zoho-success] Created pending registration:', {
      category,
      registrationId: String(newRegistration._id),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully registered in category',
      category,
      paymentStatus: newRegistration.paymentStatus,
      registrationId: newRegistration._id,
    });
  } catch (error) {
    console.error('[zoho-success] Webhook error:', error?.message || error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
