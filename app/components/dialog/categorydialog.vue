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
        aria-labelledby="category-dialog-title"
        class="w-full max-w-md rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 border-b border-neutral-200 px-6 py-5">
          <span class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
            <Icon :name="headerIcon" size="1.35rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="category-dialog-title" class="text-xl font-bold text-neutral-900">{{ category ? `Edit ${noun}` : `Add ${noun}` }}</h2>
            <p class="mt-0.5 text-sm text-neutral-500">{{ hint }}</p>
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

        <form class="px-6 py-5" novalidate @submit.prevent="saveCategory">
          <Field
            v-model="name"
            label="Name"
            required
            :placeholder="placeholder"
            :error-messages="fieldErrors.name"
            @update:model-value="clearFieldError('name')"
          />

          <div v-if="withIcon" class="mt-5">
            <p class="text-sm font-semibold" :class="fieldErrors.icon ? 'text-red-700' : 'text-neutral-900'">
              Icon <span class="text-red-500">*</span>
            </p>
            <button
              type="button"
              class="mt-2 flex w-full items-center gap-3 rounded-md border bg-white px-3 py-2 text-left text-sm"
              :class="fieldErrors.icon ? 'border-red-500 text-red-900' : 'border-neutral-300 text-neutral-800'"
              @click="openIconPicker"
            >
              <Icon v-if="icon" :name="icon" size="1.15rem" class="text-[#1f7a4d]" />
              <span :class="icon ? '' : 'text-neutral-400'">{{ icon || "Choose icon" }}</span>
              <Icon name="heroicons:chevron-down" size="1rem" class="ml-auto text-neutral-400" />
            </button>
            <span v-if="fieldErrors.icon" class="mt-1 block text-sm text-red-600">{{ fieldErrors.icon }}</span>
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
              Save {{ noun }}
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
        aria-labelledby="category-icon-title"
        class="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-center gap-3 border-b border-neutral-200 px-6 py-5">
          <h2 id="category-icon-title" class="min-w-0 flex-1 text-xl font-bold text-neutral-900">Choose Icon</h2>
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
              v-for="item in filteredIcons"
              :key="item"
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d] hover:bg-[#d7f0e1]"
              :class="icon === item ? 'ring-2 ring-[#1f7a4d]' : ''"
              :aria-label="item"
              :aria-pressed="icon === item"
              @click="chooseIcon(item)"
            >
              <Icon :name="item" size="1.25rem" />
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

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const open = defineModel<boolean>("open", { default: false })
const props = withDefaults(defineProps<{
  category?: {
    id: string | number
    name: string
    icon?: string
  } | null
  api?: string
  subject?: string
  placeholder?: string
  withIcon?: boolean
  noun?: string
  headerIcon?: string
  addHint?: string
  editHint?: string
}>(), {
  category: null,
  api: "categories",
  subject: "story",
  placeholder: "e.g. Education",
  withIcon: false,
  noun: "Category",
  headerIcon: "heroicons:tag",
  addHint: "",
  editHint: "",
})

const hint = computed(() => {
  if (props.category) return props.editHint || `Update the name of this ${props.subject} category.`
  return props.addHint || `Create a new category for grouping ${props.subject === "story" ? "stories" : `${props.subject}s`}.`
})
const emit = defineEmits<{
  saved: []
}>()

const { POST_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()

const name = ref("")
const icon = ref("")
const saving = ref(false)
const fieldErrors = reactive<Record<string, string>>({})
const iconPickerOpen = ref(false)
const iconQuery = ref("")

const filteredIcons = computed(() => {
  const term = iconQuery.value.trim().toLowerCase()
  if (!term) return programIcons
  return programIcons.filter(item => item.toLowerCase().includes(term))
})

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function openIconPicker() {
  iconQuery.value = ""
  iconPickerOpen.value = true
}

function chooseIcon(value: string) {
  icon.value = value
  clearFieldError("icon")
  iconPickerOpen.value = false
}

function closeDialog() {
  if (saving.value) return
  if (iconPickerOpen.value) {
    iconPickerOpen.value = false
    return
  }
  open.value = false
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const key of ["name", "icon"]) {
    const value = data?.errors?.[key]
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    if (typeof message === "string" && message) fieldErrors[key] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return `The ${props.noun.toLowerCase()} could not be saved.`
}

function saveCategory() {
  if (saving.value) return
  clearFieldError("name")
  clearFieldError("icon")
  const value = name.value.trim()
  if (!value) fieldErrors.name = "Name is required."
  if (props.withIcon && !icon.value) fieldErrors.icon = "Icon is required."
  if (fieldErrors.name || fieldErrors.icon) return
  saving.value = true
  const payload = props.withIcon ? { name: value, icon: icon.value } : { name: value }
  const request = props.category
    ? PATCH_API({ api: `${props.api}/${props.category.id}`, ...payload })
    : POST_API({ api: props.api, ...payload })
  request
    .then(() => {
      toast("success", props.category ? `${props.noun} updated.` : `${props.noun} saved.`)
      saving.value = false
      open.value = false
      emit("saved")
    })
    .catch((error: { response?: { data?: ApiErrorData } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
    .finally(() => {
      saving.value = false
    })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) closeDialog()
}

watch(open, (value) => {
  if (!value) return
  clearFieldError("name")
  clearFieldError("icon")
  iconPickerOpen.value = false
  name.value = props.category?.name ?? ""
  icon.value = props.category?.icon ?? ""
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
