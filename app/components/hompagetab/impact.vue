<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:chart-bar" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Impact</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the homepage impact section such as statement, attribution, and statistics.
        </p>
      </div>
      <Button type="button" icon="uil:save" :disabled="saving" @click="submitStatement">
        Save Changes
      </Button>
    </div>

    <div class="flex items-center gap-2 bg-[#e7f6ec] px-5 py-3 font-semibold text-neutral-900">
      <Icon name="heroicons:document-text" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
      Section Content
    </div>
    <div class="grid gap-5 p-5 lg:grid-cols-2">
      <Field
        v-model="statement.statement"
        class="lg:col-span-2"
        label="Statement"
        type="textarea"
        :rows="2"
        required
        placeholder="Progress is not just about numbers, but about people's lives getting better."
        :error-messages="fieldErrors.statement"
        @update:model-value="clearFieldError('statement')"
      />
      <Field
        v-model="statement.attribution"
        label="Attribution"
        required
        placeholder="Sara Duterte"
        :error-messages="fieldErrors.attribution"
        @update:model-value="clearFieldError('attribution')"
      />
    </div>

    <div class="flex flex-col gap-3 border-t border-neutral-200 bg-[#e7f6ec] px-5 py-3 sm:flex-row sm:items-center">
      <div class="flex min-w-0 flex-1 items-center gap-2 font-semibold text-neutral-900">
        <Icon name="heroicons:square-3-stack-3d" size="1.15rem" class="text-[#1f7a4d]" aria-hidden="true" />
        Statistics
      </div>
      <Button type="button" icon="heroicons:plus" @click="openAdd">
        Add Statistic
      </Button>
    </div>

    <div class="p-5">
      <Field
        v-model="query"
        placeholder="Search statistic..."
        class="max-w-md"
      />

      <Table
        class="mt-4"
        :columns="columns"
        :items="tableItems"
        :empty-text="query.trim() ? 'No statistics match that search.' : 'No statistics yet.'"
        @edit="editStatistic"
        @delete="deleteStatistic"
      />
    </div>
    <StatisticDialog v-model:open="open" :statistic="selected" @saved="saveStatistic" />
  </div>
</template>

<script setup lang="ts">
import StatisticDialog from "~/components/dialog/statisticdialog.vue"

type Statistic = {
  id: string | number
  uuid?: string
  value: string
  description: string
  sourceUrl: string
  active: boolean
}

type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const { GET_API, PATCH_API } = useGlobalStore()
const { toast } = useToast()
const dirty = defineModel<boolean>("dirty", { default: false })

const statement = reactive({
  uuid: "",
  statement: "",
  attribution: "",
})
const fieldErrors = reactive<Record<string, string>>({})
const saving = ref(false)
const statistics = ref<Statistic[]>([])
const query = ref("")
const open = ref(false)
const selected = ref<Statistic | null>(null)
let nextLocalId = 1

const columns = [
  { key: "number", label: "#" },
  { key: "value", label: "Value", strong: true, nowrap: true },
  { key: "description", label: "Description", truncate: true },
  { key: "active", label: "Status", kind: "status" as const },
]

const tableItems = computed(() => {
  const numbered = statistics.value.map((item, index) => ({ ...item, number: index + 1 }))
  const term = query.value.trim().toLowerCase()
  if (!term) return numbered
  return numbered.filter(item => [item.value, item.description].some(value => value.toLowerCase().includes(term)))
})

function snapshot() {
  return JSON.stringify({
    statement: statement.statement,
    attribution: statement.attribution,
    statistics: statistics.value.map(({ id, ...item }) => ({ ...item, id: item.uuid ?? id })),
  })
}

const savedState = ref(snapshot())

watch(() => snapshot() !== savedState.value, (changed) => {
  dirty.value = changed
}, { immediate: true })

function readText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function readActive(row: Record<string, unknown>) {
  const value = row.is_active ?? row.active ?? row.status
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return ["active", "1", "true"].includes(value.toLowerCase())
  return true
}

function clearFieldError(key: string) {
  delete fieldErrors[key]
}

function clearFieldErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}

function openAdd() {
  selected.value = null
  open.value = true
}

function editStatistic(id: string | number) {
  selected.value = statistics.value.find(item => item.id === id) ?? null
  open.value = true
}

function saveStatistic(statistic: Omit<Statistic, "id" | "uuid"> & { id?: string | number }) {
  const index = statistic.id === undefined ? -1 : statistics.value.findIndex(item => item.id === statistic.id)
  if (index >= 0) {
    const current = statistics.value[index]!
    statistics.value[index] = { ...current, ...statistic, id: current.id }
    return
  }
  statistics.value.push({ ...statistic, id: `new-${nextLocalId++}` })
}

function deleteStatistic(id: string | number) {
  statistics.value = statistics.value.filter(item => item.id !== id)
}

function readStatistics(rows: unknown): Statistic[] {
  if (!Array.isArray(rows)) return []
  return [...rows as Record<string, unknown>[]]
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((row, index) => {
      const uuid = readText(row.uuid) || undefined
      return {
        id: uuid ?? (readText(row.id) || index),
        uuid,
        value: readText(row.value),
        description: readText(row.description),
        sourceUrl: readText(row.source_url),
        active: readActive(row),
      }
    })
}

function getImpactData() {
  GET_API({ api: "statistic-statements" })
    .then((response) => {
      const data = response.data?.data
      const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
      if (!record) return
      statement.uuid = readText(record.uuid ?? record.id)
      statement.statement = readText(record.statement)
      statement.attribution = readText(record.attribution)
      statistics.value = readStatistics(record.statistics)
      savedState.value = snapshot()
    })
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const [key, value] of Object.entries(data?.errors ?? {})) {
    const message = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    if (typeof message === "string" && key in statement) fieldErrors[key] = message
  }
  const firstFieldError = Object.values(fieldErrors)[0]
  if (firstFieldError) return firstFieldError
  if (typeof data?.message === "string" && data.message) return data.message
  return "The impact section could not be saved."
}

function submitStatement() {
  if (saving.value) return
  clearFieldErrors()
  if (!statement.uuid) {
    toast("error", "The impact section could not be saved.")
    return
  }
  if (!statement.statement.trim()) fieldErrors.statement = "Statement is required."
  if (!statement.attribution.trim()) fieldErrors.attribution = "Attribution is required."
  if (Object.keys(fieldErrors).length) {
    toast("error", "Check the highlighted fields.")
    return
  }
  saving.value = true
  PATCH_API({
    api: `statistic-statements/${statement.uuid}`,
    statement: statement.statement.trim(),
    attribution: statement.attribution.trim(),
    statistics: statistics.value.map((item, index) => ({
      ...(item.uuid ? { uuid: item.uuid } : {}),
      value: item.value,
      description: item.description,
      source_url: item.sourceUrl || null,
      sort_order: index + 1,
      is_active: item.active,
    })),
  })
    .then(() => {
      toast("success", "Impact section saved.")
      getImpactData()
    })
    .catch((error: { response?: { data?: ApiErrorData } }) => {
      toast("error", applyApiErrors(error.response?.data))
    })
    .finally(() => {
      saving.value = false
    })
}

onMounted(() => {
  getImpactData()
})
</script>
