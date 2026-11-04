<template>
  <main v-if="story" class="mx-auto max-w-3xl px-5 py-16 sm:px-8">
    <NuxtLink to="/stories" class="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">Stories</NuxtLink>
    <h1 class="mt-4 font-serif text-5xl text-neutral-900">{{ story.title }}</h1>
    <img v-if="story.image" :src="story.image" :alt="story.title" class="mt-8 h-80 w-full object-cover">
    <p class="mt-8 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{{ story.body }}</p>
  </main>
</template>

<script setup lang="ts">
import type { ContentRecord } from "~~/shared/content"

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: story } = await useAsyncData(`story-${slug.value}`, async () => {
  const stories = await $fetch<ContentRecord[]>("/api/content/stories")
  const match = stories.find(item => item.slug === slug.value)
  if (!match) {
    throw createError({ statusCode: 404, statusMessage: "Story not found" })
  }
  return {
    title: typeof match.title === "string" ? match.title : "",
    body: typeof match.body === "string" ? match.body : "",
    image: typeof match.image === "string" ? match.image : "",
  }
})
</script>
