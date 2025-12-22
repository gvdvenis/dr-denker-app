<template>
  <div class="zoom-view">
    <button class="close-btn" @click="goBack" aria-label="Close zoom view">
      ✕
    </button>

    <div class="zoom-container" ref="zoomElement">
      <img
        :src="`/dr-denker-app/images/${currentImageId}.png`"
        :alt="`Zoomed puzzle piece ${currentImageId}`"
        class="zoom-image"
      />
    </div>

    <ThumbnailCarousel
      v-if="isZoomed"
      :current-image="currentImageId"
      @select="changeImage"
    />

    <SolutionButton />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import panzoom from 'panzoom'
import ThumbnailCarousel from './ThumbnailCarousel.vue'
import SolutionButton from './SolutionButton.vue'

const router = useRouter()
const route = useRoute()

const currentImageId = ref<number>(parseInt(route.params.imageId as string) || 1)
const zoomElement = ref<HTMLDivElement>()
const isZoomed = ref(false)
let zoomInstance: any = null

const goBack = () => {
  router.push({ name: 'home' })
}

const changeImage = (imageId: number) => {
  currentImageId.value = imageId
}

const handleZoom = (e: any) => {
  isZoomed.value = e.scale > 1.2
}

onMounted(() => {
  if (zoomElement.value) {
    const img = zoomElement.value.querySelector('.zoom-image') as HTMLImageElement
    if (img) {
      zoomInstance = panzoom(img, {
        maxZoom: 5,
        minZoom: 1,
        smoothScroll: true,
        zoomDoubleClickSpeed: 1.5
      })

      zoomInstance.on('zoom', handleZoom)
      zoomInstance.on('pan', handleZoom)
    }
  }
})

onUnmounted(() => {
  if (zoomInstance) {
    zoomInstance.dispose()
  }
})

watch(currentImageId, () => {
  if (zoomInstance) {
    zoomInstance.reset()
    isZoomed.value = false
  }
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  z-index: 1001;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.zoom-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: grab;
}

.zoom-image:active {
  cursor: grabbing;
}
</style>
