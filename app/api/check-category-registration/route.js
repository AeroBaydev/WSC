import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect.js';
import CategoryRegistration from '@/lib/categoryRegistrationModel.js';

export async function GET(request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Find all category registrations for this user
    const registrations = await CategoryRegistration.find({ 
      clerkUserId: userId 
    }).select('category paymentStatus registeredAt');

    console.log('Found registrations for user:', userId, registrations);

    return NextResponse.json({ 
      success: true, 
      registrations: registrations || [],
      userId: userId
    });

  } catch (error) {
    console.error('Check category registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
