import type { FetchError } from 'ofetch'

/**
 * Pre-configured API client for the NestJS backend.
 * - Base URL comes from runtime config (NUXT_PUBLIC_API_BASE).
 * - Attaches the Bearer token from the auth store.
 * - A 401 from any endpoint clears the session and redirects to /login.
 */
export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (auth.token) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        auth.clearSession()
        await navigateTo('/login', { replace: true })
      }
    },
  })
}

/** Extract a human readable message from a backend error payload. */
export function extractErrorMessage(error: unknown, fallback: string): string {
  const fetchError = error as FetchError<{ message?: string | string[] }>
  const message = fetchError?.data?.message
  if (typeof message === 'string' && message.length > 0) return message
  if (Array.isArray(message) && message.length > 0) return message.join(', ')
  return fallback
}
