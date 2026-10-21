import { defineStore } from 'pinia'
import type { DocumentsResponse } from '~/types/api'

export const useDocumentsStore = defineStore('documents', () => {
  const api = useApi()

  const data = ref<DocumentsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDocuments(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      data.value = await api<DocumentsResponse>('/documents')
    } catch (err) {
      error.value = extractErrorMessage(err, 'Failed to load documents.')
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchDocuments }
})
