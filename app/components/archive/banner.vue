<template>
  <section class="relative overflow-hidden bg-[#faf9f7]">
    <div
      v-if="loading"
      class="relative mx-auto flex max-w-[1440px] animate-pulse items-center px-6 py-14 sm:px-10 sm:py-16 lg:min-h-[clamp(24rem,28vw,32rem)] lg:py-16 lg:pl-16 xl:pl-24"
      aria-busy="true"
    >
      <span class="sr-only">Loading banner…</span>
      <div class="w-full max-w-xl lg:max-w-[21rem] xl:max-w-[28rem]">
        <div class="h-2.5 w-40 bg-neutral-300/70" />
        <div class="mt-5 h-12 w-4/5 bg-neutral-300/70" />
        <div class="mt-3 h-12 w-3/5 bg-neutral-300/70" />
        <div class="mt-6 h-3 w-full bg-neutral-200" />
        <div class="mt-2 h-3 w-5/6 bg-neutral-200" />
      </div>
      <div class="absolute inset-y-0 right-0 hidden w-[60%] bg-neutral-200/70 lg:block" />
    </div>

    <template v-else-if="banner">
      <img
        v-if="showImage"
        :src="banner.image"
        :alt="banner.title"
        class="pointer-events-none absolute inset-y-0 right-0 hidden aspect-[11/5] h-full max-w-[66%] object-cover object-[center_60%] lg:block"
        :style="sideFade"
        @error="imageFailed = true"
      >

      <div class="relative mx-auto flex max-w-[1440px] items-center px-6 py-14 sm:px-10 sm:py-16 lg:min-h-[clamp(24rem,28vw,32rem)] lg:py-16 lg:pl-16 xl:pl-24">
        <div class="max-w-xl lg:max-w-[21rem] xl:max-w-[28rem]">
          <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-600">
            Official records library
          </p>
          <h1 class="mt-4 font-serif text-[2.75rem] font-medium leading-[0.95] whitespace-pre-line text-[#1d3b30] sm:text-6xl lg:text-[4.25rem]">
            {{ banner.title }}
          </h1>
          <p v-if="banner.subtitle" class="mt-5 max-w-md text-sm leading-relaxed whitespace-pre-line text-neutral-600 sm:text-[15px]">
            {{ banner.subtitle }}
          </p>
        </div>
      </div>

      <template v-if="banner.quote">
        <blockquote
          class="absolute top-2 right-0 hidden w-[15rem] px-8 py-6 font-hand text-[1.9rem] leading-[1.05] text-neutral-800 lg:block xl:top-4 xl:right-4 xl:w-[17rem] xl:text-[2.15rem]"
          :style="quoteGlow"
        >
          <p>“{{ banner.quote }}”</p>
          <footer class="mt-2 text-right text-[1.45rem] xl:text-[1.6rem]">
            — {{ banner.quoteAuthor }}
          </footer>
        </blockquote>

        <blockquote class="relative px-6 pb-6 text-right font-hand text-[1.7rem] leading-[1.05] text-neutral-800 sm:px-10 sm:text-[2rem] lg:hidden">
          <p class="ml-auto max-w-[16rem] sm:max-w-[20rem]">
            “{{ banner.quote }}”
          </p>
          <footer class="mt-1 text-[1.35rem] sm:text-[1.5rem]">
            — {{ banner.quoteAuthor }}
          </footer>
        </blockquote>
      </template>

      <img
        v-if="showImage"
        :src="banner.image"
        :alt="banner.title"
        class="h-64 w-full object-cover object-[30%_center] sm:h-96 lg:hidden"
        :style="topFade"
        @error="imageFailed = true"
      >
    </template>

    <div v-else class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <EmptyState
        icon="heroicons:archive-box"
        title="The Archive is being prepared"
        text="Official records and publications will be introduced here soon."
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type Banner = {
  title: string
  subtitle: string
  quote: string
  quoteAuthor: string
  image: string
}

const defaultQuoteAuthor = "Sara Duterte"

function splitQuote(value: string) {
  const match = value.match(/^([\s\S]*?)\s+[—–-]\s*([^—–\n]{2,60})$/)
  const text = (match?.[1] ?? value).trim().replace(/^[“"']+|[”"']+$/g, "").trim()
  return { text, author: match?.[2]?.trim() || defaultQuoteAuthor }
}

const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const banner = ref<Banner | null>(null)
const loading = ref(true)
const imageFailed = ref(false)
const showImage = computed(() => Boolean(banner.value?.image) && !imageFailed.value)

const sideFade = {
  maskImage: "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.35) 12%, rgb(0 0 0 / 0.8) 22%, black 32%)",
  WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.35) 12%, rgb(0 0 0 / 0.8) 22%, black 32%)",
}

const quoteGlow = {
  background: "radial-gradient(closest-side, rgb(250 249 247 / 0.92), rgb(250 249 247 / 0.78) 60%, rgb(250 249 247 / 0))",
}

const topFade = {
  maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
}

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
  imageFailed.value = false
  GET_API({ api: "public/archive-headers" })
    .then((response) => {
      const data = response.data?.data
      const record = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
      const title = readText(record?.title)
      const quote = splitQuote(readText(record?.quote))
      banner.value = record && title
        ? {
            title,
            subtitle: readText(record.subtitle),
            quote: quote.text,
            quoteAuthor: quote.author,
            image: storageSrc(readText(record.file_path)),
          }
        : null
    })
    .catch((error: unknown) => {
      banner.value = null
      console.error("Error fetching Archive banner:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getBanner()
})
</script>
