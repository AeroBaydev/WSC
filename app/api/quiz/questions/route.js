import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import QuizSession from "@/lib/quizSessionModel";
import { verifyToken, extractToken } from "@/lib/jwtUtils";
import { QUIZ_QUESTIONS } from "@/lib/quizQuestions";

/**
 * GET /api/quiz/questions
 * Fetch quiz questions (shuffled)
 * Requires valid JWT token in Authorization header
 */
export async function GET(request) {
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

    // Verify session exists and is active
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

    // Check heartbeat (if last heartbeat was more than 10 seconds ago, auto-submit)
    const heartbeatDiff = now.getTime() - session.lastHeartbeat.getTime();
    if (heartbeatDiff > 10000) { // 10 seconds
      session.status = 'auto_submitted';
      session.violationReasons.push('Heartbeat timeout');
      await session.save();
      
      return NextResponse.json(
        { error: "Connection lost. Quiz auto-submitted." },
        { status: 403 }
      );
    }

    // If questions already loaded, return stored order
    if (session.questionOrder && session.questionOrder.length > 0) {
      const questionMap = new Map(QUIZ_QUESTIONS.map(q => [q.id, q]));
      const shuffledQuestions = session.questionOrder.map(qId => {
        const q = questionMap.get(qId);
        if (!q) return null;
        
        const mapping = session.optionMappings?.find(m => m.questionId === qId)?.mapping || [0, 1, 2, 3];
        const shuffledOptions = mapping.map(origIdx => q.options[origIdx]);
        
        return {
          id: q.id,
          question: q.question,
          options: shuffledOptions,
        };
      }).filter(q => q !== null);

      return NextResponse.json({
        questions: shuffledQuestions,
        startTime: session.startTime,
        endTime: session.endTime,
        currentTime: now
      });
    }

    // First time: Shuffle questions and options, store mappings
    const shuffledQuestionIds = [...QUIZ_QUESTIONS]
      .map(q => q.id)
      .sort(() => Math.random() - 0.5);

    const optionMappings = [];
    const shuffledQuestions = shuffledQuestionIds.map(qId => {
      const q = QUIZ_QUESTIONS.find(orig => orig.id === qId);
      if (!q) return null;

      // Create shuffled option indices
      const originalIndices = [0, 1, 2, 3];
      const shuffledIndices = [...originalIndices].sort(() => Math.random() - 0.5);
      
      // Store mapping: shuffledIndex -> originalIndex
      optionMappings.push({
        questionId: q.id,
        mapping: shuffledIndices
      });

      // Create shuffled options array
      const shuffledOptions = shuffledIndices.map(origIdx => q.options[origIdx]);

      return {
        id: q.id,
        question: q.question,
        options: shuffledOptions,
      };
    }).filter(q => q !== null);

    // Store order and mappings in session
    session.questionOrder = shuffledQuestionIds;
    session.optionMappings = optionMappings;
    await session.save();

    // Return questions without correct answers
    return NextResponse.json({
      questions: shuffledQuestions,
      startTime: session.startTime,
      endTime: session.endTime,
      currentTime: now
    });

  } catch (error) {
    console.error("Fetch questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

