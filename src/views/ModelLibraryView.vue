<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModelLibrary from '@/components/models/ModelLibrary.vue'

const router = useRouter()
const selectedModel = ref(null)

const handleSelectModel = (model) => {
  selectedModel.value = model
  // Store in localStorage for persistence
  localStorage.setItem('selectedModel', JSON.stringify(model))
  // Navigate to AR view
  router.push({ name: 'ar' })
}
</script>

<template>
  <div class="model-library-view">
    <div class="header">
      <h1>Model Library</h1>
      <router-link to="/" class="back-btn">← Back to Home</router-link>
    </div>
    <ModelLibrary @select="handleSelectModel" />
  </div>
</template>

<style scoped>
.model-library-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.back-btn {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #0056b3;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>

