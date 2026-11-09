<template>
  <section class="bg-[#f6f4ef]">
    <div
      v-if="loading"
      class="mx-auto grid max-w-[1180px] animate-pulse items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-20"
      aria-busy="true"
    >
      <span class="sr-only">Loading programs…</span>
      <div class="aspect-[5/4] w-full bg-[#e7e3da] sm:aspect-[4/3]" />
      <div>
        <div class="h-2.5 w-24 bg-[#e7e3da]" />
        <div class="mt-4 h-10 w-4/5 bg-[#e7e3da]" />
        <div class="mt-5 h-3 w-full max-w-md bg-[#eeebe4]" />
        <div class="mt-2 h-3 w-5/6 max-w-sm bg-[#eeebe4]" />
      </div>
    </div>

    <div v-else-if="!programs.length" class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <EmptyState
        icon="heroicons:light-bulb"
        title="Programs coming soon"
        text="Highlights from her programs and initiatives will be featured here."
        to="/public-service"
        link-label="Explore public service"
      />
    </div>

    <div v-else class="mx-auto max-w-[1180px] space-y-16 px-6 py-16 sm:px-8 lg:space-y-20 lg:py-20">
      <article
        v-for="(program, index) in programs"
        :key="program.id"
        class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-16"
      >
        <figure class="overflow-hidden" :class="index % 2 ? 'lg:order-2' : ''">
          <img
            v-if="program.image"
            :src="program.image"
            :alt="program.title"
            class="aspect-[5/4] w-full object-cover object-[center_20%] sm:aspect-[4/3]"
          >
          <div v-else class="aspect-[5/4] w-full bg-[#e7e3da] sm:aspect-[4/3]" aria-hidden="true" />
        </figure>

        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            {{ program.initiative || "Featured program" }}
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium leading-tight text-neutral-950 sm:text-5xl">
            {{ program.title }}
          </h2>
          <p v-if="program.description" class="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
            {{ program.description }}
          </p>
          <NuxtLink
            to="/public-service"
            class="mt-7 inline-flex items-center gap-2.5 text-sm font-medium text-neutral-900 hover:text-forest"
          >
            Explore public service
            <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
          </NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { AboutProgram } from "~/types/about"

const { programs, loading = false } = defineProps<{
  programs: AboutProgram[]
  loading?: boolean
}>()
</script>
