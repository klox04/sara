<template>
  <main class="flex flex-1 flex-col bg-white">
    <article v-if="gallery" class="mx-auto w-full max-w-[1180px] px-6 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <NuxtLink
        to="/gallery"
        class="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 hover:text-forest"
      >
        <Icon name="heroicons:arrow-left" size="0.9rem" aria-hidden="true" />
        All collections
      </NuxtLink>

      <header class="mt-6 max-w-3xl sm:mt-8">
        <p v-if="gallery.category" class="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          {{ gallery.category }}
        </p>
        <h1 class="mt-3 font-serif text-[2.5rem] font-semibold leading-[1.05] text-neutral-950 sm:text-[3.25rem]">
          {{ gallery.title }}
        </h1>
        <p v-if="gallery.description" class="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-neutral-600 sm:text-base">
          {{ gallery.description }}
        </p>
        <div class="mt-5 flex flex-wrap gap-5 text-[13px] text-neutral-600">
          <p class="inline-flex items-center gap-1.5">
            <Icon name="heroicons:photo" size="1rem" aria-hidden="true" />
            {{ countLabel(gallery.pictures.length, "photo") }}
          </p>
          <p class="inline-flex items-center gap-1.5">
            <Icon name="heroicons:video-camera" size="1rem" aria-hidden="true" />
            {{ countLabel(gallery.videos.length, "video") }}
          </p>
        </div>
      </header>

      <img
        v-if="gallery.cover"
        :src="gallery.cover"
        :alt="gallery.title"
        class="mt-8 aspect-[4/3] w-full rounded-xl object-cover object-[center_25%] sm:aspect-[21/9]"
      >

      <section v-if="gallery.pictures.length" class="mt-12" aria-labelledby="gallery-photos">
        <h2 id="gallery-photos" class="font-serif text-3xl font-medium text-neutral-950">Photos</h2>
        <ul class="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <li v-for="(picture, index) in gallery.pictures" :key="picture">
            <button
              type="button"
              class="group block w-full overflow-hidden rounded-lg bg-[#eef1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a3328]"
              :aria-label="`Open photo ${index + 1} of ${gallery.pictures.length}`"
              @click="openPhoto(index)"
            >
              <img
                :src="picture"
                :alt="`${gallery.title} photo ${index + 1}`"
                class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              >
            </button>
          </li>
        </ul>
      </section>

      <section v-if="gallery.videos.length" class="mt-12" aria-labelledby="gallery-videos">
        <h2 id="gallery-videos" class="font-serif text-3xl font-medium text-neutral-950">Videos</h2>
        <ul class="mt-5 grid gap-4 sm:grid-cols-2">
          <li v-for="video in gallery.videos" :key="video">
            <video
              :src="video"
              controls
              preload="metadata"
              class="aspect-video w-full rounded-lg bg-black object-contain"
            />
          </li>
        </ul>
      </section>

      <EmptyState
        v-if="!gallery.pictures.length && !gallery.videos.length"
        class="mt-12"
        icon="heroicons:photo"
        title="Photos and videos are on the way"
        text="Media for this collection will be shared here soon."
      />
    </article>

    <div v-else-if="loading" class="mx-auto w-full max-w-[1180px] animate-pulse px-6 pt-8 pb-16 sm:px-8 sm:pt-12" aria-busy="true">
      <span class="sr-only">Loading collection…</span>
      <div class="h-3 w-28 bg-neutral-200" />
      <div class="mt-8 h-3 w-24 bg-neutral-200" />
      <div class="mt-4 h-11 w-3/5 rounded bg-neutral-200" />
      <div class="mt-4 h-4 w-2/5 rounded bg-neutral-200" />
      <div class="mt-8 aspect-[21/9] w-full rounded-xl bg-neutral-200" />
      <div class="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div v-for="index in 3" :key="index" class="aspect-[4/3] rounded-lg bg-neutral-200" />
      </div>
    </div>

    <div v-else class="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5d6f64]">Collection not found</p>
      <h1 class="mt-4 font-serif text-4xl font-medium text-[#1d3b30] sm:text-5xl">This collection is unavailable</h1>
      <p class="mt-4 text-sm leading-relaxed text-neutral-600">
        It may have been moved or is no longer published.
      </p>
      <NuxtLink
        to="/gallery"
        class="mt-8 inline-flex items-center gap-2.5 bg-[#1a3328] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
      >
        Browse all collections
        <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
      </NuxtLink>
    </div>

    <Teleport to="body">
      <div
        v-if="gallery && viewerIndex !== null"
        class="fixed inset-0 z-[60] flex flex-col bg-black/90"
        role="dialog"
        aria-modal="true"
        :aria-label="`${gallery.title} photo viewer`"
        @click.self="closePhoto"
      >
        <div class="flex items-center justify-between px-4 py-3 text-sm text-white/80 sm:px-6">
          <span>{{ viewerIndex + 1 }} / {{ gallery.pictures.length }}</span>
          <button
            ref="closeButton"
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10"
            aria-label="Close photo viewer"
            @click="closePhoto"
          >
            <Icon name="heroicons:x-mark" size="1.5rem" aria-hidden="true" />
          </button>
        </div>
        <div class="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16" @click.self="closePhoto">
          <img
            :src="gallery.pictures[viewerIndex]"
            :alt="`${gallery.title} photo ${viewerIndex + 1}`"
            class="max-h-full max-w-full rounded-md object-contain"
          >
          <button
            v-if="gallery.pictures.length > 1"
            type="button"
            class="absolute left-2 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
            aria-label="Previous photo"
            @click="stepPhoto(-1)"
          >
            <Icon name="heroicons:chevron-left" size="1.5rem" aria-hidden="true" />
          </button>
          <button
            v-if="gallery.pictures.length > 1"
            type="button"
            class="absolute right-2 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
            aria-label="Next photo"
            @click="stepPhoto(1)"
          >
            <Icon name="heroicons:chevron-right" size="1.5rem" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type MediaRecord = { file_path?: string | null } | string

