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

      <ul class="mt-10 border-t border-neutral-200">
        <li
          v-for="record in records"
          :key="record.title"
          class="flex flex-col gap-4 border-b border-neutral-200 py-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[#f3f4f0] text-neutral-600">
            <Icon name="heroicons:document-text" size="1.25rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {{ record.meta }}
            </p>
            <h3 class="mt-1 text-base font-medium text-neutral-950">
              {{ record.title }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-neutral-500">
              {{ record.detail }}
            </p>
          </div>
          <NuxtLink
            to="/archive"
            class="inline-flex shrink-0 items-center gap-2.5 text-sm text-neutral-700 hover:text-forest"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300">
              <Icon name="heroicons:arrow-right" size="0.9rem" aria-hidden="true" />
            </span>
            View document
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const records = [
  {
    meta: "Speech · Year TBD · Sample content",
    title: "Historical Public Address",
    detail: "Placeholder record of remarks on public service, community development, and national priorities.",
  },
  {
    meta: "Publication · Year TBD · Sample content",
    title: "Education Policy Publication",
    detail: "Placeholder record of policies, programs, and key initiatives on education.",
  },
]
</script>
