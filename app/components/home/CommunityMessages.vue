<template>
  <section class="bg-[#f6f4ef] text-neutral-900" aria-labelledby="community-messages-title">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-900">
        Community voices
      </p>
      <h2 id="community-messages-title" class="mt-3 font-serif text-4xl font-medium text-[#1d3b30] sm:text-5xl">
        Messages from the Community
      </h2>
      <p class="mt-3 text-sm text-neutral-700">
        A selection of messages shared by individuals, organizations, and communities.
      </p>

      <div class="mt-8 border-t border-neutral-300" />

      <ul v-if="loading && !messages.length" class="mt-8 grid animate-pulse gap-5 md:grid-cols-3" aria-busy="true">
        <li v-for="index in 3" :key="index" class="border border-neutral-200 bg-[#fbfaf7] px-6 py-6">
          <div class="h-2.5 w-28 bg-neutral-200" />
          <div class="mt-6 h-4 w-full bg-neutral-200" />
          <div class="mt-3 h-4 w-11/12 bg-neutral-200" />
          <div class="mt-3 h-4 w-3/5 bg-neutral-200" />
          <div class="mt-8 h-2.5 w-20 bg-neutral-200" />
        </li>
      </ul>

      <ul v-else-if="messages.length" class="mt-8 grid gap-5 md:grid-cols-3" :aria-busy="loading">
        <li
          v-for="message in messages"
          :key="message.id"
          class="flex flex-col border border-neutral-200 bg-[#fbfaf7] px-6 py-6 transition-opacity"
          :class="loading ? 'opacity-60' : ''"
        >
          <p class="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1f]">
            Featured message
            <span class="h-px flex-1 bg-neutral-200" aria-hidden="true" />
          </p>
          <span class="mt-4 block text-[#8a6a1f]" :style="quoteMarkStyle" aria-hidden="true">“</span>
          <blockquote class="mt-1 line-clamp-6 flex-1 font-serif text-xl leading-snug whitespace-pre-line text-neutral-900 italic">
            {{ message.text }}
          </blockquote>
          <span class="mt-6 h-px w-10 bg-neutral-300" aria-hidden="true" />
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
            {{ message.name }}
          </p>
        </li>
      </ul>

      <EmptyState
        v-else
        class="mt-8"
        icon="heroicons:chat-bubble-left-right"
        title="Messages from the community are on the way"
        text="Messages shared by individuals, organizations, and communities will appear here soon."
      />

      <nav v-if="pageCount > 1" class="mt-8 flex items-center justify-center gap-2" aria-label="Message pages">
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-200/60 disabled:text-neutral-300 disabled:hover:bg-transparent"
          :disabled="page === 1"
          aria-label="Previous messages"
          @click="page--"
        >
          <Icon name="heroicons:chevron-left" size="1.1rem" aria-hidden="true" />
        </button>
        <button
          v-for="number in pageCount"
          :key="number"
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-full text-sm font-medium"
          :class="page === number ? 'bg-[#1d3b30] text-white' : 'text-neutral-800 hover:bg-neutral-200/60'"
          :aria-current="page === number ? 'page' : undefined"
          @click="page = number"
        >
          {{ number }}
        </button>
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-200/60 disabled:text-neutral-300 disabled:hover:bg-transparent"
          :disabled="page === pageCount"
          aria-label="Next messages"
          @click="page++"
        >
          <Icon name="heroicons:chevron-right" size="1.1rem" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"

type CommunityMessage = {
  id: string
  name: string
  text: string
  active: boolean
}

const { rows, page, perPage, total, loading } = usePagedList<CommunityMessage>({
  api: "public/messages",
  perPage: 3,
  map: (row, index) => ({
    id: typeof row.uuid === "string" ? row.uuid : `message-${index}`,
    name: typeof row.name === "string" ? row.name.trim() : "",
    text: typeof row.message === "string" ? row.message.trim() : "",
    active: row.is_active !== false && row.is_active !== 0 && row.is_active !== "0",
  }),
})

const messages = computed(() => rows.value.filter(message => message.active && message.text))
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))

const quoteMarkStyle = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "3rem",
  fontWeight: 700,
  lineHeight: 1,
  height: "1.75rem",
}

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>
