<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18643e] disabled:cursor-not-allowed disabled:opacity-60"
  >
    <Icon v-if="icon" :name="icon" size="1.1rem" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: "button" | "submit" | "reset"
  icon?: string
  disabled?: boolean
}>(), {
  type: "button",
  icon: "",
  disabled: false,
})
</script>
