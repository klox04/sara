<template>
  <section>
    <NuxtLink
      :to="listPath"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-forest"
    >
      <Icon name="heroicons:arrow-left" size="1rem" aria-hidden="true" />
      Back to records
    </NuxtLink>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <PageHeader
        :title="isNew ? 'Add Record' : 'Edit Record'"
        :description="isNew ? 'Fill in the details to create a new record.' : 'Update the details for this record.'"
      />
      <div v-if="!loading && !loadError" class="flex shrink-0 gap-3">
        <NuxtLink
          :to="listPath"
          class="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Cancel
        </NuxtLink>
        <Button type="submit" form="record-form" icon="uil:save" :disabled="uploading || saving">
          {{ saving ? "Saving…" : "Save Record" }}
        </Button>
      </div>
    </div>

    <div v-if="loading" class="mt-6 grid animate-pulse gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]" aria-busy="true">
      <span class="sr-only">Loading record…</span>
      <div class="h-[28rem] rounded-xl bg-white" />
      <div class="space-y-5">
        <div class="h-64 rounded-xl bg-white" />
        <div class="h-28 rounded-xl bg-white" />
      </div>
    </div>

    <div v-else-if="loadError" class="mt-6 rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
      <p class="text-sm text-neutral-700">{{ loadError }}</p>
      <NuxtLink :to="listPath" class="mt-4 inline-flex text-sm font-medium text-[#1f7a4d] hover:underline">
        Back to records
      </NuxtLink>
    </div>

    <form
      v-else
      id="record-form"
      class="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]"
      novalidate
      @submit.prevent="saveRecord"
    >
      <div class="space-y-5">
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 class="text-lg font-semibold text-neutral-900">Record Details</h2>

        <div class="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <div>
            <label for="record-title" class="text-sm font-semibold" :class="fieldErrors.title ? 'text-red-700' : 'text-neutral-900'">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              id="record-title"
              v-model="form.title"
              type="text"
              placeholder="Enter record title"
              class="mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none"
              :class="fieldErrors.title ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
              @input="clearFieldError('title')"
            >
            <span v-if="fieldErrors.title" class="mt-1 block text-sm text-red-600">{{ fieldErrors.title }}</span>
          </div>

          <div>
            <label for="record-date" class="text-sm font-semibold" :class="fieldErrors.date ? 'text-red-700' : 'text-neutral-900'">
              Record Date <span class="text-red-500">*</span>
            </label>
            <input
              id="record-date"
              v-model="form.date"
              type="date"
              class="mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none"
              :class="[
                fieldErrors.date ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]',
                form.date ? 'text-neutral-900' : 'text-neutral-500',
              ]"
              @input="clearFieldError('date')"
            >
            <span v-if="fieldErrors.date" class="mt-1 block text-sm text-red-600">{{ fieldErrors.date }}</span>
          </div>
        </div>

        <div class="mt-5 grid gap-5 sm:grid-cols-3">
          <div v-for="field in selectFields" :key="field.key">
            <label :for="`record-${field.key}`" class="text-sm font-semibold" :class="fieldErrors[field.key] ? 'text-red-700' : 'text-neutral-900'">
              {{ field.label }} <span class="text-red-500">*</span>
            </label>
            <div class="relative mt-2">
              <Icon
                :name="field.icon"
                size="1rem"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                :class="form[field.key] ? 'text-[#1f7a4d]' : 'text-neutral-500'"
              />
              <select
                :id="`record-${field.key}`"
                v-model="form[field.key]"
                class="w-full appearance-none truncate rounded-md border bg-white py-2.5 pl-9 pr-8 text-sm outline-none"
                :class="[
                  fieldErrors[field.key] ? 'border-red-500' : 'border-neutral-300 focus:border-[#1f7a4d]',
                  form[field.key] ? 'text-neutral-900' : 'text-neutral-500',
                ]"
                @change="clearFieldError(field.key)"
              >
                <option value="" disabled>{{ field.placeholder }}</option>
                <option v-for="option in options[field.key]" :key="option.uuid" :value="option.uuid">{{ option.name }}</option>
              </select>
              <Icon name="heroicons:chevron-down" size="1rem" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
            <span v-if="fieldErrors[field.key]" class="mt-1 block text-sm text-red-600">{{ fieldErrors[field.key] }}</span>
          </div>
        </div>

        <div class="mt-5">
          <label for="record-description" class="text-sm font-semibold" :class="fieldErrors.description ? 'text-red-700' : 'text-neutral-900'">
            Description
          </label>
          <textarea
            id="record-description"
            v-model="form.description"
            rows="6"
            :maxlength="maxDescription"
            placeholder="Write a short description of this record..."
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

      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-lg font-semibold" :class="fieldErrors.videos ? 'text-red-700' : 'text-neutral-900'">Videos</h2>
          <span class="text-xs text-neutral-500">{{ videos.length }} {{ videos.length === 1 ? "video" : "videos" }}</span>
        </div>
        <label
          class="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-neutral-50 px-4 py-7 text-center transition"
          :class="fieldErrors.videos ? 'border-red-500' : videoDragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-300'"
          @dragover.prevent="videoDragOver = true"
          @dragleave.prevent="onVideoDragLeave"
          @drop.prevent="onVideoDrop"
        >
          <Icon name="heroicons:film" size="2rem" class="text-[#1f7a4d]" aria-hidden="true" />
          <span class="mt-2 text-sm font-semibold text-neutral-900">Click to browse or drag and drop videos here</span>
          <span class="mt-1 text-xs text-neutral-500">MP4, WEBM, MOV · Max size: {{ maxFileMb }} MB each</span>
          <span class="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec]">
            <Icon name="heroicons:arrow-up-tray" size="1rem" aria-hidden="true" />
            Choose Videos
          </span>
          <input type="file" multiple :accept="videoAccept" class="sr-only" @change="onVideoChange">
        </label>
        <span v-if="fieldErrors.videos" class="mt-1 block text-sm text-red-600">{{ fieldErrors.videos }}</span>

        <ul v-if="videos.length" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li
            v-for="video in videos"
            :key="video.key"
            class="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
          >
            <video
              v-if="videoSrc(video)"
              :src="videoSrc(video)"
              class="aspect-video w-full bg-neutral-900 object-cover"
              muted
              preload="metadata"
            />
            <div v-else class="flex aspect-video w-full items-center justify-center text-neutral-400">
              <Icon name="heroicons:film" size="1.75rem" aria-hidden="true" />
            </div>
            <p class="truncate border-t border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-700" :title="video.name">
              {{ video.name }}
            </p>
            <div
              v-if="video.uploading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 px-4 text-xs font-medium text-neutral-800"
            >
              <span>Uploading… {{ Math.round(video.progress) }}%</span>
              <span class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${video.progress}%` }" />
              </span>
            </div>
            <button
              v-else
              type="button"
              class="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow hover:bg-red-50 hover:text-red-700"
              :aria-label="`Remove ${video.name}`"
              @click="removeVideo(video.key)"
            >
              <Icon name="heroicons:x-mark" size="1rem" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
      </div>

      <div class="space-y-5">
        <div v-for="slot in fileSlots" :key="slot.key" class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-lg font-semibold" :class="fieldErrors[slot.key] ? 'text-red-700' : 'text-neutral-900'">
            {{ slot.label }}
          </h2>
          <div
            class="relative mt-4 overflow-hidden rounded-lg border-2 border-dashed bg-neutral-50 transition"
            :class="fieldErrors[slot.key] ? 'border-red-500' : files[slot.key].dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-300'"
            @dragover.prevent="files[slot.key].dragOver = true"
            @dragleave.prevent="onDragLeave($event, slot.key)"
            @drop.prevent="onDrop($event, slot.key)"
          >
            <div v-if="files[slot.key].path || files[slot.key].uploading" class="p-3">
              <img
                v-if="slot.key === 'image' && filePreview(slot.key)"
                :src="filePreview(slot.key)"
                alt="Selected record image"
                class="aspect-[4/3] w-full rounded-md object-cover"
              >
              <div v-else class="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-md bg-white text-[#1f7a4d]">
                <Icon :name="slot.icon" size="3rem" aria-hidden="true" />
                <span class="text-xs font-semibold uppercase tracking-wide text-neutral-500">{{ slot.badge }}</span>
              </div>
              <div class="mt-3 min-w-0 text-center">
                <p class="truncate text-sm font-semibold text-neutral-900">{{ files[slot.key].name || slot.label }}</p>
                <a
                  v-if="files[slot.key].path && !files[slot.key].uploading"
                  :href="storageSrc(files[slot.key].path)"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#1f7a4d] hover:underline"
                >
                  Open file
                  <Icon name="heroicons:arrow-top-right-on-square" size="0.85rem" aria-hidden="true" />
                </a>
                <div class="mt-3 flex justify-center gap-2">
                  <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
                    <Icon name="heroicons:arrow-path" size="1rem" aria-hidden="true" />
                    Replace
                    <input type="file" :accept="slot.accept" class="sr-only" :disabled="files[slot.key].uploading" @change="onFileChange($event, slot.key)">
                  </label>
                  <button
                    type="button"
                    class="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-60"
                    :disabled="files[slot.key].uploading"
                    @click="removeFile(slot.key)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <label v-else class="flex min-h-48 cursor-pointer flex-col items-center justify-center px-4 py-7 text-center">
              <Icon name="heroicons:cloud-arrow-up" size="2rem" class="text-[#1f7a4d]" aria-hidden="true" />
              <span class="mt-2 text-sm font-semibold text-neutral-900">Click to browse or drag and drop a file here</span>
              <span class="mt-1 text-xs text-neutral-500">{{ slot.hint }} · Max size: {{ maxFileMb }} MB</span>
              <span class="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec]">
                <Icon name="heroicons:arrow-up-tray" size="1rem" aria-hidden="true" />
                Choose File
              </span>
              <input type="file" :accept="slot.accept" class="sr-only" @change="onFileChange($event, slot.key)">
            </label>
            <div
              v-if="files[slot.key].uploading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 px-6 text-sm font-medium text-neutral-800"
            >
              <span>Uploading… {{ Math.round(files[slot.key].percent) }}%</span>
              <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${files[slot.key].percent}%` }" />
              </span>
            </div>
          </div>
          <span v-if="fieldErrors[slot.key]" class="mt-1 block text-sm text-red-600">{{ fieldErrors[slot.key] }}</span>
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

