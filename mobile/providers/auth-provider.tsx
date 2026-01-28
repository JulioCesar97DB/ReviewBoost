import { AuthContext, Profile } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setSession(null)
      } else {
        setSession(data.session)
      }

      setIsLoading(false)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setProfile(null)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, updated_at')
        .eq('id', session.user.id)
        .single()

      setProfile(data)
    }

    fetchProfile()
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
