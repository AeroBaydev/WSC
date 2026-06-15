import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import dbConnect from '@/lib/dbConnect.js';
import CategoryRegistration from '@/lib/categoryRegistrationModel.js';
import { syncRegistrationToZohoSheet } from '@/lib/zohoSheetSync.js';
import { secureCompare } from '@/lib/secureCompare.js';
import { confirmCouponRedemption } from '@/lib/couponRedemption.js';

export const runtime = 'nodejs';
export const preferredRegion = ['bom1'];

function getPaidAmountPaise(paymentLinkEntity, paymentEntity) {
  const raw =
    paymentLinkEntity?.amount_paid ??
    paymentLinkEntity?.amount ??
    paymentEntity?.amount;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

async function markSuccess(registration, { paymentId, paymentLinkId, notes, paidAmountPaise }) {
  if (
    typeof registration.finalPricePaise === 'number' &&
    paidAmountPaise !== null &&
    paidAmountPaise !== registration.finalPricePaise
  ) {
    console.error('[razorpay-webhook] Amount mismatch:', {
      paymentLinkId,
      expected: registration.finalPricePaise,
      received: paidAmountPaise,
    });
    registration.paymentStatus = 'amount_mismatch';
    registration.zohoSheetLastError = `Expected ${registration.finalPricePaise}, received ${paidAmountPaise}`;
    await registration.save();
    return { ok: false, reason: 'amount_mismatch' };
  }

  registration.paymentStatus = 'success';
  registration.paymentOrderId = paymentId || registration.paymentOrderId;
  registration.paymentLinkId = paymentLinkId || registration.paymentLinkId;
  registration.transactionId = paymentId || registration.transactionId;
  if (notes?.paymentAmount && !registration.paymentAmount) {
    registration.paymentAmount = String(notes.paymentAmount);
  }
  registration.registeredAt = registration.registeredAt || new Date();
  await registration.save();

  if (registration.discountApplied && registration.couponCode) {
    await confirmCouponRedemption(registration.couponCode, registration._id);
  }

  return { ok: true };
}

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (!signature || !secureCompare(expected, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    await dbConnect();

    const event = payload.event;
    const inner = payload.payload || payload;
    const paymentLinkEntity = inner?.payment_link?.entity || inner?.payment_link;
    const paymentEntity = inner?.payment?.entity || inner?.payment;

    const notes = paymentLinkEntity?.notes || paymentEntity?.notes || {};
    const paymentId = paymentEntity?.id;
    const paymentLinkId = paymentLinkEntity?.id || paymentEntity?.payment_link_id;
    const paidAmountPaise = getPaidAmountPaise(paymentLinkEntity, paymentEntity);

    const isSuccessEvent = event === 'payment.captured' || event === 'payment_link.paid';
    const isFailureEvent = event === 'payment.failed' || event === 'payment_link.cancelled';

    const clerkUserId = notes.clerkUserId;
    const category = notes.category;

    if (!clerkUserId || !category) {
      if (paymentLinkId) {
        const reg = await CategoryRegistration.findOne({ paymentLinkId });
        if (reg) {
          if (isSuccessEvent) {
            await markSuccess(reg, { paymentId, paymentLinkId, notes, paidAmountPaise });
          } else if (isFailureEvent) {
            reg.paymentStatus = 'failed';
            reg.paymentOrderId = paymentId || reg.paymentOrderId;
            await reg.save();
          }
          if (isSuccessEvent && reg.paymentStatus === 'success' && !reg.zohoSheetSyncedAt && event === 'payment_link.paid') {
            try {
              const syncRes = await syncRegistrationToZohoSheet(reg);
              if (syncRes?.ok) {
                reg.zohoSheetSyncedAt = new Date();
                await reg.save();
              }
            } catch (_) {}
          }
          return NextResponse.json({ ok: true });
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (isSuccessEvent) {
      let registration = null;
      if (paymentLinkId) {
        registration = await CategoryRegistration.findOne({ paymentLinkId });
      }

      if (!registration && clerkUserId && category) {
        registration = await CategoryRegistration.findOne({ clerkUserId, category });
      }

      if (!registration && clerkUserId) {
        registration = await CategoryRegistration.findOne({
          clerkUserId,
          paymentStatus: { $in: ['pending', 'initiated'] },
        }).sort({ createdAt: -1 });
      }

      if (!registration) {
        registration = await CategoryRegistration.create({
          clerkUserId: clerkUserId || 'unknown',
          category: category || 'unknown',
          email: notes.email || 'unknown@example.com',
          paymentStatus: 'success',
          paymentOrderId: paymentId,
          paymentLinkId: paymentLinkId,
          paymentAmount: notes.paymentAmount || undefined,
          zohoFormData: notes.zohoFormData ? JSON.parse(notes.zohoFormData) : {},
          registeredAt: new Date(),
        });
      } else {
        const result = await markSuccess(registration, {
          paymentId,
          paymentLinkId,
          notes,
          paidAmountPaise,
        });
        if (!result.ok) {
          return NextResponse.json({ ok: true });
        }
      }

      try {
        if (registration.paymentStatus === 'success' && !registration.zohoSheetSyncedAt && event === 'payment_link.paid') {
          const syncRes = await syncRegistrationToZohoSheet(registration);
          if (syncRes?.ok) {
            registration.zohoSheetSyncedAt = new Date();
            registration.zohoSheetLastError = undefined;
            await registration.save();
          } else if (!syncRes?.skipped) {
            registration.zohoSheetLastError = String(syncRes?.error || 'Zoho sheet sync failed');
            await registration.save();
          }
        }
      } catch (e) {
        try {
          registration.zohoSheetLastError = String(e?.message || e);
          await registration.save();
        } catch (_) {}
      }
    } else if (isFailureEvent && paymentLinkId) {
      const reg = await CategoryRegistration.findOne({ paymentLinkId });
      if (reg) {
        reg.paymentStatus = 'failed';
        reg.paymentOrderId = paymentId || reg.paymentOrderId;
        await reg.save();
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[razorpay-webhook] error:', err?.message || err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