type SelectKey = "category" | "institution" | "type"

type FileKey = "image" | "pdf"

type FileState = {
  path: string
  name: string
  preview: string
  uploading: boolean
  percent: number
  dragOver: boolean
}

type VideoItem = {
  key: string
  name: string
  path: string
  preview: string
  uploading: boolean
  progress: number
}

type Option = {
  uuid: string
  name: string
}

type RecordData = Record<string, unknown>

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const route = useRoute()
const { GET_API, POST_API, PATCH_API, NEW_POST_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const listPath = "/admin/archive?tab=record"
const maxDescription = 1000
const maxFileMb = 200
const fileSlots: { key: FileKey, label: string, apiKey: "file_path" | "pdf_file_path", hint: string, badge: string, icon: string, accept: string, types: string[], extensions: RegExp, invalid: string }[] = [
  {
    key: "image",
    label: "Image",
    apiKey: "file_path",
    hint: "JPG, PNG, WEBP",
    badge: "Image",
    icon: "heroicons:photo",
    accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    types: ["image/jpeg", "image/png", "image/webp"],
    extensions: /\.(jpe?g|png|webp)$/i,
    invalid: "Use a JPG, PNG, or WEBP image.",
  },
  {
    key: "pdf",
    label: "PDF Document",
    apiKey: "pdf_file_path",
    hint: "PDF",
    badge: "PDF",
    icon: "heroicons:document-text",
    accept: "application/pdf,.pdf",
    types: ["application/pdf"],
    extensions: /\.pdf$/i,
    invalid: "Use a PDF file.",
  },
]
const videoTypes = ["video/mp4", "video/webm", "video/quicktime"]
const videoExtensions = /\.(mp4|webm|mov)$/i
const videoAccept = `${videoTypes.join(",")},.mp4,.webm,.mov`

const selectFields: { key: SelectKey, label: string, placeholder: string, icon: string, api: string, apiKey: string, nested: string }[] = [
  { key: "category", label: "Category", placeholder: "Select category", icon: "heroicons:tag", api: "record-categories", apiKey: "record_category_uuid", nested: "category" },
  { key: "institution", label: "Institution", placeholder: "Select institution", icon: "heroicons:building-library", api: "institutions", apiKey: "institution_uuid", nested: "institution" },
  { key: "type", label: "Type", placeholder: "Select type", icon: "heroicons:document-duplicate", api: "record-types", apiKey: "record_type_uuid", nested: "type" },
]

const apiFields: Record<string, string> = {
  title: "title",
  description: "description",
  record_date: "date",
  record_category_uuid: "category",
  institution_uuid: "institution",
  record_type_uuid: "type",
  file_path: "image",
  pdf_file_path: "pdf",
}
const visibility = [
  { key: "active", label: "Active", hint: "Show this record on the website." },
  { key: "featured", label: "Is Featured", hint: "Show this record in the Featured documents section of the Archive page." },
  { key: "publicService", label: "Show in Public Service", hint: "Also list this record on the Public Service page." },
] as const

const recordId = computed(() => String(route.params.id ?? ""))
const isNew = computed(() => recordId.value === "create")

const form = reactive({
  title: "",
  date: "",
  category: "",
  institution: "",
  type: "",
  description: "",
  active: true,
  featured: false,
  publicService: false,
})

function emptyFile(): FileState {
  return { path: "", name: "", preview: "", uploading: false, percent: 0, dragOver: false }
}

const options = reactive<Record<SelectKey, Option[]>>({ category: [], institution: [], type: [] })
const files = reactive<Record<FileKey, FileState>>({ image: emptyFile(), pdf: emptyFile() })
const videos = ref<VideoItem[]>([])
const fieldErrors = reactive<Record<string, string>>({})
const loading = ref(false)
const loadError = ref("")
const saving = ref(false)
const videoDragOver = ref(false)
const discardOpen = ref(false)
let resolveDiscard: ((discard: boolean) => void) | null = null
let videoKey = 0

const uploading = computed(() => fileSlots.some(slot => files[slot.key].uploading) || videos.value.some(video => video.uploading))

function snapshot() {
  return JSON.stringify({
    ...form,
    image: files.image.path,
    pdf: files.pdf.path,
    videos: videos.value.map(video => video.path),
  })
}

const savedState = ref(snapshot())
const dirty = computed(() => snapshot() !== savedState.value)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function filePreview(key: FileKey) {
  return files[key].preview || storageSrc(files[key].path)
}

function videoSrc(video: VideoItem) {
  return video.preview || storageSrc(video.path)
}

function fileNameOf(path: string) {
  return path.split("/").pop() || path
}

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function readBoolean(value: unknown) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true"].includes(value.toLowerCase())
  return false
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function fillForm(record: RecordData) {
  form.title = readText(record.title)
  form.date = readText(record.record_date).slice(0, 10)
  for (const field of selectFields) {
    const nested = record[field.nested] && typeof record[field.nested] === "object" ? record[field.nested] as RecordData : null
    form[field.key] = readText(record[field.apiKey]) || readText(nested?.uuid)
  }
  form.description = readText(record.description)
  form.active = record.is_active === undefined || record.is_active === null ? true : readBoolean(record.is_active)
  form.featured = readBoolean(record.is_featured)
  form.publicService = readBoolean(record.show_in_public_service)
  for (const slot of fileSlots) {
    const path = readText(record[slot.apiKey])
    Object.assign(files[slot.key], emptyFile(), { path, name: path ? fileNameOf(path) : "" })
  }
  const list = Array.isArray(record.videos) ? record.videos as unknown[] : []
  videos.value = list.flatMap((item) => {
    const path = typeof item === "string" ? item : readText((item as RecordData | null)?.file_path)
    return path ? [{ key: `video-${++videoKey}`, name: fileNameOf(path), path, preview: "", uploading: false, progress: 100 }] : []
  })
}

async function findRecord(uuid: string) {
  const single = await GET_API({ api: `records/${uuid}` })
    .then(response => response.data?.data)
    .catch(() => null)
  if (single && typeof single === "object" && !Array.isArray(single)) return single as RecordData
  const rows = await GET_API({ api: "records", per_page: 100 }).then(response => response.data?.data)
  return Array.isArray(rows) ? (rows as RecordData[]).find(row => row.uuid === uuid) ?? null : null
}

async function getRecord() {
  if (isNew.value) return
  loading.value = true
  loadError.value = ""
  try {
    const record = await findRecord(recordId.value)
    if (record) fillForm(record)
    else loadError.value = "This record could not be found."
  }
  catch {
    loadError.value = "The record could not be loaded."
  }
  finally {
    savedState.value = snapshot()
    loading.value = false
  }
}

function getOptions() {
  for (const field of selectFields) {
    GET_API({ api: field.api, per_page: 100 })
      .then((response) => {
        const rows = Array.isArray(response.data?.data) ? response.data.data as RecordData[] : []
        options[field.key] = rows.flatMap((row) => {
          const uuid = readText(row.uuid)
          return uuid ? [{ uuid, name: readText(row.name) || uuid }] : []
        })
      })
      .catch(() => {
        options[field.key] = []
      })
  }
}

function slotFor(key: FileKey) {
  return fileSlots.find(slot => slot.key === key)!
}

function takeFile(file: File, key: FileKey) {
  if (files[key].uploading) return
  const slot = slotFor(key)
  if (!slot.types.includes(file.type) && !slot.extensions.test(file.name)) {
    fieldErrors[key] = slot.invalid
    return
  }
  if (file.size > maxFileMb * 1024 * 1024) {
    fieldErrors[key] = `The file must be ${maxFileMb} MB or smaller.`
    return
  }
  uploadSingleFile(file, key)
}

function onFileChange(event: Event, key: FileKey) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) takeFile(file, key)
}

