<script setup>
import logoWordmark from '@/assets/figma/logo-wordmark.png'
</script>

<template>
  <header class="codecamp-header">
    <div class="codecamp-header__curves" aria-hidden="true">
      <span class="curve curve--top"></span>
      <span class="curve curve--bottom"></span>
    </div>
    <div class="codecamp-header__brand">
      <img :src="logoWordmark" alt="Code Camp wordmark" class="brand-mark" />
      <p>Immersive AR login studio</p>
    </div>
  </header>
</template>

<style scoped>
.codecamp-header {
  position: relative;
  max-width: 960px;
  margin: 0 auto 2.5rem;
  padding: 1.75rem 1.5rem 0;
}

.codecamp-header__curves {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
}

.curve {
  display: block;
  width: min(960px, 90vw);
  margin: 0 auto;
  background: var(--surface-dark);
  border-radius: 0 0 80px 80px;
  opacity: 0.95;
  filter: drop-shadow(0 20px 45px rgba(10, 10, 15, 0.25));
}

.curve--top {
  height: 230px;
  transform: translateY(-70%);
}

.curve--bottom {
  height: 245px;
  transform: translateY(260%);
  opacity: 0.65;
}

.codecamp-header__brand {
  position: relative;
  z-index: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.brand-mark {
  width: min(420px, 70vw);
  height: auto;
}

.codecamp-header__brand p {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: var(--surface-dark);
}

@media (max-width: 768px) {
  .codecamp-header {
    margin-bottom: 1.5rem;
    padding-top: 1rem;
  }

  .curve--top {
    height: 180px;
  }

  .curve--bottom {
    height: 200px;
    transform: translateY(200%);
  }
}
</style>
