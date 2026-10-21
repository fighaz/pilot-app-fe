<script setup lang="ts">
import { BookOpen, CalendarDays, Ellipsis, House } from 'lucide-vue-next'

const route = useRoute()

const items = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Logbook', to: '/logbook', icon: BookOpen },
  { label: 'More', to: '/more', icon: Ellipsis },
]

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <nav class="bottom-nav">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: isActive(item.to) }"
    >
      <component :is="item.icon" :size="22" :stroke-width="2" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  justify-content: space-around;
  max-width: 480px;
  margin: 0 auto;
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #e5e7eb;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  padding: 6px 0;
  border-radius: 12px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 600;
  transition: color 0.15s ease;

  &.active {
    color: #0e2138;

    svg {
      color: #e63757;
    }
  }
}
</style>
