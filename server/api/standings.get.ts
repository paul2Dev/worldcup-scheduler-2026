export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const data = await $fetch('https://api.football-data.org/v4/competitions/WC/standings?stage=GROUP_STAGE', {
    headers: { 'X-Auth-Token': config.footballApiKey }
  })

  return data
})
