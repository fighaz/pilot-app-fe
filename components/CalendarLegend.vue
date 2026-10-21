<script setup lang="ts">
defineProps<{
  legend: Array<{ code: string; label: string; color: string }>
}>()
</script>

<template>
  <div class="calendar-legend">
    <div v-for="item in legend" :key="item.code" class="legend-item">
      <span class="swatch" :style="{ backgroundColor: item.color }" />
      <span class="code">{{ item.code }}</span>
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.swatch {
  width: 11px;
  height: 11px;
  border-radius: 4px;
  flex-shrink: 0;
}

.code {
  font-weight: 700;
  color: #0e2138;
}
</style>
