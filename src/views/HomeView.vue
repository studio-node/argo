<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVPSLocation } from '@/composables/useVPSLocation'

const router = useRouter()
const { findNearestVPSLocation, currentVPSLocation } = useVPSLocation()

const detectingLocation = ref(false)
const selectedLocation = ref(null)

const mockLocations = ref([
  {
    id: 'pier-27',
    name: 'Pier 27 Launchpad',
    shortDescription: 'Immersive waterfront AR moment.',
    description:
      'Follow the animated wayfinding beacons along the pier to reveal a floating kinetic sculpture hovering over the bay.',
    distance: '0.2 mi',
    window: 'Every 15 min',
    coordinates: { x: 24, y: 46 }
  },
  {
    id: 'rooftop-garden',
    name: 'Sky Garden Observatory',
    shortDescription: 'Guided path through the rooftop canopy.',
    description:
      'Trace glimmering light ribbons to explore the rooftop garden story. Interact with volumetric blooms that respond to your movement.',
    distance: '0.6 mi',
    window: 'Opens 6 pm',
    coordinates: { x: 62, y: 38 }
  },
  {
    id: 'market-square',
    name: 'Market Square Portal',
    shortDescription: 'Portal show inside the central plaza.',
    description:
      'This drop anchors holographic characters to each market stall, revealing narratives from local makers as you move around the square.',
    distance: '1.1 mi',
    window: 'Weekends only',
    coordinates: { x: 48, y: 72 }
  },
  {
    id: 'museum-walk',
    name: 'Museum Walk Chronicle',
    shortDescription: 'Story trail along the sculpture walk.',
    description:
      'Scan each sculpture to unlock layered animations and spatialized narration that bring the collection to life.',
    distance: '1.8 mi',
    window: 'All day',
    coordinates: { x: 78, y: 28 }
  }
])

const startAR = async (locationId = null) => {
  detectingLocation.value = true

  if (locationId) {
    await router.push({ name: 'ar', params: { vpsLocationId: locationId } })
    detectingLocation.value = false
    return
  }

  const { data } = await findNearestVPSLocation()

  detectingLocation.value = false

  if (data) {
    router.push({ name: 'ar', params: { vpsLocationId: data.id } })
  } else {
    router.push({ name: 'ar' })
  }
}

const selectLocation = (location) => {
  selectedLocation.value = location
}

const closeModal = () => {
  selectedLocation.value = null
}

const exploreSelectedLocation = () => {
  const location = selectedLocation.value
  if (!location) return
  startAR(location.id)
}
</script>

