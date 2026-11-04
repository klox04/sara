import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { randomUUID } from "node:crypto"
import {
  collections,
  contentSeed,
  isCollection,
  singletons,
  singletonSeed,
  slugify,
  type CollectionName,
  type ContentField,
  type ContentRecord,
  type SingletonName,
} from "~~/shared/content"

const dataDir = join(process.cwd(), "server/data")

function fileFor(name: string) {
  return join(dataDir, `${name}.json`)
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(fileFor(name), "utf8")
    return JSON.parse(raw) as T
  }
  catch {
    await mkdir(dataDir, { recursive: true })
    await writeFile(fileFor(name), `${JSON.stringify(fallback, null, 2)}\n`)
    return structuredClone(fallback)
  }
}

async function writeJson(name: string, value: unknown) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(fileFor(name), `${JSON.stringify(value, null, 2)}\n`)
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function imageList(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map(item => item.trim())
  }
  if (typeof value === "string") {
    return value.split("\n").map(item => item.trim()).filter(Boolean)
  }
  return []
}

function applyFields(source: Record<string, unknown>, fields: ContentField[]) {
  const record: Record<string, string | string[]> = {}
  for (const field of fields) {
    if (field.type === "images") {
      record[field.key] = imageList(source[field.key])
      continue
    }
    record[field.key] = textValue(source[field.key])
  }
  return record
}

function sortRecords(records: ContentRecord[]) {
  return [...records].sort((left, right) => left.sort - right.sort || String(left.id).localeCompare(String(right.id)))
}

export async function listContent(name: CollectionName, includeDrafts: boolean) {
  const records = await readJson<ContentRecord[]>(name, contentSeed[name])
  const visible = includeDrafts ? records : records.filter(record => record.published)
  return sortRecords(visible)
}

export async function getContent(name: CollectionName, id: string) {
  const records = await readJson<ContentRecord[]>(name, contentSeed[name])
  return records.find(record => record.id === id) ?? null
}

export async function createContent(name: CollectionName, body: Record<string, unknown>) {
  const config = collections[name]
  const fields = applyFields(body, config.fields)
  const title = textValue(fields[config.titleKey])
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: `${config.fields.find(field => field.key === config.titleKey)?.label || "Title"} is required` })
  }

  if (name === "stories" && !textValue(fields.slug)) {
    fields.slug = slugify(title) || "story"
  }

  const records = await readJson<ContentRecord[]>(name, contentSeed[name])
  if (name === "stories") {
    const base = textValue(fields.slug)
    let slug = base
    let count = 2
    while (records.some(record => record.slug === slug)) {
      slug = `${base}-${count}`
      count += 1
    }
    fields.slug = slug
  }

  const record: ContentRecord = {
    id: randomUUID(),
    sort: typeof body.sort === "number" ? body.sort : Number(body.sort) || records.length + 1,
    published: body.published !== false,
    ...fields,
  }
  records.push(record)
  await writeJson(name, records)
  return record
}

export async function updateContent(name: CollectionName, id: string, body: Record<string, unknown>) {
  const records = await readJson<ContentRecord[]>(name, contentSeed[name])
  const index = records.findIndex(record => record.id === id)
  const current = records[index]
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: "Content not found" })
  }

  const config = collections[name]
  const fields = applyFields({ ...current, ...body }, config.fields)
  const title = textValue(fields[config.titleKey])
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: `${config.fields.find(field => field.key === config.titleKey)?.label || "Title"} is required` })
  }
  if (name === "stories" && !textValue(fields.slug)) {
    fields.slug = slugify(title) || "story"
  }

  const record: ContentRecord = {
    ...current,
    ...fields,
    id,
    sort: body.sort === undefined ? current.sort : Number(body.sort) || current.sort,
    published: body.published === undefined ? current.published : body.published !== false,
  }
  records[index] = record
  await writeJson(name, records)
  return record
}

export async function deleteContent(name: CollectionName, id: string) {
  const records = await readJson<ContentRecord[]>(name, contentSeed[name])
  const next = records.filter(record => record.id !== id)
  if (next.length === records.length) {
    throw createError({ statusCode: 404, statusMessage: "Content not found" })
  }
  await writeJson(name, next)
}

export async function readSingleton(name: SingletonName) {
  return readJson(name, singletonSeed[name])
}

export async function writeSingleton(name: SingletonName, body: Record<string, unknown>) {
  const fields = applyFields(body, singletons[name].fields)
  if (!textValue(fields.heading)) {
    throw createError({ statusCode: 400, statusMessage: "Heading is required" })
  }
  await writeJson(name, fields)
  return fields
}

export function assertCollection(value: string): CollectionName {
  if (!isCollection(value)) {
    throw createError({ statusCode: 404, statusMessage: "Content not found" })
  }
  return value
}
