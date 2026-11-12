<template>
  <section class="bg-[#faf9f7] text-neutral-900">
    <div class="mx-auto max-w-[1180px] px-6 pt-8 pb-16 sm:px-8 lg:pb-20">
      <form class="flex flex-col gap-3 sm:flex-row" role="search" @submit.prevent="applySearch">
        <label class="flex flex-1 items-center gap-3 border border-neutral-300 bg-white px-4 py-3">
          <span class="sr-only">Search records</span>
          <Icon name="heroicons:magnifying-glass" size="1.1rem" class="shrink-0 text-neutral-500" aria-hidden="true" />
          <input
            v-model="query"
            type="search"
            enterkeyhint="search"
            placeholder="Search records, publications, speeches, reports..."
            class="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          >
        </label>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 bg-[#1d3b30] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#163026]"
        >
          Search
          <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
        </button>
      </form>

      <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
        <label v-for="filter in filterFields" :key="filter.key" class="flex items-end gap-3">
          <Icon :name="filter.icon" size="1.35rem" class="mb-2 shrink-0 text-neutral-600" aria-hidden="true" />
          <span class="flex-1">
            <span class="block text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-600">
              {{ filter.label }}
            </span>
            <select
              v-model="filters[filter.key]"
              class="mt-1 block w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none"
            >
              <option value="">{{ filter.all }}</option>
              <option v-for="option in filter.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </span>
        </label>
        <button
          type="button"
          class="inline-flex items-center gap-2 justify-self-start py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-700 hover:text-neutral-950"
          @click="clearFilters"
        >
          <Icon name="heroicons:arrow-path" size="1rem" aria-hidden="true" />
          Clear filters
        </button>
      </div>

      <div class="mt-14 flex items-center justify-between gap-4">
        <h2 class="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-900 sm:text-[12px] sm:tracking-[0.2em]">
          Featured documents
        </h2>
        <a href="#all-records" class="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-800 hover:text-forest sm:gap-2 sm:text-[11px] sm:tracking-[0.14em]">
          View all featured
          <Icon name="heroicons:arrow-right" size="0.9rem" aria-hidden="true" />
        </a>
      </div>

      <div v-if="featuredLoading" class="mt-5 grid animate-pulse gap-6 md:grid-cols-3" aria-busy="true">
        <div v-for="index in 3" :key="index" class="border border-neutral-200 bg-white">
          <div class="h-48 bg-neutral-100" />
          <div class="px-5 pt-5 pb-4">
            <div class="h-2.5 w-24 bg-neutral-200" />
            <div class="mt-3 h-6 w-4/5 bg-neutral-200" />
            <div class="mt-3 h-3 w-full bg-neutral-100" />
            <div class="mt-2 h-3 w-2/3 bg-neutral-100" />
            <div class="mt-6 h-3 w-1/2 bg-neutral-100" />
          </div>
        </div>
      </div>

      <div v-else-if="featured.length" class="mt-5 grid gap-6 md:grid-cols-3">
        <article
          v-for="item in featured"
          :key="item.id"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <img v-if="item.image" :src="item.image" :alt="item.title" class="h-48 w-full object-cover">
          <div v-else class="flex h-48 w-full items-center justify-center bg-[#eef1ec] text-[#5d6f64]" aria-hidden="true">
            <Icon :name="item.icon" size="2.75rem" />
          </div>
          <div class="flex flex-1 flex-col px-5 pt-5 pb-4">
            <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
              {{ item.category }}
            </p>
            <h3 class="mt-2 font-serif text-[1.65rem] leading-[1.1] font-medium text-neutral-950">
              {{ item.title }}
            </h3>
            <p class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
              {{ item.text }}
            </p>
            <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3 text-[12px] text-neutral-500">
              <span>{{ item.date }}<template v-if="item.type"><span class="px-1.5">|</span>{{ item.type }}</template></span>
              <NuxtLink
                :to="`/archive/${item.id}`"
                class="inline-flex shrink-0 items-center gap-1.5 font-medium text-neutral-900 hover:text-forest"
              >
                View record
                <Icon name="heroicons:arrow-right" size="0.85rem" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <EmptyState
        v-else
        class="mt-5"
        icon="heroicons:star"
        title="Featured documents are on the way"
        text="Highlighted speeches, reports, and publications will appear here soon."
      />

      <div id="all-records" class="mt-14 flex scroll-mt-24 items-center justify-between gap-4">
        <h2 class="text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
          All records
        </h2>
        <p class="text-[13px] text-neutral-500">
          <template v-if="loading">Loading records…</template>
          <template v-else>{{ recordCount }} {{ recordCount === 1 ? "record" : "records" }}</template>
        </p>
      </div>

      <div v-if="loading" class="mt-4 animate-pulse border-y border-neutral-300" aria-busy="true">
        <div v-for="index in 5" :key="index" class="flex items-center gap-4 border-b border-neutral-200 py-4 last:border-b-0">
          <div class="size-5 shrink-0 rounded bg-neutral-200" />
          <div class="h-3 flex-[2] bg-neutral-200" />
          <div class="hidden h-3 flex-1 bg-neutral-100 md:block" />
          <div class="hidden h-3 flex-1 bg-neutral-100 md:block" />
          <div class="hidden h-3 flex-1 bg-neutral-100 md:block" />
        </div>
      </div>

      <div v-else-if="visible.length" class="mt-4">
        <table class="hidden w-full border-collapse text-left text-[13px] md:table">
          <thead>
            <tr class="border-y border-neutral-300 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
              <th scope="col" class="py-3 pr-4 pl-11 font-medium">Title</th>
              <th scope="col" class="px-4 py-3 font-medium">Date</th>
              <th scope="col" class="px-4 py-3 font-medium">Category</th>
              <th scope="col" class="px-4 py-3 font-medium">Institution</th>
              <th scope="col" class="px-4 py-3 font-medium">Type</th>
              <th scope="col" class="py-3 pl-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in visible" :key="record.id" class="border-b border-neutral-200">
              <td class="py-3 pr-4">
                <span class="flex items-center gap-3">
                  <Icon name="heroicons:document-text" size="1.2rem" class="shrink-0 text-neutral-500" aria-hidden="true" />
                  <span class="text-neutral-900">{{ record.title }}</span>
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-neutral-700">{{ record.date }}</td>
              <td class="px-4 py-3 text-neutral-700">{{ record.category }}</td>
              <td class="px-4 py-3 text-neutral-700">{{ record.institution }}</td>
              <td class="px-4 py-3 text-neutral-700">{{ record.type }}</td>
              <td class="py-3 pl-4">
                <NuxtLink
                  :to="`/archive/${record.id}`"
                  class="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-neutral-900 hover:text-forest"
                >
                  View record
                  <Icon name="heroicons:arrow-right" size="0.85rem" aria-hidden="true" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <ul class="divide-y divide-neutral-200 border-y border-neutral-300 md:hidden">
          <li v-for="record in visible" :key="`m-${record.id}`" class="flex gap-3 py-4">
            <Icon name="heroicons:document-text" size="1.2rem" class="mt-0.5 shrink-0 text-neutral-500" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-neutral-900">{{ record.title }}</p>
              <p class="mt-1 text-[12px] text-neutral-500">
                {{ record.date }} · {{ record.category }} · {{ record.type }}
              </p>
              <p class="mt-0.5 text-[12px] text-neutral-500">{{ record.institution }}</p>
              <NuxtLink
                :to="`/archive/${record.id}`"
                class="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-900 hover:text-forest"
              >
                View record
                <Icon name="heroicons:arrow-right" size="0.85rem" aria-hidden="true" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>
      <EmptyState
        v-else-if="searchTerm || hasFilters"
        class="mt-6"
        icon="heroicons:magnifying-glass"
        title="No records match your search"
        text="Try a different word or clear the filters to see every record."
      />
      <EmptyState
        v-else
        class="mt-6"
        icon="heroicons:archive-box"
        title="Records are on the way"
        text="Speeches, reports, and public documents will be listed here soon."
      />

      <nav v-if="pageCount > 1" class="mt-8 flex items-center justify-center gap-2" aria-label="Record pages">
        <button
          v-for="number in pageCount"
          :key="number"
          type="button"
          class="inline-flex h-8 min-w-8 items-center justify-center border px-2 text-[13px]"
          :class="page === number ? 'border-[#1d3b30] bg-[#1d3b30] text-white' : 'border-neutral-300 bg-white text-neutral-800'"
          :aria-current="page === number ? 'page' : undefined"
          @click="page = number"
        >
          {{ number }}
        </button>
        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center border border-neutral-300 bg-white text-neutral-700 disabled:text-neutral-300"
          :disabled="page === pageCount"
          aria-label="Next page"
          @click="page++"
        >
          <Icon name="heroicons:chevron-right" size="0.95rem" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ref } from "vue"
