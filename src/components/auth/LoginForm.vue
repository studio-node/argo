<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits(['success', 'switch-to-signup'])

const email = ref('')
const password = ref('')
const { signIn, loading, error } = useAuth()

const handleSubmit = async () => {
  const { user, error: err } = await signIn(email.value, password.value)
  if (user && !err) {
    emit('success')
  }
}
</script>

<template>
  <div class="auth-panel">
    <header>
      <h1>Welcome Back</h1>
      <p>Sign in to continue.</p>
    </header>

    <form @submit.prevent="handleSubmit" novalidate>
      <label>
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          inputmode="email"
          placeholder="you@email.com"
          required
        />
      </label>
      <label>
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </label>

      <p v-if="error" class="error">{{ error }}</p>
      
      <button class="primary-action" type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Log In' }}
      </button>
    </form>

    <p class="auth-switch">
      <span>Need an account?</span>
      <button type="button" @click="$emit('switch-to-signup')">
        Sign up
      </button>
    </p>
  </div>
</template>

<style scoped>
/* Styles copied directly from parkersAuthPage.vue */
.auth-panel {
  width: min(420px, 100%);
  background: rgba(33, 32, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: clamp(1.5rem, 4vw, 2.25rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45);
}

header h1 {
  margin: 0 0 0.25rem 0;
  font-size: clamp(1.6rem, 5vw, 2rem);
  color: #f5f5f7;
}

header p {
  margin: 0;
  color: rgba(245, 245, 247, 0.75);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.95rem;
  color: rgba(245, 245, 247, 0.75);
}

input {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.85rem 1rem;
  color: #f5f5f7;
  font-size: 1rem;
}

input:focus {
  outline: 2px solid rgba(255, 255, 255, 0.25);
  outline-offset: 2px;
}

.error {
  color: #feb2b2;
  margin: 0;
  font-size: 0.9rem;
}

.primary-action {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, #f97316, #facc15);
  color: #111;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.primary-action:hover:not(:disabled) {
  opacity: 0.9;
}

.primary-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  font-size: 0.9rem;
  color: rgba(245, 245, 247, 0.75);
}

.auth-switch button {
  border: none;
  background: transparent;
  color: #f97316;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.35rem;
}
</style>