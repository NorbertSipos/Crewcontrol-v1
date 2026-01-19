import { createClient } from '@supabase/supabase-js'

// Get your Supabase URL and anon key from environment variables
// We'll set these up in the next step
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Get the current origin for redirect URLs
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`
  }
  return `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/auth/callback`
}

// Create and export the Supabase client
// This client will be used throughout your app to interact with Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: getRedirectUrl(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
