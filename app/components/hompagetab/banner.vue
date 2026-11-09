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

    <div class="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1fr)]">
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
              class="aspect-[16/7] w-full object-cover object-[center_28%] sm:aspect-[4/1]"
            >
            <div v-else class="flex aspect-[16/7] flex-col items-center justify-center gap-3 px-6 text-center sm:aspect-[4/1]">
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
            {{ form.image ? "Replace Image" : "Upload Image" }}
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

        <div class="mt-6 flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
          <Icon name="heroicons:play-circle" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
          Hero Video
          <span class="rounded-md bg-white/70 px-2 py-0.5 text-[11px] font-medium text-neutral-600">Optional</span>
        </div>

        <div class="mt-4">
          <div>
            <div
              class="relative overflow-hidden rounded-xl transition"
              :class="[
                videoSrc ? 'border bg-black' : 'border-2 border-dashed bg-neutral-50/80',
                fieldErrors.video_file_path || videoError
                  ? 'border-red-500'
                  : videoDragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-200',
              ]"
              @dragover.prevent="videoDragOver = true"
              @dragleave.prevent="onVideoDragLeave"
              @drop.prevent="onVideoDrop"
            >
              <video
                v-if="videoSrc"
                :key="videoSrc"
                :src="videoSrc"
                controls
                preload="metadata"
                class="aspect-video w-full object-contain"
              />
              <label
                v-else
                class="group flex min-h-40 cursor-pointer flex-col items-center justify-center px-5 py-6 text-center has-[:disabled]:cursor-not-allowed"
              >
                <span class="inline-flex size-9 items-center justify-center rounded-md border-2 border-neutral-800 text-neutral-800">
                  <Icon name="heroicons:play" size="1rem" aria-hidden="true" />
                </span>
                <span class="mt-3 text-[15px] font-semibold text-neutral-900">Upload a video</span>
                <span class="mt-1 text-xs text-neutral-500">Drag and drop a video file here, or click to browse</span>
                <span class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1f4d3a] px-4 py-2.5 text-sm font-medium text-white group-hover:bg-[#183d2e]">
                  <Icon name="heroicons:arrow-up-tray" size="1rem" aria-hidden="true" />
                  Choose Video
                </span>
                <input
                  type="file"
                  :accept="videoAccept"
                  class="sr-only"
                  :disabled="videoUploading"
                  @change="onVideoChange"
                >
              </label>
              <div
                v-if="videoUploading"
                class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 px-6 text-sm font-medium text-neutral-800"
              >
                <span>Uploading… {{ Math.round(videoPercent) }}%</span>
                <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                  <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${videoPercent}%` }" />
                </span>
              </div>
            </div>

            <div v-if="videoSrc" class="mt-3 flex gap-2">
              <label
                class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#1f7a4d] bg-white px-4 py-2.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
              >
                <Icon name="heroicons:arrow-path" size="1.05rem" aria-hidden="true" />
                Replace Video
                <input
                  type="file"
                  :accept="videoAccept"
                  class="sr-only"
                  :disabled="videoUploading"
                  @change="onVideoChange"
                >
              </label>
              <button
                type="button"
                class="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                :disabled="videoUploading"
                @click="removeVideo"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <p v-if="fieldErrors.video_file_path" class="mt-2 text-sm text-red-600">{{ fieldErrors.video_file_path }}</p>
        <p v-else-if="videoError" class="mt-2 text-sm text-red-700">{{ videoError }}</p>
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
  video_file_path: "",
  uuid: "",
})
const fieldErrors = reactive<Record<string, string>>({})
const preview = ref("")
const uploading = ref(false)
const loadingPercent = ref(0)
const uploadError = ref("")
const dragOver = ref(false)
const videoPreview = ref("")
const videoUploading = ref(false)
const videoPercent = ref(0)
const videoError = ref("")
const videoDragOver = ref(false)
const maxVideoMb = 200
const videoTypes = ["video/mp4", "video/webm", "video/quicktime"]
const videoAccept = videoTypes.join(",")

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const base = storageUrl.replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

const imagePreview = computed(() => preview.value || storageSrc(form.file_path || form.image))
const videoSrc = computed(() => videoPreview.value || storageSrc(form.video_file_path))

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function readUploadError(error: unknown, fallback = "The image could not be uploaded.") {
  if (error instanceof Error && error.message.startsWith("The uploaded")) return error.message
  const response = error as { response?: { data?: { message?: unknown } } }
  const message = response.response?.data?.message
  return typeof message === "string" && message ? message : fallback
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

async function uploadInChunks(file: File, onProgress: (percent: number) => void) {
  const chunkSize = 1024 * 1024 * 5
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize))
  const name = file.name.replace(/\.[^/.]+$/, "")
  let filePath = ""

  for (let index = 0; index < totalChunks; index++) {
    const start = index * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    filePath = await uploadChunk(file.slice(start, end), index, totalChunks, name, file.name)
    onProgress(((index + 1) / totalChunks) * 100)
  }

  if (!filePath) throw new Error("The uploaded file path was not returned.")
  return filePath
}

async function uploadFileInChunks(file: File) {
  uploadError.value = ""
  uploading.value = true
  loadingPercent.value = 0
  readPreview(file)

  try {
    const filePath = await uploadInChunks(file, (percent) => {
      loadingPercent.value = percent
    })
    form.file_path = filePath
    form.image = filePath
    preview.value = ""
    clearFieldError("image")
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

function clearVideoPreview() {
  if (videoPreview.value) URL.revokeObjectURL(videoPreview.value)
  videoPreview.value = ""
}

function onVideoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) uploadVideo(file)
}

function onVideoDragLeave(event: DragEvent) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && current.contains(next)) return
  videoDragOver.value = false
}

function onVideoDrop(event: DragEvent) {
  videoDragOver.value = false
  if (videoUploading.value) return
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadVideo(file)
}

async function uploadVideo(file: File) {
  if (!videoTypes.includes(file.type)) {
    videoError.value = "Choose an MP4, WebM, or MOV video."
    return
  }
  if (file.size > maxVideoMb * 1024 * 1024) {
    videoError.value = `The video must be ${maxVideoMb} MB or smaller.`
    return
  }
  videoError.value = ""
  videoUploading.value = true
  videoPercent.value = 0
  clearVideoPreview()
  videoPreview.value = URL.createObjectURL(file)

  try {
    form.video_file_path = await uploadInChunks(file, (percent) => {
      videoPercent.value = percent
    })
    clearFieldError("video_file_path")
    toast("success", "Video uploaded.")
  }
  catch (error) {
    clearVideoPreview()
    videoError.value = readUploadError(error, "The video could not be uploaded.")
  }
  finally {
    videoUploading.value = false
  }
}

function removeVideo() {
  clearVideoPreview()
  form.video_file_path = ""
  videoError.value = ""
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
    form.video_file_path = typeof record.video_file_path === "string" ? record.video_file_path : ""
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
    video_file_path: form.video_file_path || null,
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

onBeforeUnmount(() => {
  clearVideoPreview()
})
</script>
