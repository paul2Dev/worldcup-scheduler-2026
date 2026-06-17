export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  css: ['flag-icons/css/flag-icons.min.css'],

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
      ]
    }
  },

  compatibilityDate: '2024-11-01'
})
