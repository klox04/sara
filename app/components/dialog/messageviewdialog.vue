<template>
  <Teleport to="body">
    <div
      v-if="open && message"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-view-title"
        class="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 border-b border-neutral-200 px-6 py-5">
          <span class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
            <Icon name="heroicons:envelope-open" size="1.35rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="message-view-title" class="truncate text-xl font-bold text-neutral-900">{{ message.name || "Unknown sender" }}</h2>
            <p v-if="message.received" class="mt-0.5 text-sm text-neutral-500">Received {{ message.received }}</p>
          </div>
          <button
            ref="closeButton"
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
            @click="close"
          >
            <Icon name="heroicons:x-mark" size="1.15rem" />
          </button>
        </div>

        <div class="overflow-y-auto px-6 py-5">
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Message</p>
          <p class="mt-2 whitespace-pre-line break-words text-[15px] leading-relaxed text-neutral-800">{{ message.message }}</p>
        </div>

        <div class="flex justify-end border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            class="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
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
const { message } = defineProps<{
  message: { name: string, message: string, received: string } | null
}>()

const open = defineModel<boolean>("open", { default: false })
const closeButton = ref<HTMLButtonElement | null>(null)
let returnFocus: HTMLElement | null = null

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) close()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    returnFocus = document.activeElement as HTMLElement | null
    await nextTick()
    closeButton.value?.focus()
  }
  else {
    returnFocus?.focus()
    returnFocus = null
  }
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
