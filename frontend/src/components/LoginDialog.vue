<template>
  <div class="dialog-backdrop" v-if="visible">
    <div class="dialog">
      <h2>{{ step === 1 ? t('login.title') : t('login.verify') }}</h2>
      <div class="form">
        <label>{{ t('login.email') }}</label>
        <input v-model="email" type="email" placeholder="you@example.com" />
      </div>
      <div class="form" v-if="step === 2">
        <label>{{ t('login.code') }}</label>
        <input v-model="code" type="text" maxlength="6" />
      </div>
      <div class="actions">
        <button class="btn-pill btn-neutral" @click="$emit('close')">{{ t('common.cancel') }}</button>
        <button class="btn-pill btn-success" @click="onPrimaryClick" :disabled="loading">
          {{ step === 1 ? t('login.request') : t('login.submit') }}
        </button>
      </div>
      <p class="hint" v-if="step === 1">{{ t('login.hint') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'logged-in'): void }>()

const { t } = useI18n()
const { requestOtp, verifyOtp } = useAuth()

const email = ref('')
const code = ref('')
const step = ref<1 | 2>(1)
const loading = ref(false)

watch(() => props.visible, v => {
  if (!v) {
    step.value = 1
    email.value = ''
    code.value = ''
    loading.value = false
  }
})

async function onPrimaryClick() {
  try {
    loading.value = true
    if (step.value === 1) {
      await requestOtp(email.value)
      step.value = 2
    } else {
      await verifyOtp(email.value, code.value)
      emit('logged-in')
      emit('close')
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dialog-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; }
.dialog { background: var(--color-white); padding: var(--spacing-2xl); border-radius: var(--radius-lg); box-shadow: var(--shadow-base); width: min(420px, 90vw); }
.actions { display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-2xl); }
.form { margin-top: var(--spacing-md); }
.form input { width: 100%; padding: var(--spacing-md); border-radius: var(--radius-lg); border: 1px solid #ddd; }
.hint { color: #666; margin-top: var(--spacing-md); }
</style>