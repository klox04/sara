<template>
  <div>
    <div class="flex flex-col gap-3 bg-[#e7f6ec] px-5 py-3 sm:flex-row sm:items-center">
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
        :empty-text="query.trim() ? 'No milestones match that search.' : 'No milestones yet.'"
        @edit="editMilestone"
        @delete="deleteMilestone"
      />
    </div>
    <MilestoneDialog v-model:open="open" :milestone="selected" @saved="saveMilestone" />
  </div>
</template>

<script setup lang="ts">
import MilestoneDialog from "~/components/dialog/milestonedialog.vue"

type Milestone = {
  id: string | number
  year: string
  image: string
  title: string
  organization: string
  period: string
  description: string
  for: MilestoneFor | ""
  active: boolean
}

type MilestoneFor = "home" | "about"

type MilestoneForm = Omit<Milestone, "id" | "for"> & { id?: string | number, for: MilestoneFor }

const forLabels: Record<MilestoneFor, string> = {
  home: "Home",
  about: "About",
}

const { GET_API, POST_API, PATCH_API, DELETE_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "").replace(/\/$/, "")

const milestones = ref<Milestone[]>([])
const query = ref("")
const open = ref(false)
const selected = ref<Milestone | null>(null)

const columns = [
  { key: "number", label: "#" },
  { key: "year", label: "Year" },
  { key: "image", label: "Image", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "organization", label: "Organization" },
  { key: "period", label: "Period Label" },
  { key: "description", label: "Description", truncate: true },
  {
    key: "shownOn",
    label: "Shown On",
    kind: "chip" as const,
    chips: {
      Home: { class: "bg-[#e7f6ec] text-[#1f7a4d]", icon: "heroicons:home" },
      About: { class: "bg-amber-50 text-amber-800", icon: "heroicons:user" },
    },
  },
  { key: "active", label: "Status", kind: "status" as const },
]

const tableItems = computed(() => {
  const numbered = milestones.value.map((item, index) => ({
    ...item,
    number: index + 1,
    shownOn: item.for ? forLabels[item.for] : "—",
  }))
  const term = query.value.trim().toLowerCase()
  if (!term) return numbered
  return numbered.filter(item =>
    [item.year, item.title, item.organization, item.period, item.description, item.shownOn]
      .some(value => value.toLowerCase().includes(term)),
  )
})

function readText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function readActive(value: unknown) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["active", "1", "true"].includes(value.toLowerCase())
  return true
}

function readFor(value: unknown): MilestoneFor | "" {
  const normalized = readText(value).toLowerCase()
  return normalized === "home" || normalized === "about" ? normalized : ""
}

function relativeFilePath(path: string) {
  if (storageUrl && path.startsWith(`${storageUrl}/`)) return path.slice(storageUrl.length + 1)
  return path
}

function openAdd() {
  selected.value = null
  open.value = true
}

function editMilestone(id: string | number) {
  selected.value = milestones.value.find(item => item.id === id) ?? null
  open.value = true
}

function readError(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message
  return typeof message === "string" && message ? message : fallback
}

function saveMilestone(milestone: MilestoneForm) {
  const payload = {
    year: milestone.year,
    file_path: relativeFilePath(milestone.image),
    title: milestone.title,
    organization: milestone.organization,
    period_label: milestone.period || null,
    description: milestone.description,
    for: milestone.for,
    is_active: milestone.active,
  }
  const editing = milestone.id !== undefined
  const request = editing
    ? PATCH_API({ api: `milestones/${milestone.id}`, ...payload })
    : POST_API({ api: "milestones", ...payload })
  request
    .then(() => {
      toast("success", editing ? "Milestone updated." : "Milestone saved.")
      getMilestones()
    })
    .catch((error: unknown) => {
      toast("error", readError(error, "The milestone could not be saved."))
    })
}

function deleteMilestone(id: string | number) {
  DELETE_API({ api: `milestones/${id}` })
    .then(() => {
      toast("success", "Milestone deleted.")
      getMilestones()
    })
    .catch((error: unknown) => {
      toast("error", readError(error, "The milestone could not be deleted."))
    })
}

function getMilestones() {
  GET_API({ api: "milestones" })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as Record<string, unknown>[] : []
      milestones.value = [...rows]
        .sort((a, b) => Number(a.year ?? 0) - Number(b.year ?? 0))
        .map((row, index) => ({
          id: readText(row.uuid) || readText(row.id) || index,
          year: readText(row.year),
          image: readText(row.file_path || row.image),
          title: readText(row.title),
          organization: readText(row.organization),
          period: readText(row.period_label),
          description: readText(row.description),
          for: readFor(row.for),
          active: readActive(row.is_active),
        }))
    })
    .catch(() => {
      milestones.value = []
    })
}

onMounted(() => {
  getMilestones()
})
</script>
