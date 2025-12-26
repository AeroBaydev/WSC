import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import QuizSession from "@/lib/quizSessionModel";
import { verifyToken, extractToken } from "@/lib/jwtUtils";

/**
 * POST /api/quiz/heartbeat
 * Update last heartbeat timestamp
 * Client should call this every 5 seconds
 * 
 * Body: {
 *   currentQuestionId: number (optional)
 * }
 */
export async function POST(request) {
  try {
    await dbConnect();

    // Extract and verify token
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Find session
    const session = await QuizSession.findOne({ 
      email: decoded.email,
      sessionToken: token
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Check if session is already submitted
    if (session.status === 'submitted' || session.status === 'auto_submitted') {
      return NextResponse.json(
        { error: "Quiz already completed" },
        { status: 403 }
      );
    }

    // Check if time has expired (SERVER TIME CHECK)
    const now = new Date();
    if (now > session.endTime) {
      // Auto-submit if time expired
      session.status = 'auto_submitted';
      session.violationReasons.push('Time expired');
      await session.save();
      
      return NextResponse.json(
        { error: "Time limit exceeded. Quiz auto-submitted." },
        { status: 403 }
      );
    }

    // Update heartbeat (SERVER TIME)
    session.lastHeartbeat = now;
    await session.save();

    // Return server time for client sync
    return NextResponse.json({
      success: true,
      serverTime: now,
      endTime: session.endTime,
      timeRemaining: Math.max(0, session.endTime.getTime() - now.getTime())
    });

  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

