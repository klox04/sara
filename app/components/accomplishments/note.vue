<template>
  <section class="relative overflow-hidden bg-[#f6f4ef]">
    <img
      :src="flower"
      alt=""
      class="pointer-events-none absolute top-0 -left-4 hidden h-full w-36 object-cover object-left lg:block lg:w-44"
    >

    <div class="relative mx-auto grid max-w-[1180px] items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_auto] lg:gap-12 lg:py-16">
      <div class="lg:pl-16">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Reading the numbers
        </p>
        <h2 class="mt-3 max-w-sm font-serif text-4xl font-medium leading-tight text-neutral-950 sm:text-5xl">
          Every figure needs a fuller story.
        </h2>
      </div>

      <div>
        <p class="max-w-md text-sm leading-relaxed text-neutral-600">
          The examples here are layout samples, not verified achievements. A reporting period is not a completion date; an investment portfolio is not government spending. Definitions, attribution, and primary sources must be reviewed before publication.
        </p>
        <NuxtLink
          to="/archive"
          class="mt-6 inline-flex items-center gap-2.5 bg-[#1a3328] px-4 py-3 text-[13px] font-medium text-white hover:bg-[#14281f]"
        >
          Learn more about the data
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ul class="space-y-4 border-neutral-300 lg:border-l lg:pl-8">
        <li v-for="item in checks" :key="item.label" class="flex items-center gap-3 text-sm text-neutral-700">
          <Icon :name="item.icon" class="shrink-0 text-neutral-600" size="1.15rem" aria-hidden="true" />
          {{ item.label }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import flower from "~/assets/image/flower.png"

const checks = [
  { icon: "heroicons:envelope", label: "Check the reporting period" },
  { icon: "heroicons:document-text", label: "Review definitions and scope" },
  { icon: "heroicons:user-group", label: "Confirm the primary source" },
  { icon: "heroicons:magnifying-glass", label: "Look for related documents" },
]
</script>
