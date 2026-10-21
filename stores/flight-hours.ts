import { defineStore } from 'pinia'
import type { FlightHoursResponse, SummaryRange, SummaryResponse } from '~/types/api'

export const useFlightHoursStore = defineStore('flightHours', () => {
  const api = useApi()

  const range = ref<SummaryRange>('1w')
  const summary = ref<SummaryResponse | null>(null)
  const summaryLoading = ref(false)
  const summaryError = ref<string | null>(null)

  const recent = ref<FlightHoursResponse | null>(null)
  const recentLoading = ref(false)

  async function fetchSummary(nextRange?: SummaryRange): Promise<void> {
    if (nextRange) range.value = nextRange
    summaryLoading.value = true
    summaryError.value = null
    try {
      summary.value = await api<SummaryResponse>('/flight-hours/summary', {
        query: { range: range.value },
      })
    } catch (err) {
      summaryError.value = extractErrorMessage(err, 'Failed to load flight hours summary.')
    } finally {
      summaryLoading.value = false
    }
  }

  async function setRange(nextRange: SummaryRange): Promise<void> {
    if (nextRange === range.value && summary.value) return
    await fetchSummary(nextRange)
  }

  /** Daily hours for the Logbook preview (last 14 days ending at TODAY). */
  async function fetchRecentDays(today: string, days = 14): Promise<void> {
    recentLoading.value = true
    try {
      recent.value = await api<FlightHoursResponse>('/flight-hours', {
        query: { from: addDays(today, -(days - 1)), to: today },
      })
    } finally {
      recentLoading.value = false
    }
  }

  return {
    range,
    summary,
    summaryLoading,
    summaryError,
    recent,
    recentLoading,
    fetchSummary,
    setRange,
    fetchRecentDays,
  }
})
