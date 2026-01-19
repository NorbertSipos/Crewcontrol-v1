import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Create the Auth Context
const AuthContext = createContext({})

// Custom hook to use the auth context
// This is what we'll use in components to access user data
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component - wraps your app and provides auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null) // User data from users table
  const [loading, setLoading] = useState(true) // Loading state while checking for user
  const sessionTokenRef = useRef(null) // Cache session token to avoid abort issues with getSession()

  // Helper function to get session token from localStorage (avoids getSession() abort issues)
  const getSessionToken = () => {
    // Try cached token first
    if (sessionTokenRef.current) {
      return sessionTokenRef.current;
    }
    
    // Try to find token in localStorage (Supabase stores it when persistSession: true)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          try {
            const sessionStr = localStorage.getItem(key);
            if (sessionStr) {
              const sessionData = JSON.parse(sessionStr);
              // Try multiple possible token locations
              const token = sessionData?.access_token || sessionData?.accessToken || sessionData?.currentSession?.access_token || (Array.isArray(sessionData) && sessionData[0]?.access_token);
              if (token) {
                sessionTokenRef.current = token; // Cache it
                return token;
              }
            }
          } catch (parseErr) {
            // Continue searching other keys
          }
        }
      }
    } catch (err) {
      // Silently fail
    }
    
    return null;
  };

  // Fetch user profile from users table with retry logic for AbortErrors
  // accessToken: optional, if provided, use it directly (e.g., from onAuthStateChange callback)
  const fetchUserProfile = async (userId, providedAccessToken = null, retryCount = 0) => {
    if (!userId) {
      setUserProfile(null)
      return
    }

    const maxRetries = 3

    try {
      // Use direct fetch to bypass Supabase client's abort controller (which causes AbortErrors)
      // This is the same approach used in CompleteSignup.jsx and ResetPassword.jsx
      // If accessToken is provided (e.g., from onAuthStateChange), use it directly
      // Otherwise, get token from localStorage to avoid getSession() abort issues
      let accessToken = providedAccessToken || getSessionToken();
      
      // If not in cache, try getSession() (may abort but we handle it)
      if (!accessToken) {
        try {
          const session = await supabase.auth.getSession();
          accessToken = session?.data?.session?.access_token;
          if (accessToken) {
            sessionTokenRef.current = accessToken; // Cache it for next time
          }
        } catch (sessionErr) {
          // getSession() may abort - continue with null token and let fetch fail with 401
        }
      }
      
      if (!accessToken) {
        // No session token, can't fetch profile
        setUserProfile(null);
        return;
      }

      // Direct fetch to Supabase REST API
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation'
          },
          // Don't use AbortController - let the request complete naturally
          signal: undefined
        }
      );
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 406) {
          // User doesn't exist in users table (PGRST116 equivalent)
          setUserProfile(null);
          return;
        }
        // Other error
        const errorText = await response.text();
        console.error('Error fetching user profile:', response.status, errorText);
        setUserProfile(null);
        return;
      }

      const dataArray = await response.json();
      const data = dataArray?.[0] || null; // REST API returns array, get first item

      // If no data, user doesn't exist in users table (hasn't completed signup)
      if (!data) {
        setUserProfile(null)
        return
      }

      setUserProfile(data)
    } catch (err) {
      // Handle AbortError with retry logic
      if (err?.name === 'AbortError' && retryCount < maxRetries) {
        // AbortError - request was cancelled (often due to rapid re-renders)
        // Retry after exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.min(500 * Math.pow(2, retryCount), 2000)))
        // Verify user still exists before retrying
        // Use fresh token from getSession() if available, otherwise use provided token
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id === userId) {
          return fetchUserProfile(userId, session?.access_token || providedAccessToken, retryCount + 1)
        }
        return
      }
      
      console.error('Error fetching user profile:', err)
      setUserProfile(null)
      // Throw the error so onAuthStateChange knows it failed
      throw err
    }
  }

  // Check if user is logged in when the app starts
  useEffect(() => {
    // Track if getSession has completed to avoid race condition with onAuthStateChange
    let getSessionCompleted = false;
    
    // Get the current session (user) from Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      // Fetch user profile if logged in
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      
      // Mark getSession as completed so onAuthStateChange knows it can safely fetch profiles
      getSessionCompleted = true;
      
      setLoading(false)
    }

    getSession()
    
    // Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        
        // Fetch user profile when auth state changes
        // BUT: Skip the initial SIGNED_IN and INITIAL_SESSION events if getSession hasn't completed yet
        // (getSession will handle the initial profile fetch)
        if (session?.user) {
          // If this is an initial auth event (SIGNED_IN or INITIAL_SESSION) and getSession hasn't completed, skip fetching
          // getSession will handle it. For other events (like actual sign-in), always fetch.
          if ((_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') && !getSessionCompleted) {
            setLoading(false); // Set loading false since getSession will handle it
            return;
          }
          
          // Wait for profile fetch to complete before setting loading to false
          // This ensures Dashboard doesn't check before profile is loaded
          // Pass session.access_token to ensure we use the correct token for this session
          await fetchUserProfile(session.user.id, session?.access_token)
          // Wait a tick for React state to update after setUserProfile
          await new Promise(resolve => setTimeout(resolve, 0))
        } else {
          setUserProfile(null)
        }
        
        // Only set loading to false after profile fetch has completed (or if no user)
        setLoading(false)
      }
    )

    // Cleanup: unsubscribe when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // Value object - this is what components will have access to
  const value = {
    user,           // Current Supabase Auth user (or null if not logged in)
    userProfile,    // User data from users table (role, organization_id, etc.)
    loading,        // Whether we're still checking for user
    signOut: async () => {
      await supabase.auth.signOut()
      setUserProfile(null)
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
