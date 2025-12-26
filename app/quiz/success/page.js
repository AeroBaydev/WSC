"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Exit fullscreen if still in fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submission Successful
          </h1>
          <p className="text-gray-600">
            Your response has been submitted successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Thank you for participating in the World Skill Challenge – Stars and Beyond.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Results will be announced later.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

