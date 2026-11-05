export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  setCookie(
    event,
    adminCookieName,
    signAdminSession(config.sessionSecret, "admin"),
    adminCookieOptions(),
  )

  return { ok: true }
})
