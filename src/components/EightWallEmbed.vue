<script setup>
import { onMounted, onUnmounted }from 'vue'
import { useVPSLocation } from '@/composables/useVPSLocation'
import { usePersistence } from '@/composables/usePersistence'

const emit = defineEmits(['experience-ready'])

// 1. Initialize your composables
const { findVPSLocationByEighthWallId } = useVPSLocation()
const { createPlacedObjectFromPlacement, loading, error } = usePersistence()

/**
 * Handles the 'message' event from the 8th Wall iframe.
 * This is the core of your persistence pipeline.
 */
const handleMessage = async (event) => {
  // Security: Check the origin of the message
  // if (event.origin !== 'https://studionode.8thwall.app') return

  const eventData = event.data
  
  // We're looking for a specific message 'type' from 8th Wall
  if (eventData && eventData.type === 'EIGHTHWALL_PLACEMENT') {
    console.log(
      '%c[Vue] Message received from 8th Wall',
      'color:#f97316; font-weight:bold;',
      eventData
    )
    
    const { placement, vpsId } = eventData.payload

    if (!placement || !vpsId) {
      console.error('[Vue] Invalid message payload', eventData.payload)
      return
    }

    try {
      // Step 1: Find the Supabase UUID for the VPS location
      const { data: vpsLocation, error: vpsError } = 
        await findVPSLocationByEighthWallId(vpsId)

      if (vpsError || !vpsLocation) {
        throw vpsError || new Error(`No vps_location found for ID: ${vpsId}`)
      }

      // Step 2: Create the placed object row
      const { data: newObject, error: createError } = 
        await createPlacedObjectFromPlacement(placement, vpsLocation.id)
        
      if (createError) {
        throw createError
      }
      
      console.log(
        '%c[Vue] Object saved to Supabase!',
        'color:#4caf50; font-weight:bold;',
        newObject
      )
      
    } catch (err) {
      console.error(
        '%c[Vue] Full persistence pipeline failed',
        'color:red; font-weight:bold;',
        err
      )
    }
  }
}

// Emits when the iframe content has loaded
const handleLoad = () => {
  emit('experience-ready')
}

// 3. Set up the listener when the component mounts
onMounted(() => {
  window.addEventListener('message', handleMessage)
})

// 4. Clean up the listener when the component is removed
onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="embed-container">
    <iframe
      src="https://studionode.8thwall.app/hunt-scavenger/"
      allowfullscreen
      allow="camera; microphone; geolocation; accelerometer; magnetometer; gyroscope; autoplay; clipboard-read; clipboard-write; fullscreen"
      title="8th Wall Experience"
      @load="handleLoad"
    ></iframe>
    
    <!-- Optional: Show a loading state when saving -->
    <div v-if="loading" class="loading-overlay">
      <p>Saving...</p>
    </div>
  </div>
</template>

<style scoped>
.embed-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative; /* For the loading overlay */
}

.embed-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.loading-overlay {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  z-index: 10;
}
</style>