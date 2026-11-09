<template>
  <section class="bg-white">
    <div
      v-if="loading"
      class="mx-auto grid max-w-[1180px] animate-pulse items-center gap-8 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:py-20"
      aria-busy="true"
    >
      <span class="sr-only">Loading featured story…</span>
      <div class="h-64 w-full bg-neutral-200 sm:h-80 lg:h-[22rem]" />
      <div class="max-w-md">
        <div class="h-2.5 w-28 bg-neutral-200" />
        <div class="mt-4 h-10 w-4/5 bg-neutral-200" />
        <div class="mt-3 h-10 w-3/5 bg-neutral-200" />
        <div class="mt-5 h-3 w-full bg-neutral-100" />
        <div class="mt-2 h-3 w-5/6 bg-neutral-100" />
        <div class="mt-7 h-11 w-40 bg-neutral-200" />
      </div>
    </div>

    <div v-else-if="!story" class="mx-auto max-w-[1180px] px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
      <EmptyState
        icon="heroicons:star"
        title="No featured story yet"
        text="A highlighted story will appear here once one is selected. Browse the latest stories below in the meantime."
      />
    </div>

    <div v-else class="mx-auto grid max-w-[1180px] items-center gap-8 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:py-20">
      <img
        v-if="story.image"
        :src="story.image"
        :alt="story.title"
        class="h-64 w-full object-cover sm:h-80 lg:h-[22rem]"
      >
      <div v-else class="h-64 w-full bg-neutral-100 sm:h-80 lg:h-[22rem]" aria-hidden="true" />

      <div class="max-w-md">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Featured story
        </p>
        <h2 class="mt-3 font-serif text-4xl font-medium leading-[1.05] text-[#1d3b30] sm:text-5xl">
          {{ story.title }}
        </h2>
        <p v-if="story.description" class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          {{ story.description }}
        </p>
        <NuxtLink
          :to="story.to"
          class="mt-6 inline-flex items-center gap-2.5 bg-[#1a3328] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
        >
          Read the story
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type StoryRecord = {
  uuid?: string
  title?: string
  description?: string
  file_path?: string
  is_active?: boolean
}

type FeaturedStory = {
  title: string
  description: string
  image: string
  to: string
}

const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const story = ref<FeaturedStory | null>(null)
const loading = ref(true)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path}`
}

function getFeaturedStory() {
  GET_API({ api: "public/stories", is_main_featured: true })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as StoryRecord[] : []
      const record = rows.find(row => row.uuid && row.title && row.is_active !== false)
      if (!record) return
      story.value = {
        title: record.title!,
        description: record.description ?? "",
        image: storageSrc(record.file_path ?? ""),
        to: `/stories/${record.uuid}`,
      }
    })
    .catch((error: unknown) => {
      console.error("Error fetching featured story:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getFeaturedStory()
})
</script>
