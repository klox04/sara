<template>
  <main>
    <PublicServiceBanner />
    <PublicServiceInitiatives />
    <PublicServiceHistorical />
    <PublicServiceContext />
  </main>
</template>

<script setup lang="ts">
import PublicServiceBanner from "~/components/publicservice/banner.vue"
import PublicServiceInitiatives from "~/components/publicservice/initiatives.vue"
import PublicServiceHistorical from "~/components/publicservice/historical.vue"
import PublicServiceContext from "~/components/publicservice/context.vue"
</script>
