<script setup>
import { onMounted } from 'vue'
import { useDatabase } from '@/composables/useDatabase'
import ModelCard from './ModelCard.vue'

const emit = defineEmits(['select'])

const { models, loading, error, fetchModels } = useDatabase()

onMounted(() => {
  fetchModels()
})

const handleSelectModel = (model) => {
  emit('select', model)
}
</script>

<template>
  <div class="model-library">
    <div v-if="loading" class="loading">Loading models...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else-if="models.length === 0" class="empty">No models available</div>
    <div v-else class="model-grid">
      <ModelCard
        v-for="model in models"
        :key="model.id"
        :model="model"
        @select="handleSelectModel(model)"
      />
    </div>
  </div>
</template>

<style scoped>
.model-library {
  padding: 2rem;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .model-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>

