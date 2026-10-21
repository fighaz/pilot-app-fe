import { defineStore } from 'pinia'
import type { LoginResponse } from '~/types/api'

const TOKEN_COOKIE = 'pilot_token'
const TOKEN_MAX_AGE = 60 * 60 * 12 // mirrors backend JWT_EXPIRES_IN (12h)

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>(TOKEN_COOKIE, {
    maxAge: TOKEN_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  })

  const token = computed(() => tokenCookie.value ?? null)
  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(username: string, password: string): Promise<void> {
    const config = useRuntimeConfig()
    const response = await $fetch<LoginResponse>('/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: { username, password },
    })
    tokenCookie.value = response.accessToken
  }

  function clearSession(): void {
    tokenCookie.value = null
  }

  async function logout(): Promise<void> {
    clearSession()
    await navigateTo('/login', { replace: true })
  }

  return { token, isLoggedIn, login, logout, clearSession }
})
