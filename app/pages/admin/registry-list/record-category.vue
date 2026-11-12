<template>
  <section>
    <PageHeader
      title="Record Category"
      description="Manage the categories used to group public records."
    />

    <div class="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
          <Icon name="heroicons:folder" size="1.4rem" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-semibold text-neutral-900">All Categories</h2>
          <p class="mt-0.5 text-sm text-neutral-500">
            Categories are used to group records on the Archive and About pages.
          </p>
        </div>
        <Button type="button" icon="heroicons:plus" @click="openAdd">
          Add Category
        </Button>
      </div>

      <div class="p-5">
        <Field
          v-model="query"
          @keydown.enter.prevent="search"
          placeholder="Search category..."
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
          min-width="min-w-[36rem]"
          @edit="editCategory"
          @delete="deleteCategory"
        />
      </div>
    </div>

    <CategoryDialog
      v-model:open="open"
      :category="selected"
      api="record-categories"
      subject="record"
      placeholder="e.g. Speech"
      with-icon
      @saved="getCategories"
    />
  </section>
</template>

<script setup lang="ts">
import CategoryDialog from "~/components/dialog/categorydialog.vue"

type CategoryRow = {
  id: string | number
  name: string
  icon: string
  added: string
}

const { DELETE_API } = useGlobalStore()
const { toast } = useToast()

const { rows: categories, items, query, searchTerm, search, page, perPage, total, offset, loading, load: getCategories } = usePagedList<CategoryRow>({
  api: "record-categories",
  map: (row, index) => ({
    id: readText(row.uuid) || (typeof row.id === "number" ? row.id : index),
    name: readText(row.name),
    icon: readText(row.icon),
    added: formatDate(readText(row.created_at)),
  }),
  filter: (item, term) => item.name.toLowerCase().includes(term),
})
const open = ref(false)
const selected = ref<CategoryRow | null>(null)

const columns = [
  { key: "number", label: "#" },
  { key: "icon", label: "Icon", kind: "icon" as const },
  { key: "name", label: "Name", strong: true },
  { key: "added", label: "Date Added", nowrap: true },
]

const emptyText = computed(() => {
  if (loading.value) return "Loading categories…"
  return searchTerm.value ? "No categories match that search." : "No categories yet."
})

const tableItems = computed(() => items.value.map((item, index) => ({ ...item, number: offset.value + index + 1 })))

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

function editCategory(id: string | number) {
  selected.value = categories.value.find(item => item.id === id) ?? null
  open.value = true
}

function deleteCategory(id: string | number) {
  DELETE_API({ api: `record-categories/${id}` })
    .then(() => {
      toast("success", "Category deleted.")
      getCategories()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The category could not be deleted.")
    })
}

</script>
