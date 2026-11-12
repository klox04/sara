<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Explore the record
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
            Speeches &amp; historical records
          </h2>
        </div>
        <NuxtLink
          to="/archive"
          class="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
        >
          View the archive
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ul v-if="loading" class="mt-10 animate-pulse border-t border-neutral-200" aria-busy="true">
        <li v-for="index in 2" :key="index" class="flex gap-6 border-b border-neutral-200 py-5">
          <span class="sr-only">Loading records…</span>
          <div class="size-12 shrink-0 bg-[#f3f4f0]" />
          <div class="flex-1">
            <div class="h-2.5 w-40 bg-neutral-200" />
            <div class="mt-3 h-4 w-2/3 bg-neutral-200" />
            <div class="mt-2 h-3 w-5/6 bg-neutral-100" />
          </div>
        </li>
      </ul>

      <EmptyState
        v-else-if="!records.length"
        class="mt-10"
        icon="heroicons:document-text"
        title="Records coming soon"
        text="Speeches, publications, and historical records will be listed here."
        to="/archive"
        link-label="View the archive"
      />

      <ul v-else class="mt-10 border-t border-neutral-200">
        <li
          v-for="record in records"
          :key="record.id"
          class="flex flex-col gap-4 border-b border-neutral-200 py-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[#f3f4f0] text-neutral-600">
            <Icon :name="record.icon" size="1.25rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p v-if="record.meta" class="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {{ record.meta }}
            </p>
            <h3 class="mt-1 text-base font-medium text-neutral-950">
              {{ record.title }}
            </h3>
            <p v-if="record.detail" class="mt-1 text-sm leading-relaxed text-neutral-500">
              {{ record.detail }}
            </p>
          </div>
          <!-- <NuxtLink
            to="/archive"
            class="inline-flex shrink-0 items-center gap-2.5 text-sm text-neutral-700 hover:text-forest"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300">
              <Icon name="heroicons:arrow-right" size="0.9rem" aria-hidden="true" />
            </span>
            View document
          </NuxtLink> -->
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { AboutRecordItem } from "~/types/about"

const { records, loading = false } = defineProps<{
  records: AboutRecordItem[]
  loading?: boolean
}>()
</script>
