<template>
  <section>
    <NuxtLink
      :to="listPath"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-forest"
    >
      <Icon name="heroicons:arrow-left" size="1rem" aria-hidden="true" />
      Back to collection
    </NuxtLink>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <PageHeader
        :title="isNew ? 'Add Gallery' : 'Edit Gallery'"
        :description="isNew ? 'Fill in the details to create a new gallery.' : 'Update the details for this gallery.'"
      />
      <div v-if="!loading && !loadError" class="flex shrink-0 gap-3">
        <NuxtLink
          :to="listPath"
          class="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Cancel
        </NuxtLink>
        <Button type="submit" form="gallery-form" icon="uil:save" :disabled="uploading || saving">
          {{ saving ? "Saving…" : "Save Gallery" }}
        </Button>
      </div>
    </div>

    <div v-if="loading" class="mt-6 grid animate-pulse gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]" aria-busy="true">
      <span class="sr-only">Loading gallery…</span>
      <div class="space-y-5">
        <div class="h-72 rounded-xl bg-white" />
        <div class="h-64 rounded-xl bg-white" />
      </div>
      <div class="h-32 rounded-xl bg-white" />
    </div>

    <div v-else-if="loadError" class="mt-6 rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
      <p class="text-sm text-neutral-700">{{ loadError }}</p>
      <NuxtLink :to="listPath" class="mt-4 inline-flex text-sm font-medium text-[#1f7a4d] hover:underline">
        Back to collection
      </NuxtLink>
    </div>

    <form
      v-else
      id="gallery-form"
      class="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]"
      novalidate
      @submit.prevent="saveGallery"
    >
      <div class="space-y-5">
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-lg font-semibold text-neutral-900">Gallery Details</h2>

          <div class="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label for="gallery-initiative" class="text-sm font-semibold" :class="fieldErrors.initiative ? 'text-red-700' : 'text-neutral-900'">
                Initiative <span class="text-red-500">*</span>
              </label>
              <div class="relative mt-2">
                <Icon
                  :name="selectedInitiative ? initiativeIcon(selectedInitiative.icon) : 'heroicons:light-bulb'"
                  size="1rem"
                  class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  :class="selectedInitiative ? 'text-[#1f7a4d]' : 'text-neutral-500'"
                />
                <select
                  id="gallery-initiative"
                  v-model="form.initiative"
                  class="w-full appearance-none rounded-md border bg-white py-2.5 pl-9 pr-8 text-sm outline-none"
                  :class="[
                    fieldErrors.initiative ? 'border-red-500' : 'border-neutral-300 focus:border-[#1f7a4d]',
                    form.initiative ? 'text-neutral-900' : 'text-neutral-500',
                  ]"
                  @change="clearFieldError('initiative')"
                >
                  <option value="" disabled>Select initiative</option>
                  <option v-for="initiative in initiatives" :key="initiative.uuid" :value="initiative.uuid">{{ initiative.name }}</option>
                </select>
                <Icon name="heroicons:chevron-down" size="1rem" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
              <span v-if="fieldErrors.initiative" class="mt-1 block text-sm text-red-600">{{ fieldErrors.initiative }}</span>
            </div>

            <div>
              <label for="gallery-title" class="text-sm font-semibold" :class="fieldErrors.title ? 'text-red-700' : 'text-neutral-900'">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="gallery-title"
                v-model="form.title"
                type="text"
                placeholder="Enter gallery title"
                class="mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none"
                :class="fieldErrors.title ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
                @input="clearFieldError('title')"
              >
              <span v-if="fieldErrors.title" class="mt-1 block text-sm text-red-600">{{ fieldErrors.title }}</span>
            </div>
          </div>

          <div class="mt-5">
            <label for="gallery-description" class="text-sm font-semibold" :class="fieldErrors.description ? 'text-red-700' : 'text-neutral-900'">
              Description
            </label>
            <textarea
              id="gallery-description"
              v-model="form.description"
              rows="4"
              :maxlength="maxDescription"
              placeholder="Write a short description..."
              class="mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none"
              :class="fieldErrors.description ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
              @input="clearFieldError('description')"
            />
            <div class="mt-1 flex items-start justify-between gap-4 text-xs">
              <span class="text-sm text-red-600">{{ fieldErrors.description }}</span>
              <span class="shrink-0 text-neutral-500">{{ form.description.length }} / {{ maxDescription.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div
          v-for="kind in mediaKinds"
          :key="kind"
          class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold" :class="fieldErrors[kind] ? 'text-red-700' : 'text-neutral-900'">
              {{ mediaConfig[kind].label }}
            </h2>
            <span class="text-xs text-neutral-500">
              {{ media[kind].length }} {{ media[kind].length === 1 ? mediaConfig[kind].singular : mediaConfig[kind].plural }}
            </span>
          </div>

          <label
            class="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-neutral-50 px-4 py-7 text-center transition"
            :class="fieldErrors[kind] ? 'border-red-500' : dragOver === kind ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-300'"
            @dragover.prevent="dragOver = kind"
            @dragleave.prevent="onDragLeave($event)"
            @drop.prevent="onDrop($event, kind)"
          >
            <Icon :name="mediaConfig[kind].icon" size="2rem" class="text-[#1f7a4d]" aria-hidden="true" />
            <span class="mt-2 text-sm font-semibold text-neutral-900">Click to browse or drag and drop {{ mediaConfig[kind].plural }} here</span>
            <span class="mt-1 text-xs text-neutral-500">{{ mediaConfig[kind].hint }} · Max size: {{ maxFileMb }} MB each</span>
            <span class="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec]">
              <Icon name="heroicons:arrow-up-tray" size="1rem" aria-hidden="true" />
              Choose {{ mediaConfig[kind].label }}
            </span>
            <input type="file" multiple :accept="mediaConfig[kind].accept" class="sr-only" @change="onFileChange($event, kind)">
          </label>
          <span v-if="fieldErrors[kind]" class="mt-1 block text-sm text-red-600">{{ fieldErrors[kind] }}</span>

          <ul v-if="media[kind].length" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <li
              v-for="item in media[kind]"
              :key="item.key"
              class="group relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
            >
              <img
                v-if="kind === 'pictures' && mediaSrc(item)"
                :src="mediaSrc(item)"
                :alt="item.name"
                class="aspect-[4/3] w-full object-cover"
              >
              <video
                v-else-if="kind === 'videos' && mediaSrc(item)"
                :src="mediaSrc(item)"
                class="aspect-[4/3] w-full bg-neutral-900 object-cover"
                muted
                preload="metadata"
              />
              <div v-else class="flex aspect-[4/3] w-full items-center justify-center text-neutral-400">
                <Icon :name="mediaConfig[kind].icon" size="1.75rem" aria-hidden="true" />
              </div>
              <p class="truncate border-t border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-700" :title="item.name">
                {{ item.name }}
              </p>
              <div
                v-if="item.uploading"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 px-4 text-xs font-medium text-neutral-800"
              >
                <span>Uploading… {{ Math.round(item.progress) }}%</span>
                <span class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                  <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${item.progress}%` }" />
                </span>
              </div>
              <button
                v-else
                type="button"
                class="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow hover:bg-red-50 hover:text-red-700"
                :aria-label="`Remove ${item.name}`"
                @click="removeMedia(kind, item.key)"
              >
                <Icon name="heroicons:x-mark" size="1rem" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="space-y-5">
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-lg font-semibold" :class="fieldErrors.file ? 'text-red-700' : 'text-neutral-900'">
            Cover Image <span class="text-red-500">*</span>
          </h2>
          <div
            class="relative mt-4 overflow-hidden rounded-lg border-2 border-dashed bg-neutral-50 transition"
            :class="fieldErrors.file ? 'border-red-500' : dragOver === 'cover' ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-300'"
            @dragover.prevent="dragOver = 'cover'"
            @dragleave.prevent="onDragLeave($event)"
            @drop.prevent="onCoverDrop"
          >
            <div v-if="coverSrc" class="p-3">
              <img :src="coverSrc" alt="Selected cover image" class="aspect-[16/10] w-full rounded-md object-cover">
              <div class="mt-3 min-w-0 text-center">
                <p class="truncate text-sm font-semibold text-neutral-900">{{ cover.name || "Cover image" }}</p>
                <p class="mt-1 text-xs text-neutral-500">{{ mediaConfig.pictures.hint }} · Max size: {{ maxFileMb }} MB</p>
                <div class="mt-3 flex justify-center gap-2">
                  <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
                    <Icon name="heroicons:arrow-path" size="1rem" aria-hidden="true" />
                    Replace
                    <input type="file" :accept="mediaConfig.pictures.accept" class="sr-only" :disabled="cover.uploading" @change="onCoverChange">
                  </label>
                  <button
                    type="button"
                    class="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-60"
                    :disabled="cover.uploading"
                    @click="removeCover"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <label v-else class="flex min-h-56 cursor-pointer flex-col items-center justify-center px-4 py-7 text-center">
              <Icon name="heroicons:cloud-arrow-up" size="2rem" class="text-[#1f7a4d]" aria-hidden="true" />
              <span class="mt-2 text-sm font-semibold text-neutral-900">Click to browse or drag and drop a file here</span>
              <span class="mt-1 text-xs text-neutral-500">{{ mediaConfig.pictures.hint }} · Max size: {{ maxFileMb }} MB</span>
              <span class="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec]">
                <Icon name="heroicons:arrow-up-tray" size="1rem" aria-hidden="true" />
                Choose File
              </span>
              <input type="file" :accept="mediaConfig.pictures.accept" class="sr-only" @change="onCoverChange">
            </label>
            <div
              v-if="cover.uploading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 px-6 text-sm font-medium text-neutral-800"
            >
              <span>Uploading… {{ Math.round(cover.progress) }}%</span>
              <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${cover.progress}%` }" />
              </span>
            </div>
          </div>
          <span v-if="fieldErrors.file" class="mt-1 block text-sm text-red-600">{{ fieldErrors.file }}</span>
        </div>

        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-lg font-semibold text-neutral-900">Visibility</h2>
          <ul class="mt-3 divide-y divide-neutral-200">
            <li v-for="item in visibility" :key="item.key" class="flex items-center gap-3 py-3">
              <button
                type="button"
                role="switch"
                :aria-checked="form[item.key]"
                :aria-label="item.label"
                class="relative h-6 w-11 shrink-0 rounded-full transition"
                :class="form[item.key] ? 'bg-[#1f7a4d]' : 'bg-neutral-300'"
                @click="form[item.key] = !form[item.key]"
              >
                <span
                  class="absolute top-0.5 size-5 rounded-full bg-white shadow transition-all"
                  :class="form[item.key] ? 'left-5' : 'left-0.5'"
                />
              </button>
              <span>
                <span class="block text-sm font-semibold text-neutral-900">{{ item.label }}</span>
                <span class="block text-xs text-neutral-500">{{ item.hint }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </form>

    <DiscardDialog
      v-model:open="discardOpen"
      @confirm="settleDiscard(true)"
      @cancel="settleDiscard(false)"
    />
  </section>
</template>

<script setup lang="ts">
import DiscardDialog from "~/components/dialog/discarddialog.vue"
import { initiativeIcon } from "~~/shared/initiatives"

type Initiative = {
  uuid: string
  name: string
  icon: string
}

type MediaKind = "pictures" | "videos"

type MediaItem = {
  key: string
  name: string
  path: string
  preview: string
  uploading: boolean
  progress: number
}

type GalleryRecord = Record<string, unknown>

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const route = useRoute()
const { GET_API, POST_API, PATCH_API, NEW_POST_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const listPath = "/admin/gallery?tab=collection"
const maxDescription = 500
const maxFileMb = 200
const mediaKinds: MediaKind[] = ["pictures", "videos"]
const mediaConfig: Record<MediaKind, {
  label: string
  singular: string
  plural: string
  icon: string
  hint: string
  accept: string
  types: string[]
  extensions: RegExp
}> = {
  pictures: {
    label: "Pictures",
    singular: "picture",
    plural: "pictures",
    icon: "heroicons:photo",
    hint: "JPG, PNG, JPEG, WEBP",
    accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    types: ["image/jpeg", "image/png", "image/webp"],
    extensions: /\.(jpe?g|png|webp)$/i,
  },
  videos: {
    label: "Videos",
    singular: "video",
    plural: "videos",
    icon: "heroicons:film",
    hint: "MP4, WEBM, MOV",
    accept: "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
    types: ["video/mp4", "video/webm", "video/quicktime"],
    extensions: /\.(mp4|webm|mov)$/i,
  },
}
const apiFields: Record<string, string> = {
  initiative_uuid: "initiative",
  title: "title",
  description: "description",
  file_path: "file",
}
const visibility = [
  { key: "active", label: "Active", hint: "Show this gallery on the website." },
  { key: "mainFeatured", label: "Main Featured", hint: "Highlight this gallery as the main feature of the Gallery page." },
] as const

const galleryId = computed(() => String(route.params.id ?? ""))
const isNew = computed(() => galleryId.value === "create")

const form = reactive({
  initiative: "",
  title: "",
  description: "",
  active: true,
  mainFeatured: false,
})
const media = reactive<Record<MediaKind, MediaItem[]>>({ pictures: [], videos: [] })
const cover = reactive({ path: "", name: "", preview: "", uploading: false, progress: 0 })
const fieldErrors = reactive<Record<string, string>>({})
const initiatives = ref<Initiative[]>([])
const loading = ref(false)
const loadError = ref("")
const saving = ref(false)
const dragOver = ref<MediaKind | "cover" | "">("")
const discardOpen = ref(false)
let resolveDiscard: ((discard: boolean) => void) | null = null
let mediaKey = 0

const selectedInitiative = computed(() => initiatives.value.find(item => item.uuid === form.initiative) ?? null)
const uploading = computed(() => cover.uploading || mediaKinds.some(kind => media[kind].some(item => item.uploading)))
const coverSrc = computed(() => cover.preview || storageSrc(cover.path))

function snapshot() {
  return JSON.stringify({
    ...form,
    cover: cover.path,
    pictures: media.pictures.map(item => item.path),
    videos: media.videos.map(item => item.path),
  })
}

const savedState = ref(snapshot())
const dirty = computed(() => snapshot() !== savedState.value)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function mediaSrc(item: MediaItem) {
  return item.preview || storageSrc(item.path)
}

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function readBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "active"].includes(value.toLowerCase())
  return fallback
}

function readFiles(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const path = typeof item === "string" ? item : readText((item as GalleryRecord | null)?.file_path)
    return path ? [path] : []
  })
}

