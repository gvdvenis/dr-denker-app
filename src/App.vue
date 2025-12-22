<script setup>
import { ref } from 'vue'
import PuzzleGrid from './components/PuzzleGrid.vue'
import ImageZoomView from './components/ImageZoomView.vue'

const showZoom = ref(false)
const selectedImageId = ref(1)

const openZoom = (imageId) => {
  selectedImageId.value = imageId
  showZoom.value = true
}

const closeZoom = () => {
  showZoom.value = false
}
</script>

<template>
  <PuzzleGrid @select-image="openZoom" />
  <Transition name="zoom-fade">
    <ImageZoomView 
      v-if="showZoom"
      :image-id="selectedImageId"
      @close="closeZoom"
      @change-image="selectedImageId = $event"
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
