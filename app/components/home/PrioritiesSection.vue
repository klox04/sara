<template>
  <section id="public-service" class="bg-white text-forest">
    <div class="mx-auto w-full max-w-[1180px] py-10 lg:py-12">
      <ul
        v-if="loading"
        class="grid animate-pulse grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6"
        aria-busy="true"
      >
        <li v-for="index in 6" :key="index" class="flex flex-col items-center px-2">
          <span class="sr-only">Loading priorities…</span>
          <div class="size-8 rounded-full bg-neutral-200" />
          <div class="mt-3 h-2.5 w-20 bg-neutral-200" />
          <div class="mt-2 h-2.5 w-24 bg-neutral-100" />
        </li>
      </ul>

      <EmptyState
        v-else-if="!items.length"
        class="mx-5 sm:mx-8"
        icon="heroicons:squares-2x2"
        title="Priorities are being updated"
        text="The programs and priorities for every Filipino will be listed here soon."
        to="/public-service"
        link-label="See public service"
      />

      <ul v-else class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:gap-x-6">
        <li v-for="item in items" :key="item.id" class="px-2 text-center">
          <Icon :name="item.icon" size="2rem" class="text-neutral-800" aria-hidden="true" />
          <h2 class="mt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-forest">
            {{ item.title }}
          </h2>
          <p class="mt-1.5 text-[12px] leading-snug text-forest">
            {{ item.text }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { Priority } from "~/types/priority"

const { items, loading = false } = defineProps<{
  items: Priority[]
  loading?: boolean
}>()
</script>
