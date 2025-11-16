'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast, { ToastType } from './Toast'
import { AnimatePresence } from 'framer-motion'

interface ProfileFormProps {
  userId: string
  email: string
  createdAt: string
  initialApiKey?: string
}

export default function ProfileForm({ userId, email, createdAt, initialApiKey }: ProfileFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey || '')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update the user's API key in the database
      const { error } = await supabase
        .from('users')
        // @ts-ignore - Supabase type inference issue with update
        .update({ openai_api_key: apiKey })
        .eq('id', userId)

      if (error) throw error

      setToast({ message: 'API key saved successfully!', type: 'success' })
      router.refresh()
    } catch (error) {
      console.error('Error saving API key:', error)
      setToast({ message: 'Failed to save API key. Please try again.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Profile</h1>

          {/* User Information */}
          <div className="mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <p className="text-white">{email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Account Created
              </label>
              <p className="text-white">{formatDate(createdAt)}</p>
            </div>
          </div>

          {/* API Key Form */}
          <form onSubmit={handleSaveApiKey} className="mb-8">
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-zinc-600 focus:border-transparent pr-24"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your API key is used when you lose a coinflip to answer the winner&apos;s prompt.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save API Key'}
            </button>
          </form>

          {/* Logout Button */}
          <div className="pt-6 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
