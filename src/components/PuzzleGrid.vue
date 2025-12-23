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
          :src="`/dr-denker-app/images/${index}.webp`"
          :alt="`Puzzle piece ${index}`"
          class="puzzle-image"
        />
        <div v-if="solvedImages.has(index)" class="checkmark">
          ✓
        </div>
        <div class="badge-container">
          <div v-if="solutions[index]" class="badge-rounded badge-success badge-full">
            {{ solutions[index] }}
          </div>
          <div v-else-if="characterCounts[index - 1]" class="badge-rounded badge-dark">
            {{ characterCounts[index - 1] }}
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
  solutions?: Record<number, string>
}

interface Emits {
  selectImage: [imageId: number]
  openCrossword: []
}

const props = withDefaults(defineProps<Props>(), {
  characterCounts: () => [],
  solvedImages: () => new Set(),
  solutions: () => ({})
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
  background: var(--color-bg-light);
  padding: 1.25rem 0.625rem;
  position: relative;
}

.crossword-fab {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  width: 3.5rem;
  height: 3.5rem;
  background: var(--color-info);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-circle);
  cursor: pointer;
  box-shadow: var(--shadow-info);
  transition: var(--transition-all);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (hover: hover) and (pointer: fine) {
  .crossword-fab:hover {
    background: var(--color-info-dark);
    box-shadow: var(--shadow-info-hover);
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
  padding: 0.3rem;
  border-radius: 0.5rem;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  font-size: clamp(10px, 1.5vw, 16px);
  overflow: visible;
}

@media (hover: hover) and (pointer: fine) {
  .grid-item {
    transition: var(--transition-all);
  }

  .grid-item:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-base);
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
  aspect-ratio: 1;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-success);
  font-size: 4rem;
  font-weight: var(--font-weight-bold);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
               0 0 20px rgba(255, 255, 255, 0.6);
  z-index: 20;
  pointer-events: none;
}

.badge-container {
  margin-top: -0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 10;
  flex-wrap: wrap;
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
    border-radius: 0.25rem;
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
    border-radius: 0.25rem;
  }
}
</style>
