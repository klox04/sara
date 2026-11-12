<template>
  <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
        <Icon name="heroicons:rectangle-stack" size="1.4rem" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-semibold text-neutral-900">Collection</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          Manage the photo and video collections shown on the Gallery page.
        </p>
      </div>
      <Button type="button" icon="heroicons:plus" @click="navigateTo('/admin/gallery/create')">
        Add Gallery
      </Button>
    </div>

    <div class="p-5">
      <Field
        v-model="query"
        @keydown.enter.prevent="search"
        placeholder="Search gallery..."
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
        @edit="editGallery"
        @delete="deleteGallery"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type GalleryRow = {
  id: string | number
  image: string
  title: string
  description: string
  initiative: string
  pictures: number
  videos: number
  active: boolean
}

const { DELETE_API } = useGlobalStore()
const { toast } = useToast()

const { items, query, searchTerm, search, page, perPage, total, offset, loading, load: getGalleries } = usePagedList<GalleryRow>({
  api: "galleries",
  map: (row, index) => {
    const initiative = row.initiative && typeof row.initiative === "object" ? row.initiative as Record<string, unknown> : null
    const pictures = readFiles(row.pictures)
    return {
      id: readText(row.uuid) || (typeof row.id === "number" ? row.id : index),
      image: readText(row.file_path) || pictures[0] || "",
      title: readText(row.title),
      description: readText(row.description) || "—",
      initiative: readText(initiative?.name) || "—",
      pictures: pictures.length,
      videos: readFiles(row.videos).length,
      active: readBoolean(row.is_active, true),
    }
  },
})

const columns = [
  { key: "number", label: "#" },
  { key: "image", label: "Image", kind: "icon" as const },
  { key: "title", label: "Title", strong: true },
  { key: "description", label: "Description", truncate: true },
  { key: "initiative", label: "Initiative", nowrap: true },
  { key: "pictures", label: "Pictures", nowrap: true },
  { key: "videos", label: "Videos", nowrap: true },
  { key: "active", label: "Status", kind: "status" as const },
]

const emptyText = computed(() => {
  if (loading.value) return "Loading galleries…"
  return searchTerm.value ? "No galleries match that search." : "No galleries yet."
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

function readFiles(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const path = typeof item === "string" ? item : readText((item as Record<string, unknown> | null)?.file_path)
    return path ? [path] : []
  })
}

function editGallery(id: string | number) {
  navigateTo(`/admin/gallery/${id}`)
}

function deleteGallery(id: string | number) {
  DELETE_API({ api: `galleries/${id}` })
    .then(() => {
      toast("success", "Gallery deleted.")
      getGalleries()
    })
    .catch((error: { response?: { data?: { message?: unknown } } }) => {
      const message = error.response?.data?.message
      toast("error", typeof message === "string" && message ? message : "The gallery could not be deleted.")
    })
}

</script>
