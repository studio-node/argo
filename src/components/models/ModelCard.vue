<script setup>
defineProps({
  model: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const handleSelect = () => {
  emit('select')
}
</script>

<template>
  <div class="model-card" @click="handleSelect">
    <div class="thumbnail-container">
      <img
        v-if="model.thumbnail_path"
        :src="model.thumbnail_path"
        :alt="model.name"
        class="thumbnail"
      />
      <div v-else class="thumbnail-placeholder">
        <span>No Image</span>
      </div>
    </div>
    <div class="card-content">
      <h3 class="model-name">{{ model.name }}</h3>
      <p v-if="model.description" class="model-description">
        {{ model.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.model-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.thumbnail-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  color: #999;
}

.card-content {
  padding: 1rem;
}

.model-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.model-description {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

