"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const [endTime, setEndTime] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const heartbeatIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const fullscreenCheckRef = useRef(null);

  // ============================================
  // STRICT ANTI-CHEATING MEASURES
  // ============================================

  // Auto-submit function
  const autoSubmit = useCallback(async (reason) => {
    if (isSubmitted || isSubmitting) return;

    console.log(`Auto-submitting due to: ${reason}`);
    
    try {
      const token = sessionToken || sessionStorage.getItem("quizToken");
      if (!token) return;

      // Submit current answers
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption: selectedOption !== null && selectedOption !== undefined ? selectedOption : null,
      }));

      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Clear intervals
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (fullscreenCheckRef.current) clearInterval(fullscreenCheckRef.current);

      // Show message and redirect
      alert(`Quiz auto-submitted due to: ${reason}`);
      router.push("/quiz/success");
    } catch (error) {
      console.error("Auto-submit error:", error);
    }
  }, [answers, isSubmitted, isSubmitting, sessionToken, router]);

  // Request fullscreen on load (non-blocking)
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen().catch(() => {
            // Don't auto-submit if user denies fullscreen
            console.warn("Fullscreen denied by user");
          });
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error("Fullscreen error:", error);
        // Don't auto-submit on fullscreen error, just warn
      }
    };

    if (!isLoading && questions.length > 0) {
      // Delay fullscreen request slightly to not block interactions
      setTimeout(() => {
        requestFullscreen();
      }, 500);
    }
  }, [isLoading, questions.length]);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );

      if (!isCurrentlyFullscreen && isFullscreen) {
        autoSubmit("Fullscreen exited");
      }
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen, autoSubmit]);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Disable copy, cut, paste
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      return false;
    };

    const handleCut = (e) => {
      e.preventDefault();
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // Disable keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+A, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block common shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "v" || e.key === "a" || e.key === "x" || e.key === "s" || e.key === "p")
      ) {
        e.preventDefault();
        return false;
      }
      // Block F12, Ctrl+Shift+I (DevTools)
      if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I")) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent back button
  useEffect(() => {
    const handlePopState = (e) => {
      window.history.pushState(null, "", window.location.href);
      autoSubmit("Back button pressed");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [autoSubmit]);

  // Tab/Browser visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        autoSubmit("Tab switched or browser minimized");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [autoSubmit]);

  // Prevent page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      autoSubmit("Page refresh or close attempted");
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [autoSubmit]);

  // ============================================
  // HEARTBEAT SYSTEM (CRITICAL)
  // ============================================

  useEffect(() => {
    if (!sessionToken || isSubmitted || isLoading) return;

    const sendHeartbeat = async () => {
      try {
        const currentQId = questions && questions.length > 0 ? questions[currentQuestionIndex]?.id : null;
        
        const response = await fetch("/api/quiz/heartbeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            currentQuestionId: currentQId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error && data.error.includes("auto-submitted")) {
            setIsSubmitted(true);
            router.push("/quiz/success");
          }
          return;
        }

        // Update time remaining from server (if provided) - but don't override local timer
        // The local timer is more accurate for display
        if (data.endTime) {
          const serverEndTime = new Date(data.endTime);
          if (endTime && Math.abs(serverEndTime.getTime() - endTime.getTime()) > 1000) {
            // Only update if there's a significant difference (more than 1 second)
            setEndTime(serverEndTime);
          }
        }

        // Check if time expired
        if (data.timeRemaining !== undefined && data.timeRemaining <= 0) {
          autoSubmit("Time expired");
        }
      } catch (error) {
        console.error("Heartbeat error:", error);
        // Don't auto-submit on network errors, just log
      }
    };

    // Send heartbeat every 5 seconds
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, 5000);
    
    // Send initial heartbeat after a short delay
    const initialTimeout = setTimeout(sendHeartbeat, 1000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      clearTimeout(initialTimeout);
    };
  }, [sessionToken, isSubmitted, isLoading, autoSubmit, router, questions, currentQuestionIndex, endTime]);

  // ============================================
  // TIMER (CLIENT DISPLAY ONLY - SERVER CONTROLLED)
  // ============================================

  useEffect(() => {
    if (!endTime || isSubmitted) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    // Don't restart if timer is already running
    if (timerIntervalRef.current) {
      return;
    }

    const updateTimer = () => {
      if (!endTime) return;
      
      const now = new Date().getTime();
      const remaining = Math.max(0, endTime.getTime() - now);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        autoSubmit("Time expired");
      }
    };

    // Update immediately
    updateTimer();
    
    // Then update every second
    timerIntervalRef.current = setInterval(updateTimer, 1000);
    
    console.log('✅ Timer started:', {
      endTime: endTime.toISOString(),
      now: new Date().toISOString(),
      remainingMs: endTime.getTime() - new Date().getTime()
    });

    return () => {
      // Only clear on unmount or when endTime/isSubmitted changes
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [endTime, isSubmitted]); // Removed autoSubmit from dependencies

  // ============================================
  // LOAD QUIZ DATA
  // ============================================

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const token = sessionStorage.getItem("quizToken");
        if (!token) {
          router.push("/quiz/register");
          return;
        }

        setSessionToken(token);

        const response = await fetch("/api/quiz/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error) {
            if (data.error.includes("already completed") || data.error.includes("auto-submitted")) {
              router.push("/quiz/success");
              return;
            }
            setError(data.error);
          }
          return;
        }

        setQuestions(data.questions);
        const endTimeDate = new Date(data.endTime);
        
        // Calculate initial time remaining
        const now = new Date().getTime();
        const initialRemaining = Math.max(0, endTimeDate.getTime() - now);
        
        console.log('Quiz loaded:', {
          questionsCount: data.questions.length,
          endTime: endTimeDate,
          initialRemaining: initialRemaining,
          initialRemainingMinutes: Math.floor(initialRemaining / 60000)
        });
        
        // Set endTime first, then timeRemaining, then stop loading
        setEndTime(endTimeDate);
        setTimeRemaining(initialRemaining);
        setIsLoading(false);
        
        console.log('Loading set to false, timer should start');
      } catch (error) {
        console.error("Load quiz error:", error);
        setError("Failed to load quiz. Please try again.");
      }
    };

    loadQuiz();
  }, [router]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnswerSelect = (optionIndex) => {
    console.log('🔵 handleAnswerSelect called:', { 
      optionIndex, 
      isSubmitted, 
      isSubmitting, 
      questionsLength: questions?.length,
      currentQuestionIndex 
    });
    
    // Only block if actually submitted or submitting
    if (isSubmitted) {
      console.log('❌ Blocked: Already submitted');
      return;
    }
    
    if (isSubmitting) {
      console.log('❌ Blocked: Currently submitting');
      return;
    }
    
    if (!questions || questions.length === 0) {
      console.error('❌ Questions not loaded yet!', { questions, questionsLength: questions?.length });
      return;
    }
    
    const questionId = questions[currentQuestionIndex]?.id;
    if (!questionId) {
      console.error('❌ Question ID not found!', { currentQuestionIndex, questionsLength: questions.length, questions });
      return;
    }
    
    // Ensure we store as number to match question IDs
    const normalizedQuestionId = Number(questionId);
    const normalizedOptionIndex = Number(optionIndex);
    
    const newAnswers = {
      ...answers,
      [normalizedQuestionId]: normalizedOptionIndex,
    };
    
    setAnswers(newAnswers);
    
    // Log for debugging
    console.log(`✅ Selected answer for question ${normalizedQuestionId}: option ${normalizedOptionIndex}`);
    console.log(`✅ Total answered: ${Object.keys(newAnswers).filter(k => newAnswers[k] !== undefined && newAnswers[k] !== null).length}/${questions.length}`);
    console.log('✅ Answers object:', newAnswers);
    
    // Auto-save answer to sessionStorage for persistence
    try {
      sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
      console.log('✅ Saved to sessionStorage');
    } catch (e) {
      console.error('❌ Failed to save answers to sessionStorage:', e);
    }
  };
  
  // Load saved answers from sessionStorage on mount
  useEffect(() => {
    if (questions.length > 0) {
      try {
        const savedAnswers = sessionStorage.getItem('quizAnswers');
        if (savedAnswers) {
          const parsed = JSON.parse(savedAnswers);
          setAnswers(parsed);
        }
      } catch (e) {
        console.error('Failed to load answers from sessionStorage:', e);
      }
    }
  }, [questions.length]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;

    // Check unanswered questions
    const unansweredCount = questions.length - Object.keys(answers).length;
    
    let confirmMessage = "Are you sure you want to submit? You cannot change your answers after submission.";
    if (unansweredCount > 0) {
      confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit? You cannot change your answers after submission.`;
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert answers object to array, ensuring proper types
      const answersArray = Object.entries(answers)
        .filter(([questionId, selectedOption]) => selectedOption !== undefined)
        .map(([questionId, selectedOption]) => ({
          questionId: parseInt(questionId) || Number(questionId),
          selectedOption: selectedOption !== null && selectedOption !== undefined ? Number(selectedOption) : null,
        }));

      // Add unanswered questions
      questions.forEach((q) => {
        const questionId = Number(q.id);
        if (!answersArray.find((a) => Number(a.questionId) === questionId)) {
          answersArray.push({
            questionId: questionId,
            selectedOption: null,
          });
        }
      });

      // Log for debugging
      console.log("📤 Submitting answers:", answersArray);
      console.log("📊 Total answers to submit:", answersArray.length);
      console.log("✅ Answered questions:", answersArray.filter(a => a.selectedOption !== null).length);
      console.log("❌ Unanswered questions:", answersArray.filter(a => a.selectedOption === null).length);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let response;
      let data;

      try {
        response = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ answers: answersArray }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if response is ok before parsing JSON
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Submission failed" }));
          throw new Error(errorData.error || `Submission failed: ${response.status}`);
        }

        data = await response.json();
        console.log("✅ Submission successful:", data);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error("Submission timed out. Please check your internet connection and try again.");
        }
        throw fetchError;
      }

      // Success - proceed with cleanup and redirect
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Clear intervals
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (fullscreenCheckRef.current) {
        clearInterval(fullscreenCheckRef.current);
        fullscreenCheckRef.current = null;
      }

      // Clear session storage
      try {
        sessionStorage.removeItem("quizToken");
        sessionStorage.removeItem("quizStartTime");
        sessionStorage.removeItem("quizEndTime");
        sessionStorage.removeItem("quizAnswers");
      } catch (e) {
        console.warn("Failed to clear session storage:", e);
      }

      // Redirect to success page
      console.log("🔄 Redirecting to success page...");
      router.push("/quiz/success");
      
      // Fallback redirect if router.push doesn't work
      setTimeout(() => {
        window.location.href = "/quiz/success";
      }, 1000);
      
    } catch (error) {
      console.error("❌ Submit error:", error);
      setError(error.message || "Failed to submit. Please try again.");
      setIsSubmitting(false);
      
      // Show error to user
      alert(`Submission failed: ${error.message}. Please try again or contact support.`);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/quiz/register")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  // Ensure we check answer with both string and number keys
  const currentAnswer = answers[currentQuestion.id] ?? answers[String(currentQuestion.id)] ?? answers[Number(currentQuestion.id)];
  const answeredCount = Object.keys(answers).filter(key => answers[key] !== undefined && answers[key] !== null).length;
  const totalQuestions = questions.length;

  // Format time
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gray-50" style={{ pointerEvents: 'auto' }}>
      {/* Header with Timer */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                World Skill Challenge – Stars and Beyond
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeRemaining < 300000 ? "text-red-600 animate-pulse" : "text-gray-900"}`}>
                {timeString}
              </div>
              <div className="text-xs text-gray-500">
                {answeredCount} / {totalQuestions} answered
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${
                answeredCount === totalQuestions ? "bg-green-500" : "bg-indigo-600"
              }`}
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
          
          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-2 mt-3">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
              const isCurrent = idx === currentQuestionIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    isCurrent
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300 scale-110"
                      : isAnswered
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  title={`Question ${idx + 1}${isAnswered ? " (Answered)" : " (Not answered)"}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8" style={{ pointerEvents: 'auto' }}>
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6" style={{ pointerEvents: 'auto' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options - Radio Button Style */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const optionLabels = ['A', 'B', 'C', 'D'];
              // Check if this option is selected (compare both number and string)
              const isSelected = currentAnswer === index || currentAnswer === String(index) || Number(currentAnswer) === index;
              
              return (
                <label
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Label clicked for option', index);
                    handleAnswerSelect(index);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent text selection
                  }}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                  style={{ pointerEvents: 'auto', userSelect: 'none' }}
                >
                  <div className="flex items-center h-5 mt-0.5 mr-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        console.log('Radio onChange for option', index);
                        handleAnswerSelect(index);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Radio onClick for option', index);
                        handleAnswerSelect(index);
                      }}
                      className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 focus:ring-2 cursor-pointer pointer-events-auto"
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                            : "border-gray-300 bg-white text-gray-600"
                        }`}
                      >
                        {optionLabels[index]}
                      </span>
                      <span className={`text-gray-900 text-lg leading-relaxed ${isSelected ? "font-semibold text-indigo-900" : ""}`}>
                        {option}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-auto flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-2">
            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmitted}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Quiz
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Answer Status Indicator */}
        {currentAnswer !== undefined && currentAnswer !== null ? (
          <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Answer selected</span>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium">Please select an answer</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Warning */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          ⚠️ Warning: Do not switch tabs, minimize the browser, or exit fullscreen mode. 
          Any violation will result in automatic submission.
        </div>
      </div>
    </div>
  );
}