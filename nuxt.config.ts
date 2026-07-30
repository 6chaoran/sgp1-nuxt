export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['@fontsource-variable/inter'],
  devtools: { enabled: false },
  nitro: {
    firebase: {
      gen: 2,
      httpsOptions: {
        region: 'asia-east1',
        maxInstances: 1,
      },
      nodeVersion: '18' // Can be '16' or '18' or '20'
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-gtag',
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap',
    '@pinia/nuxt',
    'nuxt-vuefire'
  ],
  // https://nuxt.com/docs/api/configuration/nuxt-config
  vuefire: {
    config: {
        apiKey: "AIzaSyDvwctO4xjmNg8Rw0pHwuBCdHRYM0_ePKQ",
        authDomain: "sgp1-79c40.firebaseapp.com",
        databaseURL: "https://sgp1-79c40-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "sgp1-79c40",
        storageBucket: "sgp1-79c40.firebasestorage.app",
        messagingSenderId: "200401677860",
        appId: "1:200401677860:web:5554153d25f085abeff2b1",
        measurementId: "G-8XTQL3RC8B"
      // there could be other properties depending on the project
    },
  },
  gtag: {
    id: 'G-8XTQL3RC8B',
    config: {
      page_title: 'SGP1 Companion'
    }
  },
  
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    exposeConfig: true,
    viewer: true,
    // and more...
  },
   pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'SGP1 – Singapore Primary 1 Planning Companion',
      short_name: 'SGP1',
      description: 'Explore historical Singapore Primary 1 ballot information by school, year, and admission phase.',
      lang: 'en-SG',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#3437c7',
      background_color: '#ffffff',
      categories: ['education', 'reference'],
      icons: [
        {
          src: 'android-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'apple-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: 'ms-icon-310x310.png',
          sizes: '310x310',
          type: 'image/png',
        },
        {
          src: 'ms-icon-310x310.png',
          sizes: '310x310',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 60,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

})
