import { createServerClient, requireAuth } from '@/lib/supabase/server'
import ProfileForm from '@/components/ProfileForm'
import { redirect } from 'next/navigation'
import type { User } from '@/types/database'

export default async function ProfilePage() {
  // Require authentication
  const authUser = await requireAuth()
  
  // Fetch user data from the users table
  const supabase = await createServerClient()
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (error || !userData) {
    console.error('Error fetching user data:', error)
    // If user doesn't exist in users table, redirect to login
    redirect('/login')
  }

  // Type assertion since we know userData exists after the check
  const user = userData as User

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <ProfileForm
        userId={user.id}
        email={user.email}
        createdAt={user.created_at}
        initialApiKey={user.openai_api_key}
      />
    </div>
  )
}
