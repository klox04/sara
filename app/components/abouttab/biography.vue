<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:document-text" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Biography</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the biography text that appears on the About page.
        </p>
      </div>
      <Button type="button" icon="uil:save" :disabled="saving" @click="submitBiography">
        Save Changes
      </Button>
    </div>

    <div class="p-5 sm:p-6">
      <div class="flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-3 font-semibold text-neutral-900">
        <Icon name="heroicons:document-text" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
        Main Content
      </div>
      <Field
        v-model="form.body"
        class="mt-5"
        label="Body"
        type="textarea"
        :rows="10"
        required
        placeholder="Write the biography..."
        :error-messages="fieldErrors.body"
        @update:model-value="clearFieldError('body')"
      />
      <p class="mt-2 text-xs text-neutral-500">Leave a blank line between paragraphs.</p>
    </div>
    <Milestones class="border-t border-neutral-200" />
  </div>
</template>

<script setup lang="ts">
import Milestones from "~/components/hompagetab/milestones.vue"
type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const { GET_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()

const form = reactive({
  uuid: "",
  body: "",
})
const fieldErrors = reactive<Record<string, string>>({})
const saving = ref(false)
const dirty = defineModel<boolean>("dirty", { default: false })
const savedBody = ref("")

watch(() => form.body !== savedBody.value, (changed) => {
  dirty.value = changed
}, { immediate: true })

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function getBiographyData() {
  GET_API({ api: "biographies" }).then((response) => {
    const data = response.data?.data
    const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
    if (!record) return
    form.uuid = readText(record.uuid)
    form.body = readText(record.body)
    savedBody.value = form.body
  })
}

function applyApiErrors(data: ApiErrorData | undefined) {
  const value = data?.errors?.body
  const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
  if (typeof message === "string" && message) {
    fieldErrors.body = message
    return message
  }
  if (typeof data?.message === "string" && data.message) return data.message
  return "The biography could not be saved."
}

function submitBiography() {
  if (saving.value) return
  clearFieldError("body")
  if (!form.uuid) {
    toast("error", "The biography could not be updated.")
    return
  }
  const body = form.body.trim()
  if (!body) {
    fieldErrors.body = "Body is required."
    toast("error", "Check the highlighted fields.")
    return
  }
  saving.value = true
  PATCH_API({
    api: `biographies/${form.uuid}`,
    body,
  })
    .then(() => {
      form.body = body
      savedBody.value = body
      toast("success", "Biography saved.")
    })
    .catch((error: { response?: { data?: ApiErrorData } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
    .finally(() => {
      saving.value = false
    })
}

onMounted(() => {
  getBiographyData()
})
</script>
