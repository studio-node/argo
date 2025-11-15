import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

/**
 * A focused composable to handle SENDING persistence data to Supabase.
 */
export function usePersistence() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * HELPER: Gets the currently authenticated user's ID.
   */
  const getCurrentUserId = async () => {
    try {
      const { data, error: authError } = await supabase.auth.getUser()
      if (authError || !data?.user) {
        console.error('usePersistence:getCurrentUserId error:', authError)
        return null
      }
      return data.user.id
    } catch (err) {
      console.error('usePersistence:getCurrentUserId unexpected error:', err)
      return null
    }
  }

  /**
   * HELPER: Finds our internal 'models' row (and its UUID)
   * using the model's URL path, which 8th Wall will provide.
   */
  const findModelByPath = async (modelPath) => {
    if (!modelPath) {
      return { data: null, error: new Error('No modelPath provided') }
    }

    try {
      const { data, error: err } = await supabase
        .from('models')
        .select('*')
        .eq('model_path', modelPath)
        .single() // We expect one unique match

      if (err) throw err

      return { data, error: null }
    } catch (err) {
      console.error('usePersistence:findModelByPath error:', err)
      return { data: null, error: err }
    }
  }

  /**
   * MAIN FUNCTION: Takes a placement payload from 8th Wall + vps_location_id
   * and creates a new row in the 'placed_objects' table.
   *
   * @param {object} placement - The 8th Wall data { modelUrl, position, rotation, scale }
   * @param {string} vpsLocationId - The Supabase UUID for the location (from useVPSLocation)
   * @returns {object} { data, error } - 'data' is the newly created row.
   */
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
      // 1. Get current user's UUID
      const userId = await getCurrentUserId()
      console.log('[DB] Resolved user_id:', userId)
      if (!userId) {
        throw new Error('No authenticated user; cannot create placed_object')
      }

      // 2. Get the model's UUID (from its URL)
      const { data: modelRow, error: modelError } = await findModelByPath(
        placement.modelUrl
      )
      console.log('[DB] Resolved modelRow:', modelRow)
      if (modelError || !modelRow) {
        throw modelError || new Error('Model not found for modelUrl')
      }

      // 3. Build the final row to insert
      const insertPayload = {
        user_id: userId,
        model_id: modelRow.id,
        vps_location_id: vpsLocationId,
        position: placement.position, // Must be JSON
        rotation: placement.rotation, // Must be JSON
        scale: placement.scale,       // Must be JSON
      }

      console.log(
        '%c[DB] INSERT → placed_objects',
        'color:#e91e63; font-weight:bold;',
        insertPayload
      )

      // 4. Insert the new row
      const { data, error: insertError } = await supabase
        .from('placed_objects')
        .insert(insertPayload)
        .select() // Select the newly created row
        .single()

      if (insertError) {
        console.error(
          '%c[DB] Supabase insert failed',
          'color:red; font-weight:bold;',
          insertError
        )
        throw insertError
      }

      console.log(
        '%c[DB] Supabase insert success',
        'color:#4caf50; font-weight:bold;',
        data
      )

      return { data, error: null }
    } catch (err) {
      console.error('usePersistence:createPlacedObjectFromPlacement error:', err)
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Return only the 'send' functions
  return {
    loading,
    error,
    createPlacedObjectFromPlacement,
  }
}