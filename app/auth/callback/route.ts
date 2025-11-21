import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error_param = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Log all query parameters for debugging
  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    error: error_param,
    error_description,
    all_params: Object.fromEntries(requestUrl.searchParams)
  })

  // If there's an error from the OAuth provider
  if (error_param) {
    console.error('OAuth error:', error_param, error_description)
    return NextResponse.redirect(`${origin}/login?error=${error_param}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Supabase exchange error:', error)
      return NextResponse.redirect(`${origin}/login?error=exchange_failed&message=${encodeURIComponent(error.message)}`)
    }

    // Redirect to lobby after successful OAuth
    console.log('OAuth successful, redirecting to lobby')
    return NextResponse.redirect(`${origin}/lobby`)
  }

  // If there's no code and no error, something went wrong
  console.error('No code or error received in callback')
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
