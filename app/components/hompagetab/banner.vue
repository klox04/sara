<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:photo" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Banners</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the homepage hero content such as title, subtitle, description, quote, and hero image.
        </p>
      </div>
      <Button @click.prevent="SubmitBanner" type="submit" icon="uil:save">
        Save Changes
      </Button>
    </div>

    <div class="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
      <div class="space-y-5">
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:document-text" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Main Content
        </div>
        <Field
          v-model="form.name"
          label="Title"
          type="textarea"
          :rows="2"
          required
          :error-messages="fieldErrors.name"
          @update:model-value="clearFieldError('name')"
        />
        <Field
          v-model="form.headline"
          label="Subtitle"
          required
          :error-messages="fieldErrors.headline"
          @update:model-value="clearFieldError('headline')"
        />
        <Field
          v-model="form.body"
          label="Description"
          type="textarea"
          :rows="4"
          required
          :error-messages="fieldErrors.body"
          @update:model-value="clearFieldError('body')"
        />
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:chat-bubble-left-right" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Quotation
        </div>
        <Field
          v-model="form.quote"
          label="Quote Text"
          :error-messages="fieldErrors.quote"
          @update:model-value="clearFieldError('quote')"
        />
      </div>
      <div>
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:photo" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Hero Image <span class="text-red-500">*</span>
        </div>

        <div
          class="mt-4 overflow-hidden rounded-xl border bg-neutral-50 transition"
          :class="fieldErrors.image ? 'border-red-500' : dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-200'"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <div class="relative">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Current hero image"
              class="aspect-[16/10] w-full object-cover"
            >
            <div v-else class="flex aspect-[16/10] flex-col items-center justify-center gap-3 px-6 text-center">
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
            <Icon :name="form.image ? 'heroicons:arrow-path' : 'heroicons:arrow-up-tray'" size="1.05rem" aria-hidden="true" />
            {{ form.image ? "Replace image" : "Upload image" }}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="sr-only"
              :disabled="uploading"
              @change="onImageChange"
            >
          </label>
          <button
            v-if="form.image"
            type="button"
            class="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            :disabled="uploading"
            @click="removeImage"
          >
            Remove
          </button>
        </div>
        <p v-if="fieldErrors.image" class="mt-2 text-sm text-red-600">{{ fieldErrors.image }}</p>
        <p v-else-if="uploadError" class="mt-2 text-sm text-red-700">{{ uploadError }}</p>
        <p v-else class="mt-2 text-xs text-neutral-500">Shown full-width behind the homepage headline.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { GET_API, NEW_POST_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const form = reactive({
  name: "",
  headline: "",
  body: "",
  quote: "",
  quoteAuthor: "",
  image: "",
  file_path: "",
  uuid: "",
})
const fieldErrors = reactive<Record<string, string>>({})
const preview = ref("")
const uploading = ref(false)
const loadingPercent = ref(0)
const uploadError = ref("")
const dragOver = ref(false)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const base = storageUrl.replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

const imagePreview = computed(() => preview.value || storageSrc(form.file_path || form.image))

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function readUploadError(error: unknown) {
  const response = error as { response?: { data?: { message?: unknown } } }
  const message = response.response?.data?.message
  return typeof message === "string" && message ? message : "The image could not be uploaded."
}

function readFilePath(response: { data?: { data?: unknown } }) {
  const path = response.data?.data
  return typeof path === "string" ? path : ""
}

function readPreview(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = typeof reader.result === "string" ? reader.result : ""
  }
  reader.readAsDataURL(file)
}

function onImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) uploadFileInChunks(file)
}

async function uploadFileInChunks(file: File) {
  uploadError.value = ""
  uploading.value = true
  loadingPercent.value = 0
  readPreview(file)

  const chunkSize = 1024 * 1024 * 5
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize))
  const name = file.name.replace(/\.[^/.]+$/, "")

  try {
    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      const filePath = await uploadChunk(chunk, index, totalChunks, name, file.name)
      loadingPercent.value = ((index + 1) / totalChunks) * 100
      if (index + 1 === totalChunks) {
        if (!filePath) throw new Error("The uploaded image path was not returned.")
        form.file_path = filePath
        form.image = filePath
        preview.value = ""
        clearFieldError("image")
        toast("success", "Image uploaded.")
      }
    }
  }
  catch (error) {
    preview.value = ""
    uploadError.value = error instanceof Error && error.message.startsWith("The uploaded")
      ? error.message
      : readUploadError(error)
  }
  finally {
    uploading.value = false
  }
}

function uploadChunk(chunk: Blob, index: number, totalChunks: number, name: string, filename: string) {
  const fileData = new FormData()
  fileData.append("file", chunk, filename)
  fileData.append("index", String(index + 1))
  fileData.append("total", String(totalChunks))
  fileData.append("folder_name", "banners")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then(response => readFilePath(response))
}

function removeImage() {
  form.image = ""
  form.file_path = ""
  preview.value = ""
  uploadError.value = ""
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

function getBannerData() {
  GET_API({
    api: "heroes",
  }).then((res) => {
    const record = res.data.data?.[0]
    if (!record) return
    Object.assign(form, record)
    form.uuid = typeof record.uuid === "string" ? record.uuid : ""
    const path = record.file_path || record.filepath || record.image || ""
    if (typeof path === "string") {
      form.file_path = path
      form.image = path
    }
  })
}

function applyApiErrors(data: { message?: unknown, errors?: Record<string, string[] | string> } | undefined) {
  clearFieldErrors()
  const errors = data?.errors
  if (errors) {
    for (const [key, value] of Object.entries(errors)) {
      const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
      if (typeof message === "string" && key in form) fieldErrors[key] = message
    }
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The banner could not be saved."
}

function SubmitBanner() {
  clearFieldErrors()
  if (!form.uuid) {
    toast("error", "The banner could not be updated.")
    return
  }
  const payload = {
    name: form.name,
    headline: form.headline,
    body: form.body,
    quote: form.quote,
    image: form.file_path || form.image,
    file_path: form.file_path,
  }
  PATCH_API({
    api: `heroes/${form.uuid}`,
    ...payload,
  })
    .then((response) => {
      const data = response.data as { message?: unknown, errors?: Record<string, string[] | string> } | undefined
      if (data?.errors) {
        toast("error", applyApiErrors(data))
        return
      }
      toast("success", "Banner saved.")
    })
    .catch((error: { response?: { data?: { message?: unknown, errors?: Record<string, string[] | string> } } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
}

onMounted(() => {
  getBannerData()
})
</script>
