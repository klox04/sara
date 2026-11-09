<template>
  <section>
    <PageHeader
      title="Homepage"
      description="Manage the content and sections that appear on the public site."
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
        @click="selectTab(item.value)"
      >
        <Icon :name="item.icon" size="1.1rem" aria-hidden="true" />
        {{ item.label }}
      </button>
    </div>

    <Program v-if="tab === 'program'" class="mt-6" />
    <Journey v-else-if="tab === 'journey'" v-model:dirty="dirty" class="mt-6" />
    <Impact v-else-if="tab === 'impact'" v-model:dirty="dirty" class="mt-6" />
    <Banner v-else class="mt-6" />

    <DiscardDialog
      v-model:open="discardOpen"
      @confirm="settleDiscard(true)"
      @cancel="settleDiscard(false)"
    />
  </section>
</template>

<script setup lang="ts">
import DiscardDialog from "~/components/dialog/discarddialog.vue";
import Banner from "~/components/hompagetab/banner.vue";
import Impact from "~/components/hompagetab/impact.vue";
import Journey from "~/components/hompagetab/journey.vue";
import Program from "~/components/hompagetab/program.vue";

type Tab = "banner" | "program" | "journey" | "impact";

const tabs: { value: Tab, label: string, icon: string }[] = [
  { value: "banner", label: "Banner", icon: "heroicons:photo" },
  { value: "program", label: "Program", icon: "heroicons:rectangle-stack" },
  { value: "journey", label: "Journey", icon: "heroicons:map" },
  { value: "impact", label: "Impact", icon: "heroicons:chart-bar" },
];

const tab = ref<Tab>("banner");
const dirty = ref(false);
const discardOpen = ref(false);
let resolveDiscard: ((discard: boolean) => void) | null = null;

function askToDiscard() {
  if (!dirty.value) return Promise.resolve(true);
  resolveDiscard?.(false);
  discardOpen.value = true;
  return new Promise<boolean>((resolve) => {
    resolveDiscard = resolve;
  });
}

function settleDiscard(discard: boolean) {
  discardOpen.value = false;
  if (discard) dirty.value = false;
  resolveDiscard?.(discard);
  resolveDiscard = null;
}

async function selectTab(next: Tab) {
  if (next === tab.value) return;
  if (await askToDiscard()) tab.value = next;
}

onBeforeRouteLeave(() => askToDiscard());

function warnBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value) return;
  event.preventDefault();
  event.returnValue = "";
}

onMounted(() => {
  window.addEventListener("beforeunload", warnBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", warnBeforeUnload);
});
</script>
