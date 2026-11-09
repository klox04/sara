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
        aria-labelledby="initiative-dialog-title"
        class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 border-b border-neutral-200 px-6 py-5">
          <span class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
            <Icon name="heroicons:light-bulb" size="1.35rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="initiative-dialog-title" class="text-xl font-bold text-neutral-900">{{ initiative ? "Edit Initiative" : "Add Initiative" }}</h2>
            <p class="mt-0.5 text-sm text-neutral-500">
              {{ initiative ? "Update the name and icon of this initiative." : "Create a new initiative with a name and icon." }}
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

        <form class="px-6 py-5" novalidate @submit.prevent="saveInitiative">
          <Field
            v-model="form.name"
            label="Name"
            required
            placeholder="e.g. Education"
            :error-messages="fieldErrors.name"
            @update:model-value="clearFieldError('name')"
          />

          <div class="mt-5">
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
              Save Initiative
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
        aria-labelledby="initiative-icon-title"
        class="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-center gap-3 border-b border-neutral-200 px-6 py-5">
          <h2 id="initiative-icon-title" class="min-w-0 flex-1 text-xl font-bold text-neutral-900">Choose Icon</h2>
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
import { initiativeIcon } from "~~/shared/initiatives"

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const open = defineModel<boolean>("open", { default: false })
const props = defineProps<{
  initiative?: {
    id: string | number
    name: string
    iconKey: string
  } | null
}>()
const emit = defineEmits<{
  saved: []
}>()

const { POST_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()

const form = reactive({ name: "", icon: "" })
const saving = ref(false)
const fieldErrors = reactive<Record<string, string>>({})

const iconPickerOpen = ref(false)
const iconQuery = ref("")
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
  return "The initiative could not be saved."
}

function saveInitiative() {
  if (saving.value) return
  clearFieldErrors()
  const name = form.name.trim()
  if (!name) fieldErrors.name = "Name is required."
  if (!form.icon) fieldErrors.icon = "Choose an icon."
  if (Object.keys(fieldErrors).length) return
  saving.value = true
  const payload = { name, icon: form.icon }
  const request = props.initiative
    ? PATCH_API({ api: `initiatives/${props.initiative.id}`, ...payload })
    : POST_API({ api: "initiatives", ...payload })
  request
    .then(() => {
      toast("success", props.initiative ? "Initiative updated." : "Initiative saved.")
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
  clearFieldErrors()
  iconPickerOpen.value = false
  iconQuery.value = ""
  const iconKey = props.initiative?.iconKey ?? ""
  form.name = props.initiative?.name ?? ""
  form.icon = iconKey ? initiativeIcon(iconKey) : ""
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
