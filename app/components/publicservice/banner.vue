<template>
  <section class="bg-[#f6f4ef]">
    <div
      v-if="loading"
      class="mx-auto grid max-w-[1180px] animate-pulse items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.85fr)] lg:gap-16 lg:py-24"
      aria-busy="true"
    >
      <span class="sr-only">Loading banner…</span>
      <div>
        <div class="h-2.5 w-24 bg-neutral-300/70" />
        <div class="mt-5 h-12 w-4/5 bg-neutral-300/70" />
        <div class="mt-3 h-12 w-3/5 bg-neutral-300/70" />
        <div class="mt-6 h-3 w-full max-w-lg bg-neutral-200" />
        <div class="mt-2 h-3 w-5/6 max-w-lg bg-neutral-200" />
        <div class="mt-8 h-11 w-52 bg-neutral-300/70" />
      </div>
      <div class="relative mx-auto aspect-[10/7] w-full max-w-[36rem]">
        <div class="absolute top-[11%] left-0 h-[80%] w-[57%] rounded-xl bg-neutral-200" />
        <div class="absolute top-0 right-[3%] h-[46%] w-[41%] rounded-xl bg-neutral-200" />
        <div class="absolute right-0 bottom-[3%] h-[46%] w-[44%] rounded-xl bg-neutral-200" />
      </div>
    </div>

    <div
      v-else-if="banner"
      class="mx-auto grid max-w-[1180px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.85fr)] lg:gap-16 lg:py-24"
    >
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Public service
        </p>
        <h1 class="mt-4 max-w-xl font-serif text-[2.7rem] font-medium leading-[1.05] whitespace-pre-line text-neutral-950 sm:text-6xl">
          {{ banner.title }}
        </h1>
        <p v-if="banner.subtitle" class="mt-5 max-w-lg text-sm leading-relaxed whitespace-pre-line text-neutral-600 sm:text-[15px]">
          {{ banner.subtitle }}
        </p>
        <NuxtLink
          to="#initiatives"
          class="mt-8 inline-flex w-fit items-center gap-3 bg-[#1a3328] px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
        >
          Explore the initiatives
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="relative mx-auto aspect-[10/7] w-full max-w-[36rem]">
        <div class="absolute top-[3%] left-[24%] h-[42%] w-[52%] -rotate-3 rounded-2xl bg-[#cfdccd]" aria-hidden="true" />
        <div class="absolute right-[-2%] bottom-[10%] h-[52%] w-[30%] rotate-2 rounded-2xl bg-[#cfdccd]" aria-hidden="true" />

        <template v-for="photo in photos" :key="photo.key">
          <img
            v-if="photo.src"
            :src="photo.src"
            :alt="photo.alt"
            class="absolute rounded-xl border-4 border-white object-cover"
            :class="photo.class"
          >
          <div
            v-else
            class="absolute flex items-center justify-center rounded-xl border-4 border-white bg-[#e7ebe4] text-[#9aa79e]"
            :class="photo.class"
            aria-hidden="true"
          >
            <Icon name="heroicons:photo" size="2rem" />
          </div>
        </template>
      </div>
    </div>

    <div v-else class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-24">
      <EmptyState
        icon="heroicons:squares-2x2"
        title="Public Service is being prepared"
        text="Programs and community initiatives will be introduced here soon."
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type Banner = {
  title: string
  subtitle: string
  images: [string, string, string]
}

const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const banner = ref<Banner | null>(null)
const loading = ref(true)

const photoLayout = [
  { key: "main", class: "top-[11%] left-0 h-[80%] w-[57%] shadow-xl" },
  { key: "second", class: "top-0 right-[3%] h-[46%] w-[41%] object-top shadow-lg" },
  { key: "third", class: "right-0 bottom-[3%] h-[46%] w-[44%] shadow-lg" },
]

const photos = computed(() => photoLayout.map((photo, index) => ({
  ...photo,
  src: banner.value?.images[index] ?? "",
  alt: `${banner.value?.title.replace(/\s+/g, " ").trim() || "Public Service"} photo ${index + 1}`,
})))

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function getBanner() {
  loading.value = true
  GET_API({ api: "public/public-service-headers" })
    .then((response) => {
      const data = response.data?.data
      const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
      const title = readText(record?.title)
      banner.value = record && title
        ? {
            title,
            subtitle: readText(record.subtitle),
            images: [
              storageSrc(readText(record.file_path)),
              storageSrc(readText(record.second_file_path)),
              storageSrc(readText(record.third_file_path)),
            ],
          }
        : null
    })
    .catch((error: unknown) => {
      banner.value = null
      console.error("Error fetching Public Service banner:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getBanner()
})
</script>
