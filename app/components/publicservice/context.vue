<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
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

      <ul v-if="loading" class="mt-8 animate-pulse border-t border-neutral-200" aria-busy="true">
        <li v-for="index in 3" :key="index" class="flex items-center gap-5 border-b border-neutral-200 py-5">
          <span class="h-11 w-11 shrink-0 bg-[#f3f4f0]" />
          <div class="min-w-0 flex-1">
            <div class="h-2.5 w-40 bg-neutral-200" />
            <div class="mt-3 h-4 w-3/5 bg-neutral-200" />
            <div class="mt-2 h-3 w-4/5 bg-neutral-100" />
          </div>
        </li>
      </ul>

      <ul v-else-if="records.length" class="mt-8 border-t border-neutral-200">
        <li v-for="record in records" :key="record.id" class="border-b border-neutral-200">
          <NuxtLink
            :to="`/archive/${record.id}`"
            class="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-5"
          >
            <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-[#f3f4f0] text-neutral-600">
              <Icon :name="record.icon" size="1.15rem" aria-hidden="true" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                {{ record.meta }}
              </p>
              <h3 class="mt-1 text-base font-medium text-neutral-950 group-hover:text-forest">
                {{ record.title }}
              </h3>
              <p v-if="record.detail" class="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                {{ record.detail }}
              </p>
            </div>
            <p class="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-neutral-900 group-hover:text-forest">
              View record
              <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
            </p>
          </NuxtLink>
        </li>
      </ul>

      <EmptyState
        v-else
        class="mt-8"
        icon="heroicons:document-text"
        title="Related records are on the way"
        text="Public records connected to these programs will be listed here soon."
        to="/archive"
        link-label="Explore the archive"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

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

type RelatedRecord = {
  id: string
  icon: string
  meta: string
  title: string
  detail: string
}

type RecordData = {
  uuid?: string
  title?: string
  description?: string | null
  record_date?: string | null
  category?: { icon?: string | null } | null
  institution?: { name?: string } | null
  type?: { name?: string } | null
  show_in_public_service?: boolean | number | string
}

const { GET_API } = useGlobalStore()
const records = ref<RelatedRecord[]>([])
const loading = ref(true)

function shownInPublicService(value: RecordData["show_in_public_service"]) {
  return value === undefined || value === true || value === 1 || value === "1" || value === "true"
}

function getRecords() {
  loading.value = true
  GET_API({ api: "public/records", show_in_public_service: true, per_page: 6 })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data as RecordData[] : []
      records.value = rows
        .filter(row => row.uuid && row.title && shownInPublicService(row.show_in_public_service))
        .map((row) => {
          const icon = row.category?.icon ?? ""
          const year = row.record_date?.match(/\d{4}/)?.[0] ?? ""
          return {
            id: row.uuid ?? "",
            icon: icon.includes(":") ? icon : "heroicons:document-text",
            meta: [row.type?.name, year, row.institution?.name].filter(Boolean).join(" · "),
            title: row.title ?? "",
            detail: row.description?.trim() ?? "",
          }
        })
    })
    .catch((error: unknown) => {
      records.value = []
      console.error("Error fetching related records:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getRecords()
})
</script>
