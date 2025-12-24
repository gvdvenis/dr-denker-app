<template>
  <Transition name="toast-slide">
    <div v-if="visible" class="update-toast">
      <div class="toast-content">
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span class="toast-message">{{ $t('pwa.updateComplete') }}</span>
      </div>
      <button class="toast-close" @click="visible = false" :aria-label="$t('pwa.close')">✕</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const AUTO_HIDE_DELAY = 5000 // 5 seconds

const show = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, AUTO_HIDE_DELAY)
}

defineExpose({ show })
</script>

<style scoped>
.update-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-success);
  color: var(--color-white);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-success-hover);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  z-index: 9999;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.toast-icon {
  flex-shrink: 0;
}

.toast-message {
  white-space: nowrap;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--color-white);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  margin-left: var(--spacing-sm);
  opacity: 0.8;
  transition: var(--transition-fast);
}

.toast-close:hover {
  opacity: 1;
}

/* Slide-up animation */
.toast-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, 100px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .update-toast {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
    max-width: calc(100% - 32px);
  }
  
  .toast-slide-enter-from,
  .toast-slide-leave-to {
    transform: translateY(100px);
  }
}
</style>
