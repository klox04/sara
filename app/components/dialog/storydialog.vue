<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      @click.self="closeDialog"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-story-title"
        class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 border-b border-neutral-200 px-6 py-5">
          <span class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
            <Icon name="heroicons:document-plus" size="1.35rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="add-story-title" class="text-xl font-bold text-neutral-900">{{ story ? "Edit Story" : "Add Story" }}</h2>
            <p class="mt-0.5 text-sm text-neutral-500">
              {{ story ? "Update the details for this story." : "Fill in the details to create a new story." }}
            </p>
          </div>
          <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
            @click="closeDialog"
          >
            <Icon name="heroicons:x-mark" size="1.15rem" />
          </button>
        </div>

        <form class="px-6 py-5" @submit.prevent="saveStory">
          <div>
            <span class="text-sm font-semibold" :class="fieldErrors.category ? 'text-red-700' : 'text-neutral-900'">
              Category <span class="text-red-500">*</span>
            </span>
            <div class="relative mt-2">
              <Icon name="heroicons:tag" size="1rem" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                v-model="form.category"
                class="w-full appearance-none rounded-md border bg-white py-2.5 pl-9 pr-8 text-sm outline-none"
                :class="fieldErrors.category ? 'border-red-500 text-red-900' : 'border-neutral-300 text-neutral-900 focus:border-[#1f7a4d]'"
                @change="clearFieldError('category')"
              >
                <option value="" disabled>Select category</option>
                <option v-for="category in categories" :key="category.uuid" :value="category.uuid">{{ category.name }}</option>
              </select>
              <Icon name="heroicons:chevron-down" size="1rem" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
            <span v-if="fieldErrors.category" class="mt-1 block text-sm text-red-600">{{ fieldErrors.category }}</span>
          </div>

          <div class="mt-5">
            <span class="text-sm font-semibold" :class="fieldErrors.title ? 'text-red-700' : 'text-neutral-900'">
              Title <span class="text-red-500">*</span>
            </span>
            <div class="relative mt-2">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">T</span>
              <input
                v-model="form.title"
                type="text"
                placeholder="Enter item title"
                class="w-full rounded-md border bg-white py-2.5 pl-9 pr-3 text-sm outline-none"
                :class="fieldErrors.title ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
                @input="clearFieldError('title')"
              >
            </div>
            <span v-if="fieldErrors.title" class="mt-1 block text-sm text-red-600">{{ fieldErrors.title }}</span>
          </div>

          <div class="mt-5">
            <span class="text-sm font-semibold" :class="fieldErrors.description ? 'text-red-700' : 'text-neutral-900'">
              Description <span class="text-red-500">*</span>
            </span>
            <div class="relative mt-2">
              <Icon name="heroicons:bars-3-bottom-left" size="1rem" class="pointer-events-none absolute left-3 top-3 text-neutral-400" />
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Write a short description about this item..."
                class="w-full rounded-md border bg-white py-2.5 pl-9 pr-3 text-sm outline-none"
                :class="fieldErrors.description ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1f7a4d]'"
                @input="clearFieldError('description')"
              />
            </div>
            <span v-if="fieldErrors.description" class="mt-1 block text-sm text-red-600">{{ fieldErrors.description }}</span>
          </div>

          <div class="mt-5">
            <span class="text-sm font-semibold" :class="fieldErrors.file ? 'text-red-700' : 'text-neutral-900'">
              Upload File <span class="text-red-500">*</span>
            </span>
            <div
              class="mt-2 rounded-lg border border-dashed bg-neutral-50 px-4 py-6 text-center"
              :class="fieldErrors.file ? 'border-red-500' : dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-300'"
              @dragover.prevent="dragOver = true"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Selected story file"
                class="mx-auto max-h-28 rounded-md object-contain"
              >
              <template v-else>
                <span class="inline-flex size-12 items-center justify-center text-[#1f7a4d]">
                  <Icon name="heroicons:cloud-arrow-up" size="2rem" aria-hidden="true" />
                </span>
                <span class="mt-2 block text-sm font-semibold text-neutral-900">
                  {{ fileName || "Drag and drop a file here, or click to browse" }}
                </span>
                <span class="mt-1 block text-xs text-neutral-500">Supported formats: JPG, PNG, PDF (Max 10 MB)</span>
              </template>
              <span
                v-if="uploading"
                class="mt-3 block text-sm font-medium text-neutral-800"
              >
                Uploading… {{ Math.round(loadingPercent) }}%
              </span>
              <button
                type="button"
                class="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f7a4d] bg-white px-4 py-1.5 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] disabled:opacity-60"
                :disabled="uploading"
                @click="fileInput?.click()"
              >
                <Icon name="heroicons:folder" size="1rem" aria-hidden="true" />
                Choose File
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
                class="sr-only"
                :disabled="uploading"
                @change="onFileChange"
              >
            </div>
            <span v-if="fieldErrors.file" class="mt-1 block text-sm text-red-600">{{ fieldErrors.file }}</span>
          </div>

          <div class="mt-5 flex items-center gap-3">
            <button
              type="button"
              role="switch"
              :aria-checked="form.active"
              class="relative h-6 w-11 rounded-full transition"
              :class="form.active ? 'bg-[#1f7a4d]' : 'bg-neutral-300'"
              @click="form.active = !form.active"
            >
              <span
                class="absolute top-0.5 size-5 rounded-full bg-white shadow transition-all"
                :class="form.active ? 'left-5' : 'left-0.5'"
              />
            </button>
            <span>
              <span class="block text-sm font-semibold text-neutral-900">Active</span>
              <span class="block text-xs text-neutral-500">Make this item visible in the system.</span>
            </span>
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              class="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              @click="closeDialog"
            >
              Cancel
            </button>
            <Button type="submit" icon="uil:save" :disabled="uploading">
              Save Story
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false })
const props = defineProps<{
  story?: {
    uuid: string
    category: string
    title: string
    description: string
    file: string
    active: boolean
  } | null
}>()
const emit = defineEmits<{
  saved: [story: {
    category: string
    categoryName: string
    title: string
    description: string
    file: string
    active: boolean
  }]
}>()

