<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <p class="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        A journey through the years
      </p>
      <h2 class="mt-3 text-center font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
        From local roots to national office
      </h2>

      <div class="mt-14 overflow-x-auto pb-2">
        <ol class="relative grid min-w-[64rem] grid-cols-5">
          <span
            class="absolute top-[2.35rem] right-[10%] left-[10%] h-px bg-neutral-400"
            aria-hidden="true"
          />
          <li
            v-for="stop in stops"
            :key="stop.title + stop.years"
            class="relative flex flex-col items-center px-3 text-center"
          >
            <p class="text-sm font-medium text-neutral-800">{{ stop.year }}</p>
            <span class="relative z-10 mt-3 h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span class="mt-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ebe4] text-neutral-600">
              <Icon :name="stop.icon" size="1.35rem" aria-hidden="true" />
            </span>
            <p class="mt-4 text-sm font-medium text-neutral-900">{{ stop.title }}</p>
            <p class="mt-1 text-[13px] leading-snug text-neutral-500">
              {{ stop.place }}<br>
              {{ stop.years }}
            </p>
            <p class="mt-3 max-w-[12rem] text-[13px] leading-relaxed text-neutral-500">
              {{ stop.detail }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stops = [
  {
    year: "2007",
    icon: "heroicons:building-library",
    title: "Vice Mayor",
    place: "Davao City",
    years: "2007 – 2010",
    detail: "Began her public service career in local government.",
  },
  {
    year: "2010",
    icon: "heroicons:building-library",
    title: "Mayor",
    place: "Davao City",
    years: "2010 – 2013",
    detail: "Continued key city programs.",
  },
  {
    year: "2016",
    icon: "heroicons:building-library",
    title: "Mayor",
    place: "Davao City",
    years: "2016 – 2022",
    detail: "Expanded programs and services.",
  },
  {
    year: "2022",
    icon: "heroicons:building-library",
    title: "Vice President",
    place: "Republic of the Philippines",
    years: "2022 – present",
    detail: "Serves the Filipino people on the national stage.",
  },
  {
    year: "2022",
    icon: "heroicons:book-open",
    title: "Secretary of Education",
    place: "Department of Education",
    years: "2022 – 2024",
    detail: "Advanced learner-centered reforms and initiatives.",
  },
]
</script>
