import { defineStore } from 'pinia'
import { ref } from 'vue'
import { encrypt, decrypt } from '@/utils/encryption'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // Initialize token from localStorage if exists
  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    try {
      token.value = decrypt(storedToken)
      isAuthenticated.value = true
    } catch (error) {
      console.error('Failed to decrypt token:', error)
      localStorage.removeItem('token')
    }
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    isAuthenticated.value = true
    const encryptedToken = encrypt(newToken)
    localStorage.setItem('token', encryptedToken)
  }

  const clearToken = () => {
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    token,
    isAuthenticated,
    setToken,
    clearToken,
  }
}) 