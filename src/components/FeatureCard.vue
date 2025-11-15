<script setup>
const props = defineProps({
  eyebrow: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'dark'
  }
})
</script>

<template>
  <article class="feature-card" :class="`feature-card--${props.variant}`">
    <div class="feature-card__text">
      <p v-if="props.eyebrow" class="feature-card__eyebrow">{{ props.eyebrow }}</p>
      <h3>{{ props.title }}</h3>
      <p v-if="props.description">{{ props.description }}</p>
    </div>
    <div v-if="$slots.media" class="feature-card__media">
      <slot name="media" />
    </div>
  </article>
</template>

<style scoped>
.feature-card {
  border-radius: 28px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.feature-card--dark {
  background: rgba(230, 236, 239, 0.04);
  color: var(--text-light);
}

.feature-card--light {
  background: var(--bg-primary);
  color: var(--text-dark);
  border-color: rgba(33, 32, 35, 0.08);
}

.feature-card__text h3 {
  margin: 0.15rem 0;
  font-size: 1.6rem;
}

.feature-card__text p {
  margin: 0;
  color: inherit;
}

.feature-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  opacity: 0.8;
}

.feature-card__media img {
  width: 96px;
  height: auto;
  object-fit: contain;
}

@media (max-width: 600px) {
  .feature-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
