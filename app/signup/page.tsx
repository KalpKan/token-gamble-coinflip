'use client'

import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, fadeIn } from '@/lib/animations'

export default function SignupPage() {
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
            Create Your Account
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Join the coinflip arena and start winning API tokens
          </p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-lg"
        >
          <AuthForm mode="signup" />
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
