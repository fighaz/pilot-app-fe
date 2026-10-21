<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import type { PilotProfile } from '~/types/api'

const props = defineProps<{
  profile: PilotProfile
}>()

const hoursLabel = computed(() =>
  props.profile ? props.profile.totalFlightHours.toLocaleString('en-US') : '',
)
</script>

<template>
  <header class="home-header">
    <div class="brand-row">
      <img src="/susi-air-logo.png" alt="Susi Air" class="logo" />
      <img v-if="profile.avatarUrl" :src="profile.avatarUrl" :alt="profile.name" class="avatar" />
    </div>
    <p class="greeting">Welcome back,</p>
    <h1 class="pilot-name">{{ profile.name }}</h1>
    <div class="hours-pill">
      <Clock :size="16" />
      <span class="num">{{ hoursLabel }}</span>
      <span class="hours-caption">total flight hours</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.home-header {
  margin-bottom: 20px;
}

.brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.logo {
  height: 28px;
  width: auto;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(14, 33, 56, 0.18);
}

.greeting {
  font-size: 14px;
  color: #6b7280;
}

.pilot-name {
  font-size: 24px;
  font-weight: 800;
  color: #0e2138;
  line-height: 1.2;
}

.hours-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 6px 14px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(14, 33, 56, 0.06), 0 4px 14px rgba(14, 33, 56, 0.06);
  color: #0e2138;

  .num {
    font-size: 15px;
  }

  svg {
    color: #22c5e8;
  }
}

.hours-caption {
  font-size: 12px;
  color: #6b7280;
}
</style>
