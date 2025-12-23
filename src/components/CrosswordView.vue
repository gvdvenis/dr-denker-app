<template>
  <div class="crossword-overlay" @click.self="$emit('close')">
    <div class="crossword-container">
      <div class="crossword-header">
        <h2>Crossword Overview</h2>
        <button class="close-btn" @click="$emit('close')" aria-label="Close crossword view">
          ✕
        </button>
      </div>
      
      <div class="crossword-content">
        <div class="crossword-grid" :style="{ '--max-boxes': maxTotalBoxes }">
          <div
            v-for="puzzleNum in 40"
            :key="puzzleNum"
            class="crossword-row"
          >
            <div class="puzzle-number">{{ puzzleNum }}</div>
            <div class="answer-boxes">
              <!-- Leading empty boxes to align solution index at the same column -->
              <div
                v-for="offset in getLeadingOffset(puzzleNum)"
                :key="`offset-${offset}`"
                class="empty-box"
              />
              <!-- All answer boxes -->
              <div
                v-for="index in getAnswerLength(puzzleNum)"
                :key="index"
                class="answer-box"
                :class="{
                  'solution-index': (index - 1) === getSolutionIndex(puzzleNum),
                  'filled': getAnswerChar(puzzleNum, index - 1)
                }"
              >
                {{ getAnswerChar(puzzleNum, index - 1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="crossword-footer">
        <div class="progress-info">
          {{ solvedCount }}/40 puzzles solved
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PuzzleAnswer, UserSolution } from '../types'

interface Props {
  puzzleData: PuzzleAnswer[]
  solutions: Map<number, UserSolution>
}

interface Emits {
  close: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

const maxSolutionIndex = computed(() => {
  return Math.max(...props.puzzleData.map(p => p.solutionIndex))
})

const getAnswerLength = (puzzleNum: number): number => {
  const puzzle = props.puzzleData[puzzleNum - 1]
  return puzzle?.answerLength || 0
}

const getSolutionIndex = (puzzleNum: number): number => {
  const puzzle = props.puzzleData[puzzleNum - 1]
  return puzzle?.solutionIndex ?? -1
}

const getLeadingOffset = (puzzleNum: number): number => {
  // Calculate how many empty boxes we need before the answer
  // to align the solution index box at the maxSolutionIndex column
  const currentSolutionIndex = getSolutionIndex(puzzleNum)
  return maxSolutionIndex.value - currentSolutionIndex
}

const getAnswerChar = (puzzleNum: number, charIndex: number): string => {
  const solution = props.solutions.get(puzzleNum)
  if (solution && solution.answer[charIndex]) {
    return solution.answer[charIndex].toUpperCase()
  }
  return ''
}

const solvedCount = computed(() => {
  return props.solutions.size
})

const maxTotalBoxes = computed(() => {
  // Calculate the maximum total boxes (leading offset + answer length) needed for any row
  return Math.max(...props.puzzleData.map((p, idx) => {
    const leadingOffset = maxSolutionIndex.value - p.solutionIndex
    return leadingOffset + p.answerLength
  }))
})
</script>

<style scoped>
.crossword-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.crossword-container {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 1200px;
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.crossword-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid var(--color-gray-lightest);
  background: var(--color-bg-light);
}

.crossword-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-dark);
}

.close-btn {
  background: var(--color-danger);
  color: var(--color-white);
  border: none;
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-pill);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow-danger);
  transition: var(--transition-all);
  z-index: 1001;
}

.close-btn:hover {
  background: var(--color-danger-dark);
  box-shadow: var(--shadow-danger-hover);
  transform: translateY(-2px);
}

.crossword-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.crossword-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: fit-content;
}

.crossword-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.puzzle-number {
  width: 40px;
  text-align: right;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.answer-boxes {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: nowrap;
}

.empty-box {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.answer-box {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-gray-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
  background: var(--color-white);
  flex-shrink: 0;
}

.answer-box.filled {
  background: var(--color-bg-lighter);
  color: var(--color-dark);
}

.answer-box.solution-index {
  border-color: var(--color-success);
  background: var(--color-success-light-bg);
}

.answer-box.solution-index.filled {
  background: var(--color-success-lighter);
  color: var(--color-success-darkest);
  border-color: var(--color-success-darker);
}

.crossword-footer {
  padding: var(--spacing-lg) 20px;
  border-top: 2px solid var(--color-gray-lightest);
  background: var(--color-bg-light);
}

.progress-info {
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .crossword-overlay {
    padding: 0;
  }
  
  .crossword-container {
    border-radius: 0;
    max-height: 100dvh;
    height: 100dvh;
  }
  
  .crossword-header {
    padding: 12px;
  }
  
  .crossword-header h2 {
    font-size: 18px;
  }
  
  .close-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .crossword-content {
    padding: 8px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .crossword-grid {
    gap: 3px;
    --puzzle-num-width: 22px;
    --row-gap: 3px;
    --box-gap: 2px;
    --padding: 16px;
  }
  
  .crossword-row {
    gap: var(--row-gap);
  }
  
  .puzzle-number {
    width: var(--puzzle-num-width);
    font-size: 11px;
  }
  
  .answer-boxes {
    gap: var(--box-gap);
  }
  
  .answer-box,
  .empty-box {
    --box-size: calc((100vw - var(--puzzle-num-width) - var(--row-gap) - var(--padding) - (var(--max-boxes) - 1) * var(--box-gap)) / var(--max-boxes));
    width: clamp(14px, var(--box-size), 28px);
    height: clamp(14px, var(--box-size), 28px);
    font-size: clamp(9px, calc(var(--box-size) * 0.55), 13px);
    border-width: 1px;
  }
  
  .crossword-footer {
    padding: 10px;
  }
  
  .progress-info {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .crossword-content {
    padding: 6px;
  }
  
  .crossword-grid {
    gap: 2px;
    --puzzle-num-width: 18px;
    --row-gap: 2px;
    --box-gap: 1px;
    --padding: 12px;
  }
  
  .puzzle-number {
    font-size: 10px;
  }
  
  .answer-box,
  .empty-box {
    width: clamp(12px, var(--box-size), 24px);
    height: clamp(12px, var(--box-size), 24px);
    font-size: clamp(8px, calc(var(--box-size) * 0.55), 11px);
  }
}
</style>
