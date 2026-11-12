<template>
  <section>
    <PageHeader
      title="Archive"
      description="Manage the records and documents that appear on the Archive page."
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
        @click="selectTab(item.value)"
      >
        <Icon :name="item.icon" size="1.1rem" aria-hidden="true" />
        {{ item.label }}
      </button>
    </div>

    <Record v-if="tab === 'record'" class="mt-6" />
    <Banner v-else v-model:dirty="dirty" class="mt-6" />

    <DiscardDialog
      v-model:open="discardOpen"
      @confirm="settleDiscard(true)"
      @cancel="settleDiscard(false)"
    />
  </section>
</template>

<script setup lang="ts">
import Banner from "~/components/archivetab/banner.vue"
import Record from "~/components/archivetab/record.vue"
import DiscardDialog from "~/components/dialog/discarddialog.vue"

type Tab = "banner" | "record"

const tabs: { value: Tab, label: string, icon: string }[] = [
  { value: "banner", label: "Banner", icon: "heroicons:photo" },
  { value: "record", label: "Record", icon: "heroicons:archive-box" },
]

const route = useRoute()
const tab = ref<Tab>(tabs.find(item => item.value === route.query.tab)?.value ?? "banner")
const dirty = ref(false)
const discardOpen = ref(false)
let resolveDiscard: ((discard: boolean) => void) | null = null

function askToDiscard() {
  if (!dirty.value) return Promise.resolve(true)
  resolveDiscard?.(false)
  discardOpen.value = true
  return new Promise<boolean>((resolve) => {
    resolveDiscard = resolve
  })
}

function settleDiscard(discard: boolean) {
  discardOpen.value = false
  if (discard) dirty.value = false
  resolveDiscard?.(discard)
  resolveDiscard = null
}

async function selectTab(next: Tab) {
  if (next === tab.value) return
  if (await askToDiscard()) tab.value = next
}

onBeforeRouteLeave(() => askToDiscard())

function warnBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ""
}

onMounted(() => {
  window.addEventListener("beforeunload", warnBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", warnBeforeUnload)
})
</script>
