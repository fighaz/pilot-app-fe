// https://nuxt.com/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    public: {
      // Backend API base URL (override with NUXT_PUBLIC_API_BASE)
      apiBase: 'http://localhost:3001',
      // Reference "today" mirroring the backend TODAY config (brief: 15 May 2026).
      // Never use the system clock for business "today".
      today: '2026-05-15',
    },
  },

  app: {
    head: {
      title: 'Susi Air Pilot App',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Susi Air Pilot App — schedule, flight hours, and duty limit tracking for pilots.' },
        { name: 'theme-color', content: '#0E2138' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap',
        },
      ],
    },
  },
})
