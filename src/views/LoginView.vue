<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'

const router = useRouter()
const showSignUp = ref(false)

const handleAuthSuccess = () => {
  router.push('/')
}

const switchToSignUp = () => {
  showSignUp.value = true
}

const switchToLogin = () => {
  showSignUp.value = false
}
</script>

<template>
  <div class="login-view">
    <div class="auth-container">
      <LoginForm
        v-if="!showSignUp"
        @success="handleAuthSuccess"
        @switch-to-signup="switchToSignUp"
      />
      <SignUpForm
        v-else
        @success="handleAuthSuccess"
        @switch-to-login="switchToLogin"
      />
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}
</style>

