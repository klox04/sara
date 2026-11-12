<template>
  <section id="initiatives" class="scroll-mt-24 bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        Areas of service
      </p>
      <div class="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 class="font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
          Explore the initiatives
        </h2>
      </div>

      <label class="mt-6 block max-w-xl">
        <span class="sr-only">Search programs</span>
        <span class="flex items-center gap-2 border border-neutral-300 px-3 py-2.5">
          <svg viewBox="0 0 24 24" class="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="6.25" />
            <path d="M16.2 16.2 20.5 20.5" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            type="search"
            enterkeyhint="search"
            placeholder="Search programs, initiatives, or keywords..."
            class="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            @keydown.enter.prevent="search"
          >
        </span>
      </label>

      <div class="mt-5 flex gap-1 overflow-x-auto pb-1">
        <button
          v-for="item in categories"
          :key="item.uuid || item.name"
          type="button"
          class="shrink-0 px-3.5 py-2 text-[13px] whitespace-nowrap"
          :class="milestoneUuid === item.uuid ? 'bg-[#1a3328] text-white' : 'text-neutral-700 hover:text-neutral-950'"
          :aria-pressed="milestoneUuid === item.uuid"
          @click="selectCategory(item)"
        >
          {{ item.name }}
        </button>
      </div>

      <div class="mt-8 text-[13px] text-neutral-500">
        <p v-if="loading">Loading programs…</p>
        <p v-else>{{ total }} {{ total === 1 ? "program" : "programs" }} to explore</p>
      </div>

      <div v-if="loading" class="mt-5 grid animate-pulse gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        <div v-for="index in 3" :key="index" class="border border-neutral-200">
          <div class="aspect-[16/10] bg-neutral-100" />
          <div class="bg-[#eef1ec] px-5 py-4">
            <div class="h-2.5 w-24 bg-[#dfe4dc]" />
          </div>
          <div class="px-5 py-5">
            <div class="h-6 w-4/5 bg-neutral-200" />
            <div class="mt-4 h-3 w-full bg-neutral-100" />
            <div class="mt-2 h-3 w-5/6 bg-neutral-100" />
          </div>
        </div>
      </div>

      <div v-else-if="programs.length" class="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="program in programs"
          :key="program.id"
          class="flex flex-col overflow-hidden border border-neutral-200 bg-white"
        >
          <div class="aspect-[16/10] overflow-hidden bg-[#eef1ec]">
            <img
              v-if="program.image"
              :src="program.image"
              :alt="program.title"
              class="h-full w-full object-cover"
              loading="lazy"
            >
            <div v-else class="flex h-full w-full items-center justify-center text-[#9aa79e]">
              <Icon name="heroicons:photo" size="2.5rem" aria-hidden="true" />
            </div>
          </div>
          <div class="border-t border-neutral-200 bg-[#eef1ec] px-5 py-4 text-neutral-700">
            <p class="text-[11px] font-medium uppercase tracking-[0.14em]">{{ program.category }}</p>
          </div>
          <div class="flex flex-1 flex-col px-5 py-5">
            <h3 class="font-serif text-[1.65rem] leading-tight font-medium text-neutral-950">
              {{ program.title }}
            </h3>
            <p class="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-neutral-600" :title="program.detail">
              {{ program.detail }}
            </p>
            <NuxtLink
              to="/archive"
              class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
            >
              View program
              <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
      <EmptyState
        v-else-if="searchTerm"
        class="mt-5"
        icon="heroicons:magnifying-glass"
        title="No programs match your search"
        text="Try a different word, or clear the search to see every program."
      />
      <EmptyState
        v-else-if="milestoneUuid"
        class="mt-5"
        icon="heroicons:light-bulb"
        :title="`No ${category} programs yet`"
        text="Programs under this milestone will appear here soon. Choose another milestone to keep exploring."
      />
      <EmptyState
        v-else
        class="mt-5"
        icon="heroicons:light-bulb"
        title="Programs are on the way"
        text="Programs and initiatives for every Filipino will be listed here soon."
      />

      <nav v-if="pageCount > 1" class="mt-8 flex items-center justify-center gap-2" aria-label="Program pages">
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

type Milestone = {
  uuid: string
  name: string
}

type MilestoneRecord = {
  uuid?: string
  year?: string | number | null
  title?: string
  for?: string
}

const allPrograms = "All programs"
const { GET_API } = useGlobalStore()
const milestones = ref<Milestone[]>([])
const categories = computed<Milestone[]>(() => [{ uuid: "", name: allPrograms }, ...milestones.value])

function milestoneName(record: MilestoneRecord | null | undefined) {
  const title = record?.title?.trim() ?? ""
  const year = record?.year ? String(record.year) : ""
  return [title, year].filter(Boolean).join(" · ")
}

function getMilestones() {
  GET_API({ api: "public/milestones", per_page: 100 })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as MilestoneRecord[] : []
      milestones.value = rows.flatMap((row) => {
        const name = milestoneName(row)
        if (!row.uuid || !name || row.for?.toLowerCase() !== "home") return []
        return [{ uuid: row.uuid, name }]
      })
    })
    .catch((error: unknown) => {
      console.error("Error fetching milestones:", error)
    })
}

type Program = {
  id: string
  image: string
  category: string
  title: string
  detail: string
}

type ProgramRecord = {
  uuid?: string
  milestone?: MilestoneRecord | null
  title?: string
  description?: string
  file_path?: string | null
}

const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

const category = ref(allPrograms)
const milestoneUuid = ref("")

const { rows: programs, query, searchTerm, page, perPage, total, loading, reset, search } = usePagedList<Program>({
  api: "public/programs",
  perPage: 6,
  params: () => (milestoneUuid.value ? { milestone_uuid: milestoneUuid.value } : {}),
  map: (row, index) => {
    const record = row as ProgramRecord
    return {
      id: record.uuid || `program-${index}`,
      image: storageSrc(record.file_path?.trim() ?? ""),
      category: milestoneName(record.milestone),
      title: record.title ?? "",
      detail: record.description?.trim() ?? "",
    }
  },
})

const pageCount = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))

function selectCategory(item: Milestone) {
  if (milestoneUuid.value === item.uuid) return
  category.value = item.name
  milestoneUuid.value = item.uuid
  reset()
}

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

onMounted(() => {
  getMilestones()
})
</script>
