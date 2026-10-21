<script setup lang="ts">
import type { LimitCardData } from '~/types/api'

const props = defineProps<{
  card: LimitCardData
}>()

const WINDOW_LABELS: Record<LimitCardData['key'], string> = {
  daily: 'Today only',
  weekly: 'Rolling 7 days',
  monthly: 'Rolling 30 days',
  annual: 'Rolling 365 days',
}

const ratio = computed(() => {
  if (props.card.limit <= 0) return 0
  return props.card.current / props.card.limit
})

const percent = computed(() => Math.min(100, Math.round(ratio.value * 100)))

const state = computed<'safe' | 'soon' | 'over'>(() => {
  if (ratio.value >= 1) return 'over'
  if (ratio.value >= 0.8) return 'soon'
  return 'safe'
})

const remaining = computed(() => {
  const left = props.card.limit - props.card.current
  if (left <= 0) return 'Limit reached'
  return `${left.toFixed(1)} h left`
})
</script>

<template>
  <div class="limit-card card">
    <div class="card-head">
      <span class="card-title">{{ card.label }}</span>
      <span class="card-state" :class="`state-${state}`">
        {{ state === 'over' ? 'Over limit' : state === 'soon' ? 'Near limit' : 'Safe' }}
      </span>
    </div>
    <p class="card-hours">
      <span class="num current">{{ card.current.toFixed(1) }}</span>
      <span class="limit">/ {{ card.limit }} h</span>
    </p>
    <div class="progress" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill" :class="`fill-${state}`" :style="{ width: `${percent}%` }" />
    </div>
    <p class="card-meta">
      <span class="window">{{ WINDOW_LABELS[card.key] }}</span>
      <span class="remaining">{{ remaining }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.limit-card {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.card-title {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
}

.card-state {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;

  &.state-safe {
    background: rgba(31, 191, 143, 0.14);
    color: #0d9668;
  }

  &.state-soon {
    background: rgba(245, 158, 11, 0.16);
    color: #b45309;
  }

  &.state-over {
    background: rgba(230, 55, 87, 0.12);
    color: #e63757;
  }
}

.card-hours {
  display: flex;
  align-items: baseline;
  gap: 5px;

  .current {
    font-size: 22px;
    color: #0e2138;
  }

  .limit {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
  }
}

.progress {
  height: 6px;
  border-radius: 999px;
  background: #eef0f3;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;

  &.fill-safe {
    background: #1fbf8f;
  }

  &.fill-soon {
    background: #f59e0b;
  }

  &.fill-over {
    background: #e63757;
  }
}

.card-meta {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-size: 11px;
  color: #6b7280;

  .remaining {
    font-weight: 700;
  }
}
</style>
