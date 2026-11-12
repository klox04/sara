<template>
  <section class="bg-[#f6f4ef]">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        Areas of public work
      </p>
      <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
        A broader view of service
      </h2>

      <div v-if="loading" class="mt-10 grid animate-pulse gap-5 md:grid-cols-3" aria-busy="true">
        <span class="sr-only">Loading featured records…</span>
        <div v-for="index in 3" :key="index" class="border border-neutral-200 bg-white px-6 py-7">
          <div class="size-7 rounded bg-neutral-200" />
          <div class="mt-5 h-2.5 w-24 bg-neutral-200" />
          <div class="mt-3 h-6 w-4/5 bg-neutral-200" />
          <div class="mt-4 h-3 w-full bg-neutral-100" />
          <div class="mt-2 h-3 w-5/6 bg-neutral-100" />
        </div>
      </div>

      <EmptyState
        v-else-if="!areas.length"
        class="mt-10"
        icon="heroicons:archive-box"
        title="Featured records coming soon"
        text="Highlights from speeches, reports, and public documents will be featured here."
        to="/archive"
        link-label="Explore the archive"
      />

      <div v-else class="mt-10 grid gap-5 md:grid-cols-3">
        <article
          v-for="area in areas"
          :key="area.id"
          class="flex flex-col border border-neutral-200 bg-white px-6 py-7"
        >
          <Icon :name="area.icon" class="text-neutral-700" size="1.6rem" aria-hidden="true" />
          <p v-if="area.category" class="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            {{ area.category }}
          </p>
          <h3 class="font-serif text-2xl font-medium text-neutral-950" :class="area.category ? 'mt-2' : 'mt-5'">
            {{ area.title }}
          </h3>
          <p v-if="area.detail" class="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
            {{ area.detail }}
          </p>
          <NuxtLink
            to="/archive"
            class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
          >
            Explore records
            <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { AboutArea } from "~/types/about"

const { areas, loading = false } = defineProps<{
  areas: AboutArea[]
  loading?: boolean
}>()
</script>
