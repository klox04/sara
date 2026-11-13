export type SiteSettings = {
  title: string
  lightLogo: string
  darkLogo: string
}

const defaultTitle = "Sara Duterte"
const defaultIcon = "/forest_eagle_mountain_icon.png"

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export function readSiteSettings(data: unknown): SiteSettings & { uuid: string } {
  const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
  return {
    uuid: readText(record?.uuid),
    title: readText(record?.title),
    lightLogo: readText(record?.light_logo),
    darkLogo: readText(record?.dark_logo),
  }
}

export function useSiteSettings() {
  const settings = useState<SiteSettings | null>("site-settings", () => null)
  const prefersDark = useState("site-prefers-dark", () => false)
  const storageUrl = String(useRuntimeConfig().public.storageUrl || "").replace(/\/$/, "")

  const siteTitle = computed(() => settings.value?.title || defaultTitle)
  const siteIcon = computed(() => {
    const light = settings.value?.lightLogo ?? ""
    const dark = settings.value?.darkLogo ?? ""
    const logo = prefersDark.value ? dark || light : light || dark
    if (!logo) return defaultIcon
    if (/^(https?:|data:|blob:|\/)/i.test(logo)) return logo
    return `${storageUrl}/${logo.replace(/^\//, "")}`
  })

  async function load() {
    const { GET_API } = useGlobalStore()
    for (const api of ["public/settings", "settings"]) {
      try {
        const response = await GET_API({ api })
        const { title, lightLogo, darkLogo } = readSiteSettings(response.data?.data)
        if (title || lightLogo || darkLogo) settings.value = { title, lightLogo, darkLogo }
        return
      }
      catch {
        continue
      }
    }
  }

  function watchColorScheme() {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => {
      prefersDark.value = query.matches
    }
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }

  return { settings, prefersDark, siteTitle, siteIcon, load, watchColorScheme }
}
