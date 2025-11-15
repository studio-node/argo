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
  font-family: 'Fredoka', sans-serif;
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
  font-family: 'Fredoka', sans-serif;
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
  font-family: 'Fredoka', sans-serif;
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
  padding-left: 0;
}

.footer-by {
  color: #E6ECEF;
  font-size: 40px;
  font-weight: 500;
  padding: 0;
  margin-right: 20px;
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

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .login-page {
    padding: 0;
    align-items: flex-start;
    min-height: 100vh;
    overflow-y: auto;
  }
  
  .login-shell {
    border-radius: 0;
    margin: 0;
    min-height: 100vh;
    width: 100%;
    max-width: 100%;
  }
  
  .signup-header {
    height: 120px;
    flex-shrink: 0;
  }
  
  .header-curve {
    border-bottom-left-radius: 0;
  }
  
  .header-logo-container {
    padding: 0.75rem;
  }
  
  .signup-main {
    padding: 1rem 0.75rem;
    gap: 0.75rem;
    flex: 1;
    min-height: auto;
  }
  
  .main-heading {
    font-size: 32px;
    margin-bottom: 0.25rem;
  }
  
  .main-subtitle {
    font-size: 14px;
    margin-bottom: 0.5rem;
  }
  
  .signup-form {
    padding: 1rem 0.75rem;
    border-radius: 30px;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  
  .form-group {
    gap: 0.25rem;
  }
  
  .form-label {
    font-size: 14px;
  }
  
  .form-input {
    height: 44px;
    padding: 0 0.75rem;
    font-size: 16px;
    border-radius: 12px;
  }
  
  .form-button {
    height: 44px;
    font-size: 16px;
    border-radius: 22px;
    margin-top: 0.25rem;
  }
  
  .login-prompt {
    margin-top: 0.75rem;
    gap: 0.25rem;
  }
  
  .prompt-text {
    font-size: 13px;
  }
  
  .prompt-link {
    font-size: 13px;
  }
  
  .signup-footer {
    border-top-left-radius: 0;
    padding: 1rem 0.75rem;
    flex-shrink: 0;
  }
  
  .footer-content {
    gap: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .footer-logo {
    height: 50px;
    padding-left: 0;
  }
  
  .footer-by {
    font-size: 12px;
    padding: 0 8px;
    margin-right: 12px;
  }
  
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .brand-seal {
    width: 35px;
  }
  
  .brand-name {
    font-size: 12px;
  }
}
</style>