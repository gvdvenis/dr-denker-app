import { ref, watch, type Ref } from 'vue'
import type { UserSolution } from '../types'

const STORAGE_KEY = 'dr-denker-solutions'

const solutions: Ref<Map<number, UserSolution>> = ref(new Map())

export function useLocalStorage() {
  // Load solutions from localStorage on initialization
  const loadSolutions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: UserSolution[] = JSON.parse(stored)
        solutions.value = new Map(data.map(s => [s.imageId, s]))
      }
    } catch (error) {
      console.error('Error loading solutions from localStorage:', error)
    }
  }

  // Save a single solution
  const saveSolution = (imageId: number, answer: string) => {
    // If answer is empty, delete the solution
    if (!answer.trim()) {
      solutions.value.delete(imageId)
      persistToStorage()
      return
    }
    
    const solution: UserSolution = {
      imageId,
      answer: answer.toUpperCase(),
      timestamp: Date.now()
    }
    solutions.value.set(imageId, solution)
    persistToStorage()
  }

  // Get solution for specific image
  const getSolution = (imageId: number): UserSolution | undefined => {
    return solutions.value.get(imageId)
  }

  // Get all solutions as array
  const getAllSolutions = (): UserSolution[] => {
    return Array.from(solutions.value.values())
  }

  // Clear all solutions
  const clearAll = () => {
    solutions.value.clear()
    localStorage.removeItem(STORAGE_KEY)
  }

  // Persist current solutions to localStorage
  const persistToStorage = () => {
    try {
      const data = Array.from(solutions.value.values())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving solutions to localStorage:', error)
    }
  }

  // Watch for changes and auto-persist
  watch(
    solutions,
    () => {
      persistToStorage()
    },
    { deep: true }
  )

  return {
    solutions,
    loadSolutions,
    saveSolution,
    getSolution,
    getAllSolutions,
    clearAll
  }
}
