import { useAuthStore } from '@/stores/auth'

const BASE_URL = 'https://absensi.dmpt.my.id/api'

export const http = {
  async get(endpoint: string) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    })
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(endpoint: string) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    })
    return response.json()
  },
} 