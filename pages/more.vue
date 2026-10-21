<script setup lang="ts">
import { Ellipsis, LogOut } from 'lucide-vue-next'

const auth = useAuthStore()
const pilotStore = usePilotStore()

onMounted(() => {
  if (!pilotStore.profile) pilotStore.fetchProfile()
})
</script>

<template>
  <div>
    <h1 class="page-title">
      <Ellipsis :size="20" />
      More
    </h1>

    <div class="card profile-card">
      <img v-if="pilotStore.profile?.avatarUrl" :src="pilotStore.profile.avatarUrl" alt="" class="avatar" />
      <div v-else class="skeleton avatar" />
      <div>
        <p class="pilot-name">{{ pilotStore.profile?.name ?? '—' }}</p>
        <p v-if="pilotStore.profile" class="pilot-meta num">
          {{ pilotStore.profile.totalFlightHours.toLocaleString('en-US') }} h total
        </p>
        <p v-else class="pilot-meta">Loading profile…</p>
      </div>
    </div>

    <div class="card placeholder-card">
      <p class="placeholder-title">More features coming soon</p>
      <p class="placeholder-sub">Profile settings, notifications, and more will land here.</p>
    </div>

    <button class="btn-primary logout-btn" type="button" @click="auth.logout()">
      <LogOut :size="17" />
      Sign Out
    </button>
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

.profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pilot-name {
  font-size: 16px;
  font-weight: 800;
  color: #0e2138;
}

.pilot-meta {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.placeholder-card {
  text-align: center;
  padding: 32px 20px;
  margin-bottom: 20px;
}

.placeholder-title {
  font-size: 15px;
  font-weight: 800;
  color: #0e2138;
}

.placeholder-sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.logout-btn {
  max-width: 280px;
  margin: 0 auto;
  background: #fff;
  color: #e63757;
  border: 1px solid rgba(230, 55, 87, 0.35);

  &:hover:not(:disabled) {
    background: rgba(230, 55, 87, 0.06);
    filter: none;
  }
}
</style>
