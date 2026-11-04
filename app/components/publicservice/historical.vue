<template>
  <section class="bg-[#f6f4ef]">
    <div class="mx-auto grid max-w-[1180px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-20">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Looking back
        </p>
        <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
          Historical initiatives
        </h2>
        <p class="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          These overviews demonstrate how past initiatives may be presented. Current availability, locations, and access details have not been verified.
        </p>
        <NuxtLink
          to="/archive"
          class="mt-8 inline-flex items-center gap-2.5 border border-neutral-800 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          Browse historical records
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ul class="divide-y divide-neutral-300 border-neutral-300 lg:border-l lg:pl-12">
        <li v-for="item in records" :key="item.title">
          <NuxtLink
            to="/archive"
            class="group flex items-center gap-6 py-6"
          >
            <span class="min-w-0 flex-1">
              <span class="block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                {{ item.meta }}
              </span>
              <span class="mt-2 block font-serif text-3xl font-medium text-neutral-950">
                {{ item.title }}
              </span>
              <span class="mt-2 block text-sm leading-relaxed text-neutral-600">
                {{ item.detail }}
              </span>
            </span>
            <Icon name="heroicons:arrow-right" class="shrink-0 text-neutral-700 group-hover:text-forest" size="1.15rem" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const records = [
  {
    meta: "OVP · Sample overview",
    title: "Libreng Sakay",
    detail: "Transportation support initiative documented in OVP reporting.",
  },
  {
    meta: "OVP · Sample overview",
    title: "Community Food Outreach",
    detail: "Illustrative overview card for food and community outreach activities.",
  },
]
</script>
