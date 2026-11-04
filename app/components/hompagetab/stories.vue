<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:book-open" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Stories</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Update the homepage stories such as title, excerpt, image, and category.
        </p>
      </div>
      <Button type="button" icon="heroicons:plus" @click="openAdd">
        Add Story
      </Button>
    </div>

    <div class="p-5">
      <Field
        v-model="query"
        placeholder="Search story..."
        class="max-w-md"
      />

      <Table
        class="mt-4"
        :columns="columns"
        :items="tableItems"
        empty-text="No stories match that search."
        @edit="editStory"
        @delete="deleteStory"
      />
    </div>
    <StoryDialog v-model:open="open" :story="dialogStory" @saved="saveStory" />
  </div>
</template>

<script setup lang="ts">
import StoryDialog from "~/components/dialog/storydialog.vue"

const { GET_API, POST_API, PATCH_API, DELETE_API } = useGlobalStore()
const { toast } = useToast()

type StoryRow = {
  id: string | number
  uuid: string
  image: string
  title: string
  excerpt: string
  category: string
  categoryUuid: string
  active: boolean
}

const stories = ref<StoryRow[]>([])
const query = ref("")
const open = ref(false)
const selected = ref<StoryRow | null>(null)
const dialogStory = computed(() => {
  const story = selected.value
  if (!story) return null
  return {
    uuid: story.uuid,
    category: story.categoryUuid,
    title: story.title,
    description: story.excerpt,
    file: story.image,
    active: story.active,
  }
})

function openAdd() {
  selected.value = null
  open.value = true
}

function editStory(id: string | number) {
  selected.value = stories.value.find(item => item.id === id) ?? null
  open.value = true
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

function saveStory(story: { category: string, title: string, description: string, file: string, active: boolean }) {
  const payload = {
    category_uuid: story.category,
    title: story.title,
    description: story.description,
    file_path: story.file,
    is_active: story.active,
  }
  const request = selected.value?.uuid
    ? PATCH_API({ api: `stories/${selected.value.uuid}`, ...payload })
    : POST_API({ api: "stories", ...payload })
  request
    .then(() => {
      toast("success", selected.value?.uuid ? "Story updated." : "Story saved.")
      getStoryData()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The story could not be saved.")
    })
}
const columns = [
  { key: "image", label: "Image", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "excerpt", label: "Excerpt", truncate: true },
  { key: "category", label: "Category" },
  { key: "active", label: "Status", kind: "status" as const },
]
const tableItems = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return stories.value
  return stories.value.filter(item =>
    [item.title, item.excerpt, item.category].some(value => value.toLowerCase().includes(term)),
  )
})

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

function getStoryData() {
  GET_API({
    api: "stories",
  }).then((res) => {
    const rows = Array.isArray(res.data.data) ? res.data.data : []
    stories.value = rows.map((row: Record<string, unknown>, index: number) => {
      const uuid = typeof row.uuid === "string" ? row.uuid : ""
      const category = readCategory(row)
      return {
        id: uuid || (typeof row.id === "string" || typeof row.id === "number" ? row.id : index),
        uuid,
        image: readText(row.file_path || row.filepath || row.image),
        title: readText(row.title),
        excerpt: readText(row.description || row.excerpt),
        category: category.name,
        categoryUuid: category.uuid,
        active: readActive(row),
      }
    })
  }).catch(() => {
    stories.value = []
  })
}

onMounted(() => {
  getStoryData()
})
</script>
