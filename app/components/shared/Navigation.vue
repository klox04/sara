<template>
  <div>
    <button
      v-if="open"
      type="button"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      aria-label="Close navigation"
      @click="emit('close')"
    />

    <aside
      class="fixed bottom-0 left-0 top-16 z-30 w-60 overflow-y-auto bg-forest text-white transition-transform md:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
    >
      <nav class="flex flex-col gap-1 px-2 py-4" aria-label="Content">
        <template v-for="(item, index) in menus" :key="item.href">
          <p
            v-if="item.section && item.section !== menus[index - 1]?.section"
            class="mt-5 mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50"
          >
            {{ item.section }}
          </p>

          <template v-if="item.children?.length">
            <button
              type="button"
              class="flex items-center gap-3 rounded-sm px-3 py-2.5 text-left text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
              :class="isActive(item.href) ? 'text-white' : ''"
              :aria-expanded="isExpanded(item)"
              :aria-controls="`menu-${index}`"
              @click="toggle(item)"
            >
              <Icon :name="item.action" size="1.15rem" aria-hidden="true" />
              <span class="flex-1">{{ item.title }}</span>
              <Icon
                name="heroicons:chevron-down"
                size="0.95rem"
                class="transition-transform"
                :class="isExpanded(item) ? 'rotate-180' : ''"
                aria-hidden="true"
              />
            </button>
            <div
              v-show="isExpanded(item)"
              :id="`menu-${index}`"
              class="ml-5 flex flex-col gap-1 border-l border-white/15 pl-2"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                class="rounded-sm px-3 py-2 text-[13px] text-white/75 hover:bg-white/10 hover:text-white"
                :class="isActive(child.href) ? 'bg-white/15 text-white' : ''"
                @click="emit('close')"
              >
                {{ child.title }}
              </NuxtLink>
            </div>
          </template>

          <NuxtLink
            v-else
            :to="item.href"
            class="flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
            :class="isActive(item.href) ? 'bg-white/15 text-white' : ''"
            @click="emit('close')"
          >
            <Icon :name="item.action" size="1.15rem" aria-hidden="true" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </template>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
export type AdminMenuChild = {
  title: string
  href: string
}

export type AdminMenu = {
  title: string
  href: string
  action: string
  section?: string
  children?: AdminMenuChild[]
}

defineProps<{
  menus: AdminMenu[]
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const toggled = ref<Record<string, boolean>>({})

function isActive(href: string) {
  if (href === "/admin/dashboard") {
    return route.path === "/admin/dashboard"
  }

  return route.path === href || route.path.startsWith(`${href}/`)
}

function isExpanded(item: AdminMenu) {
  return toggled.value[item.href] ?? isActive(item.href)
}

function toggle(item: AdminMenu) {
  toggled.value = { ...toggled.value, [item.href]: !isExpanded(item) }
}
</script>
