<template>
  <section>
    <PageHeader
      title="Gallery"
      description="Manage the photos and albums that appear on the Gallery page."
    />

    <div class="mt-6 flex flex-wrap gap-3">
      <button
        v-for="item in tabs"
        :key="item.value"
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :class="
          tab === item.value
            ? 'bg-forest text-white'
            : 'border border-neutral-200 bg-white text-neutral-800 shadow-sm'
        "
        :aria-pressed="tab === item.value"
        @click="tab = item.value"
      >
        <Icon :name="item.icon" size="1.1rem" aria-hidden="true" />
        {{ item.label }}
      </button>
    </div>

    <Collection v-if="tab === 'collection'" class="mt-6" />
    <Banner v-else class="mt-6" />
  </section>
</template>

<script setup lang="ts">
import Banner from "~/components/gallerytab/banner.vue"
import Collection from "~/components/gallerytab/collection.vue"

type Tab = "banner" | "collection"

const tabs: { value: Tab, label: string, icon: string }[] = [
  { value: "banner", label: "Banner", icon: "heroicons:photo" },
  { value: "collection", label: "Collection", icon: "heroicons:rectangle-stack" },
]

const route = useRoute()
const tab = ref<Tab>(route.query.tab === "collection" ? "collection" : "banner")
</script>
