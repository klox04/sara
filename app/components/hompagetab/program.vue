<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Field
        v-model="query"
        @keydown.enter.prevent="search"
        placeholder="Search item..."
        class="flex-1"
      />
      <Button type="button" icon="heroicons:plus" @click="addProgram">
        Add Item
      </Button>
    </div>
    <Table
      v-model:page="page"
      v-model:per-page="perPage"
      class="mt-4"
      :columns="columns"
      :items="items"
      :total="total"
      :empty-text="emptyText"
      @edit="editProgram"
      @delete="deleteProgram"
    />
    <ProgramDialog v-model:open="open" :program="selected" @saved="getProgramData" />
  </div>
</template>

<script setup lang="ts">
import ProgramDialog from "~/components/dialog/programdialog.vue"

const { DELETE_API } = useGlobalStore()
const { toast } = useToast()

type ProgramRow = {
  id: string | number
  title: string
  description: string
  icon: string
  active: boolean
}

const { rows: programs, items, query, searchTerm, search, page, perPage, total, loading, load: getProgramData } = usePagedList<ProgramRow>({
  api: "priorities",
  map: (row, index) => {
    const id = row.id ?? row.uuid
    return {
      id: typeof id === "string" || typeof id === "number" ? id : index,
      title: typeof row.title === "string" ? row.title : "",
      description: typeof row.description === "string" ? row.description : typeof row.text === "string" ? row.text : "",
      icon: typeof row.icon === "string" ? row.icon : "",
      active: readActive(row),
    }
  },
  filter: (item, term) => [item.title, item.description].some(value => value.toLowerCase().includes(term)),
})
const emptyText = computed(() => {
  if (loading.value) return "Loading programs…"
  return searchTerm.value ? "No programs match that search." : "No programs yet."
})
const open = ref(false)
const selected = ref<ProgramRow | null>(null)
const columns = [
  { key: "icon", label: "Icon", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "description", label: "Description", truncate: true },
  { key: "active", label: "Active", kind: "status" as const },
]
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

function addProgram() {
  selected.value = null
  open.value = true
}

function editProgram(id: string | number) {
  selected.value = programs.value.find(item => item.id === id) ?? null
  open.value = true
}

function deleteProgram(id: string | number) {
  DELETE_API({
    api: `priorities/${id}`,
  })
    .then(() => {
      toast("success", "Program deleted.")
      getProgramData()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The program could not be deleted.")
    })
}

</script>
