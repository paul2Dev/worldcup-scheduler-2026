export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

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
        }
      ]
    }
  },

  compatibilityDate: '2024-11-01'
})
