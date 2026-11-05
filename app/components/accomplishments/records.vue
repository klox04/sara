<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            The record, in context
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
            Key initiatives &amp; milestones
          </h2>
        </div>
        <p class="max-w-sm text-sm leading-relaxed text-neutral-500 lg:text-right">
          Explore illustrative records by office, program, or initiative. Sample figures are not verified business data; refer to the sources and documents for full context, definitions, and reporting periods.
        </p>
      </div>

      <div class="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end">
        <label class="block min-w-0 flex-1">
          <span class="sr-only">Search initiatives</span>
          <span class="flex items-center gap-2 border border-neutral-300 px-3 py-2.5">
            <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="6.25" />
              <path d="M16.2 16.2 20.5 20.5" stroke-linecap="round" />
            </svg>
            <input
              v-model="query"
              type="search"
              placeholder="Search initiatives, programs, or keywords..."
              class="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            >
          </span>
        </label>

        <label class="w-full text-[11px] text-neutral-500 lg:w-44">
          Filter by office
          <select v-model="office" class="mt-1 w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none">
            <option v-for="item in offices" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <label class="w-full text-[11px] text-neutral-500 lg:w-40">
          Sort by
          <select v-model="sort" class="mt-1 w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none">
            <option value="recent">Most recent</option>
            <option value="title">Title</option>
          </select>
        </label>

        <button
          type="button"
          class="pb-2.5 text-sm text-neutral-600 underline-offset-2 hover:text-neutral-950 hover:underline lg:shrink-0"
          @click="reset"
        >
          Reset filters
        </button>
      </div>

      <div class="mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="item in offices"
          :key="item"
          type="button"
          class="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] whitespace-nowrap"
          :class="office === item ? 'bg-[#1a3328] text-white' : 'text-neutral-700 hover:bg-neutral-100'"
          @click="office = item"
        >
          {{ item }}
        </button>
      </div>

      <p class="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
        At a glance · Sample figures · Supporting sources pending
      </p>

      <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="figure in figures"
          :key="figure.title"
          class="border border-neutral-200 bg-white px-5 py-6"
        >
          <Icon v-if="figure.icon" :name="figure.icon" class="text-neutral-700" size="1.35rem" aria-hidden="true" />
          <span v-else class="font-serif text-2xl text-neutral-700" aria-hidden="true">₱</span>
          <p class="mt-4 font-serif text-4xl font-medium text-neutral-950">{{ figure.value }}</p>
          <p class="mt-2 text-sm font-medium text-neutral-800">{{ figure.title }}</p>
          <p class="mt-2 text-xs text-neutral-500">{{ figure.period }}</p>
          <p class="mt-1 text-xs text-neutral-400">Sources pending</p>
        </article>
      </div>

      <p class="mt-12 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
        Initiatives and records
      </p>

      <div v-if="visible.length" class="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="record in visible"
          :key="record.title"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <div class="relative h-40 overflow-hidden bg-[#e7ebe4]">
            <img :src="record.image" alt="" class="h-full w-full object-cover">
            <span class="absolute top-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700">
              <Icon :name="record.icon" size="1.05rem" aria-hidden="true" />
            </span>
          </div>
          <div class="flex flex-1 flex-col px-5 py-5">
            <h3 class="text-lg font-medium text-neutral-950">{{ record.title }}</h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{{ record.detail }}</p>
            <NuxtLink
              to="/archive"
              class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
            >
              View record
              <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
      <p v-else class="mt-6 text-sm text-neutral-500">
        No records match your search.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const offices = [
  "All offices",
  "Davao City",
  "Department of Education",
  "Office of the Vice President",
]

const figures = [
  {
    icon: "heroicons:trophy",
    value: "118",
    title: "Awards and Recognitions",
    period: "Sample figure · 2016 – 2022",
  },
  {
    icon: "heroicons:academic-cap",
    value: "1,904",
    title: "Educational Scholarship Recipients",
    period: "Sample figure · 2016 – 2022",
  },
  {
    icon: "heroicons:building-office-2",
    value: "112",
    title: "Classroom Construction Projects",
    period: "Sample figure · 2016 – 2022",
  },
  {
    icon: "",
    value: "₱279B",
    title: "Reported Investment Portfolio",
    period: "Sample figure · 2016 – 2022",
  },
]

const records = [
  {
    icon: "heroicons:trophy",
    image: "/media/image4.JPG",
    office: "Davao City",
    year: 2022,
    title: "Awards and Recognitions",
    detail: "Davao City-reported recognitions from a given period, with context and sources.",
  },
  
  {
    icon: "heroicons:academic-cap",
    image: "/media/imag4.jpg",
    office: "Department of Education",
    year: 2022,
    title: "Educational Scholarship Recipients",
    detail: "Illustrative figures on scholarship recipients, with supporting context.",
  },
  {
    icon: "heroicons:building-office-2",
    image: "/media/image5.JPG",
    office: "Department of Education",
    year: 2022,
    title: "Classroom Construction Projects",
    detail: "Illustrative data for classroom construction projects, with project counts and scope.",
  },
  {
    icon: "heroicons:chart-bar",
    image: "/media/IMG_2797.JPG",
    office: "Davao City",
    year: 2022,
    title: "Reported Investment Portfolio",
    detail: "Illustrative display of a reported classroom investment portfolio, with context and sources.",
  },
  {
    icon: "heroicons:megaphone",
    image: "/media/image.JPG",
    office: "Department of Education",
    year: 2023,
    title: "MATATAG Agenda Launch",
    detail: "An illustrative record introducing the MATATAG agenda, key outputs, and sources.",
  },
  {
    icon: "heroicons:user-group",
    image: "/media/imag3.JPG",
    office: "Office of the Vice President",
    year: 2022,
    title: "Community Program Activities",
    detail: "Illustrative highlights for community and outreach programs, with context and sources.",
  },
]

const query = ref("")
const office = ref("All offices")
const sort = ref("recent")

const visible = computed(() => {
  const term = query.value.trim().toLowerCase()
  const list = records.filter((record) => {
    const matchesOffice = office.value === "All offices" || record.office === office.value
    const matchesQuery = !term || [record.title, record.detail, record.office].some(value => value.toLowerCase().includes(term))
    return matchesOffice && matchesQuery
  })

  if (sort.value === "title") {
    return [...list].sort((a, b) => a.title.localeCompare(b.title))
  }

  return list
})

function reset() {
  query.value = ""
  office.value = "All offices"
  sort.value = "recent"
}
</script>
