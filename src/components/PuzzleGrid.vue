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
interface Emits {
  selectImage: [imageId: number]
}

const emit = defineEmits<Emits>()

const selectImage = (index: number) => {
  emit('selectImage', index)
}
</script>

<style scoped>
/* Desktop: 5 columns × 8 rows */
.puzzle-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 1200px;
}

.grid-item {
  cursor: pointer;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 1;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.puzzle-image {
  width: 100%;
  height: 100%;
  display: block;
  padding: 5px;
}

/* Tablet: 5 columns × 8 rows, reduced padding */
@media (max-width: 1024px) {
  .puzzle-grid {
    padding: 15px 8px;
  }
  
  .grid-container {
    gap: 6px;
  }
}

/* Mobile landscape / narrower: 4 columns × 10 rows */
@media (max-width: 768px) and (min-width: 500px) {
  .puzzle-grid {
    padding: 0;
    background: white;
  }
  
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 4px;
  }
  
  .grid-item {
    border-radius: 4px;
  }
}

/* Very narrow mobile: 4 columns × 10 rows */
@media (max-width: 500px) {
  .puzzle-grid {
    padding: 0;
    background: white;
  }
  
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
    padding: 3px;
  }
  
  .grid-item {
    border-radius: 3px;
  }
}

/* Smallest phones: 2 columns × 20 rows */
@media (max-width: 380px) {
  .puzzle-grid {
    padding: 0;
    background: white;
  }
  
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    padding: 2px;
  }
  
  .grid-item {
    border-radius: 2px;
  }
}
</style>
