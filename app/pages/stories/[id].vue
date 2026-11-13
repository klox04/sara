<template>
  <main class="flex flex-1 flex-col bg-white">
    <article v-if="story" class="mx-auto w-full max-w-[720px] px-6 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <NuxtLink
        to="/stories"
        class="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 hover:text-forest"
      >
        <Icon name="heroicons:arrow-left" size="0.9rem" aria-hidden="true" />
        All stories
      </NuxtLink>

      <h1 class="mt-6 font-serif text-[2.5rem] font-semibold leading-[1.05] text-neutral-950 sm:mt-8 sm:text-[3.25rem]">
        {{ story.title }}
      </h1>
      <p v-if="story.description" class="mt-3 text-[15px] leading-relaxed text-neutral-600 sm:text-base">
        {{ story.description }}
      </p>

      <img
        v-if="story.image"
        :src="story.image"
        :alt="story.title"
        class="mt-7 aspect-[4/3] w-full rounded-xl object-cover object-[center_25%] sm:mt-8 sm:aspect-[5/2]"
      >

      <div v-if="story.paragraphs.length" class="mt-8 space-y-4 text-[15px] leading-relaxed text-neutral-800 sm:text-base">
        <p v-for="(paragraph, index) in story.paragraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </article>

    <div v-else-if="loading" class="mx-auto w-full max-w-[720px] animate-pulse px-6 pt-8 pb-16 sm:px-8 sm:pt-12" aria-busy="true">
      <span class="sr-only">Loading story…</span>
      <div class="h-3 w-24 bg-neutral-200" />
      <div class="mt-8 h-11 w-4/5 rounded bg-neutral-200" />
      <div class="mt-4 h-4 w-3/5 rounded bg-neutral-200" />
      <div class="mt-8 aspect-[5/2] w-full rounded-xl bg-neutral-200" />
      <div class="mt-8 h-4 w-full rounded bg-neutral-200" />
      <div class="mt-3 h-4 w-11/12 rounded bg-neutral-200" />
    </div>

    <div v-else class="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5d6f64]">Story not found</p>
      <h1 class="mt-4 font-serif text-4xl font-medium text-[#1d3b30] sm:text-5xl">This story is unavailable</h1>
      <p class="mt-4 text-sm leading-relaxed text-neutral-600">
        It may have been moved or is no longer published.
      </p>
      <NuxtLink
        to="/stories"
        class="mt-8 inline-flex items-center gap-2.5 bg-[#1a3328] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
      >
        Browse all stories
        <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import StoriesPreview from "~/components/home/StoriesPreview.vue"
import type { StoryPreview } from "~/types/story"

type StoryRecord = {
  uuid?: string
  category?: { name?: string } | null
  title?: string
  description?: string
  content?: string | null
  file_path?: string
  is_active?: boolean
}

const { GET_API } = useGlobalStore()
const route = useRoute()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const records = ref<StoryRecord[]>([])
const loading = ref(true)

const id = computed(() => String(route.params.id ?? ""))

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function splitParagraphs(value: string) {
  return value.split(/\n\s*\n|\r?\n/).map(line => line.trim()).filter(Boolean)
}

const published = computed(() => records.value.filter(record => record.uuid && record.title && record.is_active !== false))

const story = computed(() => {
  const record = published.value.find(item => item.uuid === id.value)
  if (!record) return null
  return {
    title: record.title ?? "",
    description: record.description ?? "",
    image: storageSrc(record.file_path ?? ""),
    paragraphs: splitParagraphs(record.content ?? ""),
  }
})

const related = computed<StoryPreview[]>(() => published.value
  .filter(record => record.uuid !== id.value)
  .slice(0, 3)
  .map(record => ({
    id: record.uuid ?? "",
    uuid: record.uuid,
    category: record.category?.name || "Story",
    title: record.title ?? "",
    excerpt: record.description ?? "",
    image: storageSrc(record.file_path ?? ""),
  })))

useHead({
  title: () => story.value?.title || "Story",
})

function getStories() {
  loading.value = true
  GET_API({ api: "public/stories", per_page: 100 })
    .then((response) => {
      const rows = response.data?.data
      records.value = Array.isArray(rows) ? rows : []
    })
    .catch((error: unknown) => {
      console.error("Error fetching stories:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getStories()
})
</script>
