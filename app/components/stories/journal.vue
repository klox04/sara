<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:py-16">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        Explore the journal
      </p>
      <div class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
          More stories to discover
        </h2>
        <!-- <div class="flex items-end gap-3">
          <label class="text-[11px] text-neutral-500">
            Sort by
            <select
              v-model="sort"
              class="mt-1 block min-w-[10.5rem] border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none"
            >
              <option value="editorial">Editorial order</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </label>
          <button
            type="button"
            class="mb-0.5 inline-flex items-center gap-1.5 px-2 py-2 text-sm text-neutral-600 hover:text-neutral-950"
            @click="reset"
          >
            Reset
            <Icon name="heroicons:x-mark" size="0.9rem" aria-hidden="true" />
          </button>
        </div> -->
      </div>

      <label class="mt-6 block">
        <span class="sr-only">Search stories</span>
        <span class="flex items-center gap-2 border border-neutral-300 px-3 py-2.5">
          <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="6.25" />
            <path d="M16.2 16.2 20.5 20.5" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Search stories..."
            class="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          >
        </span>
      </label>

      <div class="mt-4 flex gap-1 overflow-x-auto pb-1">
        <button
          v-for="item in categories"
          :key="item.name"
          type="button"
          class="shrink-0 px-3.5 py-2 text-[13px] whitespace-nowrap"
          :class="category === item.name ? 'bg-[#1a3328] text-white' : 'text-neutral-700 hover:text-neutral-950'"
          :aria-pressed="category === item.name"
          @click="selectCategory(item)"
        >
          {{ item.name }}
        </button>
      </div>

      <div class="mt-6 text-[13px] text-neutral-500">
        <p v-if="loading">Loading stories…</p>
        <p v-else>{{ filtered.length }} {{ filtered.length === 1 ? "story" : "stories" }} to explore</p>
      </div>

      <div v-if="loading" class="mt-5 grid animate-pulse gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        <div v-for="index in 3" :key="index" class="border border-neutral-200">
          <div class="h-44 w-full bg-neutral-200 sm:h-48" />
          <div class="px-5 py-5">
            <div class="h-2.5 w-16 bg-neutral-200" />
            <div class="mt-4 h-6 w-4/5 bg-neutral-200" />
            <div class="mt-4 h-3 w-full bg-neutral-100" />
            <div class="mt-2 h-3 w-5/6 bg-neutral-100" />
          </div>
        </div>
      </div>

      <div v-else-if="visible.length" class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="story in visible"
          :key="story.id"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <img
            v-if="story.image"
            :src="story.image"
            :alt="story.alt"
            class="h-44 w-full object-cover sm:h-48"
          >
          <div v-else class="h-44 w-full bg-neutral-100 sm:h-48" aria-hidden="true" />
          <div class="flex flex-1 flex-col px-5 py-5">
            <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {{ story.category }}
            </p>
            <h3 class="mt-2 font-serif text-[1.65rem] leading-tight font-medium text-neutral-950">
              {{ story.title }}
            </h3>
            <p class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600" :title="story.detail">
              {{ story.detail }}
            </p>
            <NuxtLink
              :to="story.to"
              class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
            >
              Read story
              <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
      <EmptyState
        v-else-if="query.trim()"
        class="mt-5"
        icon="heroicons:magnifying-glass"
        title="No stories match your search"
        text="Try a different word, or clear the search to see every story."
      />
      <EmptyState
        v-else-if="category !== allStories"
        class="mt-5"
        icon="heroicons:tag"
        :title="`No ${category.toLowerCase()} stories yet`"
        text="Stories in this category will appear here soon. Choose another category to keep exploring."
      />
      <EmptyState
        v-else
        class="mt-5"
        icon="heroicons:book-open"
        title="Stories are on the way"
        text="New stories from communities across the country will appear here soon."
        to="/about"
        link-label="Learn about Sara"
      />

      <nav v-if="!loading && pageCount > 1" class="mt-8 flex items-center justify-center gap-2" aria-label="Story pages">
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

const allStories = "All stories"
const { GET_API } = useGlobalStore()
type StoryCategory = {
  uuid: string
  name: string
}

const categoryList = ref<StoryCategory[]>([])
const categories = computed<StoryCategory[]>(() => [{ uuid: "", name: allStories }, ...categoryList.value])
const categoryUuid = ref("")

function getCategories() {
  GET_API({ api: "public/categories" })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as { uuid?: unknown, name?: unknown }[] : []
      const items = rows.flatMap((row) => {
        const name = typeof row.name === "string" ? row.name.trim() : ""
        return name ? [{ uuid: typeof row.uuid === "string" ? row.uuid : "", name }] : []
      })
      categoryList.value = items
    })
    .catch((error: unknown) => {
      console.error("Error fetching categories:", error)
    })
}

function selectCategory(item: StoryCategory) {
  if (category.value === item.name) return
  category.value = item.name
  categoryUuid.value = item.uuid
  getStories()
}

type JournalStory = {
  id: string
  category: string
  title: string
  detail: string
  image: string
  alt: string
  to: string
}

type StoryRecord = {
  uuid?: string
  category?: { name?: string } | null
  title?: string
  description?: string
  file_path?: string
  is_active?: boolean
}

const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const stories = ref<JournalStory[]>([])
const loading = ref(true)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path}`
}

let storiesRequest = 0

function getStories() {
  const request = ++storiesRequest
  const uuid = categoryUuid.value
  loading.value = true
  GET_API({
    api: "public/stories",
    per_page: 100,
    ...(uuid ? { category_uuid: uuid } : {}),
  })
    .then((response) => {
      if (request !== storiesRequest) return
      const rows = Array.isArray(response.data?.data) ? response.data.data as StoryRecord[] : []
      const items = rows
        .filter(row => row.uuid && row.title && row.is_active !== false)
        .map(row => ({
          id: row.uuid!,
          category: row.category?.name || "Story",
          title: row.title!,
          detail: row.description ?? "",
          image: storageSrc(row.file_path ?? ""),
          alt: row.title!,
          to: `/stories/${row.uuid}`,
        }))
      stories.value = items
    })
    .catch((error: unknown) => {
      if (request !== storiesRequest) return
      stories.value = []
      console.error("Error fetching stories:", error)
    })
    .finally(() => {
      if (request === storiesRequest) loading.value = false
    })
}

onMounted(() => {
  getCategories()
  getStories()
})


const query = ref("")
const category = ref(allStories)
const sort = ref("editorial")
const page = ref(1)
const pageSize = 6

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  const list = stories.value.filter((story) => {
    const matchesQuery = !term || [story.title, story.detail, story.category].some(value => value.toLowerCase().includes(term))
    return matchesQuery
  })

  if (sort.value === "title") {
    return [...list].sort((a, b) => a.title.localeCompare(b.title))
  }

  if (sort.value === "category") {
    return [...list].sort((a, b) => a.category.localeCompare(b.category))
  }

  return list
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

const visible = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function reset() {
  query.value = ""
  sort.value = "editorial"
  page.value = 1
  selectCategory({ uuid: "", name: allStories })
}

watch([query, category, sort], () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>
