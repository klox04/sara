<template>
  <section>
    <PageHeader
      title="Settings"
      description="Manage the site title and logos."
    />

    <div class="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
          <Icon name="heroicons:cog-6-tooth" size="1.4rem" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-semibold text-neutral-900">General</h2>
          <p class="mt-0.5 text-sm text-neutral-500">
            The title and logos used across the website.
          </p>
        </div>
        <Button type="button" icon="uil:save" :disabled="saving || uploading || loading" @click="submit">
          {{ saving ? "Saving…" : "Save Changes" }}
        </Button>
      </div>

      <div v-if="loading" class="animate-pulse space-y-6 p-5 sm:p-6" aria-busy="true">
        <div class="h-24 max-w-xl rounded-lg bg-neutral-100" />
        <div class="grid gap-5 md:grid-cols-2">
          <div v-for="index in 2" :key="index" class="h-44 rounded-lg bg-neutral-100" />
        </div>
      </div>

      <div v-else class="space-y-8 p-5 sm:p-6">
        <div class="space-y-5">
          <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
            <Icon name="heroicons:document-text" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
            Site Details
          </div>
          <Field
            v-model="form.title"
            class="max-w-xl"
            label="Title"
            placeholder="e.g. Sara Duterte"
            required
            :error-messages="fieldErrors.title"
            @update:model-value="clearFieldError('title')"
          />
        </div>

        <div>
          <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
            <Icon name="heroicons:photo" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
            Logos
          </div>
          <p class="mt-2 text-xs text-neutral-500">
            PNG, SVG, WEBP, or JPG · Max size: {{ maxFileMb }} MB each. Use transparent PNG or SVG files for the best result.
          </p>

          <div class="mt-4 grid gap-5 md:grid-cols-2">
            <div v-for="slot in logoSlots" :key="slot.key">
              <p class="text-sm font-semibold" :class="fieldErrors[slot.key] ? 'text-red-700' : 'text-neutral-900'">
                {{ slot.label }} <span v-if="slot.required" class="text-red-500">*</span>
              </p>
              <p class="mt-0.5 text-xs text-neutral-500">{{ slot.hint }}</p>

              <div
                class="relative mt-2 overflow-hidden rounded-xl border transition"
                :class="[
                  slot.dark ? 'bg-[#1d3b30]' : 'bg-neutral-50',
                  fieldErrors[slot.key] ? 'border-red-500' : uploads[slot.key].dragOver ? 'border-[#1f7a4d] ring-2 ring-[#1f7a4d]/20' : 'border-neutral-200',
                ]"
                @dragover.prevent="uploads[slot.key].dragOver = true"
                @dragleave.prevent="onDragLeave($event, slot.key)"
                @drop.prevent="onDrop($event, slot.key)"
              >
                <div
                  v-if="logoPreview(slot.key)"
                  class="flex h-44 items-center justify-center p-5"
                  :class="slot.dark ? 'bg-[#1d3b30]' : 'bg-white'"
                >
                  <img :src="logoPreview(slot.key)" :alt="slot.label" class="max-h-full max-w-full object-contain">
                </div>
                <label v-else class="flex h-44 cursor-pointer flex-col items-center justify-center gap-3 px-6 text-center">
                  <span
                    class="inline-flex size-12 items-center justify-center rounded-full"
                    :class="slot.dark ? 'bg-white/10 text-white' : 'bg-[#e7f6ec] text-[#1f7a4d]'"
                  >
                    <Icon name="heroicons:cloud-arrow-up" size="1.4rem" aria-hidden="true" />
                  </span>
                  <span class="text-sm font-semibold" :class="slot.dark ? 'text-white' : 'text-neutral-900'">Drop a logo here</span>
                  <input type="file" :accept="logoAccept" class="sr-only" :disabled="uploads[slot.key].uploading" @change="onFileChange($event, slot.key)">
                </label>
                <div
                  v-if="uploads[slot.key].uploading"
                  class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 px-6 text-sm font-medium text-neutral-800"
                >
                  <span>Uploading… {{ Math.round(uploads[slot.key].percent) }}%</span>
                  <span class="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
                    <span class="block h-full rounded-full bg-[#1f7a4d] transition-[width]" :style="{ width: `${uploads[slot.key].percent}%` }" />
                  </span>
                </div>
              </div>

              <div class="mt-3 flex gap-2">
                <label
                  class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#1f7a4d] bg-white px-3 py-2 text-sm font-medium text-[#1f7a4d] hover:bg-[#e7f6ec] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                >
                  <Icon :name="form[slot.key] ? 'heroicons:arrow-path' : 'heroicons:arrow-up-tray'" size="1rem" aria-hidden="true" />
                  {{ form[slot.key] ? "Replace" : "Upload" }}
                  <input type="file" :accept="logoAccept" class="sr-only" :disabled="uploads[slot.key].uploading" @change="onFileChange($event, slot.key)">
                </label>
                <button
                  v-if="form[slot.key]"
                  type="button"
                  class="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                  :disabled="uploads[slot.key].uploading"
                  @click="removeLogo(slot.key)"
                >
                  Remove
                </button>
              </div>
              <p v-if="fieldErrors[slot.key]" class="mt-1 text-sm text-red-600">{{ fieldErrors[slot.key] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DiscardDialog
      v-model:open="discardOpen"
      @confirm="settleDiscard(true)"
      @cancel="settleDiscard(false)"
    />
  </section>
</template>

<script setup lang="ts">
import DiscardDialog from "~/components/dialog/discarddialog.vue"

type LogoKey = "light_logo" | "dark_logo"

type SettingsForm = {
  title: string
} & Record<LogoKey, string>

type UploadState = {
  preview: string
  uploading: boolean
  percent: number
  dragOver: boolean
}

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const { GET_API, PATCH_API, NEW_POST_API } = useGlobalStore()
const { toast } = useToast()
const { settings: siteSettings } = useSiteSettings()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const maxFileMb = 10
const logoTypes = ["image/png", "image/svg+xml", "image/webp", "image/jpeg"]
const logoExtensions = /\.(png|svg|webp|jpe?g)$/i
const logoAccept = `${logoTypes.join(",")},.png,.svg,.webp,.jpg,.jpeg`

const logoSlots: { key: LogoKey, label: string, hint: string, required: boolean, dark: boolean }[] = [
  { key: "light_logo", label: "Light Logo", hint: "For light backgrounds. Used as the site icon in light mode.", required: false, dark: false },
  { key: "dark_logo", label: "Dark Logo", hint: "For dark backgrounds. Used as the site icon in dark mode.", required: false, dark: true },
]

function emptyUpload(): UploadState {
  return { preview: "", uploading: false, percent: 0, dragOver: false }
}

const form = reactive<SettingsForm>({ title: "", light_logo: "", dark_logo: "" })
const uploads = reactive<Record<LogoKey, UploadState>>({
  light_logo: emptyUpload(),
  dark_logo: emptyUpload(),
})
const settingsId = ref("")
const fieldErrors = reactive<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)
const discardOpen = ref(false)
let resolveDiscard: ((discard: boolean) => void) | null = null

const uploading = computed(() => logoSlots.some(slot => uploads[slot.key].uploading))

function snapshot() {
  return JSON.stringify(form)
}

const savedState = ref(snapshot())
const dirty = computed(() => snapshot() !== savedState.value)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path}`
}

function logoPreview(key: LogoKey) {
  return uploads[key].preview || storageSrc(form[key])
}

async function loadSettings() {
  const response = await GET_API({ api: "settings" })
  const settings = readSiteSettings(response.data?.data)
  settingsId.value = settings.uuid
  Object.assign(form, {
    title: settings.title,
    light_logo: settings.lightLogo,
    dark_logo: settings.darkLogo,
  })
}

async function saveSettings() {
  await PATCH_API({
    api: `settings/${settingsId.value}`,
    title: form.title,
    light_logo: form.light_logo || null,
    dark_logo: form.dark_logo || null,
  })
  siteSettings.value = {
    title: form.title,
    lightLogo: form.light_logo,
    darkLogo: form.dark_logo,
  }
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const [key, value] of Object.entries(data?.errors ?? {})) {
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    if (typeof message !== "string") continue
    if (key === "title" || key === "light_logo" || key === "dark_logo") fieldErrors[key] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The settings could not be saved."
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function readUploadError(error: unknown) {
  if (error instanceof Error && error.message.startsWith("The uploaded")) return error.message
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message
  return typeof message === "string" && message ? message : "The logo could not be uploaded."
}

function uploadChunk(chunk: Blob, index: number, totalChunks: number, name: string, filename: string) {
  const fileData = new FormData()
  fileData.append("file", chunk, filename)
  fileData.append("index", String(index + 1))
  fileData.append("total", String(totalChunks))
  fileData.append("folder_name", "settings")
  fileData.append("filename", name)
  return NEW_POST_API({
    api: "uploads/file",
    data: fileData,
  }).then((response: { data?: { data?: unknown } }) => (typeof response.data?.data === "string" ? response.data.data : ""))
}

async function uploadLogo(file: File, key: LogoKey) {
  if (!logoTypes.includes(file.type) && !logoExtensions.test(file.name)) {
    fieldErrors[key] = "Use a PNG, SVG, WEBP, or JPG image."
    return
  }
  if (file.size > maxFileMb * 1024 * 1024) {
    fieldErrors[key] = `The logo must be ${maxFileMb} MB or smaller.`
    return
  }
  const state = uploads[key]
  clearFieldError(key)
  state.uploading = true
  state.percent = 0
  if (state.preview) URL.revokeObjectURL(state.preview)
  state.preview = URL.createObjectURL(file)

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
    toast("success", "Logo uploaded.")
  }
  catch (error) {
    fieldErrors[key] = readUploadError(error)
  }
  finally {
    if (state.preview) URL.revokeObjectURL(state.preview)
    state.preview = ""
    state.uploading = false
  }
}

function onFileChange(event: Event, key: LogoKey) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (file) uploadLogo(file, key)
}

function onDragLeave(event: DragEvent, key: LogoKey) {
  const current = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && current.contains(next)) return
  uploads[key].dragOver = false
}

function onDrop(event: DragEvent, key: LogoKey) {
  uploads[key].dragOver = false
  if (uploads[key].uploading) return
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadLogo(file, key)
}

function removeLogo(key: LogoKey) {
  form[key] = ""
  clearFieldError(key)
}

async function submit() {
  if (saving.value || uploading.value) return
  if (!settingsId.value) {
    toast("error", "The settings could not be updated.")
    return
  }
  if (!form.title.trim()) fieldErrors.title = "Title is required."
  for (const slot of logoSlots) {
    if (slot.required && !form[slot.key]) fieldErrors[slot.key] = `${slot.label} is required.`
  }
  if (Object.keys(fieldErrors).length) {
    toast("error", "Check the highlighted fields.")
    return
  }
  saving.value = true
  try {
    form.title = form.title.trim()
    await saveSettings()
    savedState.value = snapshot()
    toast("success", "Settings saved.")
  }
  catch (error) {
    toast("error", applyApiErrors((error as { response?: { data?: ApiErrorData } }).response?.data))
  }
  finally {
    saving.value = false
  }
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

onMounted(async () => {
  window.addEventListener("beforeunload", warnBeforeUnload)
  try {
    await loadSettings()
  }
  catch {
    toast("error", "The settings could not be loaded.")
  }
  finally {
    savedState.value = snapshot()
    loading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", warnBeforeUnload)
  for (const slot of logoSlots) {
    if (uploads[slot.key].preview) URL.revokeObjectURL(uploads[slot.key].preview)
  }
})
</script>
