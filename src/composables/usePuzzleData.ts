import { ref, type Ref } from 'vue'
import type { PuzzleAnswer } from '../types'

const puzzleData: Ref<PuzzleAnswer[]> = ref([])
const isLoading = ref(true)
const error = ref<string | null>(null)

export function usePuzzleData() {
  const loadPuzzleData = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await fetch('/dr-denker-app/answers.json')
      if (!response.ok) {
        throw new Error(`Failed to load puzzle data: ${response.statusText}`)
      }
      const data = await response.json()
      puzzleData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load puzzle data'
      console.error('Error loading puzzle data:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getPuzzleAnswer = (imageId: number): PuzzleAnswer | undefined => {
    return puzzleData.value[imageId - 1]
  }

  return {
    puzzleData,
    isLoading,
    error,
    loadPuzzleData,
    getPuzzleAnswer
  }
}
