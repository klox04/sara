<template>
  <main>
    <StoriesBanner />
    <StoriesFeatured />
    <StoriesJournal />
    <StoriesGallery />
  </main>
</template>

<script setup lang="ts">
import StoriesBanner from "~/components/stories/banner.vue"
import StoriesFeatured from "~/components/stories/featured.vue"
import StoriesJournal from "~/components/stories/journal.vue"
import StoriesGallery from "~/components/stories/gallery.vue"
</script>
