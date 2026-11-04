<template>
  <main class="flex flex-1 flex-col">
    <HeroSection />
    <PrioritiesSection />
    <JourneySection />
    <StoriesPreview />
    <StatsSection />
    <ConnectSection />
  </main>
</template>

<script setup lang="ts">
import HeroSection from "~/components/home/HeroSection.vue"
import PrioritiesSection from "~/components/home/PrioritiesSection.vue"
import JourneySection from "~/components/home/JourneySection.vue"
import StoriesPreview from "~/components/home/StoriesPreview.vue"
import StatsSection from "~/components/home/StatsSection.vue"
import ConnectSection from "~/components/home/ConnectSection.vue"
</script>
