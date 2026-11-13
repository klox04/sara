<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-[2px] sm:p-6"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-dialog-title"
        class="my-auto w-full max-w-3xl rounded-2xl bg-white p-4 text-neutral-900 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <div class="flex items-center justify-between gap-4">
          <h2 id="video-dialog-title" class="font-serif text-3xl italic leading-none sm:text-[2.5rem]">
            {{ heading }}
          </h2>
          <button
            ref="closeButton"
            type="button"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 sm:size-10"
            aria-label="Close video"
            @click="close"
          >
            <Icon name="heroicons:x-mark" size="1.35rem" />
          </button>
        </div>

        <div v-if="src && youtubeEmbed" class="mt-4 inline-flex rounded-full bg-neutral-100 p-1 sm:mt-6" role="tablist" aria-label="Video source">
          <button
            v-for="option in sourceOptions"
            :key="option.value"
            type="button"
            role="tab"
            :aria-selected="source === option.value"
            class="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition"
            :class="source === option.value ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'"
            @click="selectSource(option.value)"
          >
            <Icon :name="option.icon" size="1rem" aria-hidden="true" />
            {{ option.label }}
          </button>
        </div>

        <div v-if="source === 'youtube' && youtubeEmbed" class="mt-4 overflow-hidden rounded-xl bg-black" :class="src ? 'sm:mt-4' : 'sm:mt-6'">
          <iframe
            :src="youtubeEmbed"
            :title="title || heading"
            class="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>

        <div v-else class="relative mt-4 overflow-hidden rounded-xl bg-black" :class="youtubeEmbed ? 'sm:mt-4' : 'sm:mt-6'">
          <video
            ref="player"
            :src="src"
            :poster="poster"
            controls
            playsinline
            preload="metadata"
            class="aspect-video w-full bg-black"
            :class="started ? 'object-contain' : 'object-cover'"
            @play="playing = started = true"
            @pause="playing = false"
            @ended="playing = false"
          />
          <button
            v-if="!playing"
            type="button"
            class="absolute left-1/2 top-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-full border-2 border-white/90 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40 sm:size-20"
            aria-label="Play video"
            @click="play"
          >
            <Icon name="heroicons:play-solid" size="2.25rem" class="translate-x-0.5" aria-hidden="true" />
          </button>
        </div>

        <h3 v-if="title" class="mt-5 font-serif text-xl italic leading-snug sm:text-2xl">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          {{ description }}
        </p>

        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="rounded-full border border-neutral-300 px-8 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
type VideoSource = "file" | "youtube"

const { src = "", youtubeUrl = "", poster, heading = "Watch Video", title, description } = defineProps<{
  src?: string
  youtubeUrl?: string
  poster?: string
  heading?: string
  title?: string
  description?: string
}>()

const open = defineModel<boolean>("open", { default: false })
const closeButton = ref<HTMLButtonElement | null>(null)
const player = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const started = ref(false)
const source = ref<VideoSource>("file")
let returnFocus: HTMLElement | null = null

const youtubeEmbed = computed(() => (open.value ? youtubeEmbedUrl(youtubeUrl, { autoplay: true }) : ""))

const sourceOptions: { value: VideoSource, label: string, icon: string }[] = [
  { value: "file", label: "Video", icon: "heroicons:film" },
  { value: "youtube", label: "YouTube", icon: "heroicons:play-circle" },
]

function selectSource(value: VideoSource) {
  if (source.value === value) return
  player.value?.pause()
  source.value = value
}

function close() {
  open.value = false
}

function play() {
  player.value?.play().catch(() => undefined)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) close()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    source.value = src ? "file" : "youtube"
    returnFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"
    await nextTick()
    closeButton.value?.focus()
  }
  else {
    playing.value = false
    started.value = false
    document.body.style.overflow = ""
    returnFocus?.focus()
    returnFocus = null
  }
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
  document.body.style.overflow = ""
})
</script>
