<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ARViewer from '@/components/ar/ARViewer.vue'
import PlacementControls from '@/components/ar/PlacementControls.vue'

const props = defineProps({
  vpsLocationId: {
    type: String,
    default: null
  }
})

const router = useRouter()
const { isAuthenticated } = useAuth()
const selectedModel = ref(null)
const placementMode = ref(false)
const arViewerRef = ref(null)

// Load selected model from localStorage
onMounted(() => {
  const storedModel = localStorage.getItem('selectedModel')
  if (storedModel) {
    try {
      selectedModel.value = JSON.parse(storedModel)
    } catch (e) {
      console.error('Failed to parse stored model', e)
    }
  }
})

const handleModelPlaced = () => {
  placementMode.value = false
  // Optionally clear selection after placement
  // selectedModel.value = null
  // localStorage.removeItem('selectedModel')
}

const handleEnablePlacement = () => {
  if (arViewerRef.value) {
    const success = arViewerRef.value.enablePlacementMode()
    if (success) {
      placementMode.value = true
    }
  }
}

const handleCancelPlacement = () => {
  placementMode.value = false
  if (arViewerRef.value) {
    arViewerRef.value.cancelPlacementMode()
  }
}

const handleClearSelection = () => {
  selectedModel.value = null
  localStorage.removeItem('selectedModel')
  placementMode.value = false
}

const handleVPSLocationDetected = (location) => {
  console.log('VPS Location detected:', location)
}
</script>

<template>
  <div class="ar-view">
    <div class="ar-header">
      <button @click="router.push('/')" class="back-btn">← Back</button>
      <div class="header-actions">
        <router-link v-if="!selectedModel" to="/models" class="models-btn">
          Select Model
        </router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="login-btn">
          Login
        </router-link>
      </div>
    </div>
    <ARViewer
      ref="arViewerRef"
      :vps-location-id="vpsLocationId"
      :selected-model="selectedModel"
      @model-placed="handleModelPlaced"
      @vps-location-detected="handleVPSLocationDetected"
    />
    <PlacementControls
      :selected-model="selectedModel"
      :placement-mode="placementMode"
      @enable-placement="handleEnablePlacement"
      @cancel-placement="handleCancelPlacement"
      @clear-selection="handleClearSelection"
    />
  </div>
</template>

<style scoped>
.ar-view {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.ar-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.back-btn,
.models-btn,
.login-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.models-btn {
  background: #28a745;
  color: white;
}

.models-btn:hover {
  background: #218838;
}

.login-btn {
  background: #007bff;
  color: white;
}

.login-btn:hover {
  background: #0056b3;
}
</style>

