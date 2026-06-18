export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  setResponseHeader(event, 'CDN-Cache-Control', 'no-store')
  setResponseHeader(event, 'Vercel-CDN-Cache-Control', 'no-store')
  setResponseHeader(event, 'Pragma', 'no-cache')
  setResponseHeader(event, 'Expires', '0')
})
