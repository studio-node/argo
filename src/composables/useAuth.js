import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

const user = ref(null)
const session = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  // Initialize auth state
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

  const isAuthenticated = computed(() => !!user.value)

  const signUp = async (email, password, username) => {
    loading.value = true
    error.value = null
    
    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username || email.split('@')[0]
          })

        if (profileError) throw profileError
      }

      return { user: authData.user, error: null }
    } catch (err) {
      error.value = err.message
      return { user: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (err) throw err

      return { user: data.user, error: null }
    } catch (err) {
      error.value = err.message
      return { user: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err

      user.value = null
      session.value = null
      return { error: null }
    } catch (err) {
      error.value = err.message
      return { error: err }
    } finally {
      loading.value = false
    }
  }

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

