<template>
  <section>
    <PageHeader
      title="Initiatives"
      description="Manage the initiatives used across the Public Service page."
    />

    <div class="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
          <Icon name="heroicons:light-bulb" size="1.4rem" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-semibold text-neutral-900">All Initiatives</h2>
          <p class="mt-0.5 text-sm text-neutral-500">
            Add, edit, or remove initiatives, including their name and icon.
          </p>
        </div>
        <Button type="button" icon="heroicons:plus" @click="openAdd">
          Add Initiative
        </Button>
      </div>

      <div class="p-5">
        <Field
          v-model="query"
          placeholder="Search initiative..."
          class="max-w-md"
        />

        <Table
          class="mt-4"
          :columns="columns"
          :items="tableItems"
          :empty-text="emptyText"
          min-width="min-w-[36rem]"
          @edit="editInitiative"
          @delete="deleteInitiative"
        />
      </div>
    </div>

    <InitiativeDialog v-model:open="open" :initiative="selected" @saved="getInitiatives" />
  </section>
</template>

<script setup lang="ts">
import InitiativeDialog from "~/components/dialog/initiativedialog.vue"
import { initiativeIcon } from "~~/shared/initiatives"

type InitiativeRow = {
  id: string | number
  name: string
  iconKey: string
  icon: string
  added: string
}

const { GET_API, DELETE_API } = useGlobalStore()
const { toast } = useToast()

const initiatives = ref<InitiativeRow[]>([])
const query = ref("")
const loading = ref(true)
const open = ref(false)
const selected = ref<InitiativeRow | null>(null)

const columns = [
  { key: "number", label: "#" },
  { key: "icon", label: "Icon", kind: "icon" as const },
  { key: "name", label: "Name", strong: true },
  { key: "added", label: "Date Added", nowrap: true },
]

const emptyText = computed(() => {
  if (loading.value) return "Loading initiatives…"
  return query.value.trim() ? "No initiatives match that search." : "No initiatives yet."
})

const tableItems = computed(() => {
  const numbered = initiatives.value.map((item, index) => ({ ...item, number: index + 1 }))
  const term = query.value.trim().toLowerCase()
  if (!term) return numbered
  return numbered.filter(item => item.name.toLowerCase().includes(term))
})

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function formatDate(value: string) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function openAdd() {
  selected.value = null
  open.value = true
}

function editInitiative(id: string | number) {
  selected.value = initiatives.value.find(item => item.id === id) ?? null
  open.value = true
}

function deleteInitiative(id: string | number) {
  DELETE_API({ api: `initiatives/${id}` })
    .then(() => {
      toast("success", "Initiative deleted.")
      getInitiatives()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The initiative could not be deleted.")
    })
}

function getInitiatives() {
  loading.value = true
  GET_API({ api: "initiatives" })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as Record<string, unknown>[] : []
      initiatives.value = rows.map((row, index) => {
        const iconKey = readText(row.icon)
        return {
          id: readText(row.uuid) || (typeof row.id === "number" ? row.id : index),
          name: readText(row.name),
          iconKey,
          icon: initiativeIcon(iconKey),
          added: formatDate(readText(row.created_at)),
        }
      })
    })
    .catch(() => {
      initiatives.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getInitiatives()
})
</script>
