<script setup>
</script>

<template>
  <footer class="codecamp-footer">
    <div class="codecamp-footer__curve" aria-hidden="true"></div>
    <div class="codecamp-footer__inner">
      <slot />
    </div>
  </footer>
</template>

<style scoped>
.codecamp-footer {
  position: relative;
  padding: clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2.5rem);
  margin-top: clamp(2rem, 5vw, 3rem);
}

.codecamp-footer__curve {
  position: absolute;
  inset: 0;
  background: var(--surface-dark);
  border-radius: 80px 80px 0 0;
  transform: translateY(25%);
  filter: drop-shadow(0 -25px 45px rgba(21, 20, 26, 0.35));
}

.codecamp-footer__inner {
  position: relative;
  background: var(--surface-dark);
  border-radius: 50px 50px 0 0;
  padding: clamp(2rem, 5vw, 3rem);
  color: var(--text-light);
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.3);
}
</style>
