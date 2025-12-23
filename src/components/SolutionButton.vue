<template>
  <div>
    <button class="solution-btn" @click="openModal" aria-label="Submit solution">
      ✓ Solution
    </button>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Enter Puzzle Solution</h2>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>

        <div class="modal-content">
          <div v-if="expectedLength" class="expected-length">
            Expected length: {{ expectedLength }} characters
          </div>
          <div class="input-wrapper">
            <input
              ref="inputElement"
              v-model="solutionInput"
              type="text"
              :placeholder="`Enter your solution (${expectedLength || '?'} characters)...`"
              class="solution-input"
              @keyup.enter="submitSolution"
              :maxlength="expectedLength || undefined"
            />
            <button 
              v-if="solutionInput"
              class="clear-btn"
              @click="clearInput"
              aria-label="Clear input"
            >
              ✕
            </button>
          </div>

          <div v-if="validationMessage" :class="['validation-message', validationClass]">
            {{ validationMessage }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-cancel" @click="showModal = false">Cancel</button>
          <button class="btn btn-submit" @click="submitSolution">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  imageId?: number
  expectedLength?: number
  existingAnswer?: string
}

interface Emits {
  submit: [imageId: number, answer: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showModal = ref(false)
const solutionInput = ref('')
const validationMessage = ref('')
const validationClass = ref('')
const inputElement = ref<HTMLInputElement>()

const openModal = () => {
  // Pre-fill with existing answer if available
  solutionInput.value = props.existingAnswer || ''
  validationMessage.value = ''
  showModal.value = true
  
  // Focus input after DOM update
  nextTick(() => {
    inputElement.value?.focus()
  })
}

const clearInput = () => {
  solutionInput.value = ''
  validationMessage.value = ''
}

const submitSolution = () => {
  const trimmedInput = solutionInput.value.trim()
  
  // Allow empty input to clear the solution
  if (!trimmedInput) {
    if (props.imageId) {
      emit('submit', props.imageId, '')
    }
    validationMessage.value = '✓ Solution cleared!'
    validationClass.value = 'success'
    
    setTimeout(() => {
      showModal.value = false
      validationMessage.value = ''
    }, 1000)
    return
  }

  // Validate length if expected length is provided
  if (props.expectedLength && trimmedInput.length !== props.expectedLength) {
    validationMessage.value = `Answer must be exactly ${props.expectedLength} characters`
    validationClass.value = 'error'
    return
  }

  // Emit submit event
  if (props.imageId) {
    emit('submit', props.imageId, trimmedInput)
  }

  validationMessage.value = '✓ Solution submitted successfully!'
  validationClass.value = 'success'
  
  setTimeout(() => {
    showModal.value = false
    validationMessage.value = ''
  }, 1000)
}

// Watch for external changes to existingAnswer
watch(() => props.existingAnswer, (newAnswer) => {
  if (showModal.value && newAnswer) {
    solutionInput.value = newAnswer
  }
})
</script>

<style scoped>
.solution-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: var(--color-success);
  color: var(--color-white);
  border: none;
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-pill);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow-success);
  transition: var(--transition-all);
  z-index: 1001;
}

.solution-btn:hover {
  background: var(--color-success-dark);
  box-shadow: var(--shadow-success-hover);
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-gray-lightest);
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-dark);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-gray-light);
  transition: var(--transition-base);
}

.modal-close:hover {
  color: var(--color-dark);
}

.modal-content {
  padding: 20px;
}

.expected-length {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  font-weight: var(--font-weight-medium);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.solution-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-gray-lightest);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  box-sizing: border-box;
  transition: var(--transition-base);
  text-transform: uppercase;
}

.solution-input:focus {
  outline: none;
  border-color: var(--color-success);
}

.clear-btn {
  position: absolute;
  right: var(--spacing-sm);
  background: var(--color-bg-lighter);
  border: none;
  border-radius: var(--radius-pill);
  padding: 6px var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-gray);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
}

.clear-btn:hover {
  background: var(--color-gray-lightest);
  color: var(--color-dark);
  box-shadow: var(--shadow-base);
  transform: translateY(-1px);
}

.validation-message {
  margin-top: var(--spacing-md);
  padding: 10px;
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.validation-message.success {
  background: var(--color-success-bg);
  color: var(--color-success-darker);
}

.validation-message.error {
  background: var(--color-danger-light-bg);
  color: var(--color-danger-darker);
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid var(--color-gray-lightest);
  justify-content: flex-end;
}

.btn {
  padding: var(--spacing-md) var(--spacing-2xl);
  border: none;
  border-radius: var(--radius-pill);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-base);
}

.btn:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.btn-cancel {
  background: var(--color-bg-lighter);
  color: var(--color-dark);
  box-shadow: var(--shadow-sm);
}

.btn-cancel:hover {
  background: var(--color-gray-lightest);
}

.btn-submit {
  background: var(--color-success);
  color: var(--color-white);
  box-shadow: var(--shadow-success);
}

.btn-submit:hover {
  background: var(--color-success-dark);
  box-shadow: var(--shadow-success-hover);
}
</style>
