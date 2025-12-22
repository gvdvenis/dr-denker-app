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
        <div class="crossword-grid">
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
</script>

<style scoped>
.crossword-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.crossword-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
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
  border-bottom: 2px solid #e0e0e0;
  background: #f5f5f5;
}

.crossword-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.close-btn {
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

.crossword-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.crossword-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.crossword-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.puzzle-number {
  width: 40px;
  text-align: right;
  font-weight: bold;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

.answer-boxes {
  display: flex;
  gap: 4px;
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
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  background: white;
  flex-shrink: 0;
}

.answer-box.filled {
  background: #f0f0f0;
  color: #333;
}

.answer-box.solution-index {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.answer-box.solution-index.filled {
  background: #a5d6a7;
  color: #1b5e20;
  border-color: #2e7d32;
}

.crossword-footer {
  padding: 16px 20px;
  border-top: 2px solid #e0e0e0;
  background: #f5f5f5;
}

.progress-info {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .crossword-overlay {
    padding: 0;
  }
  
  .crossword-container {
    border-radius: 0;
    max-height: 100vh;
    height: 100vh;
  }
  
  .crossword-content {
    padding: 12px;
    overflow-x: auto;
  }
  
  .crossword-grid {
    min-width: 600px;
  }
  
  .puzzle-number {
    width: 30px;
    font-size: 12px;
  }
  
  .answer-box,
  .empty-offset {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style>
