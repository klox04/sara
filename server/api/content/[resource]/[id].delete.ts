export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const resource = assertCollection(getRouterParam(event, "resource") || "")
  await deleteContent(resource, getRouterParam(event, "id") || "")
  return { ok: true }
})
