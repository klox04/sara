<template>
  <section>
    <NuxtLink
      to="/admin/stories"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-forest"
    >
      <Icon name="heroicons:arrow-left" size="1rem" aria-hidden="true" />
      Back to stories
    </NuxtLink>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <PageHeader
        :title="isNew ? 'Add Story' : 'Edit Story'"
        :description="isNew ? 'Fill in the details to create a new story.' : 'Update the details for this story.'"
      />
      <div v-if="!loading && !loadError" class="flex shrink-0 gap-3">
        <NuxtLink
          to="/admin/stories"
          class="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Cancel
        </NuxtLink>
        <Button type="submit" form="story-form" icon="uil:save" :disabled="uploading || saving">
          {{ saving ? "Saving…" : "Save Story" }}
        </Button>
      </div>
    </div>

    <div v-if="loading" class="mt-6 grid animate-pulse gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]" aria-busy="true">
      <span class="sr-only">Loading story…</span>
      <div class="h-[32rem] rounded-xl bg-white" />
      <div class="space-y-5">
          <div class="h-72 rounded-xl bg-white" />
          <div class="h-48 rounded-xl bg-white" />
        </div>
      </div>

      <div v-else-if="loadError" class="mt-6 rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
        <p class="text-sm text-neutral-700">{{ loadError }}</p>
        <NuxtLink to="/admin/stories" class="mt-4 inline-flex text-sm font-medium text-[#1f7a4d] hover:underline">
          Back to stories
        </NuxtLink>
      </div>

      <form
        v-else
        id="story-form"
        class="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]"
        novalidate
        @submit.prevent="saveStory"
      >
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-lg font-semibold text-neutral-900">Story Details</h2>

          <div class="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label for="story-category" class="text-sm font-semibold" :class="fieldErrors.category ? 'text-red-700' : 'text-neutral-900'">
                Category <span class="text-red-500">*</span>
              </label>
              <div class="relative mt-2">
                <Icon name="heroicons:tag" size="1rem" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <select
                  id="story-category"
                  v-model="form.category"
                  class="w-full appearance-none rounded-md border bg-white py-2.5 pl-9 pr-8 text-sm outline-none"
                  :class="[
                    fieldErrors.category ? 'border-red-500' : 'border-neutral-300 focus:border-[#1f7a4d]',
                    form.category ? 'text-neutral-900' : 'text-neutral-500',
                  ]"
                  @change="clearFieldError('category')"
                >
                  <option value="" disabled>Select category</option>
                  <option v-for="category in categories" :key="category.uuid" :value="category.uuid">{{ category.name }}</option>
                </select>
                <Icon name="heroicons:chevron-down" size="1rem" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
              <span v-if="fieldErrors.category" class="mt-1 block text-sm text-red-600">{{ fieldErrors.category }}</span>
            </div>

            <div>
              <label for="story-title" class="text-sm font-semibold" :class="fieldErrors.title ? 'text-red-700' : 'text-neutral-900'">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="story-title"
                v-model="form.title"
                type="text"
                placeholder="Enter story title"
                class="mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none"
                :class="fieldErrors.title ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
                @input="clearFieldError('title')"
              >
              <span v-if="fieldErrors.title" class="mt-1 block text-sm text-red-600">{{ fieldErrors.title }}</span>
            </div>
          </div>

          <div class="mt-5">
            <label for="story-description" class="text-sm font-semibold" :class="fieldErrors.description ? 'text-red-700' : 'text-neutral-900'">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="story-description"
              v-model="form.description"
              rows="3"
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

          <div class="mt-3">
            <label for="story-content" class="text-sm font-semibold" :class="fieldErrors.content ? 'text-red-700' : 'text-neutral-900'">
              Content
            </label>
            <textarea
              id="story-content"
              v-model="form.content"
              rows="14"
              :maxlength="maxContent"
              placeholder="Write the full content of the story..."
              class="mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none"
              :class="fieldErrors.content ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
              @input="clearFieldError('content')"
            />
            <div class="mt-1 flex items-start justify-between gap-4 text-xs">
              <span class="text-sm text-red-600">{{ fieldErrors.content }}</span>
              <span class="shrink-0 text-neutral-500">{{ form.content.length }} / {{ maxContent.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-5">
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-lg font-semibold" :class="fieldErrors.file ? 'text-red-700' : 'text-neutral-900'">
            Upload File <span class="text-red-500">*</span>
          </h2>
          <div
            class="relative mt-4 overflow-hidden rounded-lg border-2 border-dashed bg-neutral-50 transition"
            :class="fieldErrors.file ? 'border-red-500' : dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-300'"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
          >
            <div v-if="imagePreview" class="p-3">
              <img :src="imagePreview" alt="Selected story image" class="aspect-[16/10] w-full rounded-md object-cover">
              <div class="mt-3 min-w-0 text-center">
                <p class="truncate text-sm font-semibold text-neutral-900">{{ fileName || "Story image" }}</p>
                <p class="mt-1 text-xs text-neutral-500">JPG, PNG, JPEG, WEBP · Max size: {{ maxFileMb }} MB</p>
                <div class="mt-3 flex justify-center gap-2">
                  <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
                    <Icon name="heroicons:arrow-path" size="1rem" aria-hidden="true" />
                    Replace
                    <input type="file" :accept="fileAccept" class="sr-only" :disabled="uploading" @change="onFileChange">
                  </label>
                  <button
                    type="button"
                    class="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-60"
                    :disabled="uploading"
                    @click="removeFile"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <label v-else class="flex min-h-56 cursor-pointer flex-col items-center justify-center px-4 py-7 text-center has-[:disabled]:cursor-not-allowed">
              <Icon name="heroicons:cloud-arrow-up" size="2rem" class="text-[#1f7a4d]" aria-hidden="true" />
              <span class="mt-2 text-sm font-semibold text-neutral-900">Click to browse or drag and drop a file here</span>
              <span class="mt-1 text-xs text-neutral-500">JPG, PNG, JPEG, WEBP · Max size: {{ maxFileMb }} MB</span>
              <span class="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec]">
                <Icon name="heroicons:arrow-up-tray" size="1rem" aria-hidden="true" />
                Choose File
              </span>
              <input type="file" :accept="fileAccept" class="sr-only" :disabled="uploading" @change="onFileChange">
            </label>
            <div
              v-if="uploading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 px-6 text-sm font-medium text-neutral-800"
            >
              <span>Uploading… {{ Math.round(loadingPercent) }}%</span>
              <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${loadingPercent}%` }" />
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

type Category = {
  uuid: string
  name: string
}

type StoryRecord = Record<string, unknown>

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const route = useRoute()
const { GET_API, POST_API, PATCH_API, NEW_POST_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const maxDescription = 300
const maxContent = 5000
const maxFileMb = 200
const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
const fileAccept = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
const apiFields: Record<string, string> = {
  category_uuid: "category",
  title: "title",
  description: "description",
  content: "content",
  file_path: "file",
}
const visibility = [
  { key: "active", label: "Active", hint: "Make this story visible on the website." },
  { key: "featured", label: "Is Featured", hint: "Display this story in the main Featured section. Maximum of 3 featured stories." },
  { key: "mainFeatured", label: "Main Featured", hint: "Use this story as the primary featured content." },
] as const

const storyId = computed(() => String(route.params.id ?? ""))
const isNew = computed(() => storyId.value === "create")

const form = reactive({
  category: "",
  title: "",
  description: "",
  content: "",
  file: "",
  active: true,
  featured: false,
  mainFeatured: false,
})
const fieldErrors = reactive<Record<string, string>>({})
const categories = ref<Category[]>([])
const loading = ref(false)
const loadError = ref("")
const saving = ref(false)
const uploading = ref(false)
const loadingPercent = ref(0)
const preview = ref("")
const fileName = ref("")
const dragOver = ref(false)
const discardOpen = ref(false)
let resolveDiscard: ((discard: boolean) => void) | null = null

function snapshot() {
  return JSON.stringify(form)
}

const savedState = ref(snapshot())
const dirty = computed(() => snapshot() !== savedState.value)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

const imagePreview = computed(() => preview.value || storageSrc(form.file))

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function readBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "active"].includes(value.toLowerCase())
  return fallback
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function fillForm(record: StoryRecord) {
  const category = record.category && typeof record.category === "object" ? record.category as StoryRecord : null
  form.category = readText(record.category_uuid) || readText(category?.uuid)
  form.title = readText(record.title)
  form.description = readText(record.description)
  form.content = readText(record.content)
  form.file = readText(record.file_path || record.image)
  form.active = readBoolean(record.is_active, true)
  form.featured = readBoolean(record.is_featured, false)
  form.mainFeatured = readBoolean(record.is_main_featured, false)
  fileName.value = form.file.split("/").pop() || ""
}

async function findStory(uuid: string) {
  const single = await GET_API({ api: `stories/${uuid}` })
    .then(response => response.data?.data)
    .catch(() => null)
  if (single && typeof single === "object" && !Array.isArray(single)) return single as StoryRecord
  const rows = await GET_API({ api: "stories", per_page: 100 }).then(response => response.data?.data)
  return Array.isArray(rows) ? (rows as StoryRecord[]).find(row => row.uuid === uuid) ?? null : null
}

async function getStory() {
  if (isNew.value) return
  loading.value = true
  loadError.value = ""
  try {
    const record = await findStory(storyId.value)
    if (record) fillForm(record)
    else loadError.value = "This story could not be found."
  }
  catch {
    loadError.value = "The story could not be loaded."
  }
  finally {
    savedState.value = snapshot()
    loading.value = false
  }
}

function getCategoryData() {
  GET_API({ api: "categories" }).then((response) => {
    const rows = Array.isArray(response.data?.data) ? response.data.data : []
    categories.value = rows.flatMap((row: StoryRecord) => {
      const uuid = readText(row.uuid)
      const name = readText(row.name) || readText(row.title) || readText(row.label)
      return uuid ? [{ uuid, name: name || uuid }] : []
    })
  })
}

function readPreview(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = typeof reader.result === "string" ? reader.result : ""
  }
  reader.readAsDataURL(file)
}

function takeFile(file: File) {
  if (uploading.value) return
  const allowed = allowedTypes.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name)
  if (!allowed) {
    fieldErrors.file = "Use a JPG, PNG, or WEBP image."
    return
  }
  if (file.size > maxFileMb * 1024 * 1024) {
    fieldErrors.file = `The file must be ${maxFileMb} MB or smaller.`
    return
  }
  fileName.value = file.name
  uploadFileInChunks(file)
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) takeFile(file)
}

function onDragLeave(event: DragEvent) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && current.contains(next)) return
  dragOver.value = false
}

function onDrop(event: DragEvent) {
  dragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) takeFile(file)
}

function removeFile() {
  form.file = ""
  preview.value = ""
  fileName.value = ""
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
  fileData.append("folder_name", "stories")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then((response: { data?: { data?: unknown } }) => readText(response.data?.data))
}

async function uploadFileInChunks(file: File) {
  uploading.value = true
  loadingPercent.value = 0
  clearFieldError("file")
  readPreview(file)

  const chunkSize = 1024 * 1024 * 5
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize))
  const name = file.name.replace(/\.[^/.]+$/, "")

  try {
    let filePath = ""
    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      filePath = await uploadChunk(file.slice(start, end), index, totalChunks, name, file.name)
      loadingPercent.value = ((index + 1) / totalChunks) * 100
    }
    if (!filePath) throw new Error("The uploaded file path was not returned.")
    form.file = filePath
    preview.value = ""
    toast("success", "File uploaded.")
  }
  catch (error) {
    preview.value = ""
    fieldErrors.file = readUploadError(error)
  }
  finally {
    uploading.value = false
  }
}

function validate() {
  clearFieldErrors()
  if (!form.category) fieldErrors.category = "Category is required."
  if (!form.title.trim()) fieldErrors.title = "Title is required."
  if (!form.description.trim()) fieldErrors.description = "Description is required."
  else if (form.description.length > maxDescription) fieldErrors.description = `Description must be ${maxDescription} characters or fewer.`
  if (form.content.length > maxContent) fieldErrors.content = `Content must be ${maxContent.toLocaleString()} characters or fewer.`
  if (!form.file) fieldErrors.file = "File is required."
  return Object.keys(fieldErrors).length === 0
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const [key, value] of Object.entries(data?.errors ?? {})) {
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    const field = apiFields[key]
    if (field && typeof message === "string") fieldErrors[field] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The story could not be saved."
}

function saveStory() {
  if (uploading.value || saving.value) return
  if (!validate()) {
    toast("error", "Check the highlighted fields.")
    return
  }
  const payload = {
    category_uuid: form.category,
    title: form.title.trim(),
    description: form.description.trim(),
    content: form.content.trim() || null,
    file_path: form.file,
    is_active: form.active,
    is_featured: form.featured,
    is_main_featured: form.mainFeatured,
  }
  saving.value = true
  const request = isNew.value
    ? POST_API({ api: "stories", ...payload })
    : PATCH_API({ api: `stories/${storyId.value}`, ...payload })
  request
    .then(() => {
      toast("success", isNew.value ? "Story saved." : "Story updated.")
      savedState.value = snapshot()
      return navigateTo("/admin/stories")
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
  getCategoryData()
  getStory()
  window.addEventListener("beforeunload", warnBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", warnBeforeUnload)
})
</script>