<template>
  <div class="map-experience">
    <section class="map-panel">
      <header class="panel-header">
        <p class="eyebrow">City Explorer</p>
        <h1>Choose a launch point.</h1>
        <p class="panel-subtitle">
          Tap a beacon on the map or pick from the list to preview a scripted drop.
        </p>
      </header>
      <div class="map-canvas" aria-label="Mock map">
        <div class="map-grid"></div>
        <div class="map-ring ring-one"></div>
        <div class="map-ring ring-two"></div>
        <div class="map-ring ring-three"></div>
        <button
          v-for="location in mockLocations"
          :key="location.id + '-pin'"
          class="map-pin"
          :style="{ left: location.coordinates.x + '%', top: location.coordinates.y + '%' }"
          :aria-label="`Preview ${location.name}`"
          @click="selectLocation(location)"
        >
          <span></span>
        </button>
      </div>
      <div v-if="currentVPSLocation" class="location-chip">
        Nearest live node:
        <strong>{{ currentVPSLocation.name }}</strong>
      </div>
    </section>

    <section class="locations-panel">
      <div class="panel-header compact">
        <p class="eyebrow">Nearby drops</p>
        <h2>Mock locations</h2>
      </div>
      <ul class="location-list">
        <li
          v-for="location in mockLocations"
          :key="location.id"
          class="location-card"
        >
          <button
            class="location-card__body"
            type="button"
            @click="selectLocation(location)"
          >
            <div class="location-card__copy">
              <p class="location-card__meta">{{ location.distance }} · {{ location.window }}</p>
              <h3>{{ location.name }}</h3>
              <p>{{ location.shortDescription }}</p>
            </div>
            <span class="location-card__cta">Details →</span>
          </button>
        </li>
      </ul>
    </section>

    <div
      v-if="selectedLocation"
      class="location-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="selectedLocation?.name"
    >
      <div class="modal-card">
        <button class="close-btn" type="button" @click="closeModal" aria-label="Close popup">
          &times;
        </button>
        <div class="image-frame">
          <span>Image placeholder</span>
        </div>
        <div class="modal-body">
          <p class="eyebrow">{{ selectedLocation.window }}</p>
          <h3>{{ selectedLocation.name }}</h3>
          <p class="modal-description">{{ selectedLocation.description }}</p>
        </div>
        <button
          class="explore-btn"
          type="button"
          @click="exploreSelectedLocation"
          :disabled="detectingLocation"
        >
          {{ detectingLocation ? 'Launching…' : 'Explore' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-experience {
  min-height: 100vh;
  width: 100%;
  background: #e7ecef;
  padding: clamp(1.5rem, 4vw, 3rem);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(1.5rem, 4vw, 3rem);
}

.panel-header {
  margin-bottom: 1.5rem;
}

.panel-header.compact {
  margin-bottom: 1rem;
}

.eyebrow {
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.7rem;
  color: rgba(15, 23, 42, 0.6);
  margin-bottom: 0.35rem;
}

.panel-subtitle {
  color: rgba(15, 23, 42, 0.7);
  max-width: 420px;
}

.map-panel,
.locations-panel {
  background: white;
  border-radius: 28px;
  padding: clamp(1.25rem, 3vw, 2rem);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.map-canvas {
  position: relative;
  height: clamp(320px, 45vw, 520px);
  border-radius: 24px;
  overflow: hidden;
  background: radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2), transparent 45%),
    radial-gradient(circle at 70% 60%, rgba(14, 165, 233, 0.25), transparent 50%),
    #f5f7fa;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(148, 163, 184, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.25) 1px, transparent 1px);
  background-size: 40px 40px;
}

.map-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(37, 99, 235, 0.2);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ring-one {
  width: 40%;
  height: 40%;
}

.ring-two {
  width: 65%;
  height: 65%;
}

.ring-three {
  width: 90%;
  height: 90%;
}

.map-pin {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: rgba(59, 130, 246, 0.12);
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.map-pin span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2);
}

.map-pin:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: rgba(59, 130, 246, 0.2);
}

.location-chip {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.08);
  color: #0f172a;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.location-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.location-card__body {
  width: 100%;
  text-align: left;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.07));
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.location-card__body:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.location-card__copy h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.location-card__copy p {
  color: rgba(15, 23, 42, 0.7);
  font-size: 0.95rem;
}

.location-card__meta {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.55);
  margin-bottom: 0.2rem;
}

.location-card__cta {
  align-self: center;
  font-weight: 600;
  color: #2563eb;
}

.location-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal-card {
  background: white;
  width: min(420px, 90vw);
  border-radius: 28px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 40px 80px rgba(15, 23, 42, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(15, 23, 42, 0.6);
}

.image-frame {
  width: 100%;
  border-radius: 20px;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(15, 23, 42, 0.5);
  font-size: 0.95rem;
  background: #f8fafc;
}

.modal-description {
  color: rgba(15, 23, 42, 0.75);
  line-height: 1.5;
}

.explore-btn {
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, #22d3ee, #818cf8);
  color: #0f172a;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.explore-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 25px 45px rgba(129, 140, 248, 0.35);
}

.explore-btn:disabled {
  opacity: 0.7;
  cursor: progress;
}

@media (max-width: 1024px) {
  .map-experience {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .map-panel,
  .locations-panel {
    padding: 1rem;
  }

  .map-canvas {
    height: 320px;
  }

  .location-card__body {
    flex-direction: column;
  }

  .location-card__cta {
    align-self: flex-start;
  }
}
</style>

