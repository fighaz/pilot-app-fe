<script setup lang="ts">
import { BookOpen, Plane } from 'lucide-vue-next'

const config = useRuntimeConfig()
const flightHoursStore = useFlightHoursStore()

const recentDays = computed(() =>
  flightHoursStore.recent ? [...flightHoursStore.recent.days].reverse() : [],
)

onMounted(() => {
  flightHoursStore.fetchRecentDays(config.public.today as string, 14)
})
</script>

<template>
  <div>
    <h1 class="page-title">
      <BookOpen :size="20" />
      Logbook
    </h1>

    <div class="card">
      <div class="list-head">
        <p class="list-title">Last 14 days</p>
        <p v-if="flightHoursStore.recent" class="list-total num">
          Total {{ flightHoursStore.recent.totalHours.toFixed(1) }} h
        </p>
      </div>

      <div v-if="flightHoursStore.recentLoading" class="rows">
        <div v-for="i in 8" :key="i" class="skeleton row-skeleton" />
      </div>

      <ul v-else-if="recentDays.length" class="rows">
        <li v-for="day in recentDays" :key="day.date" class="row" :class="{ flown: day.hours > 0 }">
          <Plane :size="16" />
          <span class="row-date">{{ formatDisplayDate(day.date) }}</span>
          <span class="row-hours num">{{ day.hours.toFixed(1) }} h</span>
        </li>
      </ul>

      <div v-else class="empty-state">
        <BookOpen :size="32" :stroke-width="1.5" />
        <p>No flight hours recorded yet.</p>
      </div>
    </div>

    <p class="footnote">Full logbook with flight details is coming soon.</p>
  </div>
</template>

<style scoped lang="scss">
.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
  color: #0e2138;
  margin-bottom: 16px;

  svg {
    color: #e63757;
  }
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.list-title {
  font-size: 14px;
  font-weight: 700;
  color: #0e2138;
}

.list-total {
  font-size: 13px;
  color: #22c5e8;
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #f0f1f4;
  color: #9ca3af;

  &:last-child {
    border-bottom: none;
  }

  &.flown {
    color: #0e2138;

    svg {
      color: #22c5e8;
    }
  }

  svg {
    flex-shrink: 0;
  }
}

.row-date {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
}

.row-hours {
  font-size: 13px;
}

.row-skeleton {
  height: 42px;
  margin: 5px 0;
}

.footnote {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 14px;
}
</style>
