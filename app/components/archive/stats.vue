<template>
  <section class="relative overflow-hidden bg-[#eef1ea] text-neutral-900">
    <img
      :src="flower"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-10 -left-10 w-40 opacity-[0.12] sm:w-48"
    >

    <div class="relative mx-auto grid max-w-[1180px] grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,1fr))] lg:gap-0 lg:py-9">
      <div class="col-span-2 lg:col-span-1 lg:pr-6">
        <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-800">
          By the record
        </p>
        <h2 class="mt-3 font-serif text-[1.85rem] leading-[1.15] font-medium text-neutral-950 lg:text-[1.45rem] xl:text-[1.75rem]">
          A growing library<br>
          <span class="sm:whitespace-nowrap">for a more transparent nation.</span>
        </h2>
      </div>

      <div
        v-for="stat in stats"
        :key="stat.label"
        class="border-neutral-300 lg:border-l lg:px-5 xl:px-7"
      >
        <Icon :name="stat.icon" size="1.5rem" class="text-neutral-800" aria-hidden="true" />
        <p class="mt-2 font-serif text-[2rem] leading-none font-medium whitespace-nowrap lining-nums text-neutral-950 lg:text-[1.6rem] xl:text-[2rem]">
          {{ stat.value }}
        </p>
        <p class="mt-2 text-[12px] font-semibold text-neutral-900">
          {{ stat.label }}
        </p>
        <p class="mt-1 max-w-[11rem] text-[11px] leading-relaxed text-neutral-500">
          {{ stat.text }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import flower from "~/assets/image/flower.png"
import { archiveRecords, archiveYear } from "~~/shared/archive"

const years = archiveRecords.map(record => Number(archiveYear(record.date))).filter(Boolean)
const firstYear = Math.min(...years)
const lastYear = Math.max(...years)

const stats = [
  {
    icon: "heroicons:document-text",
    value: archiveRecords.length.toLocaleString("en-US"),
    label: "Total Records",
    text: "Speeches, reports, statements, and more",
  },
  {
    icon: "heroicons:building-library",
    value: new Set(archiveRecords.map(record => record.institution)).size,
    label: "Institutions",
    text: "OVP, Davao City Government, and partners",
  },
  {
    icon: "heroicons:square-3-stack-3d",
    value: new Set(archiveRecords.map(record => record.category)).size,
    label: "Categories",
    text: "Programs, education, communities, governance",
  },
  {
    icon: "heroicons:calendar-days",
    value: firstYear === lastYear ? `${firstYear}` : `${firstYear}–${lastYear}`,
    label: "Years Covered",
    text: "A continuing record of public service",
  },
]
</script>
