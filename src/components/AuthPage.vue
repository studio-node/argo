<script setup>
import { ref } from 'vue'

// --- IMPORTANT ---
// Make sure these paths are correct for your project!
// You mentioned they are in 'components/auth'
import LoginForm from './auth/LoginForm.vue'
import SignUpForm from './auth/SignUpForm.vue'

const emit = defineEmits(['authenticated'])

// This ref will control which component to show
const mode = ref('login') // 'login' or 'signup'

// This function will be called by *both* child components
// when they successfully log in or sign up.
const onAuthSuccess = () => {
  emit('authenticated')
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
  <div class="auth-page-container">
    <LoginForm
      v-if="mode === 'login'"
      @success="onAuthSuccess"
      @switch-to-signup="mode = 'signup'"
    />
    <SignUpForm
      v-else
      @success="onAuthSuccess"
      @switch-to-login="mode = 'login'"
    />
  </div>
</template>

<style scoped>
.auth-page-container {
  /* This wrapper will center your forms, which already have their own
     white backgrounds and box-shadows. */
  width: 100vw;
  height: 100vh;
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