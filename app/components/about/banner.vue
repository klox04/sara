<template>
  <section
    v-if="loading"
    class="relative isolate flex min-h-[34rem] items-center overflow-hidden bg-neutral-900 sm:min-h-[40rem] lg:min-h-[46rem]"
    aria-busy="true"
  >
    <span class="sr-only">Loading banner…</span>
    <div class="mx-auto w-full max-w-[1440px] animate-pulse px-6 py-16 sm:px-10 lg:px-16">
      <div class="h-2.5 w-20 bg-white/10" />
      <div class="mt-5 h-12 w-64 bg-white/10 sm:h-16 sm:w-96" />
      <div class="mt-3 h-12 w-48 bg-white/10 sm:h-16 sm:w-72" />
      <div class="mt-6 h-3 w-full max-w-md bg-white/5" />
      <div class="mt-2 h-3 w-5/6 max-w-sm bg-white/5" />
      <div class="mt-8 h-12 w-48 bg-white/10" />
    </div>
  </section>

  <section v-else-if="!banner" class="bg-[#10241c] text-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 sm:py-20">
      <EmptyState
        dark
        icon="heroicons:photo"
        title="Her story is being updated"
        text="An introduction to Sara Duterte's life in public service will appear here soon."
        to="/#journey"
        link-label="Explore the timeline"
      />
    </div>
  </section>

  <section v-else class="relative isolate min-h-[34rem] overflow-hidden bg-neutral-900 sm:min-h-[40rem] lg:min-h-[46rem]">
    <img
      v-if="banner.image"
      :src="banner.image"
      :alt="banner.title.replace(/\s+/g, ' ')"
      class="absolute inset-0 h-full w-full object-cover object-[72%_20%]"
    >

    <div class="relative mx-auto flex min-h-[34rem] max-w-[1440px] items-center px-6 py-16 sm:min-h-[40rem] sm:px-10 lg:min-h-[46rem] lg:px-16">
      <div class="max-w-xl">
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-white">
          Her Story
        </p>
        <h1 class="mt-4 max-w-[16rem] whitespace-pre-line font-serif text-[2.7rem] font-medium leading-[1.05] text-white sm:max-w-lg sm:text-6xl lg:text-[4.15rem]">
          {{ banner.title }}
        </h1>
        <p v-if="banner.subtitle" class="mt-5 max-w-md text-sm leading-relaxed text-white sm:text-[15px]">
          {{ banner.subtitle }}
        </p>
        <NuxtLink
          to="/#journey"
          class="mt-8 inline-flex w-fit items-center gap-3 bg-[#1a3328] px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
        >
          Explore the timeline
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <blockquote v-if="banner.quote" class="absolute right-6 top-10 max-w-[12.5rem] text-right font-script text-[1.7rem] leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:right-10 sm:top-14 sm:max-w-[15rem] sm:text-[2.15rem] lg:right-16 lg:top-16 lg:text-[2.35rem]">
        <p>“{{ banner.quote }}”</p>
        <footer class="mt-2 text-[1.35rem] sm:text-[1.55rem]">
          — Sara Duterte
        </footer>
      </blockquote>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { AboutBanner } from "~/types/about"

const { banner, loading = false } = defineProps<{
  banner: AboutBanner | null
  loading?: boolean
}>()
</script>
