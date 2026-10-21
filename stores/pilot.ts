import { defineStore } from 'pinia'
import type { PilotProfile } from '~/types/api'

export const usePilotStore = defineStore('pilot', () => {
  const api = useApi()

  const profile = ref<PilotProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProfile(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      profile.value = await api<PilotProfile>('/pilot/me')
    } catch (err) {
      error.value = extractErrorMessage(err, 'Failed to load pilot profile.')
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, error, fetchProfile }
})
