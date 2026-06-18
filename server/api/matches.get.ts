export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const config = useRuntimeConfig()
  const query = getQuery(event)

  const params = new URLSearchParams()
  if (query.dateFrom) params.set('dateFrom', String(query.dateFrom))
  if (query.dateTo) params.set('dateTo', String(query.dateTo))
  if (query.status) params.set('status', String(query.status))

  const qs = params.toString()
  const url = `https://api.football-data.org/v4/competitions/WC/matches${qs ? `?${qs}` : ''}`

  try {
    const data = await $fetch(url, {
      headers: { 'X-Auth-Token': config.footballApiKey }
    })
    return data
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status ?? 500
    const body = err?.data ?? err?.response?._data ?? null
    throw createError({
      statusCode: status,
      message: body?.message ?? `football-data.org error ${status}`
    })
  }
})
