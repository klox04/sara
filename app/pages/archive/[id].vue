<template>
  <main class="flex flex-1 flex-col bg-[#faf9f7]">
    <article v-if="record" class="mx-auto w-full max-w-[1180px] px-6 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <NuxtLink
        to="/archive#all-records"
        class="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 hover:text-forest"
      >
        <Icon name="heroicons:arrow-left" size="0.9rem" aria-hidden="true" />
        All records
      </NuxtLink>

      <header class="mt-6 max-w-3xl sm:mt-8">
        <p v-if="record.category" class="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          <Icon :name="record.icon" size="1rem" aria-hidden="true" />
          {{ record.category }}
        </p>
        <h1 class="mt-3 font-serif text-[2.5rem] font-semibold leading-[1.05] text-[#1d3b30] sm:text-[3.25rem]">
          {{ record.title }}
        </h1>
        <dl class="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-neutral-600">
          <div v-if="record.date" class="inline-flex items-center gap-1.5">
            <dt class="sr-only">Date</dt>
            <Icon name="heroicons:calendar" size="1rem" aria-hidden="true" />
            <dd>{{ record.date }}</dd>
          </div>
          <div v-if="record.type" class="inline-flex items-center gap-1.5">
            <dt class="sr-only">Type</dt>
            <Icon name="heroicons:document-duplicate" size="1rem" aria-hidden="true" />
            <dd>{{ record.type }}</dd>
          </div>
          <div v-if="record.institution" class="inline-flex items-center gap-1.5">
            <dt class="sr-only">Institution</dt>
            <Icon name="heroicons:building-library" size="1rem" aria-hidden="true" />
            <dd>{{ record.institution }}</dd>
          </div>
        </dl>
        <p v-if="record.description" class="mt-5 text-[15px] leading-relaxed whitespace-pre-line text-neutral-700 sm:text-base">
          {{ record.description }}
        </p>
      </header>

      <img
        v-if="record.image"
        :src="record.image"
        :alt="record.title"
        class="mt-8 aspect-[4/3] w-full rounded-xl border border-neutral-200 object-cover sm:aspect-[21/9]"
      >

      <section v-if="record.pdf" class="mt-12" aria-labelledby="record-document">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h2 id="record-document" class="font-serif text-3xl font-medium text-neutral-950">Document</h2>
          <div class="flex flex-wrap gap-2">
            <a
              :href="record.pdf"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 border border-[#1d3b30] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1d3b30] hover:bg-[#1d3b30] hover:text-white"
            >
              Open PDF
              <Icon name="heroicons:arrow-top-right-on-square" size="0.95rem" aria-hidden="true" />
            </a>
            <a
              :href="record.pdf"
              :download="record.pdfName"
              class="inline-flex items-center gap-2 bg-[#1d3b30] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white hover:bg-[#163026]"
            >
              Download
              <Icon name="heroicons:arrow-down-tray" size="0.95rem" aria-hidden="true" />
            </a>
          </div>
        </div>
        <iframe
          :src="record.pdf"
          :title="`${record.title} PDF document`"
          class="mt-5 block w-full rounded-lg border border-neutral-200 bg-white"
          :style="{ height: '80vh', minHeight: '36rem' }"
        />
      </section>

      <section v-if="record.videos.length" class="mt-12" aria-labelledby="record-videos">
        <h2 id="record-videos" class="font-serif text-3xl font-medium text-neutral-950">Videos</h2>
        <ul class="mt-5 grid gap-4 sm:grid-cols-2">
          <li v-for="video in record.videos" :key="video">
            <video
              :src="video"
              controls
              preload="metadata"
              class="aspect-video w-full rounded-lg bg-black object-contain"
            />
          </li>
        </ul>
      </section>
    </article>

    <div v-else-if="loading" class="mx-auto w-full max-w-[1180px] animate-pulse px-6 pt-8 pb-16 sm:px-8 sm:pt-12" aria-busy="true">
      <span class="sr-only">Loading record…</span>
      <div class="h-3 w-24 bg-neutral-200" />
      <div class="mt-8 h-3 w-32 bg-neutral-200" />
      <div class="mt-4 h-11 w-3/5 rounded bg-neutral-200" />
      <div class="mt-5 h-3 w-2/5 rounded bg-neutral-200" />
      <div class="mt-5 h-4 w-3/4 rounded bg-neutral-200" />
      <div class="mt-8 aspect-[21/9] w-full rounded-xl bg-neutral-200" />
    </div>

    <div v-else class="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5d6f64]">Record not found</p>
      <h1 class="mt-4 font-serif text-4xl font-medium text-[#1d3b30] sm:text-5xl">This record is unavailable</h1>
      <p class="mt-4 text-sm leading-relaxed text-neutral-600">
        It may have been moved or is no longer published.
      </p>
      <NuxtLink
        to="/archive#all-records"
        class="mt-8 inline-flex items-center gap-2.5 bg-[#1a3328] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
      >
        Browse all records
        <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
type RecordData = {
  uuid?: string
  title?: string
  description?: string | null
  record_date?: string | null
  category?: { name?: string, icon?: string | null } | null
  institution?: { name?: string } | null
  type?: { name?: string } | null
  file_path?: string | null
  pdf_file_path?: string | null
  videos?: ({ file_path?: string | null } | string)[] | null
}

const { GET_API } = useGlobalStore()
const route = useRoute()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const data = ref<RecordData | null>(null)
const loading = ref(true)

const id = computed(() => String(route.params.id ?? ""))

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  if (!value || Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
}

const record = computed(() => {
  const item = data.value
  if (!item?.title) return null
  const icon = item.category?.icon ?? ""
  const pdfPath = item.pdf_file_path?.trim() ?? ""
  const videos = Array.isArray(item.videos) ? item.videos : []
  return {
    title: item.title,
    description: item.description?.trim() ?? "",
    date: formatDate(item.record_date ?? ""),
    category: item.category?.name ?? "",
    icon: icon.includes(":") ? icon : "heroicons:document-text",
    institution: item.institution?.name ?? "",
    type: item.type?.name ?? "",
    image: storageSrc(item.file_path?.trim() ?? ""),
    pdf: storageSrc(pdfPath),
    pdfName: pdfPath ? `${item.title}.pdf` : "",
    videos: videos.flatMap((video) => {
      const path = (typeof video === "string" ? video : video?.file_path ?? "").trim()
      return path ? [storageSrc(path)] : []
    }),
  }
})

useHead({
  title: () => record.value ? `${record.value.title} | Sara Duterte` : "Archive | Sara Duterte",
})

function getRecord() {
  loading.value = true
  GET_API({ api: `public/records/${id.value}` })
    .then((response) => {
      const item = response.data?.data
      data.value = item && typeof item === "object" && !Array.isArray(item) ? item as RecordData : null
    })
    .catch((error: unknown) => {
      data.value = null
      console.error("Error fetching record:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

watch(id, getRecord)

onMounted(() => {
  getRecord()
})
</script>
