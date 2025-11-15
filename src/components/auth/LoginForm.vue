<template>
  <div class="login-page">
    <div class="login-shell">
      <!-- ======================= -->
      <!-- ==     Header        == -->
      <!-- ======================= -->
      <header class="signup-header">
        <div class="header-curve"></div>
        <div class="header-logo-container">
          <img class="header-logo" src="@/assets/codecamp.png" alt="CodeCamp Logo" />
        </div>
      </header>

      <!-- ======================= -->
      <!-- ==   Main Content    == -->
      <!-- ======================= -->
      <main class="signup-main">
        <h1 class="main-heading">Log In</h1>
        <p class="main-subtitle">Welcome back! Please log in to continue.</p>

        <!-- Form with Vue functionality -->
        <form class="signup-form" @submit.prevent="handleSubmit" novalidate>
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
            />
          </div>

          <!-- Conditional Error Message -->
          <p v-if="error" class="error-message">{{ error }}</p>

          <!-- Dynamic Submit Button -->
          <button type="submit" class="form-button" :disabled="loading">
            <span class="button-text">
              {{ loading ? 'Logging in...' : 'Log In' }}
            </span>
          </button>
        </form>

        <!-- Switch to Signup Prompt -->
        <div class="login-prompt">
          <span class="prompt-text">Don't have an account?</span>
          <button type="button" class="prompt-link" @click="$emit('switch-to-signup')">
            Sign Up
          </button>
        </div>
      </main>

      <!-- ======================= -->
      <!-- ==      Footer       == -->
      <!-- ======================= -->
      <footer class="signup-footer">
        <div class="footer-content">
          <img class="footer-logo" src="@/assets/argologostatic.png" alt="Argo Logo" />
          <span class="footer-by">BY</span>
          <div class="footer-brand">
            <img class="brand-seal" src="@/assets/studionodelogo.png" alt="Studio Node Seal" />
            <span class="brand-name">STUDIO<br/>NODE</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<!-- SCRIPT SECTION HAS BEEN UPDATED -->
<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth'; // Ensure this path is correct

const emit = defineEmits(['success', 'switch-to-signup']);

// Reactive variables for the form inputs
const email = ref('');
const password = ref('');

// ✅ CORRECT: Using "signIn" from the old component's logic
const { signIn, loading, error } = useAuth();

// ✅ CORRECT: handleSubmit now uses the "signIn" function
const handleSubmit = async () => {
  const { user, error: err } = await signIn(
    email.value,
    password.value
  );

  // If login is successful, emit the 'success' event
  if (user && !err) {
    emit('success');
  }
};
</script>

<style scoped>
/* STYLES ARE IDENTICAL TO THE SIGNUP PAGE FOR VISUAL CONSISTENCY */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; }
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

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .login-page {
    padding: 0.5rem;
  }
  
  .login-shell {
    border-radius: 30px;
  }
  
  .signup-header {
    height: 150px;
  }
  
  .header-curve {
    border-bottom-left-radius: 30px;
  }
  
  .header-logo-container {
    padding: 1rem;
  }
  
  .signup-main {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }
  
  .main-heading {
    font-size: 36px;
  }
  
  .main-subtitle {
    font-size: 16px;
  }
  
  .signup-form {
    padding: 1.5rem 1rem;
    border-radius: 30px;
    gap: 1rem;
  }
  
  .form-group {
    gap: 0.375rem;
  }
  
  .form-label {
    font-size: 16px;
  }
  
  .form-input {
    height: 50px;
    padding: 0 1rem;
    font-size: 16px;
    border-radius: 15px;
  }
  
  .form-button {
    height: 50px;
    font-size: 18px;
    border-radius: 25px;
  }
  
  .login-prompt {
    margin-top: 1rem;
    gap: 0.25rem;
  }
  
  .prompt-text {
    font-size: 14px;
  }
  
  .prompt-link {
    font-size: 14px;
  }
  
  .signup-footer {
    border-top-left-radius: 30px;
    padding: 1.5rem 1rem;
  }
  
  .footer-content {
    gap: 10px;
    flex-direction: column;
  }
  
  .footer-logo {
    height: 80px;
    padding-left: 0;
  }
  
  .footer-by {
    font-size: 18px;
    padding: 0;
  }
  
  .brand-seal {
    width: 50px;
  }
  
  .brand-name {
    font-size: 18px;
  }
}
</style>