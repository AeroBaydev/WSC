import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import QuizSession from "@/lib/quizSessionModel";
import { generateToken } from "@/lib/jwtUtils";
import { QUIZ_CONFIG } from "@/lib/quizQuestions";

/**
 * POST /api/quiz/register
 * Register user and start quiz session
 * 
 * Body: {
 *   fullName: string (required)
 *   email: string (required, unique)
 *   mentorName: string (required)
 *   schoolName: string (required)
 *   contactDetails: string (required)
 * }
 */
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { fullName, email, mentorName, schoolName, contactDetails } = body;

    // Validate required fields
    if (!fullName || !email || !mentorName || !schoolName || !contactDetails) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already has a session
    const existingSession = await QuizSession.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingSession) {
      // If session is already submitted or auto-submitted, block access
      if (existingSession.status === 'submitted' || existingSession.status === 'auto_submitted') {
        return NextResponse.json(
          { error: "You have already completed the quiz. Only one attempt is allowed." },
          { status: 403 }
        );
      }

      // If session is active, return existing session info
      if (existingSession.status === 'active') {
        const token = generateToken({ 
          email: existingSession.email,
          sessionId: existingSession._id.toString()
        });

        return NextResponse.json({
          message: "Session already exists",
          sessionToken: token,
          startTime: existingSession.startTime,
          endTime: existingSession.endTime,
          status: existingSession.status
        });
      }
    }

    // Calculate start and end times (SERVER TIME ONLY)
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (QUIZ_CONFIG.timeLimitMinutes * 60 * 1000));

    // Generate JWT token first (using email, will update with sessionId after save)
    const tempToken = generateToken({ 
      email: email.toLowerCase().trim(),
      temp: true
    });

    // Create new session with token
    const session = new QuizSession({
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      mentorName: mentorName.trim(),
      schoolName: schoolName.trim(),
      contactDetails: contactDetails.trim(),
      sessionToken: tempToken,
      startTime,
      endTime,
      lastHeartbeat: startTime,
      status: 'active',
      answers: []
    });

    await session.save();

    // Generate final JWT token with sessionId
    const token = generateToken({ 
      email: session.email,
      sessionId: session._id.toString()
    });

    // Update session with final token
    session.sessionToken = token;
    await session.save();

    return NextResponse.json({
      message: "Quiz session started successfully",
      sessionToken: token,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status
    }, { status: 201 });

  } catch (error) {
    console.error("Quiz registration error:", error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already registered. Only one attempt per email is allowed." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