function savedMedia(path: string): MediaItem {
  return { key: `media-${++mediaKey}`, name: path.split("/").pop() || path, path, preview: "", uploading: false, progress: 100 }
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function fillForm(record: GalleryRecord) {
  const initiative = record.initiative && typeof record.initiative === "object" ? record.initiative as GalleryRecord : null
  form.initiative = readText(record.initiative_uuid) || readText(initiative?.uuid)
  form.title = readText(record.title)
  form.description = readText(record.description)
  form.active = readBoolean(record.is_active, true)
  form.mainFeatured = readBoolean(record.is_main_featured, false)
  media.pictures = readFiles(record.pictures).map(savedMedia)
  media.videos = readFiles(record.videos).map(savedMedia)
  cover.path = readText(record.file_path)
  cover.name = cover.path.split("/").pop() || ""
}

async function findGallery(uuid: string) {
  const single = await GET_API({ api: `galleries/${uuid}` })
    .then(response => response.data?.data)
    .catch(() => null)
  if (single && typeof single === "object" && !Array.isArray(single)) return single as GalleryRecord
  const rows = await GET_API({ api: "galleries", per_page: 100 }).then(response => response.data?.data)
  return Array.isArray(rows) ? (rows as GalleryRecord[]).find(row => row.uuid === uuid) ?? null : null
}

async function getGallery() {
  if (isNew.value) return
  loading.value = true
  loadError.value = ""
  try {
    const record = await findGallery(galleryId.value)
    if (record) fillForm(record)
    else loadError.value = "This gallery could not be found."
  }
  catch {
    loadError.value = "The gallery could not be loaded."
  }
  finally {
    savedState.value = snapshot()
    loading.value = false
  }
}

function getInitiatives() {
  GET_API({ api: "initiatives" }).then((response) => {
    const rows = Array.isArray(response.data?.data) ? response.data.data as GalleryRecord[] : []
    initiatives.value = rows.flatMap((row) => {
      const uuid = readText(row.uuid)
      return uuid ? [{ uuid, name: readText(row.name) || uuid, icon: readText(row.icon) }] : []
    })
  })
}

function takeFiles(files: File[], kind: MediaKind) {
  const config = mediaConfig[kind]
  clearFieldError(kind)
  const rejected: string[] = []
  for (const file of files) {
    const allowed = config.types.includes(file.type) || config.extensions.test(file.name)
    if (!allowed || file.size > maxFileMb * 1024 * 1024) {
      rejected.push(file.name)
      continue
    }
    const item: MediaItem = {
      key: `media-${++mediaKey}`,
      name: file.name,
      path: "",
      preview: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    }
    media[kind].push(item)
    uploadFileInChunks(file, kind, item.key)
  }
  if (rejected.length) {
    fieldErrors[kind] = `Skipped ${rejected.join(", ")}. Use ${config.hint} files of ${maxFileMb} MB or smaller.`
  }
}

function onFileChange(event: Event, kind: MediaKind) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ""
  if (files.length) takeFiles(files, kind)
}

