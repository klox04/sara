<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:py-16">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label class="block min-w-0 flex-1">
          <span class="sr-only">Search collections</span>
          <span class="flex items-center gap-2 border border-neutral-300 px-3 py-2.5">
            <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="6.25" />
              <path d="M16.2 16.2 20.5 20.5" stroke-linecap="round" />
            </svg>
            <input
              v-model="query"
              type="search"
              placeholder="Search albums, places, or topics..."
              class="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            >
          </span>
        </label>

      </div>

      <div class="mt-4 flex gap-1 overflow-x-auto pb-1">
        <button
          v-for="item in categories"
          :key="item.uuid || item.name"
          type="button"
          class="shrink-0 px-3.5 py-2 text-[13px] whitespace-nowrap"
          :class="category === item.name ? 'bg-[#1a3328] text-white' : 'text-neutral-700 hover:text-neutral-950'"
          :aria-pressed="category === item.name"
          @click="selectCategory(item)"
        >
          {{ item.name }}
        </button>
      </div>

      <div class="mt-6 flex flex-col gap-2 text-[13px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p v-if="loading">Loading collections…</p>
        <p v-else>{{ filtered.length }} {{ filtered.length === 1 ? "collection" : "collections" }} to explore</p>
        <p>Photos and videos are organized by collection and are updated regularly.</p>
      </div>

      <div v-if="loading" class="animate-pulse" aria-busy="true">
        <div class="mt-6 grid border border-neutral-200 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div class="min-h-64 bg-neutral-100 sm:min-h-80" />
          <div class="flex flex-col justify-center bg-[#f6f4ef] px-6 py-8 sm:px-8">
            <div class="h-2.5 w-24 bg-neutral-200" />
            <div class="mt-4 h-8 w-3/4 bg-neutral-200" />
            <div class="mt-4 h-3 w-full bg-neutral-200/70" />
            <div class="mt-2 h-3 w-5/6 bg-neutral-200/70" />
          </div>
        </div>
        <div class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 3" :key="index" class="border border-neutral-200">
            <div class="h-44 bg-neutral-100 sm:h-48" />
            <div class="px-5 py-5">
              <div class="h-2.5 w-20 bg-neutral-200" />
              <div class="mt-3 h-6 w-4/5 bg-neutral-200" />
              <div class="mt-3 h-3 w-full bg-neutral-100" />
              <div class="mt-2 h-3 w-2/3 bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>

      <template v-else-if="filtered.length">
        <article
          v-if="featured && page === 1"
          class="mt-6 grid overflow-hidden border border-neutral-200 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        >
          <div class="relative min-h-64 bg-[#eef1ec] sm:min-h-80">
            <img
              v-if="featured.image"
              :src="featured.image"
              :alt="featured.title"
              class="absolute inset-0 h-full w-full object-cover object-[center_22%]"
            >
            <p class="absolute top-4 left-4 bg-white/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-700">
              Featured collection
            </p>
          </div>
          <div class="flex flex-col justify-center bg-[#f6f4ef] px-6 py-8 sm:px-8">
            <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
              {{ featured.category }}
            </p>
            <h2 class="mt-3 font-serif text-3xl font-medium leading-tight text-neutral-950 sm:text-4xl">
              {{ featured.title }}
            </h2>
            <p v-if="featured.detail" class="mt-3 line-clamp-4 max-w-md text-sm leading-relaxed text-neutral-600">
              {{ featured.detail }}
            </p>
            <div class="mt-4 flex flex-wrap gap-4 text-[13px] text-neutral-600">
              <p class="inline-flex items-center gap-1.5">
                <Icon name="heroicons:photo" size="1rem" aria-hidden="true" />
                {{ countLabel(featured.photos, "photograph") }}
              </p>
              <p class="inline-flex items-center gap-1.5">
                <Icon name="heroicons:video-camera" size="1rem" aria-hidden="true" />
                {{ countLabel(featured.videos, "video") }}
              </p>
            </div>
            <NuxtLink
              :to="`/gallery/${featured.id}`"
              class="mt-6 inline-flex w-fit items-center gap-2 border border-[#1a3328] px-4 py-2.5 text-[13px] font-medium text-[#1a3328] hover:bg-[#1a3328] hover:text-white"
            >
              View collection
              <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>

        <div v-if="visible.length" class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="item in visible"
            :key="item.id"
            :to="`/gallery/${item.id}`"
            class="group flex flex-col border border-neutral-200 bg-white transition hover:border-neutral-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a3328]"
          >
            <img v-if="item.image" :src="item.image" :alt="item.title" class="h-44 w-full object-cover sm:h-48" loading="lazy">
            <div v-else class="flex h-44 w-full items-center justify-center bg-[#eef1ec] text-[#9aa79e] sm:h-48">
              <Icon name="heroicons:photo" size="2.25rem" aria-hidden="true" />
            </div>
            <div class="flex flex-1 flex-col px-5 py-5">
              <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                {{ item.category }}
              </p>
              <h3 class="mt-2 font-serif text-[1.55rem] leading-tight font-medium text-neutral-950 group-hover:text-[#1a3328]">
                {{ item.title }}
              </h3>
              <p class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600" :title="item.detail">
                {{ item.detail }}
              </p>
              <div class="mt-4 flex flex-wrap gap-4 text-[13px] text-neutral-500">
                <p class="inline-flex items-center gap-1.5">
                  <Icon name="heroicons:photo" size="0.95rem" aria-hidden="true" />
                  {{ countLabel(item.photos, "photo") }}
                </p>
                <p class="inline-flex items-center gap-1.5">
                  <Icon name="heroicons:video-camera" size="0.95rem" aria-hidden="true" />
                  {{ countLabel(item.videos, "video") }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>
      <EmptyState
        v-else-if="query.trim()"
        class="mt-6"
        icon="heroicons:magnifying-glass"
        title="No collections match your search"
        text="Try a different word, or clear the search to see every collection."
      />
      <EmptyState
        v-else-if="category !== allCollections"
        class="mt-6"
        icon="heroicons:photo"
        :title="`No ${category} collections yet`"
        text="Photos and videos for this initiative will appear here soon. Choose another initiative to keep exploring."
      />
      <EmptyState
        v-else
        class="mt-6"
        icon="heroicons:photo"
        title="Collections are on the way"
        text="Photos and videos from official activities and community visits will be shared here soon."
      />

      <nav v-if="!loading && pageCount > 1" class="mt-8 flex items-center justify-center gap-2" aria-label="Collection pages">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-700 disabled:text-neutral-300"
          :disabled="page === 1"
          aria-label="Previous page"
          @click="page--"
        >
          <Icon name="heroicons:arrow-left" size="0.95rem" aria-hidden="true" />
        </button>
        <button
          v-for="number in pageCount"
          :key="number"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center border text-sm"
          :class="page === number ? 'border-[#1a3328] bg-[#1a3328] text-white' : 'border-neutral-300 text-neutral-800'"
          @click="page = number"
        >
          {{ number }}
        </button>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-700 disabled:text-neutral-300"
          :disabled="page === pageCount"
          aria-label="Next page"
          @click="page++"
        >
          <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type Initiative = {
  uuid: string
  name: string
}

type Collection = {
  id: string
  category: string
  title: string
  detail: string
  image: string
  photos: number
  videos: number
  featured: boolean
}

type GalleryRecord = {
  uuid?: string
  initiative?: { name?: string } | null
  title?: string
  description?: string | null
  file_path?: string | null
  is_main_featured?: boolean
  pictures?: { file_path?: string }[] | null
  videos?: { file_path?: string }[] | null
}

const allCollections = "All collections"
const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const initiatives = ref<Initiative[]>([])
const categories = computed<Initiative[]>(() => [{ uuid: "", name: allCollections }, ...initiatives.value])

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function countLabel(count: number, noun: string) {
  return `${count} ${count === 1 ? noun : `${noun}s`}`
}

function getInitiatives() {
  GET_API({ api: "public/initiatives", per_page: 100 })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as { uuid?: unknown, name?: unknown }[] : []
      initiatives.value = rows.flatMap((row) => {
        const name = typeof row.name === "string" ? row.name.trim() : ""
        return name ? [{ uuid: typeof row.uuid === "string" ? row.uuid : "", name }] : []
      })
    })
    .catch((error: unknown) => {
      console.error("Error fetching initiatives:", error)
    })
}

