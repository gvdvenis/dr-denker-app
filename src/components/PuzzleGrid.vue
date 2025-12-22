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
        <div class="badge-container">
          <div v-if="characterCounts[index - 1]" class="character-count">
            {{ characterCounts[index - 1] }}
          </div>
          <div v-if="solvedImages.has(index)" class="checkmark">
            ✓
          </div>
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
  padding: 1.25rem 0.625rem;
  position: relative;
}

.crossword-fab {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  width: 3.5rem;
  height: 3.5rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0.25rem 0.75rem rgba(33, 150, 243, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (hover: hover) and (pointer: fine) {
  .crossword-fab:hover {
    background: #1976D2;
    box-shadow: 0 0.375rem 1rem rgba(33, 150, 243, 0.6);
    transform: translateY(-0.125rem) scale(1.05);
  }
}

.crossword-fab svg {
  width: 1.75rem;
  height: 1.75rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  width: 100%;
  max-width: 1200px;
}

.grid-item {
  position: relative;
  cursor: pointer;
  padding: 0.3em;
  border-radius: 0.5em;
  background: white;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  font-size: clamp(10px, 1.5vw, 16px);
}

@media (hover: hover) and (pointer: fine) {
  .grid-item {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .grid-item:hover {
    transform: scale(1.05);
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
  }

  .grid-item.solved .puzzle-image:hover {
    filter: blur(0);
  }
}

.grid-item.solved .puzzle-image {
  filter: blur(1.5px);
}

.puzzle-image {
  width: 100%;
  flex: 1;
  display: block;
}

.badge-container {
  margin-top: -0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 10;
}

.character-count {
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.3em 0.6em;
  border-radius: 0.9em;
  font-size: 0.95em;
  font-weight: bold;
}

.checkmark {
  background: #4CAF50;
  color: white;
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: bold;
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
@media (max-width: 768px) and (min-width: 501px) {
  .puzzle-grid {
    padding: 0;
    background: white;
  }
  
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.25rem;
    padding: 0.25rem;
  }
  
  .grid-item {
    border-radius: 0.25em;
  }
}

/* Smaller screens: 2 columns × 20 rows */
@media (max-width: 500px) {
  .puzzle-grid {
    padding: 0;
    background: white;
  }
  
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
    padding: 0.25rem;
  }
  
  .grid-item {
    border-radius: 0.25em;
  }
}
</style>
