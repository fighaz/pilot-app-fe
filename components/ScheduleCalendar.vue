<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { ScheduleEntry } from '~/types/api'

const props = defineProps<{
  year: number
  month: number
  entriesByDate: Map<string, ScheduleEntry>
  today: string
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [date: string]
}>()

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarCell {
  key: string
  day: number | null
  date: string | null
  entry: ScheduleEntry | null
  isToday: boolean
}

const cells = computed<CalendarCell[]>(() => {
  const totalDays = daysInMonth(props.year, props.month)
  const leadingBlanks = firstWeekdayOfMonth(props.year, props.month)

  const result: CalendarCell[] = []

  for (let i = 0; i < leadingBlanks; i += 1) {
    result.push({ key: `blank-${i}`, day: null, date: null, entry: null, isToday: false })
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = isoFromParts(props.year, props.month, day)
    const entry = props.entriesByDate.get(date) ?? null
    result.push({
      key: date,
      day,
      date,
      entry,
      isToday: date === props.today,
    })
  }

  return result
})

function remaining(entry: ScheduleEntry): number {
  return Math.max(0, entry.count_schedules - entry.count_logbooks)
}

function cellStyle(entry: ScheduleEntry | null): Record<string, string> {
  if (!entry) return {}
  return { backgroundColor: entry.base_color }
}
</script>

<template>
  <div class="calendar" :class="{ loading }">
    <div class="weekday-row">
      <span v-for="label in WEEKDAY_LABELS" :key="label" class="weekday">{{ label }}</span>
    </div>
    <div class="grid">
      <div v-for="cell in cells" :key="cell.key" class="cell-wrap">
        <button
          v-if="cell.day"
          type="button"
          class="cell"
          :class="{ 'has-duty': !!cell.entry, today: cell.isToday }"
          :style="cellStyle(cell.entry)"
          :aria-label="`Open schedule for ${cell.date}`"
          @click="cell.date && emit('select', cell.date)"
        >
          <span class="day">{{ cell.day }}</span>
          <span v-if="cell.entry" class="base">{{ cell.entry.base_name }}</span>
          <span class="status-icon">
            <Check v-if="cell.entry && cell.entry.count_logbooks === cell.entry.count_schedules" :size="13" :stroke-width="3" />
            <template v-else-if="cell.entry && remaining(cell.entry) > 0">{{ remaining(cell.entry) }}</template>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar {
  &.loading {
    opacity: 0.55;
    pointer-events: none;
  }
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
}

.weekday {
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.cell-wrap {
  aspect-ratio: 1;
}

.cell {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  border: 1px solid #eef0f3;
  border-radius: 10px;
  background: #fff;
  color: #0e2138;
  padding: 0;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.94);
  }

  &.has-duty {
    border: none;
    color: #fff;

    .base {
      color: rgba(255, 255, 255, 0.9);
      font-size: 9px;
      font-weight: 600;
      line-height: 1;
    }
  }

  &.today {
    box-shadow: 0 0 0 2px #e63757;
  }
}

.day {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.1;
}

.base {
  display: none;

  .has-duty & {
    display: block;
  }
}

.status-icon {
  position: absolute;
  top: 3px;
  right: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;

  svg {
    width: 10px;
    height: 10px;
  }
}
</style>
