<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:light-bulb" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Program</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the programs listed on the Public Service page.
        </p>
      </div>
      <Button type="button" icon="heroicons:plus" @click="navigateTo('/admin/public-service/programs/create')">
        Add Program
      </Button>
    </div>

    <div class="p-5">
      <Field
        v-model="query"
        @keydown.enter.prevent="search"
        placeholder="Search program..."
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
        @edit="editProgram"
        @delete="deleteProgram"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type ProgramRow = {
  id: string | number
  image: string
  title: string
  description: string
  active: boolean
}

const { DELETE_API } = useGlobalStore()
const { toast } = useToast()

const { items, query, searchTerm, search, page, perPage, total, offset, loading, load: getPrograms } = usePagedList<ProgramRow>({
  api: "programs",
  map: (row, index) => ({
    id: readText(row.uuid) || (typeof row.id === "number" ? row.id : index),
    image: readText(row.file_path),
    title: readText(row.title),
    description: readText(row.description),
    active: readBoolean(row.is_active, true),
  }),
})

const columns = [
  { key: "number", label: "#" },
  { key: "image", label: "Image", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "description", label: "Description", truncate: true },
  { key: "active", label: "Status", kind: "status" as const },
]

const emptyText = computed(() => {
  if (loading.value) return "Loading programs…"
  return searchTerm.value ? "No programs match that search." : "No programs yet."
})

const tableItems = computed(() => items.value.map((item, index) => ({ ...item, number: offset.value + index + 1 })))

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function readBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["1", "true", "active"].includes(value.toLowerCase())
  return fallback
}

function editProgram(id: string | number) {
  navigateTo(`/admin/public-service/programs/${id}`)
}

function deleteProgram(id: string | number) {
  DELETE_API({ api: `programs/${id}` })
    .then(() => {
      toast("success", "Program deleted.")
      getPrograms()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The program could not be deleted.")
    })
}
</script>
