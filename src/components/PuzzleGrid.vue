<template>
  <div class="puzzle-grid">
    <div class="grid-container">
      <div
        v-for="index in 40"
        :key="index"
        class="grid-item"
        @click="selectImage(index)"
      >
        <img
          :src="`/dr-denker-app/images/${index}.png`"
          :alt="`Puzzle piece ${index}`"
          class="puzzle-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectImage = (index: number) => {
  // Navigate to zoom view with selected image
  router.push({
    name: 'zoom',
    params: { imageId: index }
  })
}
</script>

<style scoped>
.puzzle-grid {
  padding: 20px;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 10px;
  max-width: 1200px;
  width: 100%;
  aspect-ratio: 5/8;
}

.grid-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.puzzle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
