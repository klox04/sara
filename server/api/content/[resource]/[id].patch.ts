export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const resource = assertCollection(getRouterParam(event, "resource") || "")
  const body = await readBody<Record<string, unknown>>(event)
  return updateContent(resource, getRouterParam(event, "id") || "", body || {})
})
