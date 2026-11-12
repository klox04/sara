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
        @keydown.enter.prevent="search"
        placeholder="Search milestone..."
        class="max-w-md"
      />

      <Table
        v-model:page="page"
        v-model:per-page="perPage"
        class="mt-4"
        :columns="columns"
        :items="tableItems"
        :total="total"
        :empty-text="emptyText"
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
  icon: string
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

const { POST_API, PATCH_API, DELETE_API } = useGlobalStore()
const { toast } = useToast()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "").replace(/\/$/, "")

const { rows: milestones, items, query, searchTerm, search, page, perPage, total, offset, loading, load: getMilestones } = usePagedList<Milestone>({
  api: "milestones",
  map: (row, index) => ({
    id: readText(row.uuid) || readText(row.id) || index,
    year: readText(row.year),
    image: readText(row.file_path || row.image),
    icon: readText(row.icon),
    title: readText(row.title),
    organization: readText(row.organization),
    period: readText(row.period_label),
    description: readText(row.description),
    for: readFor(row.for),
    active: readActive(row.is_active),
  }),
  filter: (item, term) => [item.year, item.title, item.organization, item.period, item.description, item.for ? forLabels[item.for] : ""]
    .some(value => value.toLowerCase().includes(term)),
})
const open = ref(false)
const selected = ref<Milestone | null>(null)

const columns = [
  { key: "number", label: "#" },
  { key: "year", label: "Year" },
  { key: "visual", label: "Image / Icon", kind: "icon" as const },
  { key: "title", label: "Government Position", strong: true },
  { key: "organization", label: "Location" },
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

const emptyText = computed(() => {
  if (loading.value) return "Loading milestones…"
  return searchTerm.value ? "No milestones match that search." : "No milestones yet."
})

const tableItems = computed(() => [...items.value]
  .sort((a, b) => Number(a.year || 0) - Number(b.year || 0))
  .map((item, index) => ({
    ...item,
    number: offset.value + index + 1,
    visual: item.for === "about" ? item.icon : item.image,
    shownOn: item.for ? forLabels[item.for] : "—",
  })))

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
    file_path: milestone.for === "about" ? null : relativeFilePath(milestone.image),
    icon: milestone.for === "about" ? milestone.icon : null,
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

</script>
