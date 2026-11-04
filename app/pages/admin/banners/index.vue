<template>
  <section>
    <PageHeader
      title="Homepage"
      description="Manage the content and sections that appear on the public site."
    />

    <div class="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :class="
          tab === 'banner'
            ? 'bg-forest text-white'
            : 'border border-neutral-200 bg-white text-neutral-800 shadow-sm'
        "
        @click="tab = 'banner'"
      >
        <Icon name="heroicons:photo" size="1.1rem" aria-hidden="true" />
        Banner
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :class="
          tab === 'program'
            ? 'bg-forest text-white'
            : 'border border-neutral-200 bg-white text-neutral-800 shadow-sm'
        "
        @click="tab = 'program'"
      >
        <Icon name="heroicons:rectangle-stack"  size="1.1rem" aria-hidden="true" />
        Program
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :class="
          tab === 'journey'
            ? 'bg-forest text-white'
            : 'border border-neutral-200 bg-white text-neutral-800 shadow-sm'
        "
        @click="tab = 'journey'"
      >
        <Icon name="heroicons:map" size="1.1rem" aria-hidden="true" />
        Journey
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :class="
          tab === 'stories'
            ? 'bg-forest text-white'
            : 'border border-neutral-200 bg-white text-neutral-800 shadow-sm'
        "
        @click="tab = 'stories'"
      >
        <Icon name="heroicons:book-open" size="1.1rem" aria-hidden="true" />
        Stories
      </button>
    </div>

    <Program v-if="tab === 'program'" class="mt-6" />
    <Journey v-else-if="tab === 'journey'" class="mt-6" />
    <Stories v-else-if="tab === 'stories'" class="mt-6" />
    <Banner v-else class="mt-6" />
  </section>
</template>

<script setup lang="ts">
import Banner from "~/components/hompagetab/banner.vue";
import Journey from "~/components/hompagetab/journey.vue";
import Program from "~/components/hompagetab/program.vue";
import Stories from "~/components/hompagetab/stories.vue";

const tab = ref<"banner" | "program" | "journey" | "stories">("banner");
</script>