function onDragLeave(event: DragEvent) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && current.contains(next)) return
  dragOver.value = ""
}

function onDrop(event: DragEvent, kind: MediaKind) {
  dragOver.value = ""
  const files = Array.from(event.dataTransfer?.files ?? [])
  if (files.length) takeFiles(files, kind)
}

function findMedia(kind: MediaKind, key: string) {
  return media[kind].find(item => item.key === key)
}

function removeMedia(kind: MediaKind, key: string) {
  const item = findMedia(kind, key)
  if (item?.preview) URL.revokeObjectURL(item.preview)
  media[kind] = media[kind].filter(entry => entry.key !== key)
}

function readUploadError(error: unknown) {
  if (error instanceof Error && error.message.startsWith("The uploaded")) return error.message
  const response = error as { response?: { data?: { message?: unknown } } }
  const message = response.response?.data?.message
  return typeof message === "string" && message ? message : "The file could not be uploaded."
}

function uploadChunk(chunk: Blob, index: number, totalChunks: number, name: string, filename: string) {
  const fileData = new FormData()
  fileData.append("file", chunk, filename)
  fileData.append("index", String(index + 1))
  fileData.append("total", String(totalChunks))
  fileData.append("folder_name", "galleries")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then((response: { data?: { data?: unknown } }) => readText(response.data?.data))
}

