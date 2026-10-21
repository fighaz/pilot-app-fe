<script setup lang="ts">
import { CalendarDays, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-vue-next'

const scheduleStore = useScheduleStore()

onMounted(() => {
  scheduleStore.fetchMonth()
})

function goTo(date: string): void {
  navigateTo(`/schedule/${date}`)
}
</script>

<template>
  <div>
    <div class="schedule-head">
      <h1 class="page-title">
        <CalendarDays :size="20" />
        Schedule
      </h1>
      <div v-if="scheduleStore.loading" class="loading-badge">
        <LoaderCircle :size="14" class="spin" />
      </div>
    </div>

    <div class="card calendar-card">
      <div class="month-nav">
        <button
          type="button"
          class="btn-ghost-icon"
          aria-label="Previous month"
          :disabled="scheduleStore.loading"
          @click="scheduleStore.previousMonth()"
        >
          <ChevronLeft :size="20" />
        </button>
        <p class="month-title">{{ formatMonthYear(scheduleStore.year, scheduleStore.month) }}</p>
        <button
          type="button"
          class="btn-ghost-icon"
          aria-label="Next month"
          :disabled="scheduleStore.loading"
          @click="scheduleStore.nextMonth()"
        >
          <ChevronRight :size="20" />
        </button>
      </div>

      <ScheduleCalendar
        :year="scheduleStore.year"
        :month="scheduleStore.month"
        :entries-by-date="scheduleStore.entriesByDate"
        :today="scheduleStore.today"
        :loading="scheduleStore.loading"
        @select="goTo"
      />

      <p v-if="scheduleStore.error" class="alert-error month-error" role="alert">
        {{ scheduleStore.error }}
      </p>
    </div>

    <section class="section">
      <h2 class="section-title">Legend</h2>
      <div class="card">
        <CalendarLegend v-if="scheduleStore.legend.length" :legend="scheduleStore.legend" />
        <div v-else class="skeleton" style="height: 60px" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.schedule-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
  color: #0e2138;

  svg {
    color: #e63757;
  }
}

.loading-badge {
  color: #22c5e8;
  display: inline-flex;
}

.calendar-card {
  margin-bottom: 24px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.month-title {
  font-size: 16px;
  font-weight: 800;
  color: #0e2138;
}

.month-error {
  margin-top: 12px;
}

.section {
  margin-bottom: 12px;
}
</style>
