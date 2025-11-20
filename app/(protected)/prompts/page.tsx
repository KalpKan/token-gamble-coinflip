'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { createPrompt, getPromptsByUser, deletePrompt, updatePrompt } from '@/lib/prompts/queries'
import { pageTransition, staggerContainer, listItem, buttonAnimation } from '@/lib/animations'
import type { Prompt } from '@/types/database'
import PromptForm from '@/components/PromptForm'
import PromptCard from '@/components/PromptCard'
import PromptEditModal from '@/components/PromptEditModal'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

type TabType = 'loaded' | 'settled'

export default function PromptsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('loaded')
  const [loadedPrompts, setLoadedPrompts] = useState<Prompt[]>([])
  const [settledPrompts, setSettledPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const supabase = createClient()

  // Fetch user and initial prompts
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      await fetchPrompts(user.id)
      setLoading(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set up real-time subscription for prompt updates
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('prompts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prompts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          handleRealtimeUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchPrompts = async (uid: string) => {
    const loaded = await getPromptsByUser(supabase, uid, 'loaded')
    const locked = await getPromptsByUser(supabase, uid, 'locked')
    const settled = await getPromptsByUser(supabase, uid, 'settled')
    
    setLoadedPrompts([...loaded, ...locked])
    setSettledPrompts(settled)
  }

  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newPrompt = payload.new as Prompt
      if (newPrompt.status === 'loaded' || newPrompt.status === 'locked') {
        setLoadedPrompts(prev => [newPrompt, ...prev])
      } else if (newPrompt.status === 'settled') {
        setSettledPrompts(prev => [newPrompt, ...prev])
      }
    } else if (payload.eventType === 'UPDATE') {
      const updatedPrompt = payload.new as Prompt
      
      // Remove from old list and add to new list based on status
      setLoadedPrompts(prev => prev.filter(p => p.id !== updatedPrompt.id))
      setSettledPrompts(prev => prev.filter(p => p.id !== updatedPrompt.id))
      
      if (updatedPrompt.status === 'loaded' || updatedPrompt.status === 'locked') {
        setLoadedPrompts(prev => {
          const filtered = prev.filter(p => p.id !== updatedPrompt.id)
          return [updatedPrompt, ...filtered]
        })
      } else if (updatedPrompt.status === 'settled') {
        setSettledPrompts(prev => {
          const filtered = prev.filter(p => p.id !== updatedPrompt.id)
          return [updatedPrompt, ...filtered]
        })
      }
    } else if (payload.eventType === 'DELETE') {
      const deletedId = payload.old.id
      setLoadedPrompts(prev => prev.filter(p => p.id !== deletedId))
      setSettledPrompts(prev => prev.filter(p => p.id !== deletedId))
    }
  }

  const handleCreatePrompt = async (text: string) => {
    if (!userId) return

    const prompt = await createPrompt(supabase, userId, text)
    if (prompt) {
      showToast('Prompt created successfully!', 'success')
    } else {
      showToast('Failed to create prompt', 'error')
    }
  }

  const handleEditClick = (promptId: string) => {
    const prompt = [...loadedPrompts, ...settledPrompts].find(p => p.id === promptId)
    if (!prompt) return
    
    // Prevent editing locked or settled prompts
    if (prompt.status === 'locked' || prompt.status === 'settled') {
      showToast('Cannot edit a locked or settled prompt', 'error')
      return
    }
    setEditingPrompt(prompt)
  }

  const handleEditPrompt = async (text: string) => {
    if (!editingPrompt) return

    const promptId = editingPrompt.id
    const originalText = editingPrompt.text

    // Optimistic update
    setLoadedPrompts(prev =>
      prev.map(p => (p.id === promptId ? { ...p, text } : p))
    )

    const success = await updatePrompt(supabase, promptId, text)
    
    if (success) {
      showToast('Prompt updated successfully!', 'success')
      setEditingPrompt(null)
    } else {
      // Revert optimistic update on failure
      setLoadedPrompts(prev =>
        prev.map(p => (p.id === promptId ? { ...p, text: originalText } : p))
      )
      showToast('Failed to update prompt', 'error')
    }
  }

  const handleDeleteClick = (promptId: string) => {
    const prompt = loadedPrompts.find(p => p.id === promptId)
    
    // Prevent deleting locked or settled prompts
    if (prompt && (prompt.status === 'locked' || prompt.status === 'settled')) {
      showToast('Cannot delete a locked or settled prompt', 'error')
      return
    }
    
    setDeletingPromptId(promptId)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPromptId) return

    setIsDeleting(true)

    // Store the prompt for potential rollback
    const promptToDelete = loadedPrompts.find(p => p.id === deletingPromptId)

    // Optimistic update - remove from UI immediately
    setLoadedPrompts(prev => prev.filter(p => p.id !== deletingPromptId))

    const success = await deletePrompt(supabase, deletingPromptId)
    
    if (success) {
      showToast('Prompt deleted successfully!', 'success')
    } else {
      // Revert optimistic update on failure
      if (promptToDelete) {
        setLoadedPrompts(prev => [promptToDelete, ...prev])
      }
      showToast('Failed to delete prompt', 'error')
    }

    setIsDeleting(false)
    setDeletingPromptId(null)
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const currentPrompts = activeTab === 'loaded' ? loadedPrompts : settledPrompts

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Prompts</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your prompts and view answered questions</p>
        </motion.div>

        {/* Add Prompt Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6 sm:mb-8 bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Add New Prompt</h2>
          <PromptForm onSubmit={handleCreatePrompt} mode="create" />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('loaded')}
            className={`px-4 sm:px-6 py-3 font-semibold transition-all duration-200 relative whitespace-nowrap ${
              activeTab === 'loaded'
                ? 'text-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Loaded
            {activeTab === 'loaded' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={`px-4 sm:px-6 py-3 font-semibold transition-all duration-200 relative whitespace-nowrap ${
              activeTab === 'settled'
                ? 'text-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Settled
            {activeTab === 'settled' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Prompts List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
                <p className="text-gray-400 mt-4">Loading prompts...</p>
              </motion.div>
            ) : currentPrompts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700"
              >
                <p className="text-gray-400 text-lg">
                  {activeTab === 'loaded'
                    ? 'No loaded prompts yet. Add one above to get started!'
                    : 'No settled prompts yet. Win a coinflip to see your answered prompts here!'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                <AnimatePresence>
                  {currentPrompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                      isLocked={prompt.status === 'locked'}
                      showResponse={activeTab === 'settled'}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      {editingPrompt && (
        <PromptEditModal
          isOpen={!!editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSave={handleEditPrompt}
          initialText={editingPrompt.text}
          promptId={editingPrompt.id}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingPromptId}
        onClose={() => setDeletingPromptId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
