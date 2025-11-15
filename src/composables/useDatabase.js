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
 // Fetch placed objects for a specific VPS location
const fetchPlacedObjects = async (vpsLocationId) => {
  if (!vpsLocationId) {
    placedObjects.value = []
    return { data: [], error: null }
  }

  loading.value = true
  error.value = null

  console.log(
    '%c[DB] fetchPlacedObjects called',
    'color:#3f51b5; font-weight:bold;',
    vpsLocationId
  )

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

    if (err) {
      console.error(
        '%c[DB] ❌ Fetch failed',
        'color:red; font-weight:bold;',
        err
      )
      throw err
    }

    console.log(
      '%c[DB] 📦 Fetch success',
      'color:#4caf50; font-weight:bold;',
      data
    )

    placedObjects.value = data || []
    return { data, error: null }
  } catch (err) {
    error.value = err.message
    return { data: null, error: err }
  } finally {
    loading.value = false
  }
}

  // Create a new placed object (raw)
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

    fetchPlacedObjects(vpsLocationId)

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

  // Get the current authenticated user id (auth.users.id)
  const getCurrentUserId = async () => {
    try {
      const { data, error: authError } = await supabase.auth.getUser()
      if (authError || !data?.user) {
        console.error('useDatabase:getCurrentUserId error:', authError)
        return null
      }
      return data.user.id
    } catch (err) {
      console.error('useDatabase:getCurrentUserId unexpected error:', err)
      return null
    }
  }

  // Resolve a model row by its model_path (the GLB URL we send from 8th Wall)
  const findModelByPath = async (modelPath) => {
    if (!modelPath) return { data: null, error: new Error('No modelPath provided') }

    try {
      const { data, error: err } = await supabase
        .from('models')
        .select('*')
        .eq('model_path', modelPath)
        .single()

      if (err) throw err

      return { data, error: null }
    } catch (err) {
      console.error('useDatabase:findModelByPath error:', err)
      return { data: null, error: err }
    }
  }

  // Take a placement payload from 8th Wall + vps_location_id and create placed_objects row
  const createPlacedObjectFromPlacement = async (placement, vpsLocationId) => {
    if (!placement || !vpsLocationId) {
      return {
        data: null,
        error: new Error('placement and vpsLocationId are required'),
      }
    }

    console.log(
      '%c[DB] createPlacedObjectFromPlacement called',
      'color:#9c27b0; font-weight:bold;',
      { placement, vpsLocationId }
    )

    loading.value = true
    error.value = null

    try {
      // 1) current user id
      const userId = await getCurrentUserId()
      console.log('[DB] resolved user_id:', userId)
      if (!userId) {
        throw new Error('No authenticated user; cannot create placed_object')
      }

      // 2) model row (resolve from model_path === placement.modelUrl)
      const { data: modelRow, error: modelError } = await findModelByPath(
        placement.modelUrl
      )
      console.log('[DB] resolved modelRow:', modelRow)

      if (modelError || !modelRow) {
        throw modelError || new Error('Model not found for modelUrl')
      }

      // 3) build insert payload
      const insertPayload = {
        user_id: userId,
        model_id: modelRow.id,
        vps_location_id: vpsLocationId,
        position: placement.position,
        rotation: placement.rotation,
        scale: placement.scale,
      }

      console.log(
        '%c[DB] INSERT → placed_objects',
        'color:#e91e63; font-weight:bold;',
        insertPayload
      )

      const { data, error: insertError } = await supabase
        .from('placed_objects')
        .insert(insertPayload)
        .select(
          `
          *,
          model:models(*),
          user:profiles(id, username, avatar_url)
        `
        )
        .single()

      if (insertError) {
        console.error(
          '%c[DB] ❌ Supabase insert failed',
          'color:red; font-weight:bold;',
          insertError
        )
        throw insertError
      }

      console.log(
        '%c[DB] ✅ Supabase insert success',
        'color:#4caf50; font-weight:bold;',
        data
      )

      placedObjects.value = [data, ...(placedObjects.value || [])]

      return { data, error: null }
    } catch (err) {
      console.error('useDatabase:createPlacedObjectFromPlacement error:', err)
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
    findVPSLocationByEighthWallId,
    getCurrentUserId,
    findModelByPath,
    createPlacedObjectFromPlacement,
  }
}