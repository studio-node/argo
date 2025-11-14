<script setup>
import { useRouter } from 'vue-router'
import { useVPSLocation } from '@/composables/useVPSLocation'
import { ref, onMounted } from 'vue'

const router = useRouter()
const { findNearestVPSLocation, loading, currentVPSLocation } = useVPSLocation()
const detectingLocation = ref(false)

const startAR = async () => {
  detectingLocation.value = true
  const { data } = await findNearestVPSLocation()
  detectingLocation.value = false

  if (data) {
    router.push({ name: 'ar', params: { vpsLocationId: data.id } })
  } else {
    // No location found, go to AR without specific location
    router.push({ name: 'ar' })
  }
}
</script>

<template>
  <div class="home-view">
    <div class="hero">
      <h1>AR Experience Platform</h1>
      <p class="subtitle">Create and explore augmented reality experiences</p>
      <div class="actions">
        <button @click="startAR" :disabled="detectingLocation" class="primary-btn">
          {{ detectingLocation ? 'Detecting Location...' : 'Start AR Experience' }}
        </button>
        <router-link to="/models" class="secondary-btn">
          Browse Models
        </router-link>
      </div>
    </div>
    <div v-if="currentVPSLocation" class="location-info">
      <p>Current Location: <strong>{{ currentVPSLocation.name }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero {
  text-align: center;
  max-width: 600px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.primary-btn {
  background: white;
  color: #667eea;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.location-info {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>

