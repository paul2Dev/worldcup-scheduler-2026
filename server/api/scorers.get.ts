export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const config = useRuntimeConfig()

  const data = await $fetch('https://api.football-data.org/v4/competitions/WC/scorers?limit=20', {
    headers: { 'X-Auth-Token': config.footballApiKey }
  })

  return data
})
