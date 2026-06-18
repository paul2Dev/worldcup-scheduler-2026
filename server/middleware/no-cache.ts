export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  setResponseHeader(event, 'Pragma', 'no-cache')
  setResponseHeader(event, 'Expires', '0')
})
