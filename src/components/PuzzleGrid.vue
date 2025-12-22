<template>
  <div class="puzzle-grid">
    <button class="crossword-fab" @click="openCrossword" aria-label="Open crossword view">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
      </svg>
    </button>
    
    <div class="grid-container">
      <div
        v-for="index in 40"
        :key="index"
        class="grid-item"
        :class="{ 'solved': solvedImages.has(index) }"
        @click="selectImage(index)"
      >
        <img
          :src="`/dr-denker-app/images/${index}.png`"
          :alt="`Puzzle piece ${index}`"
          class="puzzle-image"
        />
        <div v-if="characterCounts[index - 1]" class="character-count">
          {{ characterCounts[index - 1] }}
        </div>
        <div v-if="solvedImages.has(index)" class="checkmark">
          ✓
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  characterCounts?: number[]
  solvedImages?: Set<number>
}

interface Emits {
  selectImage: [imageId: number]
  openCrossword: []
}

const props = withDefaults(defineProps<Props>(), {
  characterCounts: () => [],
  solvedImages: () => new Set()
})

const emit = defineEmits<Emits>()

const selectImage = (index: number) => {
  emit('selectImage', index)
}

const openCrossword = () => {
  emit('openCrossword')
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
  position: relative;
}

.crossword-fab {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crossword-fab:hover {
  background: #1976D2;
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.6);
  transform: translateY(-2px) scale(1.05);
}

.crossword-fab svg {
  width: 28px;
  height: 28px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 1200px;
}

.grid-item {
  position: relative;
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

.character-count {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
}

.checkmark {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #4CAF50;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  z-index: 10;
}

.grid-item.solved {
  opacity: 0.6;
}

.grid-item.solved:hover {
  opacity: 0.8;
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
