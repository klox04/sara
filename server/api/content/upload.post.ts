import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import { extname, join } from "node:path"

const allowed = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
])

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === "file" && part.data?.length)
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: "Choose an image" })
  }

  const type = file.type || ""
  const extension = allowed.get(type) || ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extname(file.filename || "").toLowerCase()) ? extname(file.filename || "").toLowerCase() : "")
  if (!extension) {
    throw createError({ statusCode: 400, statusMessage: "Use a JPG, PNG, WEBP, or GIF image" })
  }
  if (file.data.length > 8 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: "Image must be 8 MB or smaller" })
  }

  const filename = `${randomUUID()}${extension === ".jpeg" ? ".jpg" : extension}`
  const directory = join(process.cwd(), "public/uploads")
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, filename), file.data)
  return { path: `/uploads/${filename}` }
})
