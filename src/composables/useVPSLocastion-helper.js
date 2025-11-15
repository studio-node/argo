import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

/**
 * A focused composable to handle VPS Location lookups.
 */
export function useVPSLocation() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Finds our internal vps_locations row (and its UUID)
   * using the string ID provided by 8th Wall.
   *
   * @param {string} eighthWallVpsId - The 'eighth_wall_vps_id' string from 8th Wall.
   * @returns {object} { data, error } - 'data' is the full vps_locations row.
   */
  const findVPSLocationByEighthWallId = async (eighthWallVpsId) => {
    loading.value = true
    error.value = null
    console.log(
      '%c[VPS] findVPSLocationByEighthWallId called',
      'color:#3f51b5; font-weight:bold;',
      eighthWallVpsId
    )

    try {
      const { data, error: fetchError } = await supabase
        .from('vps_locations')
        .select('*')
        .eq('eighth_wall_vps_id', eighthWallVpsId)
        .single() // We expect one unique match

      if (fetchError) throw fetchError

      console.log(
        '%c[VPS]Location found',
        'color:#4caf50; font-weight:bold;',
        data
      )
      return { data, error: null }
    } catch (err) {
      console.error(
        '%c[VPS] Location lookup failed',
        'color:red; font-weight:bold;',
        err
      )
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    findVPSLocationByEighthWallId,
  }
}