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
        aria-labelledby="add-milestone-title"
        class="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-center gap-3 border-b border-neutral-200 px-6 py-5">
          <Icon name="heroicons:square-3-stack-3d" size="1.35rem" class="shrink-0 text-[#1f7a4d]" aria-hidden="true" />
          <h2 id="add-milestone-title" class="min-w-0 flex-1 text-xl font-bold text-neutral-900">
            {{ milestone ? "Edit Milestone" : "Add Milestone" }}
          </h2>
          <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
            @click="closeDialog"
          >
            <Icon name="heroicons:x-mark" size="1.15rem" />
          </button>
        </div>

        <form class="px-6 py-5" @submit.prevent="saveMilestone">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <span class="text-sm font-semibold" :class="fieldErrors.year ? 'text-red-700' : 'text-neutral-800'">
                Year <span class="text-red-500">*</span>
              </span>
              <select
                v-model="form.year"
                class="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none"
                :class="fieldErrors.year ? 'border-red-500 text-red-900' : 'border-neutral-300 text-neutral-900 focus:border-[#1f7a4d]'"
                @change="clearFieldError('year')"
              >
                <option value="" disabled>Select year</option>
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
              <span v-if="fieldErrors.year" class="mt-1 block text-sm text-red-600">{{ fieldErrors.year }}</span>
            </div>
            <div v-if="form.for === 'about'">
              <p class="text-sm font-semibold" :class="fieldErrors.icon ? 'text-red-700' : 'text-neutral-800'">
                Icon <span class="text-red-500">*</span>
              </p>
              <button
                type="button"
                class="mt-2 flex w-full items-center gap-3 rounded-md border bg-white px-3 py-2 text-left text-sm"
                :class="fieldErrors.icon ? 'border-red-500 text-red-900' : 'border-neutral-300 text-neutral-800'"
                @click="openIconPicker"
              >
                <Icon v-if="form.icon" :name="form.icon" size="1.15rem" class="text-[#1f7a4d]" />
                <span :class="form.icon ? '' : 'text-neutral-400'">{{ form.icon || "Choose icon" }}</span>
                <Icon name="heroicons:chevron-down" size="1rem" class="ml-auto text-neutral-400" />
              </button>
              <span v-if="fieldErrors.icon" class="mt-1 block text-sm text-red-600">{{ fieldErrors.icon }}</span>
            </div>
            <div v-else>
              <span class="text-sm font-semibold" :class="fieldErrors.image ? 'text-red-700' : 'text-neutral-800'">
                Image <span class="text-red-500">*</span>
              </span>
              <label
                class="relative mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed bg-neutral-50 px-4 py-4 text-center"
                :class="[fieldErrors.image ? 'border-red-500' : 'border-neutral-300', uploading ? 'pointer-events-none' : '']"
              >
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Selected milestone image"
                  class="max-h-28 w-full rounded-md object-contain"
                >
                <template v-else-if="!uploading">
                  <span class="inline-flex size-9 items-center justify-center text-neutral-500">
                    <Icon name="heroicons:photo" size="1.35rem" aria-hidden="true" />
                  </span>
                  <span class="mt-1 text-sm font-semibold text-neutral-800">Click to upload image</span>
                  <span class="mt-0.5 text-xs text-neutral-500">JPG, PNG, or WebP (Max 5 MB)</span>
                </template>
                <span
                  v-if="uploading"
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 px-4 text-sm font-medium text-neutral-800"
                >
                  <span>Uploading… {{ Math.round(loadingPercent) }}%</span>
                  <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                    <span class="block h-full rounded-full bg-[#1f7a4d]" :style="{ width: `${loadingPercent}%` }" />
                  </span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="sr-only"
                  :disabled="uploading"
                  @change="onImageChange"
                >
              </label>
              <span v-if="fieldErrors.image" class="mt-1 block text-sm text-red-600">{{ fieldErrors.image }}</span>
            </div>
          </div>

          <div class="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              v-model="form.title"
              label="Government Position"
              required
              placeholder="e.g. Mayor"
              :error-messages="fieldErrors.title"
              @update:model-value="clearFieldError('title')"
            />
            <Field
              v-model="form.organization"
              label="Location"
              required
              placeholder="e.g. Davao City"
              :error-messages="fieldErrors.organization"
              @update:model-value="clearFieldError('organization')"
            />
          </div>

          <Field
            v-model="form.period"
            class="mt-5"
            label="Period Label"
            placeholder="Enter period label (e.g., 2016 – 2022)"
          />
          <Field
            v-model="form.description"
            class="mt-5"
            label="Description"
            type="textarea"
            :rows="3"
            required
            placeholder="Enter milestone description"
            :error-messages="fieldErrors.description"
            @update:model-value="clearFieldError('description')"
          />

          <div class="mt-5">
            <p id="milestone-for-label" class="text-sm font-semibold" :class="fieldErrors.for ? 'text-red-700' : 'text-neutral-800'">
              Show On <span class="text-red-500">*</span>
            </p>
            <div role="radiogroup" aria-labelledby="milestone-for-label" class="mt-3 grid gap-3 sm:grid-cols-2">
              <label
                v-for="option in forOptions"
                :key="option.value"
                class="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1f7a4d]/30"
                :class="form.for === option.value
                  ? 'border-[#1f7a4d] bg-[#e7f6ec]'
                  : fieldErrors.for ? 'border-red-500 hover:bg-neutral-50' : 'border-neutral-300 hover:bg-neutral-50'"
              >
                <input
                  v-model="form.for"
                  type="radio"
                  name="milestone-for"
                  :value="option.value"
                  class="sr-only"
                  @change="clearFieldError('for')"
                >
                <span
                  class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                  :class="form.for === option.value ? 'bg-[#1f7a4d] text-white' : 'bg-neutral-100 text-neutral-600'"
                >
                  <Icon :name="option.icon" size="1.1rem" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-semibold text-neutral-900">{{ option.label }}</span>
                  <span class="block text-xs text-neutral-500">{{ option.hint }}</span>
                </span>
                <Icon
                  v-if="form.for === option.value"
                  name="heroicons:check-circle-solid"
                  size="1.2rem"
                  class="shrink-0 text-[#1f7a4d]"
                  aria-hidden="true"
                />
              </label>
            </div>
            <span v-if="fieldErrors.for" class="mt-1 block text-sm text-red-600">{{ fieldErrors.for }}</span>
          </div>

          <div class="mt-5">
            <p class="text-sm font-semibold text-neutral-800">
              Active <span class="text-red-500">*</span>
            </p>
            <div class="mt-3 flex items-center gap-3">
              <button
                type="button"
                role="switch"
                :aria-checked="form.active"
                aria-label="Active"
                class="relative h-6 w-11 rounded-full transition"
                :class="form.active ? 'bg-[#1f7a4d]' : 'bg-neutral-300'"
                @click="form.active = !form.active"
              >
                <span
                  class="absolute top-0.5 size-5 rounded-full bg-white shadow transition-all"
                  :class="form.active ? 'left-5' : 'left-0.5'"
                />
              </button>
              <span class="text-sm text-neutral-800">{{ form.active ? "Active (visible on website)" : "Inactive (hidden from website)" }}</span>
            </div>
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
              Save Milestone
            </Button>
          </div>
        </form>
      </div>
    </div>
    <div
      v-if="iconPickerOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/40 p-4"
      @click.self="iconPickerOpen = false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-icon-title"
        class="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-center gap-3 border-b border-neutral-200 px-6 py-5">
          <h2 id="milestone-icon-title" class="min-w-0 flex-1 text-xl font-bold text-neutral-900">Choose Icon</h2>
          <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
            @click="iconPickerOpen = false"
          >
            <Icon name="heroicons:x-mark" size="1.15rem" />
          </button>
        </div>
        <div class="px-6 py-5">
          <input
            v-model="iconQuery"
            type="search"
            placeholder="Search icons"
            class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4d]"
          >
          <div class="mt-4 flex max-h-80 flex-wrap gap-2 overflow-y-auto overscroll-contain pr-1">
            <button
              v-for="icon in filteredIcons"
              :key="icon"
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d] hover:bg-[#d7f0e1]"
              :class="form.icon === icon ? 'ring-2 ring-[#1f7a4d]' : ''"
              :aria-label="icon"
              :aria-pressed="form.icon === icon"
              @click="chooseIcon(icon)"
            >
              <Icon :name="icon" size="1.25rem" />
            </button>
          </div>
          <p v-if="!filteredIcons.length" class="mt-3 text-sm text-neutral-500">No icons match that search.</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import programIcons from "~~/server/data/program-icons.json"

const open = defineModel<boolean>("open", { default: false })
const props = defineProps<{
  milestone?: {
    id: string | number
    year: string
    image: string
    icon: string
    title: string
    organization: string
    period: string
    description: string
    for: MilestoneFor | ""
    active: boolean
  } | null
}>()
const emit = defineEmits<{
  saved: [milestone: {
    id?: string | number
    year: string
    image: string
    icon: string
    title: string
    organization: string
    period: string
    description: string
    for: MilestoneFor
    active: boolean
  }]
}>()

type MilestoneFor = "home" | "about"

const forOptions: { value: MilestoneFor, label: string, hint: string, icon: string }[] = [
  { value: "home", label: "Home", hint: "Shown in Her Journey on the homepage.", icon: "heroicons:home" },
  { value: "about", label: "About", hint: "Shown on the About page.", icon: "heroicons:user" },
]

const { NEW_POST_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const maxImageBytes = 5 * 1024 * 1024
const uploading = ref(false)
const loadingPercent = ref(0)
const preview = ref("")
const iconPickerOpen = ref(false)
const iconQuery = ref("")
const form = reactive({
  year: "",
  image: "",
  icon: "",
  title: "",
  organization: "",
  period: "",
  description: "",
  for: "" as MilestoneFor | "",
  active: true,
})
const fieldErrors = reactive<Record<string, string>>({})

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  const base = storageUrl.replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

const imagePreview = computed(() => preview.value || storageSrc(form.image))

const filteredIcons = computed(() => {
  const term = iconQuery.value.trim().toLowerCase()
  if (!term) return programIcons
  return programIcons.filter(icon => icon.toLowerCase().includes(term))
})

function openIconPicker() {
  iconQuery.value = ""
  iconPickerOpen.value = true
}

function chooseIcon(icon: string) {
  form.icon = icon
  clearFieldError("icon")
  iconPickerOpen.value = false
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

const yearOptions = computed(() => {
  const end = new Date().getFullYear() + 5
  const years: string[] = []
  for (let year = end; year >= 1980; year--) years.push(String(year))
  if (form.year && !years.includes(form.year)) years.unshift(form.year)
  return years
})

function fillForm() {
  clearFieldErrors()
  preview.value = ""
  uploading.value = false
  loadingPercent.value = 0
  iconPickerOpen.value = false
  iconQuery.value = ""
  const milestone = props.milestone
  if (!milestone) {
    form.year = ""
    form.image = ""
    form.icon = ""
    form.title = ""
    form.organization = ""
    form.period = ""
    form.description = ""
    form.for = ""
    form.active = true
    return
  }
  form.year = milestone.year.replace(/\D/g, "").slice(0, 4)
  form.image = milestone.image
  form.icon = milestone.icon
  form.title = milestone.title
  form.organization = milestone.organization
  form.period = milestone.period
  form.description = milestone.description
  form.for = milestone.for
  form.active = milestone.active
}

function closeDialog() {
  if (uploading.value) return
  if (iconPickerOpen.value) {
    iconPickerOpen.value = false
    return
  }
  open.value = false
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
  if (!file || uploading.value) return
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    fieldErrors.image = "Use a JPG, PNG, or WebP image."
    return
  }
  if (file.size > maxImageBytes) {
    fieldErrors.image = "Image must be 5 MB or smaller."
    return
  }
  uploadFileInChunks(file)
}

async function uploadFileInChunks(file: File) {
  uploading.value = true
  loadingPercent.value = 0
  clearFieldError("image")
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
        form.image = filePath
        preview.value = ""
        clearFieldError("image")
        toast("success", "Image uploaded.")
      }
    }
  }
  catch (error) {
    preview.value = ""
    fieldErrors.image = error instanceof Error && error.message.startsWith("The uploaded")
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
  fileData.append("folder_name", "milestones")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then(response => readFilePath(response))
}

function saveMilestone() {
  if (uploading.value) return
  clearFieldErrors()
  if (!form.year.trim()) fieldErrors.year = "Year is required."
  if (form.for === "about" && !form.icon) fieldErrors.icon = "Icon is required."
  if (form.for !== "about" && !form.image) fieldErrors.image = "Image is required."
  if (!form.title.trim()) fieldErrors.title = "Government Position is required."
  if (!form.organization.trim()) fieldErrors.organization = "Location is required."
  if (!form.description.trim()) fieldErrors.description = "Description is required."
  if (!form.for) fieldErrors.for = "Choose where to show this milestone."
  if (Object.keys(fieldErrors).length || !form.for) return
  emit("saved", {
    id: props.milestone?.id,
    year: form.year.trim(),
    image: form.for === "about" ? "" : form.image,
    icon: form.for === "about" ? form.icon : "",
    title: form.title.trim(),
    organization: form.organization.trim(),
    period: form.period.trim(),
    description: form.description.trim(),
    for: form.for,
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
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
