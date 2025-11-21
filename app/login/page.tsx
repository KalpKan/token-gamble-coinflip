'use client'

import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, fadeIn } from '@/lib/animations'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'auth_failed':
        return 'Authentication failed. Please try again.'
      case 'exchange_failed':
        return message ? decodeURIComponent(message) : 'Failed to complete authentication.'
      case 'no_code':
        return 'No authentication code received. Please try again.'
      case 'access_denied':
        return 'Access was denied. Please try again.'
      default:
        return error ? `Error: ${error}` : null
    }
  }

  const errorMessage = getErrorMessage(error)

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-black"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <Link href="/" className="inline-block mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Token Gamble
            </h1>
          </Link>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Sign in to start wagering API tokens
          </p>
        </motion.div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg"
          >
            <p className="text-sm text-red-400 text-center">{errorMessage}</p>
          </motion.div>
        )}

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-lg"
        >
          <AuthForm mode="login" />
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
