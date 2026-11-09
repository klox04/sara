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
            <Icon name="heroicons:tag" size="1.35rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="category-dialog-title" class="text-xl font-bold text-neutral-900">{{ category ? "Edit Category" : "Add Category" }}</h2>
            <p class="mt-0.5 text-sm text-neutral-500">
              {{ category ? "Update the name of this story category." : "Create a new category for grouping stories." }}
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

        <form class="px-6 py-5" novalidate @submit.prevent="saveCategory">
          <Field
            v-model="name"
            label="Name"
            required
            placeholder="e.g. Education"
            :error-messages="fieldErrors.name"
            @update:model-value="clearFieldError('name')"
          />

          <div class="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              class="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              @click="closeDialog"
            >
              Cancel
            </button>
            <Button type="submit" icon="uil:save" :disabled="saving">
              Save Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const open = defineModel<boolean>("open", { default: false })
const props = defineProps<{
  category?: {
    id: string | number
    name: string
  } | null
}>()
const emit = defineEmits<{
  saved: []
}>()

const { POST_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()

const name = ref("")
const saving = ref(false)
const fieldErrors = reactive<Record<string, string>>({})

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function closeDialog() {
  if (saving.value) return
  open.value = false
}

function applyApiErrors(data: ApiErrorData | undefined) {
  const value = data?.errors?.name
  const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
  if (typeof message === "string" && message) {
    fieldErrors.name = message
    return message
  }
  if (typeof data?.message === "string" && data.message) return data.message
  return "The category could not be saved."
}

function saveCategory() {
  if (saving.value) return
  clearFieldError("name")
  const value = name.value.trim()
  if (!value) {
    fieldErrors.name = "Name is required."
    return
  }
  saving.value = true
  const request = props.category
    ? PATCH_API({ api: `categories/${props.category.id}`, name: value })
    : POST_API({ api: "categories", name: value })
  request
    .then(() => {
      toast("success", props.category ? "Category updated." : "Category saved.")
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
  name.value = props.category?.name ?? ""
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
