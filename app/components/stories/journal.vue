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
        <div class="flex items-end gap-3">
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
        </div>
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
          :key="item"
          type="button"
          class="shrink-0 px-3.5 py-2 text-[13px] whitespace-nowrap"
          :class="category === item ? 'bg-[#1a3328] text-white' : 'text-neutral-700 hover:text-neutral-950'"
          @click="category = item"
        >
          {{ item }}
        </button>
      </div>

      <div class="mt-6 flex flex-col gap-2 text-[13px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{{ filtered.length }} {{ filtered.length === 1 ? "story" : "stories" }} to explore</p>
        <p>Stories use sample content for editorial purposes.</p>
      </div>

      <div v-if="visible.length" class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="story in visible"
          :key="story.title"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <img
            :src="story.image"
            :alt="story.alt"
            class="h-44 w-full object-cover sm:h-48"
          >
          <div class="flex flex-1 flex-col px-5 py-5">
            <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {{ story.category }}
            </p>
            <h3 class="mt-2 font-serif text-[1.65rem] leading-tight font-medium text-neutral-950">
              {{ story.title }}
            </h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
              {{ story.detail }}
            </p>
            <NuxtLink
              to="/archive"
              class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
            >
              Read story
              <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
      <p v-else class="mt-8 text-sm text-neutral-500">
        No stories match your search.
      </p>

      <nav class="mt-8 flex items-center justify-center gap-2" aria-label="Story pages">
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
  "All stories",
  "Community",
  "Education",
  "Environment",
  "Livelihood",
  "Transport",
  "Disaster",
  "Historical",
  "Archive",
]

const stories = [
  {
    category: "Community",
    title: "Working With Communities",
    detail: "A closer look at community visits and service activities across the country, and the people who make them possible.",
    image: "/media/DSC00816.jpg",
    alt: "Sara Duterte greeting children during a community visit",
  },
  {
    category: "Education",
    title: "Education and Learner Support",
    detail: "Stories from schools and communities on initiatives that help more Filipino learners reach their potential.",
    image: "/media/IMG_2797.JPG",
    alt: "Sara Duterte with schoolchildren holding books in a library",
  },
  {
    category: "Environment",
    title: "Environmental Outreach",
    detail: "Community-led efforts for cleaner, safer, and more resilient communities, from coastal areas to urban centers.",
    image: "/media/image5.JPG",
    alt: "Sara Duterte with community members outdoors",
  },
  {
    category: "Livelihood",
    title: "Livelihood and Enterprise",
    detail: "Stories of small businesses, local entrepreneurs, and community programs that create opportunities.",
    image: "/media/image.JPG",
    alt: "Sara Duterte with market workers and drivers",
  },
  {
    category: "Transport",
    title: "Community Transport Stories",
    detail: "Features on transport and mobility initiatives that connect people, opportunities, and growing communities.",
    image: "/media/IMG_4361.jpg",
    alt: "Sara Duterte with a crowd outside a community building",
  },
  {
    category: "Disaster",
    title: "Disaster Preparedness in Practice",
    detail: "Stories of readiness, response, and recovery efforts, and the communities working together for a safer tomorrow.",
    image: "/media/IMG_3065.JPG",
    alt: "Sara Duterte speaking at a public event",
  },
]

const query = ref("")
const category = ref("All stories")
const sort = ref("editorial")
const page = ref(1)
const pageSize = 6

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  const list = stories.filter((story) => {
    const matchesCategory = category.value === "All stories" || story.category === category.value
    const matchesQuery = !term || [story.title, story.detail, story.category].some(value => value.toLowerCase().includes(term))
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

function reset() {
  query.value = ""
  category.value = "All stories"
  sort.value = "editorial"
  page.value = 1
}

watch([query, category, sort], () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>
