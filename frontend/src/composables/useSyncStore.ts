import { ref, watchEffect } from 'vue'
import { useAuth } from './useAuth'
import { useLocalStorage } from './useLocalStorage'
import type { UserSolution } from '../types'

type Mutation = { imageId: number; answer: string; timestamp: number }

const QUEUE_KEY = 'dr-denker-sync-queue'

export function useSyncStore() {
  const { API_BASE, isAuthenticated, authHeaders } = useAuth()
  const { solutions, saveSolution, loadSolutions } = useLocalStorage()
  const queue = ref<Mutation[]>(JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'))
  const likelihoods = ref<Map<number, { likelihood: number; uncertainty: number }>>(new Map())

  function persistQueue() {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.value))
  }

  async function syncFromServer() {
    if (!isAuthenticated.value) return
    const res = await fetch(`${API_BASE}/answers`, { headers: { ...authHeaders() } })
    if (!res.ok) return
    const remote: UserSolution[] = await res.json()
    for (const r of remote) {
      const local = solutions.value.get(r.imageId)
      if (!local || r.timestamp >= local.timestamp) {
        saveSolution(r.imageId, r.answer)
      }
    }
  }

  async function flushQueue() {
    if (!isAuthenticated.value || queue.value.length === 0) return
    const pending = [...queue.value]
    for (const m of pending) {
      const res = await fetch(`${API_BASE}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ imageId: m.imageId, answer: m.answer, timestamp: m.timestamp })
      })
      if (res.ok) {
        // remove from queue
        queue.value = queue.value.filter(q => !(q.imageId === m.imageId && q.timestamp === m.timestamp))
        persistQueue()
      } else {
        // stop on first failure to avoid hammering
        break
      }
    }
  }

  async function save(imageId: number, answer: string) {
    const ts = Date.now()
    // local-first
    saveSolution(imageId, answer)
    // enqueue remote mutation
    queue.value.push({ imageId, answer, timestamp: Math.floor(ts / 1000) })
    persistQueue()
    if (navigator.onLine) await flushQueue()
  }

  async function init() {
    loadSolutions()
    await syncFromServer()
    await flushQueue()
    await loadLikelihoods()
  }

  // Background sync when online
  window.addEventListener('online', () => {
    flushQueue()
    syncFromServer()
  })

  // Periodic sync
  setInterval(() => {
    if (navigator.onLine) {
      flushQueue()
      syncFromServer()
      loadLikelihoods()
    }
  }, 15000)

  async function loadLikelihoods() {
    if (!isAuthenticated.value) return
    const res = await fetch(`${API_BASE}/stats/answer-likelihood`, { headers: { ...authHeaders() } })
    if (!res.ok) return
    const list: Array<{ imageId: number; likelihood: number; uncertainty: number }> = await res.json()
    const map = new Map<number, { likelihood: number; uncertainty: number }>()
    for (const item of list) map.set(item.imageId, { likelihood: item.likelihood, uncertainty: item.uncertainty })
    likelihoods.value = map
  }

  return { solutions, save, init, syncFromServer, flushQueue, likelihoods, loadLikelihoods }
}