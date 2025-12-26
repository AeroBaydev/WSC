import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import QuizSession from "@/lib/quizSessionModel";
import { verifyToken, extractToken } from "@/lib/jwtUtils";
import { QUIZ_QUESTIONS, QUIZ_CONFIG } from "@/lib/quizQuestions";

/**
 * POST /api/quiz/submit
 * Submit quiz answers and calculate score
 * 
 * Body: {
 *   answers: [
 *     { questionId: number, selectedOption: number },
 *     ...
 *   ]
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

    // Check if already submitted
    if (session.status === 'submitted' || session.status === 'auto_submitted') {
      return NextResponse.json(
        { error: "Quiz already submitted" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    // Save answers
    const now = new Date();
    session.answers = answers.map(ans => ({
      questionId: ans.questionId,
      selectedOption: ans.selectedOption !== null && ans.selectedOption !== undefined ? ans.selectedOption : null,
      answeredAt: now
    }));

    // Log for debugging
    console.log(`Saving ${session.answers.length} answers for session ${session._id}`);
    console.log(`Answered questions: ${session.answers.filter(a => a.selectedOption !== null).length}`);
    console.log(`Unanswered questions: ${session.answers.filter(a => a.selectedOption === null).length}`);

    // Calculate score on SERVER
    // Need to map shuffled option indices back to original indices
    let score = 0;
    const questionMap = new Map(QUIZ_QUESTIONS.map(q => [q.id, q]));

    answers.forEach(ans => {
      const question = questionMap.get(ans.questionId);
      if (!question) return;

      // If no option mapping stored (backward compatibility), use direct comparison
      if (!session.optionMappings || session.optionMappings.length === 0) {
        if (ans.selectedOption === question.correctAnswer) {
          score += QUIZ_CONFIG.marksPerQuestion;
        }
        return;
      }

      // Find option mapping for this question
      const mapping = session.optionMappings.find(m => m.questionId === ans.questionId);
      if (!mapping || !mapping.mapping) {
        // Fallback: direct comparison
        if (ans.selectedOption === question.correctAnswer) {
          score += QUIZ_CONFIG.marksPerQuestion;
        }
        return;
      }

      // Map shuffled index to original index
      // mapping.mapping[shuffledIndex] = originalIndex
      if (ans.selectedOption !== null && ans.selectedOption !== undefined) {
        const originalIndex = mapping.mapping[ans.selectedOption];
        if (originalIndex === question.correctAnswer) {
          score += QUIZ_CONFIG.marksPerQuestion;
        }
      }
    });

    // Update session
    session.score = score;
    session.status = 'submitted';
    session.submittedAt = now;
    
    console.log(`Saving session with score: ${score}, status: submitted`);
    await session.save();
    console.log(`Session saved successfully: ${session._id}`);

    // Return success (DO NOT return score or correct answers)
    return NextResponse.json({
      message: "Your response has been submitted successfully.",
      submittedAt: session.submittedAt
    }, { status: 200 });

  } catch (error) {
    console.error("Submit quiz error:", error);
    console.error("Error stack:", error.stack);
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || "Internal server error"
      : "Internal server error. Please try again.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

