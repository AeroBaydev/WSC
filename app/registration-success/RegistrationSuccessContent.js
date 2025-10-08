"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function RegistrationSuccessContent() {
  const searchParams = useSearchParams()
  const { user } = useUser()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  const clerkUserId = searchParams.get('clerkUserId')
  const category = searchParams.get('category')

  useEffect(() => {
    // Check if we're in a popup/iframe and should close automatically
    const isInPopup = window.opener || window.parent !== window;
    
    const confirmRegistration = async () => {
      if (!clerkUserId || !category) {
        setStatus('error')
        setMessage('Missing registration information')
        return
      }

      try {
        const response = await fetch('/api/mark-registered', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkUserId,
            category,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setMessage('Registration confirmed successfully!')
          
          // If in popup, auto-close after 3 seconds
          if (isInPopup) {
            setTimeout(() => {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.location.href = 'https://worldskillchallenge.com/#register';
                  window.close();
                } else if (window.parent && window.parent !== window) {
                  window.parent.location.href = 'https://worldskillchallenge.com/#register';
                }
              } catch (error) {
                window.location.href = 'https://worldskillchallenge.com/#register';
              }
            }, 3000);
          }
        } else {
          setStatus('already-registered')
          setMessage(data.message || 'Already registered in this category')
        }
      } catch (error) {
        console.error('Error confirming registration:', error)
        setStatus('error')
        setMessage('Failed to confirm registration. Please contact support.')
      }
    }

    confirmRegistration()
  }, [clerkUserId, category])

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return {
          icon: '⏳',
          title: 'Confirming Registration...',
          description: 'Please wait while we confirm your registration for World Skill Challenge 2025.',
          color: 'text-blue-600'
        }
      case 'success':
        return {
          icon: '🎉',
          title: 'Congratulations! Registration Complete!',
          description: `You have successfully registered for ${category} in World Skill Challenge 2025! Welcome to India's premier student skill competition. Check your email for further instructions, competition guidelines, and important dates.`,
          color: 'text-green-600'
        }
      case 'already-registered':
        return {
          icon: 'ℹ️',
          title: 'Already Registered',
          description: `You are already registered for ${category} in World Skill Challenge 2025. No need to register again.`,
          color: 'text-orange-600'
        }
      case 'error':
        return {
          icon: '❌',
          title: 'Registration Error',
          description: message || 'Something went wrong during registration. Please try again or contact our support team.',
          color: 'text-red-600'
        }
      default:
        return {
          icon: '❓',
          title: 'Unknown Status',
          description: 'Please contact support for assistance with your registration.',
          color: 'text-gray-600'
        }
    }
  }

  const statusContent = getStatusContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl mb-6"
        >
          {statusContent.icon}
        </motion.div>

        <h1 className={`text-3xl font-bold mb-6 ${statusContent.color}`}>
          {statusContent.title}
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          {statusContent.description}
        </p>

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-green-800 mb-4">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-green-700 text-sm">
                  <strong>Category:</strong> {category}
                </p>
                <p className="text-green-700 text-sm">
                  <strong>Registration Date:</strong> {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-green-700 text-sm">
                  <strong>Registration ID:</strong> WSC2025-{clerkUserId?.slice(-8)}
                </p>
                <p className="text-green-700 text-sm">
                  <strong>Status:</strong> Confirmed ✅
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-4">What's Next?</h3>
            <ul className="text-blue-700 text-sm text-left space-y-2">
              <li>📧 Check your email for detailed competition guidelines</li>
              <li>📅 Mark your calendar for competition dates</li>
              <li>📚 Review the competition rules and requirements</li>
              <li>🎯 Start preparing your project or team</li>
              <li>📞 Join our WhatsApp community for updates</li>
            </ul>
          </motion.div>
        )}

        <div className="space-y-4">
          <motion.button
            onClick={() => {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.location.href = 'https://worldskillchallenge.com/#register';
                  window.close();
                } else if (window.parent && window.parent !== window) {
                  window.parent.location.href = 'https://worldskillchallenge.com/#register';
                } else {
                  window.location.href = 'https://worldskillchallenge.com/#register';
                }
              } catch (error) {
                window.location.href = 'https://worldskillchallenge.com/#register';
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold py-3 px-6 transition-all duration-300"
          >
            Register for Another Category
          </motion.button>

          <motion.button
            onClick={() => {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.location.href = 'https://worldskillchallenge.com/';
                  window.close();
                } else if (window.parent && window.parent !== window) {
                  window.parent.location.href = 'https://worldskillchallenge.com/';
                } else {
                  window.location.href = 'https://worldskillchallenge.com/';
                }
              } catch (error) {
                window.location.href = 'https://worldskillchallenge.com/';
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold py-3 px-6 transition-all duration-300"
          >
            Back to Homepage
          </motion.button>
        </div>

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 text-sm">
              If you continue to experience issues, please contact our support team at{' '}
              <a href="mailto:worldskillchallenge@gmail.com" className="underline font-semibold">
                worldskillchallenge@gmail.com
              </a>{' '}
              or call us at{' '}
              <a href="tel:+919266300825" className="underline font-semibold">
                +91 9266300825
              </a>
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-gray-500 text-xs">
            World Skill Challenge 2025 - Crafting Champions of Tomorrow
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
