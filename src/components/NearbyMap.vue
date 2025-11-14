<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps({
  coords: {
    type: Object,
    required: true
  }
})

const mapEl = ref(null)
let mapInstance
let markerInstance

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const initMap = () => {
  if (!mapEl.value || mapInstance) return
  const { lat, lng } = props.coords
  mapInstance = L.map(mapEl.value, {
    zoomControl: false
  }).setView([lat, lng], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance)

  markerInstance = L.marker([lat, lng]).addTo(mapInstance)
}

const updateMarker = () => {
  if (!mapInstance || !markerInstance) return
  markerInstance.setLatLng([props.coords.lat, props.coords.lng])
  mapInstance.setView([props.coords.lat, props.coords.lng], 15)
}

watch(
  () => props.coords,
  (newCoords) => {
    if (!newCoords) return
    if (!mapInstance) {
      initMap()
    } else {
      updateMarker()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.coords) {
    initMap()
  }
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div ref="mapEl" class="nearby-map" aria-label="Map centered on your location"></div>
</template>

<style scoped>
.nearby-map {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);
}
</style>
