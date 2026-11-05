export default defineEventHandler((event) => {
  deleteCookie(event, adminCookieName, { path: "/" })
  return { ok: true }
})