import EmptyState from "~/components/EmptyState.vue"
import { archiveYear, emptyArchiveFilters, type ArchiveFilterKey, type ArchiveFilters } from "~~/shared/archive"

type FeaturedRecord = {
  id: string
  category: string
  icon: string
  title: string
  text: string
  date: string
  type: string
  image: string
  file: string
}

type Option = {
  uuid: string
  name: string
}

type RecordRow = {
  id: string
  title: string
  date: string
  year: string
  category: string
  institution: string
  type: string
}

type RecordRecord = {
  uuid?: string
  title?: string
  description?: string | null
  record_date?: string | null
  category?: { name?: string, icon?: string | null } | null
  institution?: { name?: string } | null
  type?: { name?: string } | null
  file_path?: string | null
  is_featured?: boolean | number | string
}

const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const filters = useState<ArchiveFilters>("archive-filters", emptyArchiveFilters)
const categories = ref<Option[]>([])
const institutions = ref<Option[]>([])
const types = ref<Option[]>([])
const years = ref<string[]>([])

const filterFields = computed<{ key: ArchiveFilterKey, label: string, all: string, icon: string, options: string[] }[]>(() => [
  { key: "year", label: "Year", all: "All years", icon: "heroicons:calendar", options: years.value },
  { key: "category", label: "Category", all: "All categories", icon: "heroicons:document-text", options: categories.value.map(item => item.name) },
  { key: "institution", label: "Institution", all: "All institutions", icon: "heroicons:building-library", options: institutions.value.map(item => item.name) },
  { key: "type", label: "Type", all: "All types", icon: "heroicons:document-duplicate", options: types.value.map(item => item.name) },
])

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  if (!value || Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function uuidFor(list: Option[], name: string) {
  return name ? list.find(item => item.name === name)?.uuid ?? "" : ""
}

const featured = ref<FeaturedRecord[]>([])
const featuredLoading = ref(true)

function isFeatured(value: RecordRecord["is_featured"]) {
  return value === true || value === 1 || value === "1" || value === "true"
}

function isImagePath(path: string) {
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(path)
}

function getFeatured() {
  featuredLoading.value = true
  GET_API({ api: "public/records", is_featured: true, per_page: 100 })
    .then((response) => {
      const data = Array.isArray(response.data?.data) ? response.data.data as RecordRecord[] : []
      featured.value = data
        .filter(record => record.title && isFeatured(record.is_featured))
        .slice(0, 3)
        .map((record, index) => {
          const file = storageSrc(record.file_path?.trim() ?? "")
          const icon = record.category?.icon ?? ""
          return {
            id: record.uuid || `featured-${index}`,
            category: record.category?.name ?? "",
            icon: icon.includes(":") ? icon : "heroicons:document-text",
            title: record.title ?? "",
            text: record.description?.trim() ?? "",
            date: formatDate(record.record_date ?? ""),
            type: record.type?.name ?? "",
            image: isImagePath(file) ? file : "",
            file,
          }
        })
    })
    .catch((error: unknown) => {
      featured.value = []
      console.error("Error fetching featured records:", error)
    })
    .finally(() => {
      featuredLoading.value = false
    })
}

const { rows, query, searchTerm, page, perPage, total, loading, reset, search } = usePagedList<RecordRow>({
  api: "public/records",
  perPage: 10,
  params: () => {
    const category = uuidFor(categories.value, filters.value.category)
    const institution = uuidFor(institutions.value, filters.value.institution)
    const type = uuidFor(types.value, filters.value.type)
    return {
      ...(category ? { record_category_uuid: category } : {}),
      ...(institution ? { institution_uuid: institution } : {}),
      ...(type ? { record_type_uuid: type } : {}),
      ...(filters.value.year ? { year: filters.value.year } : {}),
    }
  },
  map: (row, index) => {
    const record = row as RecordRecord
    const date = record.record_date ?? ""
    return {
      id: record.uuid || `record-${index}`,
      title: record.title ?? "",
      date: formatDate(date),
      year: archiveYear(date),
      category: record.category?.name ?? "",
      institution: record.institution?.name ?? "",
      type: record.type?.name ?? "",
    }
  },
})

const hasFilters = computed(() => Object.values(filters.value).some(Boolean))
const visible = computed(() => filters.value.year ? rows.value.filter(record => record.year === filters.value.year) : rows.value)
const recordCount = computed(() => filters.value.year ? visible.value.length : total.value)
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))

