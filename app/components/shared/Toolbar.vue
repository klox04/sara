<template>
  <header class="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white px-4 sm:px-6">
    <button
      type="button"
      class="inline-flex h-10 w-10 items-center justify-center text-neutral-800 md:hidden"
      aria-label="Open navigation"
      @click="emit('toggle-nav')"
    >
      <Icon name="heroicons:bars-3" size="1.4rem" aria-hidden="true" />
    </button>

    <div class="min-w-0 leading-tight">
      <p class="font-serif text-lg uppercase tracking-[0.14em] text-neutral-900">Sara Duterte</p>
      <p class="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">Admin</p>
    </div>

    <p v-if="username" class="ml-auto hidden text-sm text-neutral-600 sm:block">
      Signed in as {{ username }}
    </p>
    <button
      type="button"
      class="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950"
      @click="emit('sign-out')"
    >
      Sign out
    </button>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  username: string | null
}>()

const emit = defineEmits<{
  "toggle-nav": []
  "sign-out": []
}>()
</script>