async function uploadInChunks(file: File, onProgress: (percent: number) => boolean) {
  const chunkSize = 1024 * 1024 * 5
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize))
  const name = file.name.replace(/\.[^/.]+$/, "")
  let filePath = ""
  for (let index = 0; index < totalChunks; index++) {
    const start = index * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    filePath = await uploadChunk(file.slice(start, end), index, totalChunks, name, file.name)
    if (!onProgress(((index + 1) / totalChunks) * 100)) return ""
  }
  if (!filePath) throw new Error("The uploaded file path was not returned.")
  return filePath
}

async function uploadFileInChunks(file: File, kind: MediaKind, key: string) {
  try {
    const filePath = await uploadInChunks(file, (percent) => {
      const item = findMedia(kind, key)
      if (item) item.progress = percent
      return Boolean(item)
    })
    const item = findMedia(kind, key)
    if (!item || !filePath) return
    item.path = filePath
    item.uploading = false
  }
  catch (error) {
    if (!findMedia(kind, key)) return
    removeMedia(kind, key)
    fieldErrors[kind] = `${file.name}: ${readUploadError(error)}`
  }
}

function takeCover(file: File) {
  if (cover.uploading) return
  const config = mediaConfig.pictures
  const allowed = config.types.includes(file.type) || config.extensions.test(file.name)
  if (!allowed) {
    fieldErrors.file = `Use a ${config.hint} image.`
    return
  }
  if (file.size > maxFileMb * 1024 * 1024) {
    fieldErrors.file = `The file must be ${maxFileMb} MB or smaller.`
    return
  }
  uploadCover(file)
}

function onCoverChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) takeCover(file)
}

function onCoverDrop(event: DragEvent) {
  dragOver.value = ""
  const file = event.dataTransfer?.files?.[0]
  if (file) takeCover(file)
}

function removeCover() {
  if (cover.preview) URL.revokeObjectURL(cover.preview)
  cover.path = ""
  cover.name = ""
  cover.preview = ""
}

async function uploadCover(file: File) {
  clearFieldError("file")
  const previousPath = cover.path
  const previousName = cover.name
  if (cover.preview) URL.revokeObjectURL(cover.preview)
  cover.preview = URL.createObjectURL(file)
  cover.name = file.name
  cover.uploading = true
  cover.progress = 0
  try {
    cover.path = await uploadInChunks(file, (percent) => {
      cover.progress = percent
      return true
    })
    toast("success", "File uploaded.")
  }
  catch (error) {
    URL.revokeObjectURL(cover.preview)
    cover.preview = ""
    cover.path = previousPath
    cover.name = previousName
    fieldErrors.file = readUploadError(error)
  }
  finally {
    cover.uploading = false
  }
}

function validate() {
  clearFieldErrors()
  if (!form.initiative) fieldErrors.initiative = "Initiative is required."
  if (!form.title.trim()) fieldErrors.title = "Title is required."
  if (!cover.path) fieldErrors.file = "Cover image is required."
  if (form.description.length > maxDescription) fieldErrors.description = `Description must be ${maxDescription} characters or fewer.`
  return Object.keys(fieldErrors).length === 0
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const [key, value] of Object.entries(data?.errors ?? {})) {
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    if (typeof message !== "string") continue
    const field = apiFields[key] ?? mediaKinds.find(kind => key === kind || key.startsWith(`${kind}.`))
    if (field) fieldErrors[field] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The gallery could not be saved."
}

