import { ref, computed } from 'vue'
// Make sure this path is correct for your project structure
// e.g., '@/lib/supabase' or '../lib/supabase'
import { supabase } from '@/lib/supabase' 

// These are outside the function, so they act as a global singleton state
const user = ref(null)
const session = ref(null)
const loading = ref(false)
const error = ref(null)

// Initialize auth state once
supabase.auth.getSession().then(({ data, error: err }) => {
  if (err) {
    error.value = err.message
    return
  }
  session.value = data.session
  user.value = data.session?.user ?? null
})

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, newSession) => {
  session.value = newSession
  user.value = newSession?.user ?? null
})

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Sign a new user up
   * This now passes the username in options.data,
   * which our SQL trigger 'handle_new_user' will use to create the profile.
   */
  const signUp = async (email, password, username) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // This 'data' object is passed to your SQL trigger
            username: username
          }
        }
      })

      if (authError) throw authError

      // With email verification off, the user is signed in.
      // The onAuthStateChange listener will automatically update the user/session refs.
      return { user: data.user, error: null }

    } catch (err) {
      error.value = err.message
      return { user: null, error: err }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign an existing user in
   */
  const signIn = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (err) throw err
      
      // onAuthStateChange will handle setting the user/session
      return { user: data.user, error: null }
    } catch (err) {
      error.value = err.message
      return { user: null, error: err }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign the current user out
   */
  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err

      // onAuthStateChange will handle setting user/session to null
      return { error: null }
    } catch (err) {
      error.value = err.message
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  // Return all the reactive state and functions
  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut
  }
}