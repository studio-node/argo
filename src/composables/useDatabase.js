import { ref, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'

export function useDatabase() {
  const models = ref([])
  const placedObjects = ref([])
  const loading = ref(false)
  const error = ref(null)
  let pollingInterval = null

  // Fetch all models
  const fetchModels = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      models.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Fetch placed objects for a specific VPS location
  const fetchPlacedObjects = async (vpsLocationId) => {
    if (!vpsLocationId) {
      placedObjects.value = []
      return { data: [], error: null }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('placed_objects')
        .select(`
          *,
          model:models(*),
          user:profiles(id, username, avatar_url)
        `)
        .eq('vps_location_id', vpsLocationId)
        .order('created_at', { ascending: false })

      if (err) throw err

      placedObjects.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Create a new placed object
  const createPlacedObject = async (placementData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('placed_objects')
        .insert(placementData)
        .select(`
          *,
          model:models(*),
          user:profiles(id, username, avatar_url)
        `)
        .single()

      if (err) throw err

      // Add to local state
      placedObjects.value = [data, ...placedObjects.value]
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Start polling for placed objects updates
  const startPolling = (vpsLocationId, intervalMs = 8000) => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    // Fetch immediately
    fetchPlacedObjects(vpsLocationId)

    // Then poll at interval
    pollingInterval = setInterval(() => {
      fetchPlacedObjects(vpsLocationId)
    }, intervalMs)
  }

  // Stop polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  // Fetch VPS locations
  const fetchVPSLocations = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('vps_locations')
        .select('*')
        .order('name')

      if (err) throw err

      return { data: data || [], error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Find VPS location by eighth_wall_vps_id
  const findVPSLocationByEighthWallId = async (eighthWallVpsId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('vps_locations')
        .select('*')
        .eq('eighth_wall_vps_id', eighthWallVpsId)
        .single()

      if (err) throw err

      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopPolling()
  })

  return {
    models,
    placedObjects,
    loading,
    error,
    fetchModels,
    fetchPlacedObjects,
    createPlacedObject,
    startPolling,
    stopPolling,
    fetchVPSLocations,
    findVPSLocationByEighthWallId
  }
}

