export default defineNuxtRouteMiddleware(async (to) => {
  const path = to.path.replace(/\/$/, "") || "/"
  if (path === "/admin" || !path.startsWith("/admin")) return
  if (import.meta.prerender) return

  if (useCookie("sara_admin").value) return

  try {
    const result = await useRequestFetch()<{ ok?: boolean }>("/session")
    if (result?.ok) return
  }
  catch {
    // The static host has no Node route for /session.
  }

  return navigateTo("/admin")
})
