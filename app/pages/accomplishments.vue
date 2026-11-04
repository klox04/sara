<template>
  <main class="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
    <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">Accomplishments</p>
    <h1 class="mt-3 font-serif text-5xl text-neutral-900">Work that lasts</h1>
    <ul class="mt-10 grid gap-8 md:grid-cols-2">
      <li v-for="item in items" :key="item.id" class="border border-neutral-200 bg-white">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="h-56 w-full object-cover">
        <div class="p-6">
          <p class="font-serif text-2xl text-neutral-800">{{ item.year }}</p>
          <h2 class="mt-2 text-lg font-semibold text-neutral-900">{{ item.title }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-neutral-600">{{ item.summary }}</p>
        </div>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { contentSeed, type ContentRecord } from "~~/shared/content"

const { data } = await useAsyncData("achievements", () =>
  $fetch<ContentRecord[]>("/api/content/achievements").catch(() => [] as ContentRecord[]),
)

const items = computed(() => {
  const source = data.value?.length ? data.value : contentSeed.achievements
  return source.map(item => ({
    id: item.id,
    title: typeof item.title === "string" ? item.title : "",
    year: typeof item.year === "string" ? item.year : "",
    summary: typeof item.summary === "string" ? item.summary : "",
    image: typeof item.image === "string" ? item.image : "",
  }))
})
</script>
