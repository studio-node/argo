<script setup>
import { ref } from 'vue'

const emit = defineEmits(['authenticated'])

const mode = ref('signup')
const form = ref({
  username: '',
  email: '',
  password: ''
})
const error = ref('')

const swapMode = (target) => {
  mode.value = target
  error.value = ''
}

const clearForm = () => {
  form.value = {
    username: '',
    email: '',
    password: ''
  }
}

const validate = () => {
  if (!form.value.email.trim() || !form.value.password.trim()) {
    error.value = 'Email and password are required.'
    return false
  }

  if (mode.value === 'signup' && !form.value.username.trim()) {
    error.value = 'Choose a username to continue.'
    return false
  }

  error.value = ''
  return true
}

const handleSubmit = () => {
  if (!validate()) return
  emit('authenticated', { ...form.value, mode: mode.value })
  clearForm()
}
</script>

<template>
  <main class="auth-root">
    <div class="auth-panel">
      <header>
        <h1>Code Camp Experience</h1>
        <p v-if="mode === 'signup'">Create your account to get started.</p>
        <p v-else>Welcome back. Sign in to continue.</p>
      </header>
      <form @submit.prevent="handleSubmit" novalidate>
        <label v-if="mode === 'signup'">
          <span>Username</span>
          <input
            v-model="form.username"
            type="text"
            minlength="2"
            maxlength="30"
            autocomplete="off"
            placeholder="coder123"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            v-model="form.email"
            type="email"
            inputmode="email"
            placeholder="you@email.com"
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            v-model="form.password"
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
      <p class="auth-switch">
        <span v-if="mode === 'login'">Need an account?</span>
        <span v-else>Already have an account?</span>
        <button type="button" @click="swapMode(mode === 'login' ? 'signup' : 'login')">
          {{ mode === 'login' ? 'Sign up' : 'Log in' }}
        </button>
      </p>
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
