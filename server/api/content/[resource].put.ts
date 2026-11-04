export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const name = getRouterParam(event, "resource") || ""
  if (name !== "about" && name !== "connect") {
    throw createError({ statusCode: 404, statusMessage: "Content not found" })
  }
  const body = await readBody<Record<string, unknown>>(event)
  return writeSingleton(name, body || {})
})
