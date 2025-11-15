<script setup>
import { ref } from 'vue'

const emit = defineEmits(['authenticated'])

const mode = ref('login')
const email = ref('')
const password = ref('')
const error = ref('')

const switchMode = (target) => {
  mode.value = target
  error.value = ''
}

const handleSubmit = () => {
  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Please enter your email and password.'
    return
  }
  error.value = ''
  emit('authenticated')
}
</script>

<template>
  <main class="auth-root">
    <div class="auth-panel">
      <header>
        <h1>Code Camp Experience</h1>
        <p>Sign in to launch the experience.</p>
      </header>
      <div class="auth-toggle" role="tablist">
        <button
          role="tab"
          type="button"
          :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >
          Log In
        </button>
        <button
          role="tab"
          type="button"
          :class="{ active: mode === 'signup' }"
          @click="switchMode('signup')"
        >
          Sign Up
        </button>
      </div>
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
        <button class="primary-action" type="submit">
          {{ mode === 'login' ? 'Log In' : 'Create Account' }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.auth-root {
  width: 100vw;
  height: 100vh;
  background: #212023;
  color: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);
}

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
}

header p {
  margin: 0;
  color: rgba(245, 245, 247, 0.75);
}

.auth-toggle {
  display: inline-flex;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem;
  gap: 0.35rem;
}

.auth-toggle button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.25rem;
  background: transparent;
  color: rgba(245, 245, 247, 0.7);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.auth-toggle button.active {
  background: #f5f5f7;
  color: #212023;
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

.primary-action:hover {
  opacity: 0.9;
}
</style>
