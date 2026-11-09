<template>
  <div
    class="flex flex-col items-center px-6 py-12 text-center sm:py-14"
    :class="dark ? 'border border-white/15 bg-white/5' : 'border border-neutral-200 bg-[#f7f6f3]'"
  >
    <span
      class="inline-flex size-14 items-center justify-center rounded-full"
      :class="dark ? 'bg-white/10 text-white' : 'bg-white text-forest shadow-sm'"
    >
      <Icon :name="icon" size="1.5rem" aria-hidden="true" />
    </span>
    <h3
      class="mt-5 font-serif text-3xl leading-tight sm:text-4xl"
      :class="dark ? 'text-white' : 'text-neutral-900'"
    >
      {{ title }}
    </h3>
    <p
      class="mt-3 max-w-md text-sm leading-relaxed"
      :class="dark ? 'text-white/70' : 'text-neutral-600'"
    >
      {{ text }}
    </p>
    <NuxtLink
      v-if="to && linkLabel"
      :to="to"
      class="mt-6 inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em]"
      :class="dark
        ? 'border-white/80 text-white hover:bg-white hover:text-[#10241c]'
        : 'border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white'"
    >
      {{ linkLabel }}
      <Icon name="heroicons:arrow-right" size="0.9rem" aria-hidden="true" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { icon = "heroicons:inbox", title, text, to, linkLabel, dark = false } = defineProps<{
  icon?: string
  title: string
  text: string
  to?: string
  linkLabel?: string
  dark?: boolean
}>()
</script>
