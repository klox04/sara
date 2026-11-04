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
        aria-labelledby="add-program-title"
        class="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 border-b border-neutral-200 px-6 py-5">
          <span class="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#e7f6ec] text-[#1f7a4d]">
            <Icon name="heroicons:square-3-stack-3d" size="1.4rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="add-program-title" class="text-xl font-bold text-neutral-900">{{ program ? "Edit Program" : "Add Program" }}</h2>
            <p class="mt-0.5 text-sm text-neutral-500">
              {{ program ? "Update this program item on the homepage." : "Create a new program item to display on the homepage." }}
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

        <form class="px-6 py-5" @submit.prevent="saveProgram">
          <div>
            <p class="text-sm font-semibold" :class="fieldErrors.icon ? 'text-red-700' : 'text-neutral-900'">
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
            <p v-if="fieldErrors.icon" class="mt-1 text-sm text-red-600">{{ fieldErrors.icon }}</p>
          </div>

          <Field
            v-model="form.title"
            class="mt-5"
            label="Title"
            required
            placeholder="Enter program title"
            :error-messages="fieldErrors.title"
            @update:model-value="clearFieldError('title')"
          />
          <Field
            v-model="form.description"
            class="mt-5"
            label="Description"
            type="textarea"
            :rows="3"
            required
            placeholder="Enter program description"
            :error-messages="fieldErrors.description"
            @update:model-value="clearFieldError('description')"
          />

          <div class="mt-6">
            <p class="text-sm font-semibold text-neutral-900">
              Is Active <span class="text-red-500">*</span>
            </p>
            <div class="mt-3 flex items-center gap-3">
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
                <span class="block text-sm font-semibold text-neutral-900">{{ form.active ? "Active" : "Inactive" }}</span>
                <span class="block text-xs text-neutral-500">Show this program on the homepage.</span>
              </span>
            </div>
            <p v-if="fieldErrors.is_active" class="mt-2 text-sm text-red-600">{{ fieldErrors.is_active }}</p>
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              class="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              @click="closeDialog"
            >
              Cancel
            </button>
            <Button type="submit" icon="uil:save" :disabled="saving">
              Save Program
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
        aria-labelledby="choose-icon-title"
        class="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-center gap-3 border-b border-neutral-200 px-6 py-5">
          <h2 id="choose-icon-title" class="min-w-0 flex-1 text-xl font-bold text-neutral-900">Choose Icon</h2>
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
  program?: {
    id: string | number
    title: string
    description: string
    icon: string
    active: boolean
  } | null
}>()
const emit = defineEmits<{
  saved: []
}>()

const { POST_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()

const saving = ref(false)
const iconPickerOpen = ref(false)
const iconQuery = ref("")
const form = reactive({
  title: "",
  description: "",
  icon: "",
  active: false,
})
const fieldErrors = reactive<Record<string, string>>({})
const filteredIcons = computed(() => {
  const term = iconQuery.value.trim().toLowerCase()
  if (!term) return programIcons
  return programIcons.filter(icon => icon.toLowerCase().includes(term))
})

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function fillForm() {
  iconQuery.value = ""
  iconPickerOpen.value = false
  clearFieldErrors()
  const program = props.program
  if (!program) {
    form.title = ""
    form.description = ""
    form.icon = ""
    form.active = true
    return
  }
  form.title = program.title
  form.description = program.description
  form.icon = program.icon
  form.active = program.active
}

function closeDialog() {
  if (saving.value) return
  if (iconPickerOpen.value) {
    iconPickerOpen.value = false
    return
  }
  open.value = false
}

function openIconPicker() {
  iconQuery.value = ""
  iconPickerOpen.value = true
}

function chooseIcon(icon: string) {
  form.icon = icon
  clearFieldError("icon")
  iconPickerOpen.value = false
}

function applyApiErrors(data: { message?: unknown, errors?: Record<string, string[] | string> } | undefined) {
  clearFieldErrors()
  const errors = data?.errors
  if (errors) {
    for (const [key, value] of Object.entries(errors)) {
      const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
      if (typeof message === "string") fieldErrors[key] = message
    }
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The program could not be saved."
}

function saveProgram() {
  saving.value = true
  const payload = {
    title: form.title.trim().toUpperCase(),
    description: form.description,
    icon: form.icon,
    is_active: form.active,
  }
  const request = props.program
    ? PATCH_API({ api: `priorities/${props.program.id}`, ...payload })
    : POST_API({ api: "priorities", ...payload })
  request
    .then((response) => {
      const data = response.data as { message?: unknown, errors?: Record<string, string[] | string> } | undefined
      if (data?.errors) {
        toast("error", applyApiErrors(data))
        return
      }
      toast("success", props.program ? "Program updated." : "Program saved.")
      open.value = false
      emit("saved")
    })
    .catch((error: { response?: { data?: { message?: unknown, errors?: Record<string, string[] | string> } } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
    .finally(() => {
      saving.value = false
    })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeDialog()
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
