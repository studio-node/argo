<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useVPSLocation } from '@/composables/useVPSLocation'
import { usePersistence } from '@/composables/usePersistence'
import { supabase } from '@/lib/supabase'

const emit = defineEmits(['experience-ready'])

// Template ref for the iframe
const iframeRef = ref(null)

// 1. Initialize your composables
const { findVPSLocationByEighthWallId, currentVPSLocation } = useVPSLocation()
const { createPlacedObjectFromPlacement, loading, error } = usePersistence()

// Track current VPS location ID
const currentVpsLocationId = ref(null)

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

      // Update current location tracking
      currentVpsLocationId.value = vpsLocation.id

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

/**
 * Sends initialization data (user ID and all placed objects) to the 8th wall iframe
 */
const sendInitDataToIframe = async () => {
  if (!iframeRef.value?.contentWindow) {
    console.warn('[Vue] Iframe not ready, cannot send init data')
    return
  }

  try {
    // Get current user ID
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      console.error('[Vue] Failed to get user:', userError)
      return
    }
    const userId = userData.user.id

    // Fetch ALL placed objects with joins
    const { data: placedObjects, error: objectsError } = await supabase
      .from('placed_objects')
      .select(`
        *,
        model:models(*),
        user:profiles(id, username, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (objectsError) {
      console.error('[Vue] Failed to fetch placed objects:', objectsError)
      return
    }

    // Send message to iframe
    const message = {
      type: 'INIT_DATA',
      payload: {
        userId,
        placedObjects: placedObjects || [],
        vps_location_id: currentVpsLocationId.value || currentVPSLocation.value?.id || null
      }
    }

    iframeRef.value.contentWindow.postMessage(message, '*')
    
    console.log(
      '%c[Vue] Init data sent to 8th Wall',
      'color:#4caf50; font-weight:bold;',
      { userId, placedObjectsCount: placedObjects?.length || 0 }
    )
  } catch (err) {
    console.error('[Vue] Error sending init data to iframe:', err)
  }
}

// Emits when the iframe content has loaded
const handleLoad = () => {
  emit('experience-ready')
  // Send initialization data after iframe is ready
  sendInitDataToIframe()
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
      ref="iframeRef"
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
