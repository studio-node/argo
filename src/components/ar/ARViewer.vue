<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MESSAGE_TYPES, createMessage, isValidMessage } from '@/lib/studioMessages'
import { useDatabase } from '@/composables/useDatabase'
import { useAuth } from '@/composables/useAuth'
import { useVPSLocation } from '@/composables/useVPSLocation'

const props = defineProps({
  vpsLocationId: {
    type: String,
    default: null
  },
  selectedModel: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['model-placed', 'vps-location-detected'])

const studioUrl = import.meta.env.VITE_8TH_WALL_STUDIO_URL || 'https://studionode.8thwall.app/testing-ar/'
const iframeRef = ref(null)
const { user, isAuthenticated } = useAuth()
const { createPlacedObject, placedObjects, startPolling, stopPolling } = useDatabase()
const { findVPSLocationByEighthWallId, currentVPSLocation } = useVPSLocation()

let currentVPSLocationId = ref(null)
let placementMode = ref(false)

// Handle messages from Studio
const handleMessage = async (event) => {
  // Security: verify origin if needed
  // if (event.origin !== 'https://studionode.8thwall.app') return

  if (!isValidMessage(event.data)) return

  const { type, payload } = event.data

  switch (type) {
    case MESSAGE_TYPES.VPS_LOCATION_DETECTED:
      // Studio detected a VPS location
      if (payload?.eighth_wall_vps_id) {
        const { data: vpsLocation } = await findVPSLocationByEighthWallId(payload.eighth_wall_vps_id)
        if (vpsLocation) {
          currentVPSLocationId.value = vpsLocation.id
          emit('vps-location-detected', vpsLocation)
          // Start polling for placed objects
          startPolling(vpsLocation.id, 8000)
          // Load existing placed objects
          sendPlacedObjectsToStudio()
        }
      }
      break

    case MESSAGE_TYPES.TAP_POSITION:
      // User tapped in AR view
      if (placementMode.value && props.selectedModel && isAuthenticated.value && currentVPSLocationId.value) {
        await placeModel(payload)
      }
      break

    case MESSAGE_TYPES.PLACEMENT_SUCCESS:
      // Studio confirmed placement
      emit('model-placed')
      break
  }
}

// Send placed objects to Studio
const sendPlacedObjectsToStudio = () => {
  if (!iframeRef.value?.contentWindow) return

  const message = createMessage(MESSAGE_TYPES.LOAD_PLACED_OBJECTS, {
    objects: placedObjects.value.map(obj => ({
      id: obj.id,
      model: {
        id: obj.model.id,
        name: obj.model.name,
        model_path: obj.model.model_path
      },
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale
    }))
  })

  iframeRef.value.contentWindow.postMessage(message, '*')
}

// Place a model at the tapped position
const placeModel = async (tapData) => {
  if (!props.selectedModel || !user.value || !currentVPSLocationId.value) return

  const placementData = {
    user_id: user.value.id,
    model_id: props.selectedModel.id,
    vps_location_id: currentVPSLocationId.value,
    position: tapData.position || { x: 0, y: 0, z: 0 },
    rotation: tapData.rotation || { x: 0, y: 0, z: 0 },
    scale: tapData.scale || { x: 1, y: 1, z: 1 }
  }

  const { data, error } = await createPlacedObject(placementData)

  if (data && !error) {
    // Send placement to Studio
    const message = createMessage(MESSAGE_TYPES.PLACE_MODEL, {
      id: data.id,
      model: {
        id: data.model.id,
        name: data.model.name,
        model_path: data.model.model_path
      },
      position: data.position,
      rotation: data.rotation,
      scale: data.scale
    })

    if (iframeRef.value?.contentWindow) {
      iframeRef.value.contentWindow.postMessage(message, '*')
    }

    placementMode.value = false
    emit('model-placed', data)
  }
}

// Enable placement mode
const enablePlacementMode = () => {
  if (!isAuthenticated.value) {
    alert('Please login to place models')
    return false
  }
  if (!props.selectedModel) {
    alert('Please select a model first')
    return false
  }
  placementMode.value = true
  return true
}

// Watch for placed objects changes and update Studio
watch(placedObjects, () => {
  sendPlacedObjectsToStudio()
}, { deep: true })

// Watch for selected model changes
watch(() => props.selectedModel, (newModel) => {
  if (newModel) {
    placementMode.value = false
  }
})

// Watch for vpsLocationId prop changes
watch(() => props.vpsLocationId, (newId) => {
  if (newId) {
    currentVPSLocationId.value = newId
    startPolling(newId, 8000)
    sendPlacedObjectsToStudio()
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('message', handleMessage)
  
  // If vpsLocationId is provided as prop, start polling immediately
  if (props.vpsLocationId) {
    currentVPSLocationId.value = props.vpsLocationId
    startPolling(props.vpsLocationId, 8000)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
  stopPolling()
})

const cancelPlacementMode = () => {
  placementMode.value = false
}

defineExpose({
  enablePlacementMode,
  cancelPlacementMode,
  get placementMode() {
    return placementMode.value
  }
})
</script>

<template>
  <div class="ar-viewer">
    <iframe
      ref="iframeRef"
      :src="studioUrl"
      class="ar-iframe"
      allowfullscreen
      allow="camera; microphone; geolocation; accelerometer; magnetometer; gyroscope; autoplay; clipboard-read; clipboard-write; fullscreen"
    ></iframe>
    <div v-if="placementMode" class="placement-indicator">
      Tap in AR view to place model
    </div>
  </div>
</template>

<style scoped>
.ar-viewer {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.ar-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.placement-indicator {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 500;
  z-index: 10;
  pointer-events: none;
}
</style>

