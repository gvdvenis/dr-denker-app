import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const SESSION_KEY = 'dr-denker-session-token'

export function useAuth() {
  const token = ref<string | null>(null)
  const user = ref<{ id: string; email: string } | null>(null)
  const isAuthenticated = ref(false)

  async function requestOtp(email: string) {
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!res.ok) throw new Error('Failed to request OTP')
    return true
  }

  async function verifyOtp(email: string, code: string) {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    })
    if (!res.ok) throw new Error('Invalid code')
    const data = await res.json()
    token.value = data.token
    user.value = data.user
    isAuthenticated.value = true
    // TODO: replace with encrypted IndexedDB storage
    sessionStorage.setItem(SESSION_KEY, token.value!)
    return data.user as { id: string; email: string }
  }

  async function bootstrapSession() {
    const t = sessionStorage.getItem(SESSION_KEY)
    if (!t) return false
    token.value = t
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${t}` }
    })
    if (!res.ok) {
      logout()
      return false
    }
    user.value = await res.json()
    isAuthenticated.value = true
    return true
  }

  function logout() {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    sessionStorage.removeItem(SESSION_KEY)
  }

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    API_BASE,
    token,
    user,
    isAuthenticated,
    requestOtp,
    verifyOtp,
    bootstrapSession,
    logout,
    authHeaders
  }
}