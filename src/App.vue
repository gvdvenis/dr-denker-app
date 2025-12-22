<script setup>
import { ref, computed, onMounted } from 'vue'
import PuzzleGrid from './components/PuzzleGrid.vue'
import ImageZoomView from './components/ImageZoomView.vue'
import CrosswordView from './components/CrosswordView.vue'
import { usePuzzleData } from './composables/usePuzzleData'
import { useLocalStorage } from './composables/useLocalStorage'

const showZoom = ref(false)
const selectedImageId = ref(1)
const showCrossword = ref(false)

// Load puzzle data and solutions
const { puzzleData, loadPuzzleData, getPuzzleAnswer } = usePuzzleData()
const { solutions, loadSolutions, saveSolution } = useLocalStorage()

// Computed properties
const characterCounts = computed(() => {
  return puzzleData.value.map(p => p.answerLength)
})

const solvedImages = computed(() => {
  return new Set(solutions.value.keys())
})

const currentImageCharacterCount = computed(() => {
  const puzzle = getPuzzleAnswer(selectedImageId.value)
  return puzzle?.answerLength
})

const currentImageExistingAnswer = computed(() => {
  const solution = solutions.value.get(selectedImageId.value)
  return solution?.answer
})

// Event handlers
const openZoom = (imageId) => {
  selectedImageId.value = imageId
  showZoom.value = true
}

const closeZoom = () => {
  showZoom.value = false
}

const openCrossword = () => {
  showCrossword.value = true
}

const closeCrossword = () => {
  showCrossword.value = false
}

const handleSolutionSubmit = (imageId, answer) => {
  saveSolution(imageId, answer)
}

// Initialize on mount
onMounted(async () => {
  await loadPuzzleData()
  loadSolutions()
})
</script>

<template>
  <PuzzleGrid 
    :character-counts="characterCounts"
    :solved-images="solvedImages"
    @select-image="openZoom"
    @open-crossword="openCrossword"
  />
  
  <Transition name="zoom-fade">
    <ImageZoomView 
      v-if="showZoom"
      :image-id="selectedImageId"
      :character-count="currentImageCharacterCount"
      :existing-answer="currentImageExistingAnswer"
      @close="closeZoom"
      @change-image="selectedImageId = $event"
      @submit-solution="handleSolutionSubmit"
    />
  </Transition>
  
  <Transition name="zoom-fade">
    <CrosswordView
      v-if="showCrossword"
      :puzzle-data="puzzleData"
      :solutions="solutions"
      @close="closeCrossword"
    />
  </Transition>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Transition for zoom view */
.zoom-fade-enter-active {
  transition: opacity 0.3s ease;
}

.zoom-fade-leave-active {
  transition: opacity 0.2s ease;
}

.zoom-fade-enter-from,
.zoom-fade-leave-to {
  opacity: 0;
}

html, body, #app {
  width: 100%;
  height: 100%;
}

#app {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
  #app {
    padding: 0;
  }
}
</style>
