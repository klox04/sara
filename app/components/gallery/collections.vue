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
        <p>{{ filtered.length }} {{ filtered.length === 1 ? "collection" : "collections" }} to explore</p>
        <p>Photos and videos are organized by collection and are updated regularly.</p>
      </div>

      <article
        v-if="featured && page === 1"
        class="mt-6 grid overflow-hidden border border-neutral-200 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div class="relative min-h-64 sm:min-h-80">
          <img
            :src="featured.image"
            :alt="featured.alt"
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
          <p class="mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
            {{ featured.detail }}
          </p>
          <div class="mt-4 flex flex-wrap gap-4 text-[13px] text-neutral-600">
            <p class="inline-flex items-center gap-1.5">
              <Icon name="heroicons:photo" size="1rem" aria-hidden="true" />
              {{ featured.photos }} photographs
            </p>
            <p class="inline-flex items-center gap-1.5">
              <Icon name="heroicons:video-camera" size="1rem" aria-hidden="true" />
              {{ featured.videos }} video
            </p>
          </div>
          <NuxtLink
            to="/archive"
            class="mt-6 inline-flex w-fit items-center gap-2 border border-[#1a3328] px-4 py-2.5 text-[13px] font-medium text-[#1a3328] hover:bg-[#1a3328] hover:text-white"
          >
            View collection
            <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
          </NuxtLink>
        </div>
      </article>

      <div v-if="visible.length" class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="item in visible"
          :key="item.title"
          class="flex flex-col border border-neutral-200 bg-white"
        >
          <img :src="item.image" :alt="item.alt" class="h-44 w-full object-cover sm:h-48">
          <div class="flex flex-1 flex-col px-5 py-5">
            <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {{ item.category }}
            </p>
            <h3 class="mt-2 font-serif text-[1.55rem] leading-tight font-medium text-neutral-950">
              {{ item.title }}
            </h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
              {{ item.detail }}
            </p>
            <div class="mt-4 flex flex-wrap gap-4 text-[13px] text-neutral-500">
              <p class="inline-flex items-center gap-1.5">
                <Icon name="heroicons:photo" size="0.95rem" aria-hidden="true" />
                {{ item.photos }} photos
              </p>
              <p class="inline-flex items-center gap-1.5">
                <Icon name="heroicons:video-camera" size="0.95rem" aria-hidden="true" />
                {{ item.videos }} videos
              </p>
            </div>
          </div>
        </article>
      </div>
      <p v-else-if="!featured" class="mt-8 text-sm text-neutral-500">
        No collections match your search.
      </p>

      <nav class="mt-8 flex items-center justify-center gap-2" aria-label="Collection pages">
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
import videos from "~/assets/image/gallery.png"

const categories = [
  "All collections",
  "Official Activities",
  "Education",
  "Community Visits",
  "Environment",
  "Disaster Response",
  "Videos",
]

const collections = [
  {
    featured: true,
    category: "Official Activities",
    title: "The Official Portrait, 2022",
    detail: "A reference collection of the formal OVP portrait and its published crop. These are portrait references, not photographs of an activity or event.",
    image: "/media/imag1.JPG",
    alt: "Sara Duterte in a green polo shirt",
    photos: 2,
    videos: 1,
  },
  {
    category: "Official Activities",
    title: "Official Activities",
    detail: "Ceremonies, meetings, and key events in the Philippines and abroad.",
    image: "/media/IMG_4361.jpg",
    alt: "Sara Duterte with a community crowd",
    photos: 245,
    videos: 18,
  },
  {
    category: "Education",
    title: "Education Initiatives",
    detail: "School visits, programs, and engagements with learners and educators.",
    image: "/media/IMG_2797.JPG",
    alt: "Sara Duterte with schoolchildren in a library",
    photos: 180,
    videos: 12,
  },
  {
    category: "Community Visits",
    title: "Community Visits",
    detail: "Engagements with communities across regions.",
    image: "/media/DSC00816.jpg",
    alt: "Sara Duterte greeting children during a community visit",
    photos: 276,
    videos: 16,
  },
  {
    category: "Environment",
    title: "Environmental Activities",
    detail: "Tree planting, conservation activities, and environmental programs.",
    image: "/media/image5.JPG",
    alt: "Sara Duterte with community members outdoors",
    photos: 132,
    videos: 9,
  },
  {
    category: "Disaster Response",
    title: "Disaster Preparedness",
    detail: "Relief operations, preparedness activities, and support for affected communities.",
    image: "/media/image4.JPG",
    alt: "Sara Duterte with uniformed personnel",
    photos: 160,
    videos: 11,
  },
  {
    category: "Videos",
    title: "Speeches & Video Collections",
    detail: "Key speeches, messages, and video features from official events and public engagements.",
    image: videos,
    alt: "A camera held in front of printed photographs",
    photos: 84,
    videos: 46,
  },
]

const query = ref("")
const category = ref("All collections")
const sort = ref("editorial")
const page = ref(1)
const pageSize = 6

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  const list = collections.filter((item) => {
    const matchesCategory = category.value === "All collections" || item.category === category.value
    const matchesQuery = !term || [item.title, item.detail, item.category].some(value => value.toLowerCase().includes(term))
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

const featured = computed(() => filtered.value.find(item => item.featured) ?? null)

const cards = computed(() => filtered.value.filter(item => item !== featured.value))

const pageCount = computed(() => Math.max(1, Math.ceil(cards.value.length / pageSize)))

const visible = computed(() => {
  const start = (page.value - 1) * pageSize
  return cards.value.slice(start, start + pageSize)
})

function reset() {
  query.value = ""
  category.value = "All collections"
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
