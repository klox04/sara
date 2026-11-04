export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "resource") || ""
  if (name === "about" || name === "connect") {
    return readSingleton(name)
  }

  const resource = assertCollection(name)
  const includeDrafts = getQuery(event).all === "1"
  if (includeDrafts) {
    requireAdmin(event)
  }
  return listContent(resource, includeDrafts)
})
