<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <p class="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        A journey through the years
      </p>
      <h2 class="mt-3 text-center font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
        From local roots to national office
      </h2>

      <div v-if="loading" class="mt-14 grid animate-pulse grid-cols-2 gap-8 sm:grid-cols-4" aria-busy="true">
        <span class="sr-only">Loading timeline…</span>
        <div v-for="index in 4" :key="index" class="flex flex-col items-center">
          <div class="h-3 w-12 bg-neutral-200" />
          <div class="mt-4 size-2.5 rounded-full bg-neutral-300" />
          <div class="mt-6 size-16 rounded-full bg-[#e6ebe4]" />
          <div class="mt-4 h-3 w-24 bg-neutral-200" />
          <div class="mt-2 h-3 w-28 bg-neutral-100" />
          <div class="mt-3 h-3 w-36 bg-neutral-100" />
        </div>
      </div>

      <EmptyState
        v-else-if="!stops.length"
        class="mt-14"
        icon="heroicons:flag"
        title="The timeline is being prepared"
        text="Key milestones from her years in public service will appear here soon."
      />

      <div v-else class="mt-14 overflow-x-auto pb-2">
        <ol class="relative grid w-max min-w-full auto-cols-[minmax(12.5rem,1fr)] grid-flow-col">
          <span
            v-if="stops.length > 1"
            class="absolute top-[2.35rem] h-px bg-neutral-400"
            :style="{ left: lineInset, right: lineInset }"
            aria-hidden="true"
          />
          <li
            v-for="stop in stops"
            :key="stop.id"
            class="relative flex flex-col items-center px-3 text-center"
          >
            <p class="text-sm font-medium text-neutral-800">{{ stop.year }}</p>
            <span class="relative z-10 mt-3 h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span class="mt-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ebe4] text-neutral-600">
              <Icon :name="stop.icon" size="1.35rem" aria-hidden="true" />
            </span>
            <p class="mt-4 text-sm font-medium text-neutral-900">{{ stop.title }}</p>
            <p v-if="stop.place || stop.years" class="mt-1 text-[13px] leading-snug text-neutral-500">
              {{ stop.place }}<br v-if="stop.place && stop.years">
              {{ stop.years }}
            </p>
            <p v-if="stop.detail" class="mt-3 max-w-[12rem] text-[13px] leading-relaxed text-neutral-500">
              {{ stop.detail }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { AboutTimelineStop } from "~/types/about"

const { stops, loading = false } = defineProps<{
  stops: AboutTimelineStop[]
  loading?: boolean
}>()

const lineInset = computed(() => `${50 / Math.max(stops.length, 1)}%`)
</script>
