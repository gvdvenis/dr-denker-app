<template>
  <div class="zoom-view">
    <button class="close-btn" @click="goBack" aria-label="Close zoom view">
      ✕
    </button>

    <div class="zoom-container" ref="zoomElement">
      <TransitionGroup name="image-fade" mode="out-in">
        <div :key="imageId" class="image-wrapper">
          <img
            :src="`/dr-denker-app/images/${imageId}.png`"
            :alt="`Zoomed puzzle piece ${imageId}`"
            class="zoom-image"
          />
          <div v-if="characterCount" class="character-count">
            {{ characterCount }}
          </div>
        </div>
      </TransitionGroup>
    </div>

    <ThumbnailCarousel
      :current-image="imageId"
      @select="changeImage"
    />

    <SolutionButton 
      :image-id="imageId"
      :expected-length="characterCount"
      :existing-answer="existingAnswer"
      @submit="handleSolutionSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import panzoom from 'panzoom'
import ThumbnailCarousel from './ThumbnailCarousel.vue'
import SolutionButton from './SolutionButton.vue'

interface Props {
  imageId: number
  characterCount?: number
  existingAnswer?: string
}

interface Emits {
  close: []
  changeImage: [imageId: number]
  submitSolution: [imageId: number, answer: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const zoomElement = ref<HTMLDivElement>()
const isZoomed = ref(false)
let zoomInstance: any = null

const goBack = () => {
  emit('close')
}

const changeImage = (imageId: number) => {
  const isSameImage = props.imageId === imageId
  emit('changeImage', imageId)
  
  // If clicking the same image, manually reset since watch won't trigger
  if (isSameImage) {
    setTimeout(() => {
      resetZoom()
    }, 100)
  }
}

const handleSolutionSubmit = (imageId: number, answer: string) => {
  emit('submitSolution', imageId, answer)
}

const resetZoom = () => {
  if (zoomInstance) {
    zoomInstance.moveTo(0, 0)
    zoomInstance.zoomAbs(0, 0, 1)
    isZoomed.value = false
  }
}

const initPanzoom = () => {
  if (zoomInstance) {
    zoomInstance.dispose()
  }
  
  if (zoomElement.value) {
    const wrapper = zoomElement.value.querySelector('.image-wrapper') as HTMLElement
    if (wrapper) {
      zoomInstance = panzoom(wrapper, {
        maxZoom: 5,
        minZoom: 1,
        smoothScroll: false,
        zoomDoubleClickSpeed: 1.5,
        bounds: true,
        boundsPadding: 0.3,
      })
    }
  }
}

onMounted(() => {
  initPanzoom()
})

onUnmounted(() => {
  if (zoomInstance) {
    zoomInstance.dispose()
  }
})

watch(() => props.imageId, () => {
  // Wait for the new image to render, then reinitialize panzoom
  setTimeout(() => {
    initPanzoom()
  }, 350) // Wait for transition to complete (300ms) + buffer
})
</script>

<style scoped>
.zoom-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
  transition: all 0.3s ease;
  z-index: 1001;
}

.close-btn:hover {
  background: #da190b;
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.6);
  transform: translateY(-2px);
}

.zoom-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 0;
  position: relative;
}

.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.3s ease;
  position: absolute;
}

.image-fade-enter-from {
  opacity: 0;
}

.image-fade-leave-to {
  opacity: 0;
}

.image-fade-leave-active {
  position: absolute;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  cursor: grab;
}

.image-wrapper:active {
  cursor: grabbing;
}

.zoom-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

.zoom-image:active {
  cursor: grabbing;
}

.character-count {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
}
</style>
