<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import splashVideo from '@/assets/animatedlogo.mp4'
import EightWallEmbed from '@/components/EightWallEmbed.vue'

const showSplash = ref(true)
let splashTimer

const preventScroll = () => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

const allowScroll = () => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

const hideSplash = () => {
  if (!showSplash.value) return
  showSplash.value = false
  allowScroll()
}

const handleSplashEnd = () => {
  hideSplash()
}

onMounted(() => {
  preventScroll()
  splashTimer = window.setTimeout(hideSplash, 5000)
})

onBeforeUnmount(() => {
  allowScroll()
  if (splashTimer) {
    clearTimeout(splashTimer)
  }
})
</script>

<template>
  <div class="app-root">
    <transition name="splash-fade">
      <section v-if="showSplash" class="splash-screen" aria-live="polite">
        <video
          :src="splashVideo"
          autoplay
          muted
          playsinline
          class="splash-video"
          @ended="handleSplashEnd"
        ></video>
      </section>
    </transition>

    <section v-if="!showSplash" class="embed-shell">
      <EightWallEmbed />
    </section>
  </div>
</template>

<style scoped>
.app-root {
  width: 100vw;
  min-height: 100vh;
  background: #212023;
  position: relative;
  overflow: hidden;
}

.splash-screen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #E7ECEF;
  color: #0f172a;
  z-index: 40;
}

.splash-video {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  pointer-events: none;
}

.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.4s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}

.embed-shell {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
