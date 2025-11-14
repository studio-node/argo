import { ref } from 'vue'
import { useGeolocation } from '@vueuse/core'
import { supabase } from '@/lib/supabase'

const currentVPSLocation = ref(null)
const loading = ref(false)
const error = ref(null)

export function useVPSLocation() {
  const { coords, locatedAt, error: geoError } = useGeolocation()

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  // Find nearest VPS location based on geolocation
  const findNearestVPSLocation = async () => {
    loading.value = true
    error.value = null

    try {
      if (!coords.value) {
        throw new Error('Geolocation not available')
      }

      // Fetch all VPS locations
      const { data: locations, error: fetchError } = await supabase
        .from('vps_locations')
        .select('*')

      if (fetchError) throw fetchError

      if (!locations || locations.length === 0) {
        return { data: null, error: null }
      }

      // Find nearest location
      let nearest = null
      let minDistance = Infinity

      for (const location of locations) {
        if (location.latitude && location.longitude) {
          const distance = calculateDistance(
            coords.value.latitude,
            coords.value.longitude,
            location.latitude,
            location.longitude
          )

          if (distance < minDistance) {
            minDistance = distance
            nearest = location
          }
        }
      }

      // Only return if within reasonable distance (e.g., 100 meters)
      if (nearest && minDistance < 100) {
        currentVPSLocation.value = nearest
        return { data: nearest, error: null }
      }

      return { data: null, error: null }
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
      const { data, error: fetchError } = await supabase
        .from('vps_locations')
        .select('*')
        .eq('eighth_wall_vps_id', eighthWallVpsId)
        .single()

      if (fetchError) throw fetchError

      currentVPSLocation.value = data
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    currentVPSLocation,
    loading,
    error,
    coords,
    locatedAt,
    geoError,
    findNearestVPSLocation,
    findVPSLocationByEighthWallId
  }
}

