<script setup>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const coords = inject('userCoords', null)
const locationStatus = inject('locationStatus', null)
const locationError = inject('locationError', null)

const featuredDrops = [
  {
    id: 'pier-27',
    name: 'Pier 27 Launchpad',
    distance: '0.2 mi',
    window: 'Every 15 min',
    blurb: 'A floating sculpture that responds to the tide.'
  },
  {
    id: 'museum-walk',
    name: 'Museum Walk Chronicle',
    distance: '1.1 mi',
    window: 'All day',
    blurb: 'Narrated sculptures and volumetric blooms.'
  },
  {
    id: 'sky-garden',
    name: 'Sky Garden Observatory',
    distance: '1.8 mi',
    window: 'Opens 6 pm',
    blurb: 'Light ribbons guide you to each rooftop beat.'
  }
]

const formattedCoords = computed(() => {
  if (!coords?.value) return 'Unknown location'
  return `${coords.value.lat.toFixed(3)}, ${coords.value.lng.toFixed(3)}`
})

const primaryStatus = computed(() => {
  if (!locationStatus) return 'idle'
  return locationStatus.value
})

const openArView = (dropId) => {
  router.push({ name: 'ar', params: { vpsLocationId: dropId } })
}
</script>

<template>
  <section class="home-view">
    <header class="home-header">
      <p class="microcopy">Current coords</p>
      <p class="coordinate" :aria-live="primaryStatus === 'success' ? 'polite' : 'off'">
        {{ primaryStatus === 'success' ? formattedCoords : 'Searching…' }}
      </p>
      <p v-if="locationError?.value" class="error-text">{{ locationError.value }}</p>
    </header>

    <ul class="drop-list">
      <li v-for="drop in featuredDrops" :key="drop.id" class="drop-card">
        <div>
          <p class="microcopy">{{ drop.distance }} · {{ drop.window }}</p>
          <h3>{{ drop.name }}</h3>
          <p>{{ drop.blurb }}</p>
        </div>
        <button type="button" class="ghost-btn" @click="openArView(drop.id)">
          Launch
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: #f5f5f7;
}

.home-header {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.microcopy {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(248, 249, 252, 0.6);
}

.coordinate {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0.35rem;
  color: #fdfdff;
}

.error-text {
  margin-top: 0.35rem;
  color: #feb2b2;
  font-size: 0.9rem;
}

.drop-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

.drop-card {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #2f2e33;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.drop-card h3 {
  margin: 0.35rem 0 0.2rem;
  color: #f9f7ff;
}

.drop-card p {
  margin: 0;
  color: rgba(248, 249, 252, 0.7);
}

.ghost-btn {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  color: #f4f4f8;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 640px) {
  .drop-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .ghost-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
