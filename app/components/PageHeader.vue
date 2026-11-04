<template>
  <header>
    <h1 class="mt-2 text-3xl font-bold text-forest">{{ title }}</h1>
    <p v-if="description" class="mt-2 text-sm text-neutral-600">{{ description }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
