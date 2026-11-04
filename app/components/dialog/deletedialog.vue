<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        class="w-full max-w-md rounded-xl bg-white shadow-2xl"
      >
        <div class="flex items-start gap-3 px-6 py-5">
          <span class="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
            <Icon name="heroicons:exclamation-triangle" size="1.4rem" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="delete-dialog-title" class="text-xl font-bold text-neutral-900">Delete this item?</h2>
            <p class="mt-1 text-sm text-neutral-600">
              This data will be permanently removed. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
            @click="close"
          >
            <Icon name="heroicons:x-mark" size="1.15rem" />
          </button>
        </div>
        <div class="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            class="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-800"
            @click="confirm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false })
const emit = defineEmits<{
  confirm: []
}>()

function close() {
  open.value = false
}

function confirm() {
  open.value = false
  emit("confirm")
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) close()
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>