const collections = ref<Collection[]>([])
const loading = ref(true)
const initiativeUuid = ref("")
let collectionsRequest = 0

function getCollections() {
  const request = ++collectionsRequest
  const uuid = initiativeUuid.value
  loading.value = true
  GET_API({
    api: "public/galleries",
    per_page: 100,
    ...(uuid ? { initiative_uuid: uuid } : {}),
  })
    .then((response) => {
      if (request !== collectionsRequest) return
      const rows = Array.isArray(response.data?.data) ? response.data.data as GalleryRecord[] : []
      collections.value = rows
        .filter(row => row.title)
        .map((row, index) => {
          const pictures = Array.isArray(row.pictures) ? row.pictures.filter(item => item?.file_path) : []
          const videos = Array.isArray(row.videos) ? row.videos.filter(item => item?.file_path) : []
          return {
            id: row.uuid || `gallery-${index}`,
            category: row.initiative?.name ?? "",
            title: row.title ?? "",
            detail: row.description?.trim() ?? "",
            image: storageSrc(row.file_path?.trim() || pictures[0]?.file_path || ""),
            photos: pictures.length,
            videos: videos.length,
            featured: row.is_main_featured === true,
          }
        })
    })
    .catch((error: unknown) => {
      if (request !== collectionsRequest) return
      collections.value = []
      console.error("Error fetching collections:", error)
    })
    .finally(() => {
      if (request === collectionsRequest) loading.value = false
    })
}

function selectCategory(item: Initiative) {
  if (category.value === item.name) return
  category.value = item.name
  initiativeUuid.value = item.uuid
  getCollections()
}

onMounted(() => {
  getInitiatives()
  getCollections()
})

const query = ref("")
const category = ref(allCollections)
const page = ref(1)
const pageSize = 6

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  return collections.value.filter(item =>
    !term || [item.title, item.detail, item.category].some(value => value.toLowerCase().includes(term)),
  )
})

const featured = computed(() => filtered.value.find(item => item.featured) ?? null)

const cards = computed(() => filtered.value.filter(item => item !== featured.value))

const pageCount = computed(() => Math.max(1, Math.ceil(cards.value.length / pageSize)))

const visible = computed(() => {
  const start = (page.value - 1) * pageSize
  return cards.value.slice(start, start + pageSize)
})

watch([query, category], () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>
