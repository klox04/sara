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

      <p
        v-if="!loading && !summary"
        class="col-span-2 self-center text-sm text-neutral-600 lg:col-span-4 lg:border-l lg:border-neutral-300 lg:px-7"
      >
        Record figures will appear here once the library is published.
      </p>
      <template v-else>
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="border-neutral-300 lg:border-l lg:px-5 xl:px-7"
        >
          <Icon :name="stat.icon" size="1.5rem" class="text-neutral-800" aria-hidden="true" />
          <p v-if="loading" class="mt-2 h-8 w-20 animate-pulse rounded bg-neutral-300/70" aria-hidden="true" />
          <p v-else class="mt-2 font-serif text-[2rem] leading-none font-medium whitespace-nowrap lining-nums text-neutral-950 lg:text-[1.6rem] xl:text-[2rem]">
            {{ stat.value }}
          </p>
          <p class="mt-2 text-[12px] font-semibold text-neutral-900">
            {{ stat.label }}
          </p>
          <p class="mt-1 max-w-[11rem] text-[11px] leading-relaxed text-neutral-500">
            {{ stat.text }}
          </p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import flower from "~/assets/image/flower.png"

type Summary = {
  totalRecords: number
  institutions: number
  categories: number
  yearsCovered: string
}

const { GET_API } = useGlobalStore()
const summary = ref<Summary | null>(null)
const loading = ref(true)

function readCount(value: unknown) {
  const count = typeof value === "number" ? value : Number(value)
  return Number.isFinite(count) ? count : 0
}

const stats = computed(() => [
  {
    icon: "heroicons:document-text",
    value: (summary.value?.totalRecords ?? 0).toLocaleString("en-US"),
    label: "Total Records",
    text: "Speeches, reports, statements, and more",
  },
  {
    icon: "heroicons:building-library",
    value: (summary.value?.institutions ?? 0).toLocaleString("en-US"),
    label: "Institutions",
    text: "OVP, Davao City Government, and partners",
  },
  {
    icon: "heroicons:square-3-stack-3d",
    value: (summary.value?.categories ?? 0).toLocaleString("en-US"),
    label: "Categories",
    text: "Programs, education, communities, governance",
  },
  {
    icon: "heroicons:calendar-days",
    value: summary.value?.yearsCovered || "—",
    label: "Years Covered",
    text: "A continuing record of public service",
  },
])

function getSummary() {
  loading.value = true
  GET_API({ api: "public/records/summary" })
    .then((response) => {
      const data = response.data?.data as Record<string, unknown> | undefined
      summary.value = data && typeof data === "object"
        ? {
            totalRecords: readCount(data.total_records),
            institutions: readCount(data.institutions),
            categories: readCount(data.categories),
            yearsCovered: typeof data.years_covered === "string" ? data.years_covered.trim() : String(data.years_covered ?? ""),
          }
        : null
    })
    .catch((error: unknown) => {
      summary.value = null
      console.error("Error fetching record summary:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getSummary()
})
</script>
