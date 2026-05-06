import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserSettings } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const settings = ref<UserSettings>({
    units: 'kg',
    reminderEnabled: true,
    reminderTime: '20:00',
    theme: 'light',
  })
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const displayUnits = computed(() => settings.value.units)

  function setUser(u: User) {
    user.value = u
  }

  function setTokens(accessToken: string, refresh: string) {
    token.value = accessToken
    refreshToken.value = refresh
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refresh)
  }

  function updateSettings(newSettings: Partial<UserSettings>) {
    settings.value = { ...settings.value, ...newSettings }
  }

  function logout() {
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return {
    user,
    settings,
    token,
    isLoggedIn,
    displayUnits,
    setUser,
    setTokens,
    updateSettings,
    logout,
  }
})