function readOptions(response: { data?: { data?: unknown } }) {
  const data = response.data?.data
  if (!Array.isArray(data)) return []
  return (data as { uuid?: unknown, name?: unknown }[]).flatMap((item) => {
    const name = typeof item.name === "string" ? item.name.trim() : ""
    return name ? [{ uuid: typeof item.uuid === "string" ? item.uuid : "", name }] : []
  })
}

function getFilterOptions() {
  const lists: [string, Ref<Option[]>][] = [
    ["public/record-categories", categories],
    ["public/institutions", institutions],
    ["public/record-types", types],
  ]
  const requests = lists.map(([api, target]) => GET_API({ api, per_page: 100 })
    .then((response) => {
      target.value = readOptions(response)
    })
    .catch((error: unknown) => {
      console.error(`Error fetching ${api}:`, error)
    }))
  const yearRequest = GET_API({ api: "public/records", per_page: 100 })
    .then((response) => {
      const data = Array.isArray(response.data?.data) ? response.data.data as RecordRecord[] : []
      years.value = [...new Set(data.map(record => archiveYear(record.record_date ?? "")).filter(Boolean))].sort().reverse()
    })
    .catch(() => {
      years.value = []
    })
  Promise.all([...requests, yearRequest]).then(() => {
    if (filters.value.category || filters.value.institution || filters.value.type) reset()
  })
}

function applySearch() {
  search()
}

function clearFilters() {
  searchTerm.value = ""
  query.value = ""
  filters.value = emptyArchiveFilters()
}

watch(filters, () => {
  reset()
}, { deep: true })

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

onMounted(() => {
  getFilterOptions()
  getFeatured()
})

onBeforeUnmount(() => {
  filters.value = emptyArchiveFilters()
})
</script>
