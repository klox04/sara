<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:map" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Journey</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the homepage journey section such as title, description, and milestones.
        </p>
      </div>
      <Button type="button" icon="uil:save" @click="submitJourney">
        Save Changes
      </Button>
    </div>

    <div class="flex items-center gap-2 bg-[#e7f6ec] px-5 py-3 font-semibold text-neutral-900">
      <Icon name="heroicons:document-text" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
      Section Content
    </div>
    <div class="grid gap-5 p-5 sm:grid-cols-2">
      <Field v-model="section.title" label="Title" required />
      <Field
        v-model="section.description"
        class="sm:col-span-2"
        label="Description"
        type="textarea"
        :rows="3"
        required
      />
    </div>

    <Milestones class="border-t border-neutral-200" />
  </div>
</template>

<script setup lang="ts">
import Milestones from "~/components/hompagetab/milestones.vue"

const { GET_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()

const section = reactive({
  uuid: "",
  title: "",
  description: "",
})

const dirty = defineModel<boolean>("dirty", { default: false })

function snapshot() {
  return JSON.stringify({
    title: section.title,
    description: section.description,
  })
}

const savedState = ref(snapshot())

watch(() => snapshot() !== savedState.value, (changed) => {
  dirty.value = changed
}, { immediate: true })

function readText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function getJourneyData() {
  GET_API({
    api: "journeys",
  }).then((res) => {
    const record = res.data.data?.[0]
    if (!record) return
    section.uuid = readText(record.uuid)
    section.title = readText(record.title)
    section.description = readText(record.description)
    savedState.value = snapshot()
  })
}

function submitJourney() {
  if (!section.uuid) {
    toast("error", "The journey could not be saved.")
    return
  }
  PATCH_API({
    api: `journeys/${section.uuid}`,
    title: section.title,
    description: section.description,
  })
    .then(() => {
      toast("success", "Journey saved.")
      getJourneyData()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The journey could not be saved.")
    })
}

onMounted(() => {
  getJourneyData()
})
</script>
