<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <div class="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            A little more context
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
            Common questions
          </h2>
        </div>

        <div class="border-t border-neutral-200">
          <div
            v-for="(item, index) in questions"
            :key="item.question"
            class="border-b border-neutral-200"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-6 py-4 text-left text-sm text-neutral-800 sm:text-[15px]"
              :aria-expanded="openIndex === index"
              @click="openIndex = openIndex === index ? null : index"
            >
              {{ item.question }}
              <Icon
                name="heroicons:plus"
                class="shrink-0 text-neutral-700 transition-transform"
                :class="openIndex === index ? 'rotate-45' : ''"
                size="1.05rem"
                aria-hidden="true"
              />
            </button>
            <p v-if="openIndex === index" class="pb-4 text-sm leading-relaxed text-neutral-600">
              {{ item.answer }}
              <NuxtLink v-if="item.to" :to="item.to" class="underline hover:text-forest">
                {{ item.linkLabel }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <div class="mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Further reading
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
            Related public records
          </h2>
        </div>
        <NuxtLink
          to="/archive"
          class="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
        >
          Explore archive
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
            <Icon name="heroicons:arrow-top-right-on-square" size="0.95rem" aria-hidden="true" />
            Source pending
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null)

const questions = [
  {
    question: "Where can I find verified eligibility information?",
    answer: "Verified eligibility rules are not listed on this page. Confirm current requirements with the office that administers the program.",
  },
  {
    question: "How can I contact the relevant office?",
    answer: "Office contact details are listed on the ",
    to: "/connect",
    linkLabel: "Connect page.",
  },
  {
    question: "Can I apply for assistance through this website?",
    answer: "Applications are not accepted here. This page shows sample overviews and records only.",
  },
]

const records = [
  {
    meta: "Speech · Year unknown · Davao City",
    title: "Historical Public Address",
    detail: "Placeholder record for demonstrating archive metadata, filtering and source link states.",
  },
  {
    meta: "Publication · Year unknown",
    title: "Education Policy Publication",
    detail: "Placeholder record for demonstrating archive metadata, filtering and source link states.",
  },
  {
    meta: "Report · Year unknown · OVP",
    title: "OVP Program Report",
    detail: "Placeholder record for demonstrating archive metadata, filtering and source link states.",
  },
]
</script>
