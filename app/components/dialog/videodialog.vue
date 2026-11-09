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

        <div class="relative mt-4 overflow-hidden rounded-xl bg-black sm:mt-6">
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
const { src, poster, heading = "Watch Video", title, description } = defineProps<{
  src: string
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
let returnFocus: HTMLElement | null = null

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
