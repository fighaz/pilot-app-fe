<script setup lang="ts">
import { AlertCircle, LoaderCircle } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

const auth = useAuthStore()
const route = useRoute()

const username = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const submitting = ref(false)

async function handleSubmit(): Promise<void> {
  if (submitting.value) return
  errorMessage.value = null
  submitting.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    await navigateTo((route.query.redirect as string) || '/', { replace: true })
  } catch (err) {
    errorMessage.value = extractErrorMessage(err, 'Login failed. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <img src="/susi-air-logo.png" alt="Susi Air" class="logo" />
      <div class="heading">
        <h1>Pilot App</h1>
        <p>Sign in to view your schedule and flight hours.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            name="username"
            autocomplete="username"
            placeholder="e.g. johndoe"
            required
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="Your password"
            required
          />
        </div>

        <p v-if="errorMessage" class="alert-error" role="alert">
          <AlertCircle :size="16" />
          {{ errorMessage }}
        </p>

        <button class="btn-primary" type="submit" :disabled="submitting || !username || !password">
          <LoaderCircle v-if="submitting" :size="18" class="spin" />
          {{ submitting ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <p class="hint">Demo credentials: johndoe / susiairtest</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: linear-gradient(180deg, #0e2138 0%, #0e2138 38%, #f5f6f8 38%);
  min-height: 100dvh;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(14, 33, 56, 0.25);
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  height: 34px;
  width: auto;
  margin-bottom: 20px;
}

.heading {
  text-align: center;
  margin-bottom: 22px;

  h1 {
    font-size: 20px;
    font-weight: 800;
    color: #0e2138;
  }

  p {
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
  }
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hint {
  margin-top: 18px;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
}
</style>
