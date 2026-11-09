<template>
  <section class="bg-white" id="stories" >
    <div class="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
      <div class="flex items-center justify-between gap-6">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-800">
          {{ heading }}
        </p>
        <NuxtLink v-if="stories.length" to="/stories" class="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-forest">
          View all stories
          <Icon name="heroicons:arrow-right" size="0.9rem" />
        </NuxtLink>
      </div>

      <ul v-if="loading" class="mt-8 grid gap-6 md:grid-cols-3" aria-busy="true">
        <li v-for="index in 3" :key="index" class="animate-pulse">
          <span class="sr-only">Loading stories…</span>
          <div class="aspect-[16/10] w-full bg-neutral-200" />
          <div class="px-4 py-5">
            <div class="h-2.5 w-16 bg-neutral-200" />
            <div class="mt-4 h-6 w-4/5 bg-neutral-200" />
            <div class="mt-2 h-6 w-3/5 bg-neutral-200" />
            <div class="mt-4 h-3 w-full bg-neutral-100" />
            <div class="mt-2 h-3 w-5/6 bg-neutral-100" />
          </div>
        </li>
      </ul>

      <EmptyState
        v-else-if="!stories.length"
        class="mt-8"
        icon="heroicons:book-open"
        title="Stories are on the way"
        text="New stories from communities across the country will appear here soon. In the meantime, learn more about her journey in public service."
        to="/about"
        link-label="Learn about Sara"
      />

      <ul v-else class="mt-8 grid gap-6 md:grid-cols-3">
        <li v-for="story in stories" :key="story.id" class="flex bg-white">
          <NuxtLink :to="story.uuid ? `/stories/${story.uuid}` : '/stories'" class="flex w-full flex-col">
            <img v-if="story.image" :src="story.image" :alt="story.title" class="aspect-[16/10] w-full object-cover">
            <div class="flex flex-1 flex-col px-4 py-5">
              <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                {{ story.category }}
              </p>
              <h3 class="mt-2 line-clamp-2 min-h-[2.5em] font-serif text-[1.65rem] leading-tight text-neutral-900" :title="story.title">
                {{ story.title }}
              </h3>
              <p class="mt-2 line-clamp-2 min-h-[3.25em] text-sm leading-relaxed text-neutral-600" :title="story.excerpt">
                {{ story.excerpt }}
              </p>
              <span class="mt-auto inline-flex items-center gap-2 pt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800">
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
import EmptyState from "~/components/EmptyState.vue"
import type { StoryPreview } from "~/types/story"

const { stories, heading = "Featured Stories", loading = false } = defineProps<{
  stories: StoryPreview[]
  heading?: string
  loading?: boolean
}>()
</script>
