<script setup lang="ts">
import { CalendarDays, FileText, TrendingUp } from 'lucide-vue-next'
import type { SummaryRange } from '~/types/api'

const pilotStore = usePilotStore()
const flightHoursStore = useFlightHoursStore()
const documentsStore = useDocumentsStore()

const RANGE_OPTIONS: Array<{ value: SummaryRange; label: string }> = [
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
]

onMounted(() => {
  pilotStore.fetchProfile()
  flightHoursStore.fetchSummary()
  documentsStore.fetchDocuments()
})
</script>

<template>
  <div>
    <!-- Header -->
    <template v-if="pilotStore.profile">
      <AppHeader :profile="pilotStore.profile" />
    </template>
    <div v-else class="header-skeleton">
      <div class="skeleton" style="height: 44px; width: 100%" />
      <div class="skeleton" style="height: 24px; width: 55%; margin-top: 12px" />
      <div class="skeleton" style="height: 30px; width: 40%; margin-top: 10px; border-radius: 999px" />
    </div>

    <!-- Hours to Limit -->
    <section class="section">
      <h2 class="section-title"><TrendingUp :size="18" /> Hours to Limit</h2>

      <div v-if="flightHoursStore.summary" class="cards-grid">
        <LimitCard
          v-for="card in flightHoursStore.summary.cards"
          :key="card.key"
          :card="card"
        />
      </div>
      <div v-else-if="flightHoursStore.summaryLoading" class="cards-grid">
        <div v-for="i in 4" :key="i" class="skeleton" style="height: 128px; border-radius: 16px" />
      </div>
      <div v-else-if="flightHoursStore.summaryError" class="card">
        <div class="error-state">
          <span>{{ flightHoursStore.summaryError }}</span>
          <button class="btn-retry" @click="flightHoursStore.fetchSummary()">Retry</button>
        </div>
      </div>

      <div class="card chart-card">
        <div class="chart-head">
          <div>
            <p class="chart-title">Flight Hours Trend</p>
            <p v-if="flightHoursStore.summary" class="chart-sub">
              Rolling {{ flightHoursStore.summary.windowDays }}-day sum · limit
              {{ flightHoursStore.summary.limit }} h
            </p>
          </div>
          <div class="range-toggle" role="tablist" aria-label="Chart range">
            <button
              v-for="option in RANGE_OPTIONS"
              :key="option.value"
              type="button"
              role="tab"
              :aria-selected="flightHoursStore.range === option.value"
              :class="{ active: flightHoursStore.range === option.value }"
              :disabled="flightHoursStore.summaryLoading"
              @click="flightHoursStore.setRange(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <TrendChart
          v-if="flightHoursStore.summary"
          :points="flightHoursStore.summary.points"
          :limit="flightHoursStore.summary.limit"
          :y-max="flightHoursStore.summary.yMax"
          :today="flightHoursStore.summary.today"
        />
        <div v-else class="skeleton" style="height: 240px" />
      </div>
    </section>

    <!-- My Documents -->
    <section class="section">
      <h2 class="section-title"><FileText :size="18" /> My Documents</h2>
      <div class="card">
        <DocumentsList
          v-if="documentsStore.data"
          :documents="documentsStore.data.documents"
        />
        <div v-else-if="documentsStore.loading">
          <div v-for="i in 5" :key="i" class="skeleton doc-skeleton" />
        </div>
        <div v-else-if="documentsStore.error" class="error-state">
          <span>{{ documentsStore.error }}</span>
          <button class="btn-retry" @click="documentsStore.fetchDocuments()">Retry</button>
        </div>
      </div>
    </section>

    <!-- Quick link to schedule -->
    <NuxtLink to="/schedule" class="schedule-cta card">
      <CalendarDays :size="20" />
      <div>
        <p class="cta-title">View Duty Schedule</p>
        <p class="cta-sub">See your roster for this month</p>
      </div>
      <span class="cta-arrow">→</span>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.header-skeleton {
  margin-bottom: 20px;
}

.section {
  margin-bottom: 24px;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.chart-title {
  font-size: 14px;
  font-weight: 700;
  color: #0e2138;
}

.chart-sub {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.range-toggle {
  display: inline-flex;
  background: #f5f6f8;
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
  flex-shrink: 0;

  button {
    border: none;
    background: transparent;
    border-radius: 999px;
    padding: 5px 11px;
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    transition: background-color 0.15s ease, color 0.15s ease;

    &.active {
      background: #0e2138;
      color: #fff;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.doc-skeleton {
  height: 54px;
  margin: 10px 0;
}

.btn-retry {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 700;
  color: #0e2138;

  &:hover {
    background: #f5f6f8;
  }
}

.schedule-cta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;

  svg {
    color: #e63757;
    flex-shrink: 0;
  }
}

.cta-title {
  font-size: 14px;
  font-weight: 700;
  color: #0e2138;
}

.cta-sub {
  font-size: 12px;
  color: #6b7280;
}

.cta-arrow {
  margin-left: auto;
  color: #6b7280;
  font-size: 18px;
}
</style>
