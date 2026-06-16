import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect.js';
import CategoryRegistration from '@/lib/categoryRegistrationModel.js';
import { syncRegistrationToZohoSheet } from '@/lib/zohoSheetSync.js';
import { secureCompare } from '@/lib/secureCompare.js';
import { confirmCouponRedemption } from '@/lib/couponRedemption.js';
import { getActiveSeasonOptional } from '@/lib/seasonService.js';
import { buildRegistrationCreatePayload } from '@/lib/registrationService.js';

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

function resolveSeasonIdFromNotes(notes) {
  const raw = notes?.seasonId;
  if (!raw || !mongoose.Types.ObjectId.isValid(String(raw))) return null;
  return new mongoose.Types.ObjectId(String(raw));
}

async function findRegistrationForWebhook({ paymentLinkId, clerkUserId, category, seasonId }) {
  if (paymentLinkId) {
    const byLink = await CategoryRegistration.findOne({ paymentLinkId });
    if (byLink) return byLink;
  }

  if (clerkUserId && category && seasonId) {
    const bySeason = await CategoryRegistration.findOne({
      clerkUserId,
      seasonId,
      category,
    });
    if (bySeason) return bySeason;
  }

  if (clerkUserId && category) {
    const activeSeason = await getActiveSeasonOptional();
    if (activeSeason) {
      const byActiveSeason = await CategoryRegistration.findOne({
        clerkUserId,
        seasonId: activeSeason._id,
        category,
      });
      if (byActiveSeason) return byActiveSeason;
    }
  }

  if (clerkUserId) {
    return CategoryRegistration.findOne({
      clerkUserId,
      paymentStatus: { $in: ['pending', 'initiated'] },
    }).sort({ createdAt: -1 });
  }

  return null;
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

async function syncZohoIfNeeded(registration, event) {
  if (registration.paymentStatus !== 'success' || registration.zohoSheetSyncedAt || event !== 'payment_link.paid') {
    return;
  }

  try {
    const syncRes = await syncRegistrationToZohoSheet(registration);
    if (syncRes?.ok) {
      registration.zohoSheetSyncedAt = new Date();
      registration.zohoSheetLastError = undefined;
      await registration.save();
    } else if (!syncRes?.skipped) {
      registration.zohoSheetLastError = String(syncRes?.error || 'Zoho sheet sync failed');
      await registration.save();
    }
  } catch (e) {
    try {
      registration.zohoSheetLastError = String(e?.message || e);
      await registration.save();
    } catch (_) {}
  }
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
    const seasonId = resolveSeasonIdFromNotes(notes);

    if (isSuccessEvent) {
      let registration = await findRegistrationForWebhook({
        paymentLinkId,
        clerkUserId,
        category,
        seasonId,
      });

      if (!registration && clerkUserId && category) {
        const activeSeason = await getActiveSeasonOptional();
        if (activeSeason) {
          registration = await CategoryRegistration.create({
            ...buildRegistrationCreatePayload({
              clerkUserId,
              email: notes.email || 'unknown@example.com',
              category,
              season: activeSeason,
            }),
            paymentStatus: 'success',
            paymentOrderId: paymentId,
            paymentLinkId,
            paymentAmount: notes.paymentAmount || undefined,
            zohoFormData: notes.zohoFormData ? JSON.parse(notes.zohoFormData) : {},
            registeredAt: new Date(),
          });
        }
      }

      if (registration) {
        const result = await markSuccess(registration, {
          paymentId,
          paymentLinkId,
          notes,
          paidAmountPaise,
        });
        if (result.ok) {
          await syncZohoIfNeeded(registration, event);
        }
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
