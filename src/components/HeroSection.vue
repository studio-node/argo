<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  username: '',
  email: '',
  password: ''
})

const status = ref('')
const error = ref('')

const handleSubmit = () => {
  if (!form.username || !form.email || !form.password) {
    error.value = 'Fill out every field to continue.'
    status.value = ''
    return
  }

  error.value = ''
  status.value = 'We just reserved your spot. Check your inbox for the next steps.'
  setTimeout(() => {
    status.value = ''
  }, 4000)
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__panel">
      <div class="hero__copy">
        <p class="hero__eyebrow">Code Camp</p>
        <h1 id="hero-title">Login</h1>
        <p class="hero__lead">Create your account for an AR experience.</p>
      </div>
      <form class="hero__form" @submit.prevent="handleSubmit" novalidate>
        <label>
          <span>Username</span>
          <input v-model="form.username" type="text" name="username" autocomplete="username" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" name="email" autocomplete="email" />
        </label>
        <label>
          <span>Password</span>
          <input v-model="form.password" type="password" name="password" autocomplete="current-password" />
        </label>
        <p v-if="error" class="form-feedback form-feedback--error">{{ error }}</p>
        <p v-if="status" class="form-feedback form-feedback--status">{{ status }}</p>
        <button type="submit" class="hero__cta">Create Account</button>
      </form>
      <p class="hero__switch">
        <span>Already have an account?</span>
        <button type="button">Log in</button>
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 2rem);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: 0 auto;
  width: min(90%, 980px);
  height: clamp(600px, 80vh, 860px);
  top: clamp(-120px, -10vw, -80px);
  background: linear-gradient(180deg, rgba(33, 32, 35, 0.12), rgba(33, 32, 35, 0));
  filter: blur(30px);
  z-index: 0;
}

.hero__panel {
  position: relative;
  z-index: 1;
  background: var(--surface-dark);
  border-radius: var(--card-radius);
  padding: clamp(2rem, 5vw, 3.75rem);
  color: var(--text-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  box-shadow: var(--shadow-lg);
}

.hero__copy {
  text-align: center;
}

.hero__eyebrow {
  margin: 0;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: rgba(230, 236, 239, 0.75);
}

.hero__copy h1 {
  margin: 0.25rem 0 0.35rem;
  font-size: clamp(2.8rem, 8vw, 5.5rem);
  letter-spacing: -0.04em;
}

.hero__lead {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: rgba(230, 236, 239, 0.85);
}

.hero__form {
  width: min(640px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: rgba(230, 236, 239, 0.9);
}

input {
  border: none;
  border-radius: 24px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-dark);
  font-family: inherit;
  box-shadow: inset 0 0 0 1px rgba(33, 32, 35, 0.15);
}

input:focus {
  outline: 3px solid rgba(255, 181, 0, 0.8);
  outline-offset: 2px;
}

.hero__cta {
  border: none;
  border-radius: 999px;
  padding: 1rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: var(--text-dark);
  box-shadow: var(--shadow-soft);
}

.hero__cta:hover {
  opacity: 0.95;
}

.hero__switch {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.hero__switch button {
  background: none;
  border: none;
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.form-feedback {
  margin: -0.35rem 0 0;
  font-size: 0.95rem;
}

.form-feedback--error {
  color: #feb2b2;
}

.form-feedback--status {
  color: #c8f8d2;
}

@media (max-width: 640px) {
  .hero__panel {
    padding: 2rem 1.25rem;
  }

  input {
    font-size: 0.95rem;
  }
}
</style>
