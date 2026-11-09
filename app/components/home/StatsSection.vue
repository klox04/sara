<template>
  <section class="bg-[#10241c] text-white">
    <div class="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-16">
      <div class="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-xl">
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
            By the Numbers
          </p>
          <h2 class="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            Real Work. Measurable Results.
          </h2>
        </div>
        <div class="flex max-w-md flex-col gap-5 sm:flex-row sm:items-center lg:max-w-lg lg:justify-end">
          <p class="text-sm leading-relaxed text-white/75">
            A track record of programs, initiatives, and recognitions across years of public service.
          </p>
          <NuxtLink
            to="/accomplishments"
            class="inline-flex shrink-0 items-center justify-center gap-2 border border-white/80 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] hover:bg-white hover:text-[#10241c]"
          >
            View more
            <Icon name="heroicons:arrow-right" size="0.9rem" />
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="loading"
        class="mt-10 grid animate-pulse gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        aria-busy="true"
      >
        <span class="sr-only">Loading statistics…</span>
        <div v-for="index in 4" :key="index">
          <div class="h-12 w-28 bg-white/10" />
          <div class="mt-4 h-3 w-44 bg-white/5" />
          <div class="mt-2 h-3 w-36 bg-white/5" />
        </div>
      </div>

      <EmptyState
        v-else-if="!impact || (!impact.figures.length && !impact.statement)"
        dark
        class="mt-10"
        icon="heroicons:chart-bar"
        title="Results are being compiled"
        text="Figures from programs, initiatives, and recognitions will be shared here soon."
        to="/accomplishments"
        link-label="See accomplishments"
      />

      <div v-else class="mt-10 grid gap-10 lg:gap-8" :class="impact.statement ? 'lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.24fr)]' : ''">
        <div v-if="impact.figures.length" class="grid gap-10 sm:grid-cols-2 lg:gap-8" :class="figureColumns">
          <article v-for="item in impact.figures" :key="item.id">
            <p class="font-serif text-5xl leading-none lining-nums">{{ item.value }}</p>
            <p class="mt-4 max-w-[14rem] text-sm leading-relaxed text-white/75">{{ item.label }}</p>
            <a
              v-if="item.source"
              :href="item.source"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80 hover:text-white"
            >
              View source
              <Icon name="heroicons:arrow-right" size="0.85rem" />
            </a>
          </article>
        </div>

        <blockquote v-if="impact.statement" class="lg:border-l lg:border-white/15 lg:pl-8">
          <p class="font-serif text-2xl italic leading-snug text-white/95 sm:text-[1.7rem]">
            “ {{ impact.statement }} ”
          </p>
          <footer v-if="impact.attribution" class="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
            — {{ impact.attribution }}
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { Impact } from "~/types/impact"

const { impact, loading = false } = defineProps<{
  impact: Impact | null
  loading?: boolean
}>()

const figureColumns = computed(() => {
  const count = impact?.figures.length ?? 0
  if (count <= 2) return "lg:grid-cols-2"
  if (count === 3) return "lg:grid-cols-3"
  return "lg:grid-cols-4"
})
</script>
