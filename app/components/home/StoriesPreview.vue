<template>
  <section class="bg-white" id="stories" >
    <div class="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
      <div class="flex items-center justify-between gap-6">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-800">
          Featured Stories
        </p>
        <NuxtLink to="/stories" class="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-forest">
          View all stories
          <Icon name="heroicons:arrow-right" size="0.9rem" />
        </NuxtLink>
      </div>

      <ul class="mt-8 grid gap-6 md:grid-cols-3">
        <li v-for="story in stories" :key="story.id" class="bg-white">
          <NuxtLink :to="`/stories/${story.slug}`" class="block">
            <img v-if="story.image" :src="story.image" :alt="story.title" class="aspect-[16/10] w-full object-cover">
            <div class="px-4 py-5">
              <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                {{ story.category }}
              </p>
              <h3 class="mt-2 font-serif text-[1.65rem] leading-tight text-neutral-900">
                {{ story.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-neutral-600">
                {{ story.excerpt }}
              </p>
              <span class="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800">
                Read more
                <Icon name="heroicons:arrow-right" size="0.9rem" />
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { contentSeed, type ContentRecord } from "~~/shared/content"

const { data } = await useAsyncData("stories-preview", () =>
  $fetch<ContentRecord[]>("/api/content/stories").catch(() => [] as ContentRecord[]),
)

const stories = computed(() => {
  const source = data.value?.length ? data.value : contentSeed.stories
  return source.slice(0, 3).map(story => ({
    id: story.id,
    title: typeof story.title === "string" ? story.title : "",
    slug: typeof story.slug === "string" ? story.slug : "",
    excerpt: typeof story.excerpt === "string" ? story.excerpt : "",
    image: typeof story.image === "string" ? story.image : "",
    category: typeof story.category === "string" && story.category ? story.category : "Story",
  }))
})
</script>
