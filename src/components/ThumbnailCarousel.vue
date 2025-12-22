<template>
  <div v-if="isVisible" class="thumbnail-carousel">
    <div class="carousel-wrapper">
      <swiper
        :slides-per-view="6"
        :space-between="10"
        :centered-slides="true"
        :loop="true"
        :initial-slide="currentImage - 1"
        class="thumbnail-swiper"
        @swiper="onSwiper"
      >
        <swiper-slide
          v-for="index in 40"
          :key="index"
          @click="selectThumbnail(index)"
        >
          <img
            :src="`/dr-denker-app/images/${index}.png`"
            :alt="`Thumbnail ${index}`"
            :class="['thumbnail', { active: index === currentImage }]"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

interface Props {
  currentImage: number
}

interface Emits {
  select: [imageId: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(true)
const swiperInstance = ref<any>(null)

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
}

const selectThumbnail = (index: number) => {
  emit('select', index)
}

// Watch currentImage and center the carousel when it changes
watch(
  () => props.currentImage,
  (newImage) => {
    if (swiperInstance.value) {
      swiperInstance.value.slideToLoop(newImage - 1)
    }
  }
)

watch(
  () => isVisible.value,
  (newVal) => {
    if (!newVal) {
      setTimeout(() => {
        isVisible.value = true
      }, 5000)
    }
  }
)
</script>

<style scoped>
.thumbnail-carousel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  z-index: 999;
}

.carousel-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.thumbnail-swiper {
  width: 100%;
}

.thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease, border 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail:hover {
  opacity: 0.8;
}

.thumbnail.active {
  opacity: 1;
  border-color: #4CAF50;
}
</style>
