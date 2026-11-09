<template>
  <section>
    <PageHeader
      title="Experience"
      description="Manage the milestones that appear in Her Journey on the homepage."
    />

    <div class="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <Milestones />
    </div>
  </section>
</template>

<script setup lang="ts">
import Milestones from "~/components/hompagetab/milestones.vue"
</script>
