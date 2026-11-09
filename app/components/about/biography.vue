<template>
  <section class="bg-white">
    <div class="mx-auto grid max-w-[1180px] items-start gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16 lg:py-20">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          A personal chronology
        </p>
        <h2 class="mt-3 font-serif text-5xl font-medium text-neutral-950 sm:text-6xl">
          Biography
        </h2>
        <div v-if="loading" class="mt-6 max-w-xl animate-pulse space-y-3" aria-busy="true">
          <span class="sr-only">Loading biography…</span>
          <div class="h-3.5 w-full bg-neutral-200" />
          <div class="h-3.5 w-11/12 bg-neutral-200" />
          <div class="h-3.5 w-4/5 bg-neutral-200" />
          <div class="h-3.5 w-full bg-neutral-100" />
          <div class="h-3.5 w-3/4 bg-neutral-100" />
        </div>
        <div v-else-if="paragraphs.length" class="mt-6 max-w-xl space-y-5 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          <p v-for="(paragraph, index) in paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
        <EmptyState
          v-else
          class="mt-6 max-w-xl"
          icon="heroicons:document-text"
          title="Biography coming soon"
          text="A fuller account of her life and public service will be published here."
        />
      </div>

      <aside class="bg-[#f3f4f0] px-6 py-8 sm:px-8">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          At a glance
        </p>
        <h3 class="mt-3 font-serif text-3xl font-medium text-neutral-950 sm:text-[2rem]">
          Local roots. National roles.
        </h3>
        <ul v-if="loading" class="mt-8 animate-pulse space-y-6" aria-busy="true">
          <li v-for="index in 3" :key="index" class="flex gap-4">
            <span class="sr-only">Loading roles…</span>
            <div class="size-11 shrink-0 rounded-full bg-[#e4e6e1]" />
            <div class="flex-1 pt-1">
              <div class="h-3.5 w-28 bg-[#e4e6e1]" />
              <div class="mt-2 h-3 w-40 bg-[#e9ebe6]" />
              <div class="mt-2 h-3 w-48 bg-[#e9ebe6]" />
            </div>
          </li>
        </ul>
        <ul v-else-if="roles.length" class="mt-8 space-y-6">
          <li
            v-for="role in roles"
            :key="role.id"
            class="flex gap-4"
          >
            <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4e6e1] text-neutral-500">
              <Icon :name="role.icon" size="1.15rem" aria-hidden="true" />
            </span>
            <div class="min-w-0 pt-0.5">
              <p class="font-medium text-neutral-900">{{ role.title }}</p>
              <p v-if="role.meta" class="mt-0.5 text-sm text-neutral-500">{{ role.meta }}</p>
              <p v-if="role.detail" class="mt-1 text-sm leading-relaxed text-neutral-500">{{ role.detail }}</p>
            </div>
          </li>
        </ul>
        <div v-else class="mt-8 flex items-start gap-3 border border-dashed border-neutral-300 bg-white/60 px-4 py-4 text-sm text-neutral-500">
          <Icon name="heroicons:flag" size="1.15rem" class="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />
          <p>Roles and offices held will be listed here soon.</p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import type { AboutRole } from "~/types/about"

const { paragraphs, roles, loading = false } = defineProps<{
  paragraphs: string[]
  roles: AboutRole[]
  loading?: boolean
}>()
</script>
