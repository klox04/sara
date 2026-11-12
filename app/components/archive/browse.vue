<template>
  <section class="bg-[#faf9f7] text-neutral-900">
    <div class="mx-auto max-w-[1180px] px-6 pb-16 sm:px-8 lg:pb-20">
      <div class="flex items-center justify-between gap-4">
        <h2 class="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-[12px] sm:tracking-[0.2em]">
          Browse by type
        </h2>
        <!-- <button
          type="button"
          class="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-800 hover:text-forest sm:gap-2 sm:text-[11px] sm:tracking-[0.14em]"
          @click="showType('')"
        >
          View all types
          <Icon name="heroicons:arrow-right" size="0.9rem" aria-hidden="true" />
        </button> -->
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="item in types"
          :key="item.type"
          type="button"
          class="flex gap-4 border bg-white px-5 py-6 text-left transition-colors hover:border-[#1d3b30] xl:gap-5 xl:px-6"
          :class="filters.type === item.type ? 'border-[#1d3b30]' : 'border-neutral-200'"
          :aria-pressed="filters.type === item.type"
          @click="showType(item.type)"
        >
          <span class="flex h-10 w-9 shrink-0 items-start justify-center text-neutral-900">
            <span v-if="item.quote" class="mt-1 font-serif text-[5rem] leading-[0.6] font-bold" aria-hidden="true">“</span>
            <Icon v-else :name="item.icon" size="2.1rem" aria-hidden="true" />
          </span>
          <span class="flex flex-1 flex-col">
            <span class="font-serif text-[1.45rem] leading-tight font-medium text-neutral-950 xl:whitespace-nowrap lg:text-[1.3rem] xl:text-[1.45rem]">
              {{ item.label }}
            </span>
            <span class="mt-1.5 flex-1 text-[13px] leading-relaxed text-neutral-600">
              {{ item.text }}
            </span>
            <span class="mt-4 inline-flex items-center gap-3 text-[13px] font-semibold text-[#1d3b30]">
              {{ countLabel(typeCounts[item.type] ?? 0) }}
              <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>

      <h2 class="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-[12px] sm:tracking-[0.2em]">
        Browse by year
      </h2>

      <div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        <button
          type="button"
          class="flex min-h-14 flex-col items-center justify-center border px-3 py-2 text-[13px] font-semibold"
          :class="filters.year === '' ? 'border-[#1d3b30] bg-[#1d3b30] text-white' : 'border-neutral-200 bg-white text-neutral-900 hover:border-[#1d3b30]'"
          :aria-pressed="filters.year === ''"
          @click="showYear('')"
        >
          All
        </button>
        <button
          v-for="item in years"
          :key="item.year"
          type="button"
          class="flex min-h-14 flex-col items-center justify-center border px-3 py-2"
          :class="filters.year === item.year ? 'border-[#1d3b30] bg-[#1d3b30] text-white' : 'border-neutral-200 bg-white text-neutral-900 hover:border-[#1d3b30]'"
          :aria-pressed="filters.year === item.year"
          @click="showYear(item.year)"
        >
          <span class="text-[13px] font-semibold">{{ item.year }}</span>
          <span class="mt-0.5 text-[12px]" :class="filters.year === item.year ? 'text-white/80' : 'text-neutral-500'">
            {{ item.count }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { archiveRecords, archiveYear, emptyArchiveFilters, type ArchiveFilters } from "~~/shared/archive"

const filters = useState<ArchiveFilters>("archive-filters", emptyArchiveFilters)

const types = [
  { type: "Speech", label: "Speeches", text: "Public addresses, keynote speeches, and remarks.", icon: "heroicons:microphone", quote: false },
  { type: "Report", label: "Reports", text: "Program reports, accomplishment reports, and special reports.", icon: "heroicons:document-text", quote: false },
  { type: "Statement", label: "Statements", text: "Official statements and press releases.", icon: "", quote: true },
  { type: "Policy Document", label: "Policy Documents", text: "Policies, frameworks, and position papers.", icon: "heroicons:clipboard-document-list", quote: false },
]

const typeCounts = archiveRecords.reduce<Record<string, number>>((counts, record) => {
  counts[record.type] = (counts[record.type] ?? 0) + 1
  return counts
}, {})

const years = Object.entries(
  archiveRecords.reduce<Record<string, number>>((counts, record) => {
    const year = archiveYear(record.date)
    counts[year] = (counts[year] ?? 0) + 1
    return counts
  }, {}),
)
  .map(([year, count]) => ({ year, count }))
  .sort((a, b) => b.year.localeCompare(a.year))

function countLabel(count: number) {
  return `${count} ${count === 1 ? "record" : "records"}`
}

function scrollToRecords() {
  document.getElementById("all-records")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

function showType(type: string) {
  filters.value.type = type
  scrollToRecords()
}

function showYear(year: string) {
  filters.value.year = year
  scrollToRecords()
}
</script>
