'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 left-4 sm:left-auto ${bgColor} text-white px-4 sm:px-6 py-3 rounded-lg shadow-xl border border-zinc-700 z-50 max-w-md sm:mx-0 mx-auto`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 sm:ml-4 text-white hover:text-gray-300 transition-colors flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}
