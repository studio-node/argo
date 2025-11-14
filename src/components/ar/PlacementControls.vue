<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  selectedModel: {
    type: Object,
    default: null
  },
  placementMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['enable-placement', 'cancel-placement', 'clear-selection'])

const { isAuthenticated } = useAuth()

const hasSelectedModel = computed(() => !!props.selectedModel)

const handlePlaceModel = () => {
  emit('enable-placement')
}

const handleCancel = () => {
  emit('cancel-placement')
}

const handleClearSelection = () => {
  emit('clear-selection')
}
</script>

<template>
  <div v-if="isAuthenticated && hasSelectedModel" class="placement-controls">
    <div v-if="!placementMode" class="controls-content">
      <div class="selected-model-info">
        <span class="model-name">{{ selectedModel.name }}</span>
        <button @click="handleClearSelection" class="clear-btn">×</button>
      </div>
      <button @click="handlePlaceModel" class="place-btn">Place Model</button>
    </div>
    <div v-else class="controls-content">
      <button @click="handleCancel" class="cancel-btn">Cancel</button>
    </div>
  </div>
  <div v-else-if="!isAuthenticated" class="placement-controls">
    <div class="controls-content">
      <p class="login-prompt">Login to place models</p>
    </div>
  </div>
</template>

<style scoped>
.placement-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.controls-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selected-model-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.model-name {
  font-weight: 500;
  color: #333;
}

.clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.clear-btn:hover {
  background: #c82333;
}

.place-btn,
.cancel-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.place-btn {
  background: #28a745;
  color: white;
}

.place-btn:hover {
  background: #218838;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.login-prompt {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>

