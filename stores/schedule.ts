import { defineStore } from 'pinia'
import type { ScheduleEntry, SchedulesResponse } from '~/types/api'

export const useScheduleStore = defineStore('schedule', () => {
  const api = useApi()
  const config = useRuntimeConfig()

  // Initial month is derived from the configured TODAY (never the system clock).
  const today = config.public.today as string
  const [initialYear, initialMonth] = today.split('-').map(Number)

  const year = ref(initialYear)
  const month = ref(initialMonth)
  const entries = ref<ScheduleEntry[]>([])
  const legend = ref<SchedulesResponse['legend']>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const entriesByDate = computed(() => {
    const map = new Map<string, ScheduleEntry>()
    for (const entry of entries.value) map.set(entry.duty_date, entry)
    return map
  })

  async function fetchMonth(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await api<SchedulesResponse>('/schedules', {
        query: { year: year.value, month: month.value },
      })
      // Guard against out-of-order responses when clicking quickly.
      if (response.year === year.value && response.month === month.value) {
        entries.value = response.entries
        legend.value = response.legend
      }
    } catch (err) {
      error.value = extractErrorMessage(err, 'Failed to load schedule.')
    } finally {
      loading.value = false
    }
  }

  async function previousMonth(): Promise<void> {
    if (month.value === 1) {
      month.value = 12
      year.value -= 1
    } else {
      month.value -= 1
    }
    await fetchMonth()
  }

  async function nextMonth(): Promise<void> {
    if (month.value === 12) {
      month.value = 1
      year.value += 1
    } else {
      month.value += 1
    }
    await fetchMonth()
  }

  return {
    today,
    year,
    month,
    entries,
    entriesByDate,
    legend,
    loading,
    error,
    fetchMonth,
    previousMonth,
    nextMonth,
  }
})
