<template>
  <div class="ar-wrapper">
    <EightWallEmbed
      ref="eightWall"
      @experience-ready="onExperienceReady"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EightWallEmbed from '@/components/EightWallEmbed.vue'
import { useVPSLocation } from '@/composables/useVPSLocation'
import { useDatabase } from '@/composables/useDatabase'

// ⚠️ MUST match vps_locations.eighth_wall_vps_id in Supabase
const currentEighthWallVpsId = 'YOUR_8THWALL_VPS_ID_HERE'

const eightWall = ref(null)

const { resolveVpsLocation, getCurrentVpsLocationId } = useVPSLocation()
const {
  fetchPlacedObjects,
  createPlacedObjectFromPlacement,
} = useDatabase()

const postToIframe = (message) => {
  if (!eightWall.value) return
  eightWall.value.postToIframe(message)
}

// 1) Messages FROM 8th Wall → Supabase insert
const handleIframeMessage = async (event) => {
  const data = event.data
  if (!data || typeof data !== 'object') return

  if (data.type === 'PLACEMENT_CREATED') {
    const placement = data.payload
    console.log('🔥 placement from iframe:', placement)

    const vpsLocationId = getCurrentVpsLocationId()
    if (!vpsLocationId) {
      console.error('No vpsLocationId resolved yet; cannot save placement')
      return
    }

    const { error } = await createPlacedObjectFromPlacement(
      placement,
      vpsLocationId
    )

    if (error) {
      console.error('Error saving placement to Supabase:', error)
    } else {
      console.log('✅ Placement saved to placed_objects')
    }
  }
}

// 2) Supabase → 8th Wall (sync existing placements)
const loadExistingPlacementsAndSync = async () => {
  const vpsLocationId = getCurrentVpsLocationId()
  if (!vpsLocationId) {
    console.error('No vpsLocationId when loading placements')
    return
  }

  const { data, error } = await fetchPlacedObjects(vpsLocationId)
  if (error) {
    console.error('Error loading placements:', error)
    return
  }

  const placementsForIframe = (data || []).map((row) => ({
    id: row.id,
    modelUrl: row.model.model_path,
    modelType: 'glb',
    parentId: 'wayspot',
    position: row.position,
    rotation: row.rotation,
    scale: row.scale,
  }))

  console.log('📦 Sending PLACEMENTS_SYNC to iframe:', placementsForIframe)

  postToIframe({
    type: 'PLACEMENTS_SYNC',
    payload: placementsForIframe,
  })
}

// Called when EightWallEmbed iframe has loaded
const onExperienceReady = async () => {
  console.log('8th Wall experience ready')
  await loadExistingPlacementsAndSync()
}

onMounted(async () => {
  // Resolve vps_location_id for this 8th Wall VPS
  const vpsLocationId = await resolveVpsLocation(currentEighthWallVpsId)
  if (!vpsLocationId) {
    console.error('Failed to resolve vps_location')
    return
  }

  window.addEventListener('message', handleIframeMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<style scoped>
.ar-wrapper {
  width: 100vw;
  height: 100vh;
}
</style>