<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:photo" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Banner</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the Archive page banner such as title, subtitle, quote, and banner image.
        </p>
      </div>
      <Button type="button" icon="uil:save" :disabled="saving || uploading" @click="submitBanner">
        Save Changes
      </Button>
    </div>

    <div class="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1fr)]">
      <div class="space-y-5">
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:document-text" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Main Content
        </div>
        <Field
          v-model="form.title"
          label="Title"
          type="textarea"
          :rows="2"
          required
          :error-messages="fieldErrors.title"
          @update:model-value="clearFieldError('title')"
        />
        <Field
          v-model="form.subtitle"
          label="Subtitle"
          type="textarea"
          :rows="4"
          required
          :error-messages="fieldErrors.subtitle"
          @update:model-value="clearFieldError('subtitle')"
        />
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:chat-bubble-left-right" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Quotation
        </div>
        <Field
          v-model="form.quote"
          label="Quote Text"
          required
          :error-messages="fieldErrors.quote"
          @update:model-value="clearFieldError('quote')"
        />
      </div>

      <div>
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:photo" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Banner Image <span class="text-red-500">*</span>
        </div>

        <div
          class="mt-4 overflow-hidden rounded-xl border bg-neutral-50 transition"
          :class="fieldErrors.file_path ? 'border-red-500' : dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-200'"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <div class="relative">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Current Archive banner image"
              class="aspect-[16/9] w-full object-cover object-[center_25%]"
            >
            <div v-else class="flex aspect-[16/9] flex-col items-center justify-center gap-3 px-6 text-center">
              <span class="inline-flex size-14 items-center justify-center rounded-full bg-[#e7f6ec] text-[#1f7a4d]">
                <Icon name="heroicons:cloud-arrow-up" size="1.6rem" aria-hidden="true" />
              </span>
              <span>
                <span class="block text-sm font-semibold text-neutral-900">Drop an image here</span>
                <span class="mt-1 block text-xs text-neutral-500">JPG, PNG, WEBP, or GIF</span>
              </span>
            </div>
            <div
              v-if="uploading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 px-6 text-sm font-medium text-neutral-800"
            >
              <span>Uploading… {{ Math.round(loadingPercent) }}%</span>
              <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${loadingPercent}%` }" />
              </span>
            </div>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <label
            class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#1f7a4d] bg-white px-4 py-2.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
          >
            <Icon :name="form.file_path ? 'heroicons:arrow-path' : 'heroicons:arrow-up-tray'" size="1.05rem" aria-hidden="true" />
            {{ form.file_path ? "Replace Image" : "Upload Image" }}
            <input
              type="file"
              :accept="imageAccept"
              class="sr-only"
              :disabled="uploading"
              @change="onImageChange"
            >
          </label>
          <button
            v-if="form.file_path"
            type="button"
            class="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            :disabled="uploading"
            @click="removeImage"
          >
            Remove
          </button>
        </div>
        <p v-if="fieldErrors.file_path" class="mt-2 text-sm text-red-600">{{ fieldErrors.file_path }}</p>
        <p v-else-if="uploadError" class="mt-2 text-sm text-red-700">{{ uploadError }}</p>
        <p v-else class="mt-2 text-xs text-neutral-500">Shown behind the Archive page headline.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const { GET_API, NEW_POST_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const imageAccept = imageTypes.join(",")

const form = reactive({
  uuid: "",
  title: "",
  subtitle: "",
  quote: "",
  file_path: "",
})
const fieldErrors = reactive<Record<string, string>>({})
const preview = ref("")
const uploading = ref(false)
const loadingPercent = ref(0)
const uploadError = ref("")
const dragOver = ref(false)
const saving = ref(false)
const dirty = defineModel<boolean>("dirty", { default: false })

function snapshot() {
  return JSON.stringify({
    title: form.title,
    subtitle: form.subtitle,
    quote: form.quote,
    file_path: form.file_path,
  })
}

const savedState = ref(snapshot())

watch(() => snapshot() !== savedState.value, (changed) => {
  dirty.value = changed
}, { immediate: true })

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path}`
}

const imagePreview = computed(() => preview.value || storageSrc(form.file_path))

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function readUploadError(error: unknown) {
  if (error instanceof Error && error.message.startsWith("The uploaded")) return error.message
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message
  return typeof message === "string" && message ? message : "The image could not be uploaded."
}

function readPreview(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = typeof reader.result === "string" ? reader.result : ""
  }
  reader.readAsDataURL(file)
}

function uploadChunk(chunk: Blob, index: number, totalChunks: number, name: string, filename: string) {
  const fileData = new FormData()
  fileData.append("file", chunk, filename)
  fileData.append("index", String(index + 1))
  fileData.append("total", String(totalChunks))
  fileData.append("folder_name", "archive-headers")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then((response: { data?: { data?: unknown } }) => readText(response.data?.data))
}

async function uploadFileInChunks(file: File) {
  if (!imageTypes.includes(file.type)) {
    uploadError.value = "Choose a JPG, PNG, WEBP, or GIF image."
    return
  }
  uploadError.value = ""
  uploading.value = true
  loadingPercent.value = 0
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
    form.file_path = filePath
    preview.value = ""
    clearFieldError("file_path")
    toast("success", "Image uploaded.")
  }
  catch (error) {
    preview.value = ""
    uploadError.value = readUploadError(error)
  }
  finally {
    uploading.value = false
  }
}

function onImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) uploadFileInChunks(file)
}

function onDragLeave(event: DragEvent) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && current.contains(next)) return
  dragOver.value = false
}

function onDrop(event: DragEvent) {
  dragOver.value = false
  if (uploading.value) return
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadFileInChunks(file)
}

function removeImage() {
  form.file_path = ""
  preview.value = ""
  uploadError.value = ""
}

function getBannerData() {
  GET_API({ api: "archive-headers" }).then((response) => {
    const data = response.data?.data
    const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
    if (!record) return
    form.uuid = readText(record.uuid)
    form.title = readText(record.title)
    form.subtitle = readText(record.subtitle)
    form.quote = readText(record.quote)
    form.file_path = readText(record.file_path)
    savedState.value = snapshot()
  })
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const [key, value] of Object.entries(data?.errors ?? {})) {
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    if (typeof message === "string" && key in form) fieldErrors[key] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The banner could not be saved."
}

function submitBanner() {
  if (saving.value || uploading.value) return
  clearFieldErrors()
  if (!form.uuid) {
    toast("error", "The banner could not be updated.")
    return
  }
  if (!form.title.trim()) fieldErrors.title = "Title is required."
  if (!form.subtitle.trim()) fieldErrors.subtitle = "Subtitle is required."
  if (!form.quote.trim()) fieldErrors.quote = "Quote is required."
  if (!form.file_path) fieldErrors.file_path = "Banner image is required."
  if (Object.keys(fieldErrors).length) {
    toast("error", "Check the highlighted fields.")
    return
  }
  saving.value = true
  const payload = {
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    quote: form.quote.trim(),
    file_path: form.file_path,
  }
  PATCH_API({
    api: `archive-headers/${form.uuid}`,
    ...payload,
  })
    .then(() => {
      Object.assign(form, payload)
      savedState.value = snapshot()
      toast("success", "Banner saved.")
    })
    .catch((error: { response?: { data?: ApiErrorData } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
    .finally(() => {
      saving.value = false
    })
}

onMounted(() => {
  getBannerData()
})
</script>
