<script setup>
import { ref, onMounted, onBeforeUnmount, provide, readonly, computed } from 'vue'
import NearbyMap from '@/components/NearbyMap.vue'
import splashVideo from '@/assets/animatedlogo.mp4'
import argoLogo from '@/assets/LogoWordmark.png'

const showSplash = ref(true)
const locationStatus = ref('idle')
const coords = ref(null)
const locationError = ref('')
const viewport = ref({
  width: window.innerWidth,
  height: window.innerHeight
})

let splashTimer

const mapHeight = computed(() => Math.max(360, Math.round(viewport.value.height * 0.55)))

const preventScroll = () => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

const allowScroll = () => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

const handleResize = () => {
  viewport.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

const requestLocation = () => {
  if (!('geolocation' in navigator)) {
    locationStatus.value = 'error'
    locationError.value = 'Location is not supported on this device.'
    return
  }

  locationStatus.value = 'pending'
  locationError.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      coords.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      locationStatus.value = 'success'
    },
    (error) => {
      locationStatus.value = 'error'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value =
            'We need permission to access your location. Please enable it to see nearby experiences.'
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = 'We could not determine your current location. Try again in a moment.'
          break
        case error.TIMEOUT:
          locationError.value = 'Getting your location took too long. Please try again.'
          break
        default:
          locationError.value = 'Something went wrong while fetching your location.'
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

const hideSplash = () => {
  if (!showSplash.value) return
  showSplash.value = false
  allowScroll()
  requestLocation()
}

const handleSplashEnd = () => {
  hideSplash()
}

onMounted(() => {
  preventScroll()
  splashTimer = window.setTimeout(hideSplash, 5000)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  allowScroll()
  if (splashTimer) {
    clearTimeout(splashTimer)
  }
  window.removeEventListener('resize', handleResize)
})

provide('userCoords', readonly(coords))
provide('locationStatus', readonly(locationStatus))
provide('locationError', readonly(locationError))
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

    <main v-if="!showSplash" class="app-shell">
      <header class="app-header">
        <div class="header-intro">
          <img :src="argoLogo" alt="Argo logo" class="argo-logo" />
          <div>
            <h1>Code Camp Experience</h1>
          </div>
        </div>
        <button class="retry-btn" @click="requestLocation">Refresh</button>
      </header>

      <section class="map-wrapper" :style="{ minHeight: `${mapHeight}px` }" aria-live="polite">
        <div v-if="locationStatus === 'pending'" class="status-card">
          <span class="spinner" aria-hidden="true"></span>
          <p>Getting your location…</p>
        </div>
        <div v-else-if="locationStatus === 'error'" class="status-card is-error">
          <p>{{ locationError }}</p>
          <button class="retry-btn inline" @click="requestLocation">Try again</button>
        </div>
        <div v-else-if="locationStatus === 'success'" class="map-stage">
          <NearbyMap :coords="coords" />
        </div>
        <div v-else class="status-card">
          <p>Tap allow to share your location and view the map.</p>
        </div>
      </section>

      <section class="details-panel">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-root {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(145deg, #dfe6eb 0%, #e7ecef 60%, #f7fafc 100%);
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

.app-shell {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  min-height: 100vh;
  padding: calc(env(safe-area-inset-top) + 24px) clamp(20px, 5vw, 32px)
    calc(env(safe-area-inset-bottom) + 32px);
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 2rem);
}

.app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.header-intro {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.argo-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(15, 23, 42, 0.6);
  font-size: 0.75rem;
  margin-bottom: 0.35rem;
}

.app-header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 5vw, 2rem);
}

.retry-btn {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.25rem;
  background: #0f172a;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.retry-btn.inline {
  margin-top: 0.75rem;
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.retry-btn:hover {
  opacity: 0.85;
}

.map-wrapper {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  align-items: stretch;
}

.map-stage {
  flex: 1;
}

.status-card {
  width: 100%;
  min-height: 240px;
  border-radius: 32px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  gap: 0.75rem;
}

.status-card.is-error {
  color: #b91c1c;
}

.spinner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid rgba(15, 23, 42, 0.15);
  border-top-color: #0f172a;
  animation: spin 1s linear infinite;
}

.details-panel {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  min-height: 200px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .app-shell {
    padding-left: clamp(12px, 4vw, 20px);
    padding-right: clamp(12px, 4vw, 20px);
  }

  .map-wrapper {
    border-radius: 24px;
  }

  .status-card {
    border-radius: 24px;
  }
}
</style>
