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
        <NuxtLink
          v-for="item in menus"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
          :class="isActive(item.href) ? 'bg-white/15 text-white' : ''"
          @click="emit('close')"
        >
          <Icon :name="item.action" size="1.15rem" aria-hidden="true" />
          <span>{{ item.title }}</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
export type AdminMenu = {
  title: string
  href: string
  action: string
}

defineProps<{
  menus: AdminMenu[]
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

function isActive(href: string) {
  if (href === "/admin/dashboard") {
    return route.path === "/admin/dashboard"
  }

  return route.path === href || route.path.startsWith(`${href}/`)
}
</script>
