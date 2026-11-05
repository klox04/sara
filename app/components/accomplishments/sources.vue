<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Sources &amp; documents
          </p>
          <p class="mt-2 text-sm text-neutral-600">
            Reports, publications, and other records related to the figures above.
          </p>
        </div>
        <NuxtLink
          to="/archive"
          class="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
        >
          View all documents
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ul class="mt-8 border-t border-neutral-200">
        <li
          v-for="record in records"
          :key="record.title"
          class="flex flex-col gap-4 border-b border-neutral-200 py-5 sm:flex-row sm:items-center sm:gap-5"
        >
          <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-[#f3f4f0] text-neutral-600">
            <Icon name="heroicons:document-text" size="1.15rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
              {{ record.meta }}
              <span class="border border-neutral-300 px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-neutral-500">
                Sample content
              </span>
            </p>
            <h3 class="mt-1 text-base font-medium text-neutral-950">
              {{ record.title }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-neutral-500">
              {{ record.detail }}
            </p>
          </div>
          <p class="inline-flex shrink-0 items-center gap-2 text-sm text-neutral-500">
            <Icon name="heroicons:clock" size="0.95rem" aria-hidden="true" />
            Source pending
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const records = [
  {
    meta: "Speech · Year pending · Davao City",
    title: "Historical Public Address",
    detail: "Placeholder record for demonstrating archive metadata, filtering and source-link states.",
  },
  {
    meta: "Publication · Year pending · DepEd",
    title: "Education Policy Publication",
    detail: "Placeholder record for demonstrating archive metadata, filtering and source-link states.",
  },
  {
    meta: "Report · Year pending · OVP",
    title: "OVP Program Report",
    detail: "Placeholder record for demonstrating archive metadata, filtering and source-link states.",
  },
]
</script>
