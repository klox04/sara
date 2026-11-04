export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const resource = assertCollection(getRouterParam(event, "resource") || "")
  const record = await getContent(resource, getRouterParam(event, "id") || "")
  if (!record) {
    throw createError({ statusCode: 404, statusMessage: "Content not found" })
  }
  return record
})
