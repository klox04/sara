<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:photo" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Banner</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the Public Service page banner such as title, subtitle, and banner images.
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
      </div>

      <div>
        <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:photo" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Banner Images <span class="text-red-500">*</span>
        </div>
        <p class="mt-2 text-xs text-neutral-500">
          Shown as a collage beside the Public Service page headline: the main image on the left, the second and third images stacked on the right.
        </p>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <div v-for="slot in imageSlots" :key="slot.key" :class="slot.key === 'file_path' ? 'col-span-2' : ''">
            <p class="text-sm font-semibold" :class="fieldErrors[slot.key] ? 'text-red-700' : 'text-neutral-900'">
              {{ slot.label }} <span class="text-red-500">*</span>
            </p>
            <div
              class="mt-2 overflow-hidden rounded-xl border bg-neutral-50 transition"
              :class="fieldErrors[slot.key] ? 'border-red-500' : images[slot.key].dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-200'"
              @dragover.prevent="images[slot.key].dragOver = true"
              @dragleave.prevent="onDragLeave($event, slot.key)"
              @drop.prevent="onDrop($event, slot.key)"
            >
              <div class="relative">
                <img
                  v-if="imagePreview(slot.key)"
                  :src="imagePreview(slot.key)"
                  :alt="`${slot.label} for the Public Service banner`"
                  class="w-full object-cover"
                  :class="slot.aspect"
                >
                <div v-else class="flex flex-col items-center justify-center gap-2 px-4 text-center" :class="slot.aspect">
                  <span class="inline-flex size-11 items-center justify-center rounded-full bg-[#e7f6ec] text-[#1f7a4d]">
                    <Icon name="heroicons:cloud-arrow-up" size="1.35rem" aria-hidden="true" />
                  </span>
                  <span>
                    <span class="block text-sm font-semibold text-neutral-900">Drop an image here</span>
                    <span class="mt-0.5 block text-xs text-neutral-500">JPG, PNG, WEBP, or GIF</span>
                  </span>
                </div>
                <div
                  v-if="images[slot.key].uploading"
                  class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 px-4 text-sm font-medium text-neutral-800"
                >
                  <span>Uploading… {{ Math.round(images[slot.key].percent) }}%</span>
                  <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                    <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${images[slot.key].percent}%` }" />
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-2 flex gap-2">
              <label
                class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#1f7a4d] bg-white px-3 py-2 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
              >
                <Icon :name="form[slot.key] ? 'heroicons:arrow-path' : 'heroicons:arrow-up-tray'" size="1rem" aria-hidden="true" />
                {{ form[slot.key] ? "Replace" : "Upload" }}
                <input
                  type="file"
                  :accept="imageAccept"
                  class="sr-only"
                  :disabled="images[slot.key].uploading"
                  @change="onImageChange($event, slot.key)"
                >
              </label>
              <button
                v-if="form[slot.key]"
                type="button"
                class="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                :disabled="images[slot.key].uploading"
                @click="removeImage(slot.key)"
              >
                Remove
              </button>
            </div>
            <p v-if="fieldErrors[slot.key]" class="mt-1 text-sm text-red-600">{{ fieldErrors[slot.key] }}</p>
            <p v-else-if="images[slot.key].error" class="mt-1 text-sm text-red-700">{{ images[slot.key].error }}</p>
          </div>
        </div>
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

type ImageKey = "file_path" | "second_file_path" | "third_file_path"

type ImageState = {
  preview: string
  uploading: boolean
  percent: number
  error: string
  dragOver: boolean
}

const imageSlots: { key: ImageKey, label: string, required: string, aspect: string }[] = [
  { key: "file_path", label: "Main Image", required: "Main image is required.", aspect: "aspect-[16/9]" },
  { key: "second_file_path", label: "Second Image", required: "Second image is required.", aspect: "aspect-[4/3]" },
  { key: "third_file_path", label: "Third Image", required: "Third image is required.", aspect: "aspect-[4/3]" },
]

function emptyImageState(): ImageState {
  return { preview: "", uploading: false, percent: 0, error: "", dragOver: false }
}

const form = reactive({
  uuid: "",
  title: "",
  subtitle: "",
  file_path: "",
  second_file_path: "",
  third_file_path: "",
})
const images = reactive<Record<ImageKey, ImageState>>({
  file_path: emptyImageState(),
  second_file_path: emptyImageState(),
  third_file_path: emptyImageState(),
})
const fieldErrors = reactive<Record<string, string>>({})
const saving = ref(false)
const uploading = computed(() => imageSlots.some(slot => images[slot.key].uploading))
const dirty = defineModel<boolean>("dirty", { default: false })

function snapshot() {
  return JSON.stringify({
    title: form.title,
    subtitle: form.subtitle,
    file_path: form.file_path,
    second_file_path: form.second_file_path,
    third_file_path: form.third_file_path,
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

function imagePreview(key: ImageKey) {
  return images[key].preview || storageSrc(form[key])
}

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

function readPreview(file: File, key: ImageKey) {
  const reader = new FileReader()
  reader.onload = () => {
    if (images[key].uploading) images[key].preview = typeof reader.result === "string" ? reader.result : ""
  }
  reader.readAsDataURL(file)
}

function uploadChunk(chunk: Blob, index: number, totalChunks: number, name: string, filename: string) {
  const fileData = new FormData()
  fileData.append("file", chunk, filename)
  fileData.append("index", String(index + 1))
  fileData.append("total", String(totalChunks))
  fileData.append("folder_name", "public-service-headers")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then((response: { data?: { data?: unknown } }) => readText(response.data?.data))
}

async function uploadFileInChunks(file: File, key: ImageKey) {
  const state = images[key]
  if (!imageTypes.includes(file.type)) {
    state.error = "Choose a JPG, PNG, WEBP, or GIF image."
    return
  }
  state.error = ""
  state.uploading = true
  state.percent = 0
  readPreview(file, key)

  const chunkSize = 1024 * 1024 * 5
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize))
  const name = file.name.replace(/\.[^/.]+$/, "")

  try {
    let filePath = ""
    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      filePath = await uploadChunk(file.slice(start, end), index, totalChunks, name, file.name)
      state.percent = ((index + 1) / totalChunks) * 100
    }
    if (!filePath) throw new Error("The uploaded file path was not returned.")
    form[key] = filePath
    clearFieldError(key)
    toast("success", "Image uploaded.")
  }
  catch (error) {
    state.error = readUploadError(error)
  }
  finally {
    state.preview = ""
    state.uploading = false
  }
}

function onImageChange(event: Event, key: ImageKey) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) uploadFileInChunks(file, key)
}

function onDragLeave(event: DragEvent, key: ImageKey) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && current.contains(next)) return
  images[key].dragOver = false
}

function onDrop(event: DragEvent, key: ImageKey) {
  images[key].dragOver = false
  if (images[key].uploading) return
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadFileInChunks(file, key)
}

function removeImage(key: ImageKey) {
  form[key] = ""
  images[key].preview = ""
  images[key].error = ""
}

function getBannerData() {
  GET_API({ api: "public-service-headers" }).then((response) => {
    const data = response.data?.data
    const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
    if (!record) return
    form.uuid = readText(record.uuid)
    form.title = readText(record.title)
    form.subtitle = readText(record.subtitle)
    form.file_path = readText(record.file_path)
    form.second_file_path = readText(record.second_file_path)
    form.third_file_path = readText(record.third_file_path)
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
  for (const slot of imageSlots) {
    if (!form[slot.key]) fieldErrors[slot.key] = slot.required
  }
  if (Object.keys(fieldErrors).length) {
    toast("error", "Check the highlighted fields.")
    return
  }
  saving.value = true
  const payload = {
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    file_path: form.file_path,
    second_file_path: form.second_file_path,
    third_file_path: form.third_file_path,
  }
  PATCH_API({
    api: `public-service-headers/${form.uuid}`,
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
