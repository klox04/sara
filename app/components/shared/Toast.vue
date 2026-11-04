<template>
  <div
    class="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    aria-live="polite"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg"
      :class="tone[item.type]"
      role="status"
    >
      <p class="min-w-0 flex-1">{{ item.message }}</p>
      <button
        type="button"
        class="shrink-0 text-white/80 hover:text-white"
        aria-label="Close"
        @click="dismiss(item.id)"
      >
        <Icon name="heroicons:x-mark" size="1rem" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from "~/composables/useToast"

const { items, dismiss } = useToast()

const tone: Record<ToastType, string> = {
  success: "bg-[#1f7a4d]",
  error: "bg-red-700",
  warning: "bg-amber-600",
  info: "bg-forest",
}
</script>
