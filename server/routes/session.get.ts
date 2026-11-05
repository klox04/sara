export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const session = readAdminSession(getCookie(event, adminCookieName), config.sessionSecret)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sign in required",
    })
  }

  return { ok: true }
})
