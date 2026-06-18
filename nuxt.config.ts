export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  routeRules: {
    '/': { headers: { 'Cache-Control': 'no-store' } },
    '/api/**': { headers: { 'Cache-Control': 'no-store' } }
  },

  runtimeConfig: {
    footballApiKey: process.env.FOOTBALL_API_KEY,
    public: {}
  },

  app: {
    head: {
      title: 'World Cup 2026',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/flag-icons@7.3.2/css/flag-icons.min.css'
        },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icon-512.png' }
      ],
      meta: [
        { name: 'theme-color', content: '#0f172a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'WC 2026' }
      ]
    }
  },

  compatibilityDate: '2024-11-01'
})
