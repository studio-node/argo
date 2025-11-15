<script setup>
import Header from '@/components/Header.vue'
import HeroSection from '@/components/HeroSection.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import Footer from '@/components/Footer.vue'

import logoWordmark from '@/assets/figma/logo-wordmark.png'
import footerSeal from '@/assets/figma/footer-seal.png'

const footerHighlights = [
  {
    eyebrow: 'Studio',
    title: 'Node',
    description: 'The AR control room for Code Camp creators.',
    image: logoWordmark,
    alt: 'Code Camp glyph'
  },
  {
    eyebrow: 'By',
    title: 'Code Camp',
    description: 'Spatial login surfaces built for dev mode.',
    image: footerSeal,
    alt: 'Code Camp seal'
  }
]
</script>

<template>
  <div class="home-page">
    <Header />
    <HeroSection />
    <Footer>
      <div class="footer-grid">
        <FeatureCard
          v-for="highlight in footerHighlights"
          :key="highlight.title"
          :eyebrow="highlight.eyebrow"
          :title="highlight.title"
          :description="highlight.description"
          variant="dark"
        >
          <template #media>
            <img :src="highlight.image" :alt="highlight.alt" />
          </template>
        </FeatureCard>
      </div>
      <p class="footer-note">Immersive login surfaces inspired by the CODE CAMP frame.</p>
    </Footer>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 4rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.footer-note {
  margin-top: 1.5rem;
  color: rgba(230, 236, 239, 0.75);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.8rem;
}
</style>
