<template>
  <main class="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
    <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">Archive</p>
    <h1 class="mt-3 font-serif text-5xl text-neutral-900">Records</h1>
    <ul class="mt-10 divide-y divide-neutral-200">
      <li v-for="item in items" :key="item.id" class="py-6">
        <p class="text-[11px] uppercase tracking-[0.16em] text-neutral-500">{{ item.date }}</p>
        <h2 class="mt-2 font-serif text-3xl text-neutral-900">
          <NuxtLink v-if="item.link" :to="item.link">{{ item.title }}</NuxtLink>
          <span v-else>{{ item.title }}</span>
        </h2>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">{{ item.summary }}</p>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { contentSeed, type ContentRecord } from "~~/shared/content"

const { data } = await useAsyncData("archive", () =>
  $fetch<ContentRecord[]>("/api/content/archive").catch(() => [] as ContentRecord[]),
)

const items = computed(() => {
  const source = data.value?.length ? data.value : contentSeed.archive
  return source.map(item => ({
    id: item.id,
    title: typeof item.title === "string" ? item.title : "",
    date: typeof item.date === "string" ? item.date : "",
    summary: typeof item.summary === "string" ? item.summary : "",
    link: typeof item.link === "string" ? item.link : "",
  }))
})
</script>
