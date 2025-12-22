<template>
  <div v-if="isVisible" class="thumbnail-carousel">
    <div class="carousel-wrapper">
      <swiper
        :slides-per-view="6"
        :space-between="10"
        :centered-slides="true"
        :loop="true"
        :navigation="true"
        class="thumbnail-swiper"
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
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

interface Props {
  currentImage: number
}

interface Emits {
  select: [imageId: number]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(true)

const selectThumbnail = (index: number) => {
  emit('select', index)
}

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

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: white;
}
</style>
