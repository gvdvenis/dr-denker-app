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
          <input
            v-model="solutionInput"
            type="text"
            :placeholder="`Enter your solution (${expectedLength || '?'} characters)...`"
            class="solution-input"
            @keyup.enter="submitSolution"
            :maxlength="expectedLength || undefined"
          />

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
import { ref, watch } from 'vue'

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

const openModal = () => {
  // Pre-fill with existing answer if available
  solutionInput.value = props.existingAnswer || ''
  validationMessage.value = ''
  showModal.value = true
}

const submitSolution = () => {
  const trimmedInput = solutionInput.value.trim()
  
  if (!trimmedInput) {
    validationMessage.value = 'Please enter a solution'
    validationClass.value = 'error'
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
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
  z-index: 1001;
}

.solution-btn:hover {
  background: #45a049;
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.6);
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
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
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-content {
  padding: 20px;
}

.expected-length {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.solution-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  text-transform: uppercase;
}

.solution-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.validation-message {
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

.validation-message.success {
  background: #c8e6c9;
  color: #2e7d32;
}

.validation-message.error {
  background: #ffcdd2;
  color: #c62828;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #4CAF50;
  color: white;
}

.btn-submit:hover {
  background: #45a049;
}
</style>
