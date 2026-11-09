<template>
  <section id="journey" class="overflow-hidden bg-[#f7f6f3] text-forest">
    <div
      v-if="loading"
      class="mx-auto grid max-w-[1180px] animate-pulse items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10 lg:py-20"
      aria-busy="true"
    >
      <span class="sr-only">Loading journey…</span>
      <div class="flex flex-col items-center lg:items-start">
        <div class="h-2.5 w-24 bg-neutral-300/60" />
        <div class="mt-4 h-12 w-56 bg-neutral-300/60" />
        <div class="mt-3 h-12 w-40 bg-neutral-300/60" />
        <div class="mt-5 h-3 w-64 bg-neutral-200" />
        <div class="mt-2 h-3 w-52 bg-neutral-200" />
      </div>
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div v-for="index in 4" :key="index" class="flex flex-col items-center">
          <div class="h-6 w-14 bg-neutral-300/60" />
          <div class="mt-4 size-28 rounded-full bg-neutral-200 sm:size-32" />
          <div class="mt-4 h-3 w-20 bg-neutral-300/60" />
          <div class="mt-2 h-3 w-24 bg-neutral-200" />
        </div>
      </div>
    </div>

    <div v-else-if="!journey" class="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:py-20">
      <EmptyState
        icon="heroicons:map"
        title="Her journey is being written"
        text="Milestones from a life in public service will appear here soon."
        to="/about"
        link-label="Learn about Sara"
      />
    </div>

    <div v-else class="relative mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10 lg:py-20">
      <div class="relative">
        <div class="relative z-10 text-center lg:text-left">
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Her Journey
          </p>
          <h2 v-if="journey.title" class="mt-3 font-serif text-5xl leading-[0.95] text-balance text-neutral-900 sm:text-6xl">
            {{ journey.title }}
          </h2>
          <p v-if="journey.description" class="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-600 lg:mx-0">
            {{ journey.description }}
          </p>
          <NuxtLink
            to="/about"
            class="mt-7 inline-flex items-center gap-2 border border-neutral-800 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            View Full Timeline
            <Icon name="heroicons:arrow-right" class="size-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div
          aria-hidden="true"
          class="pointer-events-none hidden bg-[#ddd6c8] lg:absolute lg:top-[46%] lg:-left-6 lg:block lg:h-[38rem] lg:w-[22rem] lg:-translate-y-1/2"
          :style="{
            WebkitMaskImage: `url(${philippinesMap})`,
            maskImage: `url(${philippinesMap})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }"
        />
      </div>

      <EmptyState
        v-if="!stops.length"
        class="relative z-10"
        icon="heroicons:flag"
        title="Milestones coming soon"
        text="Key moments from her years in public service will be added here."
      />
      <div v-else class="relative z-10 min-w-0 overflow-x-auto pb-2">
        <ol
          class="grid auto-cols-[minmax(11.5rem,1fr)] grid-flow-col"
          aria-label="Journey milestones"
        >
          <li
            v-for="(stop, index) in stops"
            :key="stop.id"
            class="px-2 text-center"
          >
            <p class="font-serif text-[1.7rem] leading-none text-neutral-800">
              {{ stop.year }}
            </p>
            <div class="relative -mx-2 mt-3 flex h-3 items-center justify-center">
              <span
                v-if="stops.length > 1"
                class="absolute top-1/2 h-px -translate-y-1/2 bg-neutral-300"
                :class="index === 0 ? 'left-1/2 w-1/2' : index === stops.length - 1 ? 'left-0 w-1/2' : 'left-0 w-full'"
              />
              <span class="relative z-10 size-2.5 rounded-full bg-neutral-800" />
            </div>
            <div class="mx-auto mt-4 size-28 overflow-hidden rounded-full bg-neutral-200 sm:size-32">
              <img
                v-if="stop.image"
                :src="stop.image"
                :alt="`${stop.role}, ${stop.place}`"
                class="h-full w-full object-cover object-top"
              >
            </div>
            <h3 class="mt-4 text-sm font-semibold text-neutral-900">
              {{ stop.role }}
            </h3>
            <p class="mt-1 text-[13px] text-neutral-700">
              {{ stop.place }}
            </p>
            <p class="mx-auto mt-2 max-w-[12.5rem] text-[12px] leading-relaxed text-neutral-500">
              {{ stop.text }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import philippinesMap from "~/assets/image/philippines.svg"
import EmptyState from "~/components/EmptyState.vue"
import type { Journey } from "~/types/journey"

const { journey, loading = false } = defineProps<{
  journey: Journey | null
  loading?: boolean
}>()

const stops = computed(() => journey?.milestones ?? [])
</script>
