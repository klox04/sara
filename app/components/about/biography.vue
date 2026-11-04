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
        <div class="mt-6 max-w-xl space-y-5 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          <p>
            Sara Duterte served in Davao local government before assuming national office. Her public service journey has been shaped by a deep commitment to her community, practical solutions, and a focus on the well-being of Filipino families.
          </p>
          <p>
            From her early years in local governance to her work on the national stage, she has championed inclusive programs, stronger communities, and opportunities for the next generation.
          </p>
        </div>
        <div class="mt-8 flex max-w-xl items-start gap-3 border border-neutral-200 bg-[#fafafa] px-4 py-3.5 text-[13px] leading-relaxed text-neutral-500">
          <Icon name="heroicons:information-circle" class="mt-0.5 shrink-0 text-neutral-400" size="1.15rem" aria-hidden="true" />
          <p>
            Proposed content only. Working, historical details, and sources remain subject to editorial review.
          </p>
        </div>
      </div>

      <aside class="bg-[#f3f4f0] px-6 py-8 sm:px-8">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          At a glance
        </p>
        <h3 class="mt-3 font-serif text-3xl font-medium text-neutral-950 sm:text-[2rem]">
          Local roots. National roles.
        </h3>
        <ul class="mt-8 space-y-6">
          <li
            v-for="role in roles"
            :key="role.title + role.meta"
            class="flex gap-4"
          >
            <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4e6e1] text-neutral-500">
              <Icon :name="role.icon" size="1.15rem" aria-hidden="true" />
            </span>
            <div class="min-w-0 pt-0.5">
              <p class="font-medium text-neutral-900">{{ role.title }}</p>
              <p class="mt-0.5 text-sm text-neutral-500">{{ role.meta }}</p>
              <p class="mt-1 text-sm leading-relaxed text-neutral-500">{{ role.detail }}</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
const roles = [
  {
    icon: "heroicons:building-library",
    title: "Vice Mayor",
    meta: "2007 – 2010 · Davao City",
    detail: "Began her public service career.",
  },
  {
    icon: "heroicons:building-library",
    title: "Mayor",
    meta: "2010 – 2013 · Davao City",
    detail: "Continued city development programs.",
  },
  {
    icon: "heroicons:building-library",
    title: "Mayor",
    meta: "2016 – 2022 · Davao City",
    detail: "Expanded programs and services.",
  },
  {
    icon: "heroicons:building-library",
    title: "Vice President",
    meta: "2022 – present · Republic of the Philippines",
    detail: "Serves the Filipino people on the national stage.",
  },
  {
    icon: "heroicons:book-open",
    title: "Secretary of Education",
    meta: "2022 – 2024 · Department of Education",
    detail: "Led education reforms and learner-focused initiatives.",
  },
]
</script>
