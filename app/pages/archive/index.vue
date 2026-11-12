<template>
  <main>
    <ArchiveBanner />
    <ArchiveRecords />
    <ArchiveBrowse />
    <ArchiveStats />
  </main>
</template>

<script setup lang="ts">
import ArchiveBanner from "~/components/archive/banner.vue"
import ArchiveBrowse from "~/components/archive/browse.vue"
import ArchiveRecords from "~/components/archive/records.vue"
import ArchiveStats from "~/components/archive/stats.vue"
</script>
