<template>
  <main class="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
    <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">Stories</p>
    <h1 class="mt-3 font-serif text-5xl text-neutral-900">From the record</h1>
    <ul class="mt-10 grid gap-10 md:grid-cols-2">
      <li v-for="story in stories" :key="story.id">
        <NuxtLink :to="`/stories/${story.slug}`" class="block">
          <img v-if="story.image" :src="story.image" :alt="story.title" class="h-64 w-full object-cover">
          <h2 class="mt-4 font-serif text-3xl text-neutral-900">{{ story.title }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-neutral-600">{{ story.excerpt }}</p>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { contentSeed, type ContentRecord } from "~~/shared/content"

const { data } = await useAsyncData("stories", () =>
  $fetch<ContentRecord[]>("/api/content/stories").catch(() => [] as ContentRecord[]),
)

const stories = computed(() => {
  const source = data.value?.length ? data.value : contentSeed.stories
  return source.map(story => ({
    id: story.id,
    title: typeof story.title === "string" ? story.title : "",
    slug: typeof story.slug === "string" ? story.slug : "",
    excerpt: typeof story.excerpt === "string" ? story.excerpt : "",
    image: typeof story.image === "string" ? story.image : "",
  }))
})
</script>
