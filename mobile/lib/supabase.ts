import { createClient, SupportedStorage } from '@supabase/supabase-js'
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store'

const ExpoSecureStoreAdapter: SupportedStorage = {
  getItem: (key: string) => {
    return getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    return setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    return deleteItemAsync(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
