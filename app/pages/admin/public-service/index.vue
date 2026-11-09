<template>
  <section>
    <PageHeader
      title="Public Service"
      description="Manage the content that appears on the Public Service page."
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

    <Records v-if="tab === 'records'" class="mt-6" />
    <Program v-else class="mt-6" />
  </section>
</template>

<script setup lang="ts">
import Program from "~/components/publicservicetab/program.vue"
import Records from "~/components/publicservicetab/records.vue"

type Tab = "program" | "records"

const tabs: { value: Tab, label: string, icon: string }[] = [
  { value: "program", label: "Program", icon: "heroicons:light-bulb" },
  { value: "records", label: "Public Records", icon: "heroicons:archive-box" },
]

const tab = ref<Tab>("program")
</script>
