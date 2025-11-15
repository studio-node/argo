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
  background: #212023; /* Matches your App.vue background */
}
</style>