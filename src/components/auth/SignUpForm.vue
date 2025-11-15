<template>
  <div class="login-page">
    <div class="login-shell">
      <!-- ======================= -->
      <!-- ==     Header        == -->
      <!-- ======================= -->
      <header class="signup-header">
        <div class="header-curve"></div>
        <div class="header-logo-container">
          <!-- ✅ FIXED ASSET PATH -->
          <img class="header-logo" src="@/assets/codecamp.png" alt="CodeCamp Logo" />
        </div>
      </header>

      <!-- ======================= -->
      <!-- ==   Main Content    == -->
      <!-- ======================= -->
      <main class="signup-main">
        <h1 class="main-heading">Sign Up</h1>
        <p class="main-subtitle">Create your account for an AR experience.</p>

        <!-- Form with Vue functionality -->
        <form class="signup-form" @submit.prevent="handleSubmit" novalidate>
          <!-- Username -->
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="coder123"
              required
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="you@email.com"
              required
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              minlength="6"
            />
          </div>

          <!-- Conditional Error Message -->
          <p v-if="error" class="error-message">{{ error }}</p>

          <!-- Dynamic Submit Button -->
          <button type="submit" class="form-button" :disabled="loading">
            <span class="button-text">
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </span>
          </button>
        </form>

        <!-- Switch to Login Prompt -->
        <div class="login-prompt">
          <span class="prompt-text">Already have an account?</span>
          <button type="button" class="prompt-link" @click="$emit('switch-to-login')">
            Log In
          </button>
        </div>
      </main>

      <!-- ======================= -->
      <!-- ==      Footer       == -->
      <!-- ======================= -->
      <footer class="signup-footer">
        <div class="footer-content">
          <!-- ✅ FIXED ASSET PATH -->
          <img class="footer-logo" src="@/assets/argologostatic.png" alt="Argo Logo" />
          <span class="footer-by">BY</span>
          <div class="footer-brand">
            <!-- ✅ FIXED ASSET PATH -->
            <img class="brand-seal" src="@/assets/studionodelogo.png" alt="Studio Node Seal" />
            <span class="brand-name">STUDIO<br/>NODE</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth'; // Ensure this path is correct

const emit = defineEmits(['success', 'switch-to-login']);

// Reactive variables for the form inputs
const username = ref('');
const email = ref('');
const password = ref('');

// Import authentication logic from the composable
const { signUp, loading, error } = useAuth();

// Function to handle form submission
const handleSubmit = async () => {
  const { user, error: signUpError } = await signUp(
    email.value,
    password.value,
    username.value
  );

  // If sign-up is successful, emit the 'success' event
  if (user && !signUpError) {
    emit('success');
  }
};
</script>

<style scoped>
/* NOTE: The provided CSS has been adapted to the new, structured HTML.
   You may need to adjust this to perfectly match your vision. */

/* Base and Fonts */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  margin: 0;
  padding: 1.5rem;
  background: #E6ECEF;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Fredoka', sans-serif;
}

/* Main container/shell */
.login-shell {
  width: 100%;
  max-width: 864px;
  background: #E6ECEF;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
}

/* Header */
.signup-header {
  position: relative;
  width: 100%;
  height: 245px;
}

.header-curve {
  position: absolute;
  inset: 0;
  background: #212023;
  border-bottom-left-radius: 50px;
}

.header-logo-container {
  position: relative;
  height: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo {
  max-width: 100%;
  max-height: 80%;
  object-fit: contain;
}

/* Main Content Area */
.signup-main {
  background: #E6ECEF;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.main-heading {
  margin: 0;
  color: #212023;
  font-size: 96px;
  font-weight: 600;
  line-height: 1.2;
}

.main-subtitle {
  margin: 0;
  color: #212023;
  font-size: 32px;
  font-weight: 400;
  max-width: 600px;
}

/* Form */
.signup-form {
  width: 100%;
  max-width: 780px;
  margin-top: 1rem;
  padding: 3rem;
  background: #212023;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.form-group {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-label {
  color: #E6ECEF;
  font-size: 32px;
  font-weight: 400;
}

.form-input {
  width: 100%;
  height: 90px;
  border-radius: 25px;
  border: none;
  background: #E6ECEF;
  padding: 0 1.5rem;
  font-size: 24px;
  font-family: 'Fredoka', sans-serif;
  color: #212023;
}

.form-input::placeholder {
  color: rgba(33, 32, 35, 0.5);
}

.form-input:focus {
  outline: 3px solid #ffb500;
}

.error-message {
  color: #feb2b2;
  font-size: 1rem;
}

.form-button {
  width: 100%;
  max-width: 680px;
  height: 90px;
  border-radius: 100px;
  border: none;
  background: #FFB500;
  cursor: pointer;
  color: #212023;
  font-size: 32px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Login Prompt */
.login-prompt {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.prompt-text {
  color: #212023;
  font-size: 32px;
}

.prompt-link {
  color: #FA7921;
  font-size: 32px;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: 'Fredoka', sans-serif;
}

/* Footer */
.signup-footer {
  background: #212023;
  border-top-left-radius: 50px;
  padding: 2rem 4rem;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-logo {
  height: 180px;
  padding-left: 60px;
}

.footer-by {
  color: #E6ECEF;
  font-size: 40px;
  font-weight: 500;
  padding-right: 40px;
  padding-left: 15px;
  
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 19px;

}

.brand-seal {
  width: 100px;
}

.brand-name {
  color: #E6ECEF;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.1;
  text-align: left;
}
</style>