type Category = {
  uuid: string
  name: string
}

const categories = ref<Category[]>([])
const { NEW_POST_API, GET_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const maxFileBytes = 10 * 1024 * 1024
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]

const form = reactive({
  category: "",
  title: "",
  description: "",
  file: "",
  active: true,
})
const fieldErrors = reactive<Record<string, string>>({})
const uploading = ref(false)
const loadingPercent = ref(0)
const preview = ref("")
const fileName = ref("")
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  const base = storageUrl.replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

const imagePreview = computed(() => {
  const source = preview.value || form.file
  if (!source || source.toLowerCase().endsWith(".pdf")) return ""
  return storageSrc(source)
})

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function fillForm() {
  clearFieldErrors()
  preview.value = ""
  uploading.value = false
  loadingPercent.value = 0
  dragOver.value = false
  const story = props.story
  if (!story) {
    form.category = ""
    form.title = ""
    form.description = ""
    form.file = ""
    form.active = true
    fileName.value = ""
    return
  }
  form.category = story.category
  form.title = story.title
  form.description = story.description
  form.file = story.file
  form.active = story.active
  fileName.value = story.file.split("/").pop() || ""
}

function closeDialog() {
  if (uploading.value) return
  open.value = false
}

function readUploadError(error: unknown) {
  const response = error as { response?: { data?: { message?: unknown } } }
  const message = response.response?.data?.message
  return typeof message === "string" && message ? message : "The file could not be uploaded."
}

function readFilePath(response: { data?: { data?: unknown } }) {
  const path = response.data?.data
  return typeof path === "string" ? path : ""
}

function readPreview(file: File) {
  if (file.type === "application/pdf") {
    preview.value = ""
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = typeof reader.result === "string" ? reader.result : ""
  }
  reader.readAsDataURL(file)
}

function takeFile(file: File) {
  if (uploading.value) return
  const allowed = allowedTypes.includes(file.type) || /\.(jpe?g|png|pdf)$/i.test(file.name)
  if (!allowed) {
    fieldErrors.file = "Use a JPG, PNG, or PDF file."
    return
  }
  if (file.size > maxFileBytes) {
    fieldErrors.file = "File must be 10 MB or smaller."
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

async function uploadFileInChunks(file: File) {
  uploading.value = true
  loadingPercent.value = 0
  clearFieldError("file")
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
        if (!filePath) throw new Error("The uploaded file path was not returned.")
        form.file = filePath
        preview.value = ""
        clearFieldError("file")
        toast("success", "File uploaded.")
      }
    }
  }
  catch (error) {
    preview.value = ""
    form.file = ""
    fieldErrors.file = error instanceof Error && error.message.startsWith("The uploaded")
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
  fileData.append("folder_name", "stories")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then(response => readFilePath(response))
}
function getCategoryData() {
  GET_API({
    api: "categories",
  }).then((res) => {
    const rows = Array.isArray(res.data.data) ? res.data.data : []
    categories.value = rows.flatMap((row: Record<string, unknown>) => {
      const uuid = typeof row.uuid === "string" ? row.uuid : ""
      const name = typeof row.name === "string"
        ? row.name
        : typeof row.title === "string"
          ? row.title
          : typeof row.label === "string"
            ? row.label
            : ""
      if (!uuid) return []
      return [{ uuid, name: name || uuid }]
    })
  })
}
function saveStory() {
  if (uploading.value) return
  clearFieldErrors()
  if (!form.category) fieldErrors.category = "Category is required."
  if (!form.title.trim()) fieldErrors.title = "Title is required."
  if (!form.description.trim()) fieldErrors.description = "Description is required."
  if (!form.file) fieldErrors.file = "File is required."
  if (Object.keys(fieldErrors).length) return
  emit("saved", {
    category: form.category,
    categoryName: categories.value.find(item => item.uuid === form.category)?.name || "",
    title: form.title.trim(),
    description: form.description.trim(),
    file: form.file,
    active: form.active,
  })
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) closeDialog()
}

watch(open, (value) => {
  if (value) fillForm()
})

onMounted(() => {
  getCategoryData()
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
