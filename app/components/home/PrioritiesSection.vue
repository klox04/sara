<template>
  <section id="public-service" class="bg-white text-forest">
    <div class="mx-auto w-full max-w-[1180px] py-10 lg:py-12">
      <ul class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-7 lg:gap-x-6">
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
import { contentSeed, type ContentRecord } from "~~/shared/content"

const { data } = await useAsyncData("programs", () =>
  $fetch<ContentRecord[]>("/api/content/programs").catch(() => [] as ContentRecord[]),
)

const items = computed(() => {
  const source = data.value?.length ? data.value : contentSeed.programs
  return source.map(item => ({
    id: item.id,
    icon: typeof item.icon === "string" ? item.icon : "heroicons:sparkles",
    title: typeof item.title === "string" ? item.title : "",
    text: typeof item.text === "string" ? item.text : "",
  }))
})
</script>
