<template>
  <div v-if="isVisible" class="thumbnail-carousel">
    <div class="carousel-wrapper">
      <swiper
        :slides-per-view="'auto'"
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
          <div class="thumbnail-wrapper">
            <img
              :src="`/dr-denker-app/images/${index}.webp`"
              :alt="$t('thumbnail.alt', { index })"
              :class="['thumbnail', { active: index === currentImage }]"
            />
            <div v-if="solvedImages.has(index)" class="thumbnail-checkmark">
              ✓
            </div>
          </div>
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
  solvedImages?: Set<number>
}

interface Emits {
  select: [imageId: number]
}

const props = withDefaults(defineProps<Props>(), {
  solvedImages: () => new Set()
})
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
  position: relative;
  height: 130px;
  background: var(--color-dark);
  padding: 15px;
  border-top: 2px solid #444;
  flex-shrink: 0;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
}

.thumbnail-swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  width: auto !important;
}

.thumbnail-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
  display: block;
}

.thumbnail {
  height: 96px;
  width: 96px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0.6;
  transition: var(--transition-fast);
  border: 2px solid transparent;
  display: block;
  aspect-ratio: 1;
}

.thumbnail-checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-success);
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8),
               0 0 16px rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.thumbnail:hover {
  opacity: 1;
}

.thumbnail.active {
  opacity: 1;
  border-color: var(--color-success);
}

@media (max-width: 768px) {
  .thumbnail-carousel {
    height: 90px;
    padding: 10px;
  }

  .thumbnail-wrapper {
    width: 66px;
    height: 66px;
  }

  .thumbnail {
    height: 66px;
    width: 66px;
  }
  
  .thumbnail-checkmark {
    font-size: 2rem;
  }
}
</style>
