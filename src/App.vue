<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import splashVideo from '@/assets/LogoWordmarkAnimated(Color).mp4'
import EightWallEmbed from '@/components/EightWallEmbed.vue'
import AuthPage from '@/components/AuthPage.vue'

const showSplash = ref(true)
const showAuth = ref(false)
const isAuthenticated = ref(false)
const postAuthSplash = ref(false)
const eightWallLoaded = ref(false)
const postAuthVideoFinished = ref(false)

const splashTimer = ref(null)
const postAuthTimeout = ref(null)
const postAuthDelayTimer = ref(null)

const preventScroll = () => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

const allowScroll = () => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

const hideInitialSplash = () => {
  if (!showSplash.value) return
  showSplash.value = false
  allowScroll()
  if (!isAuthenticated.value) {
    showAuth.value = true
  }
}

const handleInitialSplashEnd = () => {
  hideInitialSplash()
}

const handleAuthenticated = () => {
  isAuthenticated.value = true
  showAuth.value = false
}

const handleAuthSuccess = () => {
  handleAuthenticated()
  startPostAuthSplash()
}

const startPostAuthSplash = () => {
  postAuthSplash.value = true
  postAuthVideoFinished.value = false
  eightWallLoaded.value = false
  preventScroll()

  if (postAuthTimeout.value) {
    clearTimeout(postAuthTimeout.value)
  }
  // fallback timeout in case iframe never loads
  postAuthTimeout.value = window.setTimeout(() => {
    finishPostAuthSplash()
  }, 12000)
}

const finishPostAuthSplash = () => {
  postAuthSplash.value = false
  allowScroll()
  if (postAuthTimeout.value) {
    clearTimeout(postAuthTimeout.value)
    postAuthTimeout.value = null
  }
  if (postAuthDelayTimer.value) {
    clearTimeout(postAuthDelayTimer.value)
    postAuthDelayTimer.value = null
  }
}

const handleEightWallLoaded = () => {
  eightWallLoaded.value = true
  maybeDismissPostAuthSplash()
}

const handlePostAuthVideoEnd = () => {
  postAuthVideoFinished.value = true
  maybeDismissPostAuthSplash()
}

const maybeDismissPostAuthSplash = () => {
  if (
    eightWallLoaded.value &&
    postAuthVideoFinished.value &&
    !postAuthDelayTimer.value &&
    postAuthSplash.value
  ) {
    postAuthDelayTimer.value = window.setTimeout(() => {
      finishPostAuthSplash()
    }, 2500) // wait a little longer even after video finishes
  }
}

onMounted(() => {
  preventScroll()
  splashTimer.value = window.setTimeout(hideInitialSplash, 5000)
})

onBeforeUnmount(() => {
  allowScroll()
  if (splashTimer.value) {
    clearTimeout(splashTimer.value)
  }
  if (postAuthTimeout.value) {
    clearTimeout(postAuthTimeout.value)
  }
  if (postAuthDelayTimer.value) {
    clearTimeout(postAuthDelayTimer.value)
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
          @ended="handleInitialSplashEnd"
        ></video>
      </section>
    </transition>

    <section v-if="showAuth && !isAuthenticated" class="auth-shell">
      <AuthPage @authenticated="handleAuthSuccess" />
    </section>

    <section v-if="isAuthenticated" class="embed-shell">
      <EightWallEmbed @experience-ready="handleEightWallLoaded" />
      <transition name="splash-fade">
        <section v-if="postAuthSplash" class="splash-screen post-auth" aria-live="polite">
          <video
            :src="splashVideo"
            autoplay
            muted
            playsinline
            class="splash-video"
            @ended="handlePostAuthVideoEnd"
          ></video>
        </section>
      </transition>
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
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 40;
}

.post-auth {
  z-index: 30;
}

.splash-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.auth-shell {
  width: 100vw;
  height: 100vh;
}
</style>
