export function youtubeVideoId(value: string) {
  const text = value.trim()
  if (!text) return ""
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
    const host = url.hostname.replace(/^(www\.|m\.)/, "")
    let id = ""
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0] ?? ""
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]+)/)?.[1] ?? ""
    }
    return /^[\w-]{6,}$/.test(id) ? id : ""
  }
  catch {
    return ""
  }
}

export function youtubeEmbedUrl(value: string, options: { autoplay?: boolean } = {}) {
  const id = youtubeVideoId(value)
  if (!id) return ""
  const params = new URLSearchParams({ rel: "0", playsinline: "1" })
  if (options.autoplay) params.set("autoplay", "1")
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}
