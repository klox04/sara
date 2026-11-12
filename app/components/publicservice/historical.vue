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

      <ul
        v-if="loading"
        class="animate-pulse divide-y divide-neutral-300 border-neutral-300 lg:border-l lg:pl-12"
        aria-busy="true"
      >
        <li v-for="index in 2" :key="index" class="flex items-center gap-6 py-6">
          <span class="min-w-0 flex-1">
            <span class="block h-2.5 w-28 bg-neutral-300/70" />
            <span class="mt-3 block h-7 w-3/5 bg-neutral-300/70" />
            <span class="mt-3 block h-3 w-full bg-neutral-200" />
            <span class="mt-2 block h-3 w-4/5 bg-neutral-200" />
          </span>
          <span class="size-4 shrink-0 bg-neutral-300/70" />
        </li>
      </ul>

      <ul v-else-if="records.length" class="divide-y divide-neutral-300 border-neutral-300 lg:border-l lg:pl-12">
        <li v-for="item in records" :key="item.id">
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
              <span v-if="item.detail" class="mt-2 line-clamp-3 block text-sm leading-relaxed text-neutral-600">
                {{ item.detail }}
              </span>
            </span>
            <Icon name="heroicons:arrow-right" class="shrink-0 text-neutral-700 group-hover:text-forest" size="1.15rem" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>

      <EmptyState
        v-else
        icon="heroicons:archive-box"
        title="Historical initiatives are on the way"
        text="Featured past programs will be listed here soon."
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type HistoricalRecord = {
  id: string
  meta: string
  title: string
  detail: string
}

type ProgramRecord = {
  uuid?: string
  milestone?: { title?: string, year?: string | number | null } | null
  title?: string
  description?: string
}

const { GET_API } = useGlobalStore()
const records = ref<HistoricalRecord[]>([])
const loading = ref(true)

function getRecords() {
  loading.value = true
  GET_API({ api: "public/programs", is_featured: true, per_page: 100 })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as ProgramRecord[] : []
      records.value = rows
        .filter(row => row.title)
        .map((row, index) => ({
          id: row.uuid || `program-${index}`,
          meta: ["OVP", row.milestone?.title?.trim(), row.milestone?.year ? String(row.milestone.year) : ""].filter(Boolean).join(" · "),
          title: row.title ?? "",
          detail: row.description?.trim() ?? "",
        }))
    })
    .catch((error: unknown) => {
      records.value = []
      console.error("Error fetching featured programs:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(getRecords)
</script>
