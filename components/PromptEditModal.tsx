'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { modalAnimation, backdropAnimation } from '@/lib/animations'
import PromptForm from './PromptForm'

interface PromptEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (text: string) => Promise<void>
  initialText: string
  promptId: string
}

export default function PromptEditModal({
  isOpen,
  onClose,
  onSave,
  initialText,
  promptId,
}: PromptEditModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Reset saving state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSaving(false)
    }
  }, [isOpen])

  const handleSubmit = async (text: string) => {
    setIsSaving(true)
    try {
      await onSave(text)
      onClose()
    } catch (error) {
      console.error('Error saving prompt:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSaving) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Prompt</h2>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <PromptForm
                onSubmit={handleSubmit}
                initialValue={initialText}
                mode="edit"
              />
              
              {isSaving && (
                <div className="mt-4 flex items-center justify-center gap-2 text-yellow-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-yellow-500 border-r-transparent"></div>
                  <span className="text-sm">Saving changes...</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-700">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
