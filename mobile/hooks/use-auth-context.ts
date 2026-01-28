import type { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  updated_at: string | null
}

export interface AuthData {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  isLoading: true,
  isLoggedIn: false,
})

export const useAuthContext = () => useContext(AuthContext)
