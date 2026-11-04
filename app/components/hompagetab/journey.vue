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

    <div class="flex flex-col gap-3 border-t border-neutral-200 bg-[#e7f6ec] px-5 py-3 sm:flex-row sm:items-center">
      <div class="flex min-w-0 flex-1 items-center gap-2 font-semibold text-neutral-900">
        <Icon name="heroicons:square-3-stack-3d" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
        Milestones
      </div>
      <Button type="button" icon="heroicons:plus" @click="openAdd">
        Add Milestone
      </Button>
    </div>

    <div class="p-5">
      <Field
        v-model="query"
        placeholder="Search milestone..."
        class="max-w-md"
      />

      <Table
        class="mt-4"
        :columns="columns"
        :items="tableItems"
        empty-text="No milestones match that search."
        @edit="editMilestone"
        @delete="deleteMilestone"
      />
    </div>
    <MilestoneDialog v-model:open="open" :milestone="selected" @saved="saveMilestone" />
  </div>
</template>

<script setup lang="ts">
import MilestoneDialog from "~/components/dialog/milestonedialog.vue"
const { GET_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()
type Milestone = {
  id: string | number
  recordId?: string | number
  uuid?: string
  year: string
  image: string
  title: string
  organization: string
  period: string
  description: string
  active: boolean
}

const section = reactive({
  uuid: "",
  title: "",
  description: "",
})

const milestones = ref<Milestone[]>([])
const removedIds = ref<Array<string | number>>([])

const query = ref("")
const open = ref(false)
const selected = ref<Milestone | null>(null)

function openAdd() {
  selected.value = null
  open.value = true
}

function editMilestone(id: string | number) {
  selected.value = milestones.value.find(item => item.id === id) ?? null
  open.value = true
}

function saveMilestone(milestone: Omit<Milestone, "id"> & { id?: string | number }) {
  if (milestone.id !== undefined) {
    const index = milestones.value.findIndex(item => item.id === milestone.id)
    if (index >= 0) {
      milestones.value[index] = { ...milestones.value[index], ...milestone, id: milestone.id }
      return
    }
  }
  const numericIds = milestones.value.map(item => Number(item.id)).filter(id => Number.isFinite(id))
  const id = (numericIds.length ? Math.max(...numericIds) : 0) + 1
  milestones.value.push({ ...milestone, id })
}
const columns = [
  { key: "number", label: "#" },
  { key: "year", label: "Year" },
  { key: "image", label: "Image", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "organization", label: "Organization" },
  { key: "period", label: "Period Label" },
  { key: "description", label: "Description", truncate: true },
  { key: "active", label: "Status", kind: "status" as const },
]
const tableItems = computed(() => {
  const term = query.value.trim().toLowerCase()
  const rows = term
    ? milestones.value.filter(item =>
      [item.year, item.title, item.organization, item.period, item.description]
        .some(value => String(value || "").toLowerCase().includes(term)),
    )
    : milestones.value
  return rows.map((item, index) => ({ ...item, number: index + 1 }))
})
function relativeFilePath(path: string) {
  const base = String(useRuntimeConfig().public.storageUrl || "").replace(/\/$/, "")
  if (base && path.startsWith(`${base}/`)) return path.slice(base.length + 1)
  return path
}

function readText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function readActive(row: Record<string, unknown>) {
  const value = row.is_active ?? row.active ?? row.published ?? row.status
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") {
    const normalized = value.toLowerCase()
    return normalized === "active" || normalized === "1" || normalized === "true"
  }
  return true
}

function getJourneyData() {
  GET_API({
    api: "journeys",
  }).then((res) => {
    const record = res.data.data?.[0]
    if (!record) return
    const { milestones: milestoneRows, ...details } = record
    Object.assign(section, details)
    section.uuid = typeof record.uuid === "string" ? record.uuid : ""
    const rows = Array.isArray(milestoneRows) ? milestoneRows : []
    milestones.value = rows.map((row: Record<string, unknown>, index: number) => {
      const recordId = typeof row.id === "string" || typeof row.id === "number" ? row.id : undefined
      const uuid = typeof row.uuid === "string" ? row.uuid : undefined
      return {
        id: recordId ?? uuid ?? index,
        recordId,
        uuid,
        year: readText(row.year),
        image: readText(row.file_path || row.filepath || row.image),
        title: readText(row.title || row.role),
        organization: readText(row.organization || row.place),
        period: readText(row.period_label || row.period),
        description: readText(row.description || row.text),
        active: readActive(row),
      }
    }).filter(item => !isRemoved(item))
  })
}
function sameId(left: string | number | undefined, right: string | number) {
  return left !== undefined && String(left) === String(right)
}

function isRemoved(item: { id?: string | number, recordId?: string | number, uuid?: string }) {
  return removedIds.value.some(id => sameId(item.id, id) || sameId(item.recordId, id) || sameId(item.uuid, id))
}

function deleteMilestone(id: string | number) {
  const milestone = milestones.value.find(item => sameId(item.id, id))
  if (!milestone) return
  if (milestone.recordId !== undefined) removedIds.value.push(milestone.recordId)
  if (milestone.uuid) removedIds.value.push(milestone.uuid)
  removedIds.value.push(milestone.id)
  milestones.value = milestones.value.filter(item => !sameId(item.id, id))
}
function submitJourney() {
  if (!section.uuid) {
    toast("error", "The journey could not be saved.")
    return
  }
  const payload = {
    title: section.title,
    description: section.description,
    milestones: milestones.value.filter(item => !isRemoved(item)).map(item => ({
      ...(item.recordId !== undefined ? { id: item.recordId } : {}),
      ...(item.uuid ? { uuid: item.uuid } : {}),
      year: item.year,
      file_path: relativeFilePath(item.image),
      title: item.title,
      organization: item.organization,
      period_label: item.period || null,
      description: item.description,
      is_active: item.active,
    })),
  }
  PATCH_API({
    api: `journeys/${section.uuid}`,
    ...payload,
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
