<template>
  <main class="mx-auto max-w-3xl px-5 py-16 sm:px-8">
    <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">Connect</p>
    <h1 class="mt-3 font-serif text-5xl text-neutral-900">{{ page.heading }}</h1>
    <p class="mt-6 whitespace-pre-line text-sm leading-relaxed text-neutral-600">{{ page.body }}</p>
    <dl class="mt-8 space-y-4 text-sm text-neutral-800">
      <div v-if="page.email">
        <dt class="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Email</dt>
        <dd class="mt-1"><a :href="`mailto:${page.email}`" class="underline">{{ page.email }}</a></dd>
      </div>
      <div v-if="page.phone">
        <dt class="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Phone</dt>
        <dd class="mt-1">{{ page.phone }}</dd>
      </div>
      <div v-if="page.address">
        <dt class="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Address</dt>
        <dd class="mt-1 whitespace-pre-line">{{ page.address }}</dd>
      </div>
    </dl>
  </main>
</template>

<script setup lang="ts">
import { singletonSeed } from "~~/shared/content"

const { data } = await useAsyncData("connect", () =>
  $fetch<typeof singletonSeed.connect>("/api/content/connect").catch(() => singletonSeed.connect),
)

const page = computed(() => data.value || singletonSeed.connect)
</script>
