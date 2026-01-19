"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizTakePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60 * 1000); // 30 minutes in ms
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  
  const heartbeatIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const tokenRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const isSubmittingRef = useRef(false);

  // Anti-cheat: Disable right-click, copy, paste, etc.
  useEffect(() => {
    const disableContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const disableCopy = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        return false;
      }
    };

    const disableF12 = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        return false;
      }
    };

    const disablePrint = (e) => {
      if ((e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableCopy);
    document.addEventListener('keydown', disableF12);
    document.addEventListener('keydown', disablePrint);
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableCopy);
      document.removeEventListener('keydown', disableF12);
      document.removeEventListener('keydown', disablePrint);
    };
  }, []);

  // Anti-cheat: Detect tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarning(true);
        setViolationCount(prev => prev + 1);
        
        if (violationCount >= 2) {
          autoSubmit("Tab switch detected multiple times");
        }
      } else {
        setTabSwitchWarning(false);
      }
    };

    const handleBlur = () => {
      if (!document.hidden) {
        setTabSwitchWarning(true);
        setViolationCount(prev => prev + 1);
        
        if (violationCount >= 2) {
          autoSubmit("Window lost focus multiple times");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [violationCount]);

  // Anti-cheat: Prevent back button
  useEffect(() => {
    const handlePopState = (e) => {
      window.history.pushState(null, '', window.location.href);
      autoSubmit("Back button pressed");
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Anti-cheat: Prevent page reload/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = '';
        autoSubmit("Page reload/close attempted");
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Anti-cheat: Fullscreen detection
  useEffect(() => {
    const checkFullscreen = () => {
      const isFullscreen = document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.mozFullScreenElement || 
                          document.msFullscreenElement;
      
      if (!isFullscreen && !fullscreenWarning) {
        setFullscreenWarning(true);
        setViolationCount(prev => prev + 1);
        
        if (violationCount >= 1) {
          autoSubmit("Fullscreen exited");
        }
      }
    };

    const interval = setInterval(checkFullscreen, 1000);

    // Request fullscreen on load
    const requestFullscreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    };

    requestFullscreen();

    return () => {
      clearInterval(interval);
    };
  }, [fullscreenWarning, violationCount]);

  // Load questions on mount
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const token = localStorage.getItem("quizToken");
        if (!token) {
          router.push("/quiz/register");
          return;
        }

        tokenRef.current = token;
        startTimeRef.current = localStorage.getItem("quizStartTime");
        endTimeRef.current = localStorage.getItem("quizEndTime");

        const response = await fetch("/api/quiz/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            router.push("/quiz/success");
            return;
          }
          setError(data.error || "Failed to load questions");
          setLoading(false);
          return;
        }

        setQuestions(data.questions);
        
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach((q) => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);

        // Calculate time remaining
        if (data.endTime) {
          const endTime = new Date(data.endTime);
          const now = new Date(data.currentTime || new Date());
          const remaining = Math.max(0, endTime.getTime() - now.getTime());
          setTimeRemaining(remaining);
        }

        setLoading(false);
      } catch (err) {
        console.error("Load quiz error:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    loadQuiz();
  }, [router]);

  // Heartbeat system
  useEffect(() => {
    if (!tokenRef.current || loading) return;

    const sendHeartbeat = async () => {
      try {
        const response = await fetch("/api/quiz/heartbeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenRef.current}`,
          },
          body: JSON.stringify({
            currentQuestionId: questions[currentQuestionIndex]?.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            autoSubmit(data.error || "Time expired or connection lost");
            return;
          }
        }

        // Update time remaining from server
        if (data.timeRemaining !== undefined) {
          setTimeRemaining(data.timeRemaining);
        }
      } catch (err) {
        console.error("Heartbeat error:", err);
      }
    };

    // Send heartbeat every 5 seconds
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, 5000);
    sendHeartbeat(); // Send immediately

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [loading, currentQuestionIndex, questions]);

  // Timer countdown
  useEffect(() => {
    if (loading || timeRemaining <= 0) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          autoSubmit("Time expired");
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [loading, timeRemaining]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

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
    if (isSubmittingRef.current) return;
    
    setIsSubmitting(true);
    isSubmittingRef.current = true;

    // Clear intervals
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    try {
      const answerArray = questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id],
      }));

      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenRef.current}`,
        },
        body: JSON.stringify({ answers: answerArray }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Submission failed");
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        return;
      }

      // Clear localStorage
      localStorage.removeItem("quizToken");
      localStorage.removeItem("quizStartTime");
      localStorage.removeItem("quizEndTime");

      // Redirect to success page
      router.push("/quiz/success");
    } catch (err) {
      console.error("Submit error:", err);
      setError("Submission failed. Please try again.");
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const autoSubmit = async (reason) => {
    if (isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // Clear intervals
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    try {
      const answerArray = questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id],
      }));

      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenRef.current}`,
        },
        body: JSON.stringify({ answers: answerArray }),
      });

      // Clear localStorage
      localStorage.removeItem("quizToken");
      localStorage.removeItem("quizStartTime");
      localStorage.removeItem("quizEndTime");

      // Redirect to success page
      router.push("/quiz/success");
    } catch (err) {
      console.error("Auto-submit error:", err);
      router.push("/quiz/success");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/quiz/register")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-6">
      {/* Header with timer and progress */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl mb-4 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              World Skill Challenge – Stars and Beyond Nationals
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>•</span>
              <span>Answered: {answeredCount}/{questions.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Time Remaining</div>
              <div className={`text-4xl font-bold font-mono ${timeRemaining < 5 * 60 * 1000 ? 'text-red-600 animate-pulse' : timeRemaining < 10 * 60 * 1000 ? 'text-orange-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warnings */}
      <AnimatePresence>
        {fullscreenWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">Warning: Fullscreen exited. Please return to fullscreen mode.</span>
            </div>
          </motion.div>
        )}
        {tabSwitchWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">Warning: Tab switch detected. Multiple violations will result in auto-submission.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentQuestion?.question}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {currentQuestion?.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                answers[currentQuestion.id] === index
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[currentQuestion.id] === index
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion.id] === index && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-gray-900 font-medium">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigation Grid */}
      <div className="max-w-4xl mx-auto mt-4 bg-white rounded-lg shadow-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Question Navigation</h3>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`p-2 rounded text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-orange-500 text-white'
                  : answers[q.id] !== null
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
