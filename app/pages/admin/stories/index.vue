<template>
  <section>
    <PageHeader
      title="Stories"
      description="Manage the stories that appear on the homepage and the Stories page."
    />

    <div class="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
          <Icon name="heroicons:book-open" size="1.4rem" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-semibold text-neutral-900">All Stories</h2>
          <p class="mt-0.5 text-sm text-neutral-500">
            Add, edit, or remove stories, including their title, description, content, image, and category.
          </p>
        </div>
        <Button type="button" icon="heroicons:plus" @click="openAdd">
          Add Story
        </Button>
      </div>

      <div class="p-5">
        <Field
          v-model="query"
          @keydown.enter.prevent="search"
          placeholder="Search story..."
          class="max-w-md"
        />

        <Table
          v-model:page="page"
          v-model:per-page="perPage"
          class="mt-4"
          :columns="columns"
          :items="items"
          :total="total"
          :empty-text="emptyText"
          @edit="editStory"
          @delete="deleteStory"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { DELETE_API } = useGlobalStore()
const { toast } = useToast()

type StoryRow = {
  id: string | number
  uuid: string
  image: string
  title: string
  excerpt: string
  category: string
  active: boolean
}

const { rows: stories, items, query, searchTerm, search, page, perPage, total, loading, load: getStoryData } = usePagedList<StoryRow>({
  api: "stories",
  map: (row, index) => {
    const uuid = typeof row.uuid === "string" ? row.uuid : ""
    const category = readCategory(row)
    return {
      id: uuid || (typeof row.id === "string" || typeof row.id === "number" ? row.id : index),
      uuid,
      image: readText(row.file_path || row.filepath || row.image),
      title: readText(row.title),
      excerpt: readText(row.description || row.excerpt),
      category: category.name,
      active: readActive(row),
    }
  },
  filter: (item, term) => [item.title, item.excerpt, item.category].some(value => value.toLowerCase().includes(term)),
})

const emptyText = computed(() => {
  if (loading.value) return "Loading stories…"
  return searchTerm.value ? "No stories match that search." : "No stories yet."
})

function openAdd() {
  navigateTo("/admin/stories/create")
}

function editStory(id: string | number) {
  const story = stories.value.find(item => item.id === id)
  if (story?.uuid) navigateTo(`/admin/stories/${story.uuid}`)
}

function deleteStory(id: string | number) {
  const story = stories.value.find(item => item.id === id)
  const uuid = story?.uuid || id
  DELETE_API({
    api: `stories/${uuid}`,
  })
    .then(() => {
      toast("success", "Story deleted.")
      getStoryData()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The story could not be deleted.")
    })
}

const columns = [
  { key: "image", label: "Image", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "excerpt", label: "Description", truncate: true },
  { key: "category", label: "Category" },
  { key: "active", label: "Status", kind: "status" as const },
]
function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function readCategory(row: Record<string, unknown>) {
  const nested = row.category && typeof row.category === "object" ? row.category as Record<string, unknown> : null
  const uuid = readText(row.category_uuid) || readText(nested?.uuid)
  const name = readText(nested?.name) || readText(nested?.title) || (nested ? "" : readText(row.category))
  return { uuid, name: name || "Story" }
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

</script>