type GalleryRecord = {
  uuid?: string
  initiative?: { name?: string } | null
  title?: string
  description?: string | null
  file_path?: string | null
  is_active?: boolean
  pictures?: MediaRecord[] | null
  videos?: MediaRecord[] | null
}

const { GET_API } = useGlobalStore()
const route = useRoute()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const record = ref<GalleryRecord | null>(null)
const loading = ref(true)
const viewerIndex = ref<number | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

const id = computed(() => String(route.params.id ?? ""))

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function mediaPaths(list: MediaRecord[] | null | undefined) {
  if (!Array.isArray(list)) return []
  return list.flatMap((item) => {
    const path = (typeof item === "string" ? item : item?.file_path ?? "").trim()
    return path ? [storageSrc(path)] : []
  })
}

function countLabel(count: number, noun: string) {
  return `${count} ${count === 1 ? noun : `${noun}s`}`
}

const gallery = computed(() => {
  const item = record.value
  if (!item?.title || item.is_active === false) return null
  const pictures = mediaPaths(item.pictures)
  return {
    title: item.title,
    category: item.initiative?.name ?? "",
    description: item.description?.trim() ?? "",
    cover: storageSrc(item.file_path?.trim() ?? "") || pictures[0] || "",
    pictures,
    videos: mediaPaths(item.videos),
  }
})

useHead({
  title: () => gallery.value?.title || "Gallery",
})

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as GalleryRecord : null
}

async function getGallery() {
  loading.value = true
  try {
    const single = await GET_API({ api: `galleries/${id.value}` })
      .then(response => asRecord(response.data?.data))
      .catch(() => null)
    if (single) {
      record.value = single
      return
    }
    const rows = await GET_API({ api: "public/galleries", per_page: 100 })
      .then(response => response.data?.data)
    record.value = Array.isArray(rows) ? (rows as GalleryRecord[]).find(row => row.uuid === id.value) ?? null : null
  }
  catch (error) {
    record.value = null
    console.error("Error fetching gallery:", error)
  }
  finally {
    loading.value = false
  }
}

function openPhoto(index: number) {
  viewerIndex.value = index
  nextTick(() => closeButton.value?.focus())
}

function closePhoto() {
  viewerIndex.value = null
}

function stepPhoto(step: number) {
  const total = gallery.value?.pictures.length ?? 0
  if (viewerIndex.value === null || !total) return
  viewerIndex.value = (viewerIndex.value + step + total) % total
}

function onKeydown(event: KeyboardEvent) {
  if (viewerIndex.value === null) return
  if (event.key === "Escape") closePhoto()
  else if (event.key === "ArrowLeft") stepPhoto(-1)
  else if (event.key === "ArrowRight") stepPhoto(1)
}

watch(viewerIndex, (index) => {
  document.body.style.overflow = index === null ? "" : "hidden"
})

watch(id, () => {
  closePhoto()
  getGallery()
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
  getGallery()
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
  document.body.style.overflow = ""
})
</script>
