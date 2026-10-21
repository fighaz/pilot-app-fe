<script setup lang="ts">
import { ArrowLeft, CalendarDays } from 'lucide-vue-next'

const route = useRoute()
const date = computed(() => String(route.params.date ?? ''))
</script>

<template>
  <div>
    <div class="detail-head">
      <button type="button" class="btn-ghost-icon" aria-label="Back to schedule" @click="navigateTo('/schedule')">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="page-title">
        <CalendarDays :size="18" />
        {{ date ? formatDisplayDate(date) : 'Schedule Detail' }}
      </h1>
    </div>

    <div class="card placeholder-card">
      <CalendarDays :size="40" :stroke-width="1.5" />
      <p class="placeholder-title">Detail page coming soon</p>
      <p class="placeholder-sub">Duty details for this date will be available in a future release.</p>
      <NuxtLink to="/schedule" class="back-link">Back to Schedule</NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-head {
  display: flex;
  align-items: center;
  gap: 12px;
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

.placeholder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;

  svg {
    color: #c7cdd6;
  }
}

.placeholder-title {
  margin-top: 14px;
  font-size: 17px;
  font-weight: 800;
  color: #0e2138;
}

.placeholder-sub {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

.back-link {
  margin-top: 20px;
  padding: 10px 24px;
  border-radius: 999px;
  background: #0e2138;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}
</style>
