<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:archive-box" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Record</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Manage the records and documents listed on the Archive page.
        </p>
      </div>
      <Button type="button" icon="heroicons:plus" @click="navigateTo('/admin/archive/records/create')">
        Add Record
      </Button>
    </div>

    <div class="p-5">
      <Field
        v-model="query"
        placeholder="Search record..."
        class="max-w-md"
        @keydown.enter.prevent="search"
      />

      <Table
        v-model:page="page"
        v-model:per-page="perPage"
        class="mt-4"
        :columns="columns"
        :items="tableItems"
        :total="total"
        :empty-text="emptyText"
        @edit="editRecord"
        @delete="deleteRecord"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type RecordRow = {
  id: string | number
  title: string
  date: string
  category: string
  institution: string
  type: string
  featured: string
  active: boolean
}

const { DELETE_API } = useGlobalStore()
const { toast } = useToast()

const { items, query, searchTerm, search, page, perPage, total, offset, loading, load: getRecords } = usePagedList<RecordRow>({
  api: "records",
  map: (row, index) => ({
    id: readText(row.uuid) || (typeof row.id === "number" ? row.id : index),
    title: readText(row.title),
    date: formatDate(readText(row.record_date)),
    category: readName(row.category),
    institution: readName(row.institution),
    type: readName(row.type),
    featured: readBoolean(row.is_featured) ? "Featured" : "—",
    active: row.is_active === undefined || row.is_active === null ? true : readBoolean(row.is_active),
  }),
})

const columns = [
  { key: "number", label: "#" },
  { key: "title", label: "Title", strong: true, truncate: true },
  { key: "date", label: "Date", nowrap: true },
  { key: "category", label: "Category", nowrap: true },
  { key: "institution", label: "Institution" },
  { key: "type", label: "Type", nowrap: true },
  {
    key: "featured",
    label: "Featured",
    kind: "chip" as const,
    chips: {
      Featured: { class: "bg-[#e7f6ec] text-[#1f7a4d]", icon: "heroicons:star" },
    },
  },
  { key: "active", label: "Status", kind: "status" as const },
]

const emptyText = computed(() => {
  if (loading.value) return "Loading records…"
  return searchTerm.value ? "No records match that search." : "No records yet."
})

const tableItems = computed(() => items.value.map((item, index) => ({ ...item, number: offset.value + index + 1 })))

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function readName(value: unknown) {
  const name = value && typeof value === "object" ? (value as Record<string, unknown>).name : ""
  return readText(name) || "—"
}

function readBoolean(value: unknown) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true"].includes(value.toLowerCase())
  return false
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  if (!value || Number.isNaN(date.getTime())) return value || "—"
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function editRecord(id: string | number) {
  navigateTo(`/admin/archive/records/${id}`)
}

function deleteRecord(id: string | number) {
  DELETE_API({ api: `records/${id}` })
    .then(() => {
      toast("success", "Record deleted.")
      getRecords()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The record could not be deleted.")
    })
}
</script>
