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
        aria-labelledby="statistic-dialog-title"
        class="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 border-b border-neutral-200 px-6 py-5">
          <span class="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#e7f6ec] text-[#1f7a4d]">
            <Icon name="heroicons:chart-bar" size="1.4rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="statistic-dialog-title" class="text-xl font-bold text-neutral-900">{{ statistic ? "Edit Statistic" : "Add Statistic" }}</h2>
            <p class="mt-0.5 text-sm text-neutral-500">
              {{ statistic ? "Update this statistic on the homepage." : "Create a new statistic to display on the homepage." }}
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

        <form class="px-6 py-5" novalidate @submit.prevent="saveStatistic">
          <Field
            v-model="form.value"
            label="Value"
            required
            placeholder="e.g. 1,904 or ₱279B"
            :error-messages="fieldErrors.value"
            @update:model-value="clearFieldError('value')"
          />
          <Field
            v-model="form.description"
            class="mt-5"
            label="Description"
            type="textarea"
            :rows="3"
            required
            placeholder="e.g. City government scholars reported in the 2019 SOCA"
            :error-messages="fieldErrors.description"
            @update:model-value="clearFieldError('description')"
          />

          <div class="mt-6 flex items-center gap-3">
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
            <span>
              <span class="block text-sm font-semibold text-neutral-900">{{ form.active ? "Active" : "Inactive" }}</span>
              <span class="block text-xs text-neutral-500">Show this statistic on the homepage.</span>
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
            <Button type="submit" icon="uil:save">
              Save Statistic
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
  statistic?: {
    id: string | number
    value: string
    description: string
    sourceUrl: string
    active: boolean
  } | null
}>()
const emit = defineEmits<{
  saved: [statistic: {
    id?: string | number
    value: string
    description: string
    sourceUrl: string
    active: boolean
  }]
}>()

const form = reactive({
  value: "",
  description: "",
  sourceUrl: "",
  active: true,
})
const fieldErrors = reactive<Record<string, string>>({})

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function fillForm() {
  clearFieldErrors()
  const statistic = props.statistic
  form.value = statistic?.value ?? ""
  form.description = statistic?.description ?? ""
  form.sourceUrl = statistic?.sourceUrl ?? ""
  form.active = statistic?.active ?? true
}

function closeDialog() {
  open.value = false
}

function validate() {
  clearFieldErrors()
  if (!form.value.trim()) fieldErrors.value = "Value is required."
  if (!form.description.trim()) fieldErrors.description = "Description is required."
  const source = form.sourceUrl.trim()
  if (source && !/^https?:\/\/\S+$/i.test(source)) fieldErrors.source_url = "Enter a link that starts with http:// or https://."
  return Object.keys(fieldErrors).length === 0
}

function saveStatistic() {
  if (!validate()) return
  emit("saved", {
    id: props.statistic?.id,
    value: form.value.trim(),
    description: form.description.trim(),
    sourceUrl: form.sourceUrl.trim(),
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
