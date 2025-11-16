'use client'

import { useState } from 'react'
import type { PromptFormProps } from '@/types/components'

export default function PromptForm({ onSubmit, initialValue = '', mode }: PromptFormProps) {
  const [text, setText] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(text.trim())
      if (mode === 'create') {
        setText('') // Clear form after creating
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const charCount = text.length
  const maxChars = 500

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your prompt here..."
            maxLength={maxChars}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm sm:text-base"
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {charCount}/{maxChars}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add Prompt' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
