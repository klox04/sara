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
        <label class="w-full max-w-[11rem] text-[11px] text-neutral-500 lg:mb-1">
          Sort by
          <select
            v-model="sort"
            class="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
        </label>
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
            placeholder="Search programs, initiatives, or keywords..."
            class="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          >
        </span>
      </label>

      <div class="mt-5 flex gap-1 overflow-x-auto pb-1">
        <button
          v-for="item in categories"
          :key="item"
          type="button"
          class="shrink-0 px-3.5 py-2 text-[13px] whitespace-nowrap"
          :class="category === item ? 'bg-[#1a3328] text-white' : 'text-neutral-700 hover:text-neutral-950'"
          @click="category = item"
        >
          {{ item }}
        </button>
      </div>

      <div class="mt-8 flex flex-col gap-2 text-[13px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{{ filtered.length }} programs to explore</p>
        
      </div>

      <div v-if="visible.length" class="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="program in visible"
          :key="program.title"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <div class="flex items-center justify-between bg-[#eef1ec] px-5 py-4 text-neutral-700">
            <Icon v-if="program.icon !== 'leaf'" :name="program.icon" size="1.45rem" aria-hidden="true" />
            <svg v-else viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M5 19c7.5-.8 12-7.2 14-14-6.2 1.6-12.4 5.6-14 14Z" stroke-linejoin="round" />
              <path d="M9.5 14.5c1.8-2 3.8-4.4 6-7" stroke-linecap="round" />
            </svg>
            <p class="text-[11px] font-medium uppercase tracking-[0.14em]">{{ program.category }}</p>
          </div>
          <div class="flex flex-1 flex-col px-5 py-5">
            <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              Sample content
            </p>
            <h3 class="mt-2 font-serif text-[1.65rem] leading-tight font-medium text-neutral-950">
              {{ program.title }}
            </h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
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
      <p v-else class="mt-8 text-sm text-neutral-500">
        No programs match your search.
      </p>

      <nav class="mt-8 flex items-center justify-center gap-2" aria-label="Program pages">
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
const categories = [
  "All initiatives",
  "Education",
  "Health",
  "Social Services",
  "Economy & Jobs",
  "Infrastructure",
  "Peace & Security",
  "Disaster Preparedness",
]

const programs = [
  {
    icon: "heroicons:chart-bar",
    category: "Economy & Jobs",
    title: "Mag Negosyo Ta 'Day",
    detail: "Livelihood initiative referenced in historical OVP reporting. Supports micro and small enterprises through training and access to opportunities.",
  },
  {
    icon: "heroicons:academic-cap",
    category: "Education",
    title: "PagbaBAGo: A Million Learners",
    detail: "Learner-support initiative with school supply distribution and educational assistance activities.",
  },
  {
    icon: "leaf",
    category: "Environment & Climate",
    title: "PagbaBAGo: A Million Trees",
    detail: "Tree-planting and environmental outreach initiative for greener and more resilient communities.",
  },
  {
    icon: "heroicons:user-group",
    category: "Social Services",
    title: "Libreng Sakay",
    detail: "Transportation support initiative documented in OVP reporting, aimed at assisting commuters and vulnerable sectors.",
  },
  {
    icon: "heroicons:heart",
    category: "Social Services",
    title: "Community Food Outreach",
    detail: "Food assistance and community outreach activities to support families and vulnerable groups.",
  },
  {
    icon: "heroicons:shield-check",
    category: "Disaster Preparedness",
    title: "Disaster Response Activities",
    detail: "Relief and emergency response activities during natural disasters and other emergencies.",
  },
]

const query = ref("")
const category = ref("All initiatives")
const sort = ref("featured")
const page = ref(1)
const pageSize = 6

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  const list = programs.filter((program) => {
    const matchesCategory = category.value === "All initiatives" || program.category === category.value
    const matchesQuery = !term || [program.title, program.detail, program.category].some(value => value.toLowerCase().includes(term))
    return matchesCategory && matchesQuery
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

watch([query, category, sort], () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>