function mediaPayload(kind: MediaKind) {
  return media[kind].filter(item => item.path).map(item => ({ file_path: item.path }))
}

function saveGallery() {
  if (uploading.value || saving.value) return
  if (!validate()) {
    toast("error", "Check the highlighted fields.")
    return
  }
  const payload = {
    initiative_uuid: form.initiative,
    title: form.title.trim(),
    description: form.description.trim() || null,
    is_active: form.active,
    is_main_featured: form.mainFeatured,
    file_path: cover.path,
    pictures: mediaPayload("pictures"),
    videos: mediaPayload("videos"),
  }
  saving.value = true
  const request = isNew.value
    ? POST_API({ api: "galleries", ...payload })
    : PATCH_API({ api: `galleries/${galleryId.value}`, ...payload })
  request
    .then(() => {
      toast("success", isNew.value ? "Gallery saved." : "Gallery updated.")
      savedState.value = snapshot()
      return navigateTo(listPath)
    })
    .catch((error: { response?: { data?: ApiErrorData } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
    .finally(() => {
      saving.value = false
    })
}

function askToDiscard() {
  if (!dirty.value) return Promise.resolve(true)
  resolveDiscard?.(false)
  discardOpen.value = true
  return new Promise<boolean>((resolve) => {
    resolveDiscard = resolve
  })
}

function settleDiscard(discard: boolean) {
  discardOpen.value = false
  if (discard) savedState.value = snapshot()
  resolveDiscard?.(discard)
  resolveDiscard = null
}

onBeforeRouteLeave(() => askToDiscard())

function warnBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ""
}

onMounted(() => {
  getInitiatives()
  getGallery()
  window.addEventListener("beforeunload", warnBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", warnBeforeUnload)
  if (cover.preview) URL.revokeObjectURL(cover.preview)
  for (const kind of mediaKinds) {
    for (const item of media[kind]) {
      if (item.preview) URL.revokeObjectURL(item.preview)
    }
  }
})
</script>
