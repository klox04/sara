<template>
  <section class="bg-[#faf9f7] text-neutral-900">
    <div class="mx-auto max-w-[1180px] px-6 pt-8 pb-16 sm:px-8 lg:pb-20">
      <form class="flex flex-col gap-3 sm:flex-row" role="search" @submit.prevent="applySearch">
        <label class="flex flex-1 items-center gap-3 border border-neutral-300 bg-white px-4 py-3">
          <span class="sr-only">Search records</span>
          <Icon name="heroicons:magnifying-glass" size="1.1rem" class="shrink-0 text-neutral-500" aria-hidden="true" />
          <input
            v-model="draft"
            type="search"
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

      <div class="mt-5 grid gap-6 md:grid-cols-3">
        <article
          v-for="item in featured"
          :key="item.title"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <img :src="item.image" :alt="item.alt" class="h-48 w-full object-cover" :class="item.position">
          <div class="flex flex-1 flex-col px-5 pt-5 pb-4">
            <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
              {{ item.category }}
            </p>
            <h3 class="mt-2 font-serif text-[1.65rem] leading-[1.1] font-medium text-neutral-950">
              {{ item.title }}
            </h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
              {{ item.text }}
            </p>
            <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3 text-[12px] text-neutral-500">
              <span>{{ item.date }} <span class="px-1.5">|</span> {{ item.type }}</span>
              <NuxtLink to="/archive" class="inline-flex shrink-0 items-center gap-1.5 font-medium text-neutral-900 hover:text-forest">
                View record
                <Icon name="heroicons:arrow-right" size="0.85rem" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div id="all-records" class="mt-14 flex scroll-mt-24 items-center justify-between gap-4">
        <h2 class="text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
          All records
        </h2>
        <p class="text-[13px] text-neutral-500">
          {{ filtered.length }} {{ filtered.length === 1 ? "record" : "records" }}
        </p>
      </div>

      <div v-if="visible.length" class="mt-4">
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
            <tr v-for="record in visible" :key="record.title" class="border-b border-neutral-200">
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
                <NuxtLink to="/archive" class="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-neutral-900 hover:text-forest">
                  View record
                  <Icon name="heroicons:arrow-right" size="0.85rem" aria-hidden="true" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <ul class="divide-y divide-neutral-200 border-y border-neutral-300 md:hidden">
          <li v-for="record in visible" :key="`m-${record.title}`" class="flex gap-3 py-4">
            <Icon name="heroicons:document-text" size="1.2rem" class="mt-0.5 shrink-0 text-neutral-500" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-neutral-900">{{ record.title }}</p>
              <p class="mt-1 text-[12px] text-neutral-500">
                {{ record.date }} · {{ record.category }} · {{ record.type }}
              </p>
              <p class="mt-0.5 text-[12px] text-neutral-500">{{ record.institution }}</p>
              <NuxtLink to="/archive" class="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-900 hover:text-forest">
                View record
                <Icon name="heroicons:arrow-right" size="0.85rem" aria-hidden="true" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>
      <p v-else class="mt-6 border-y border-neutral-300 py-8 text-center text-sm text-neutral-500">
        No records match your search.
      </p>

      <nav class="mt-8 flex items-center justify-center gap-2" aria-label="Record pages">
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
import book from "~/assets/image/book.png"
import { archiveRecords, archiveYear, emptyArchiveFilters, type ArchiveFilterKey, type ArchiveFilters } from "~~/shared/archive"

const featured = [
  {
    category: "Public address",
    title: "A Stronger Philippines Through Its People",
    text: "Keynote address on the role of communities in nation-building.",
    date: "July 25, 2022",
    type: "Speech",
    image: "/media/IMG_3065.JPG",
    alt: "Sara Duterte speaking at a podium beside the Philippine flag",
    position: "object-[center_20%]",
  },
  {
    category: "Policy publication",
    title: "Inclusive Education for Every Filipino",
    text: "A policy paper on expanding access to quality, inclusive, and relevant education.",
    date: "March 14, 2021",
    type: "Policy Document",
    image: "/media/imag4.jpg",
    alt: "Sara Duterte speaking to students in a classroom",
    position: "object-[center_25%]",
  },
  {
    category: "Program report",
    title: "Office of the Vice President Program Report 2022",
    text: "A comprehensive report on programs, initiatives, and measurable results.",
    date: "December 2022",
    type: "Report",
    image: book,
    alt: "Bound program reports stacked on a desk",
    position: "object-[25%_center]",
  },
]

const records = archiveRecords

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

const filterFields: { key: ArchiveFilterKey, label: string, all: string, icon: string, options: string[] }[] = [
  { key: "year", label: "Year", all: "All years", icon: "heroicons:calendar", options: unique(records.map(record => archiveYear(record.date))).reverse() },
  { key: "category", label: "Category", all: "All categories", icon: "heroicons:document-text", options: unique(records.map(record => record.category)) },
  { key: "institution", label: "Institution", all: "All institutions", icon: "heroicons:building-library", options: unique(records.map(record => record.institution)) },
  { key: "type", label: "Type", all: "All types", icon: "heroicons:document-duplicate", options: unique(records.map(record => record.type)) },
]

const draft = ref("")
const query = ref("")
const filters = useState<ArchiveFilters>("archive-filters", emptyArchiveFilters)
const page = ref(1)
const pageSize = 10

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  const { year, category, institution, type } = filters.value
  return records.filter((record) => {
    if (year && archiveYear(record.date) !== year) return false
    if (category && record.category !== category) return false
    if (institution && record.institution !== institution) return false
    if (type && record.type !== type) return false
    return !term || Object.values(record).some(value => value.toLowerCase().includes(term))
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

const visible = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function applySearch() {
  query.value = draft.value
}

function clearFilters() {
  draft.value = ""
  query.value = ""
  filters.value = emptyArchiveFilters()
}

watch([query, filters], () => {
  page.value = 1
}, { deep: true })

onBeforeUnmount(() => {
  filters.value = emptyArchiveFilters()
})
</script>