function leftDropZone(event: DragEvent) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  return !(next && current.contains(next))
}

function onDragLeave(event: DragEvent, key: FileKey) {
  if (leftDropZone(event)) files[key].dragOver = false
}

function onDrop(event: DragEvent, key: FileKey) {
  files[key].dragOver = false
  const file = event.dataTransfer?.files?.[0]
  if (file) takeFile(file, key)
}

function removeFile(key: FileKey) {
  if (files[key].preview) URL.revokeObjectURL(files[key].preview)
  Object.assign(files[key], emptyFile())
}

function takeVideos(list: File[]) {
  clearFieldError("videos")
  const rejected: string[] = []
  for (const file of list) {
    const allowed = videoTypes.includes(file.type) || videoExtensions.test(file.name)
    if (!allowed || file.size > maxFileMb * 1024 * 1024) {
      rejected.push(file.name)
      continue
    }
    const item: VideoItem = { key: `video-${++videoKey}`, name: file.name, path: "", preview: URL.createObjectURL(file), uploading: true, progress: 0 }
    videos.value.push(item)
    uploadVideo(file, item.key)
  }
  if (rejected.length) fieldErrors.videos = `Skipped ${rejected.join(", ")}. Use MP4, WEBM, or MOV files of ${maxFileMb} MB or smaller.`
}

function onVideoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const list = Array.from(input.files ?? [])
  input.value = ""
  if (list.length) takeVideos(list)
}

function onVideoDragLeave(event: DragEvent) {
  if (leftDropZone(event)) videoDragOver.value = false
}

function onVideoDrop(event: DragEvent) {
  videoDragOver.value = false
  const list = Array.from(event.dataTransfer?.files ?? [])
  if (list.length) takeVideos(list)
}

function findVideo(key: string) {
  return videos.value.find(video => video.key === key)
}

function removeVideo(key: string) {
  const video = findVideo(key)
  if (video?.preview) URL.revokeObjectURL(video.preview)
  videos.value = videos.value.filter(item => item.key !== key)
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
  fileData.append("folder_name", "records")
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

async function uploadSingleFile(file: File, key: FileKey) {
  const state = files[key]
  const previous = { path: state.path, name: state.name }
  clearFieldError(key)
  if (state.preview) URL.revokeObjectURL(state.preview)
  Object.assign(state, {
    name: file.name,
    preview: key === "image" ? URL.createObjectURL(file) : "",
    uploading: true,
    percent: 0,
  })
  try {
    state.path = await uploadInChunks(file, (percent) => {
      state.percent = percent
      return true
    })
    toast("success", "File uploaded.")
  }
  catch (error) {
    Object.assign(state, previous)
    fieldErrors[key] = readUploadError(error)
  }
  finally {
    if (state.preview) URL.revokeObjectURL(state.preview)
    state.preview = ""
    state.uploading = false
  }
}

async function uploadVideo(file: File, key: string) {
  try {
    const path = await uploadInChunks(file, (percent) => {
      const video = findVideo(key)
      if (video) video.progress = percent
      return Boolean(video)
    })
    const video = findVideo(key)
    if (!video || !path) return
    video.path = path
    video.uploading = false
  }
  catch (error) {
    if (!findVideo(key)) return
    removeVideo(key)
    fieldErrors.videos = `${file.name}: ${readUploadError(error)}`
  }
}

function validate() {
  clearFieldErrors()
  if (!form.title.trim()) fieldErrors.title = "Title is required."
  if (!form.date) fieldErrors.date = "Record date is required."
  for (const field of selectFields) {
    if (!form[field.key]) fieldErrors[field.key] = `${field.label} is required.`
  }
  if (form.description.length > maxDescription) fieldErrors.description = `Description must be ${maxDescription.toLocaleString()} characters or fewer.`
  return Object.keys(fieldErrors).length === 0
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const [key, value] of Object.entries(data?.errors ?? {})) {
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    const field = apiFields[key] ?? (key === "videos" || key.startsWith("videos.") ? "videos" : "")
    if (field && typeof message === "string") fieldErrors[field] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The record could not be saved."
}

function saveRecord() {
  if (uploading.value || saving.value) return
  if (!validate()) {
    toast("error", "Check the highlighted fields.")
    return
  }
  const payload = {
    title: form.title.trim(),
    description: form.description.trim() || null,
    record_date: form.date,
    record_category_uuid: form.category,
    institution_uuid: form.institution,
    record_type_uuid: form.type,
    file_path: files.image.path || null,
    pdf_file_path: files.pdf.path || null,
    is_active: form.active,
    is_featured: form.featured,
    show_in_public_service: form.publicService,
    videos: videos.value.filter(video => video.path).map(video => ({ file_path: video.path })),
  }
  saving.value = true
  const request = isNew.value
    ? POST_API({ api: "records", ...payload })
    : PATCH_API({ api: `records/${recordId.value}`, ...payload })
  request
    .then(() => {
      toast("success", isNew.value ? "Record saved." : "Record updated.")
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
  getOptions()
  getRecord()
  window.addEventListener("beforeunload", warnBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", warnBeforeUnload)
  for (const slot of fileSlots) {
    if (files[slot.key].preview) URL.revokeObjectURL(files[slot.key].preview)
  }
  for (const video of videos.value) {
    if (video.preview) URL.revokeObjectURL(video.preview)
  }
})
</script>
