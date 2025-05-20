import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const BASE_URL = 'https://absen-cikurai.test/api'

const handleUnauthorized = () => {
  const authStore = useAuthStore()
  
  // Clear token
  authStore.clearToken()
  
  // Show toast notification
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: 'Session expired. Please login again.',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  })
  
  // Redirect to login using window.location
  window.location.href = '/login'
}

const getHeaders = (authStore: ReturnType<typeof useAuthStore>) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }
  
  return headers
}

export const http = {
  async get(endpoint: string) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(authStore),
    })
    
    if (response.status === 401) {
      handleUnauthorized()
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(authStore),
      body: JSON.stringify(data),
    })
    
    if (response.status === 401) {
      handleUnauthorized()
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(authStore),
      body: JSON.stringify(data),
    })
    
    if (response.status === 401) {
      handleUnauthorized()
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  async delete(endpoint: string) {
    const authStore = useAuthStore()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(authStore),
    })
    
    if (response.status === 401) {
      handleUnauthorized()
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
} 