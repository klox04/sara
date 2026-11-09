<template>
  <div class="overflow-hidden rounded-xl mt-5 border border-neutral-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left text-sm" :class="minWidth">
        <thead class="bg-neutral-50 text-xs font-semibold text-neutral-500">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 font-semibold"
              :class="[column.align === 'right' ? 'text-right' : 'text-left', column.nowrap ? 'whitespace-nowrap' : '']"
            >
              {{ column.label }}
            </th>
            <th v-if="actions" class="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!pageItems.length">
            <td :colspan="columns.length + (actions ? 1 : 0)" class="px-4 py-12 text-center text-sm text-neutral-500">
              {{ emptyText }}
            </td>
          </tr>
          <tr
            v-for="(item, index) in pageItems"
            :key="menuKey(item) ?? index"
            class="border-t border-neutral-100"
            :class="clickableRows ? 'cursor-pointer hover:bg-neutral-50 focus:outline-none focus-visible:bg-[#e7f6ec]' : ''"
            :tabindex="clickableRows ? 0 : undefined"
            @click="selectRow(item)"
            @keydown.enter.prevent="selectRow(item)"
            @keydown.space.prevent="selectRow(item)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3.5"
              :class="cellClass(column)"
            >
              <span
                v-if="column.kind === 'status'"
                class="inline-flex min-w-16 justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="statusClass(item[column.key])"
              >
                {{ statusLabel(item[column.key]) }}
              </span>
              <span
                v-else-if="column.kind === 'chip' && column.chips?.[String(item[column.key])]"
                class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="column.chips[String(item[column.key])]!.class"
              >
                <Icon
                  v-if="column.chips[String(item[column.key])]!.icon"
                  :name="column.chips[String(item[column.key])]!.icon!"
                  size="0.85rem"
                  aria-hidden="true"
                />
                {{ item[column.key] }}
              </span>
              <Icon
                v-else-if="column.kind === 'icon' && isIconName(item[column.key])"
                :name="String(item[column.key])"
                size="1.35rem"
                class="text-[#1f7a4d]"
              />
              <img
                v-else-if="column.kind === 'icon' && item[column.key]"
                :src="storageSrc(String(item[column.key]))"
                alt=""
                class="size-6 object-contain"
              >
              <span v-else :class="column.truncate ? 'line-clamp-1' : ''">{{ item[column.key] }}</span>
            </td>
            <td v-if="actions" class="px-4 py-3.5 text-right">
              <button
                type="button"
                class="inline-flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                :aria-expanded="isMenuOpen(item)"
                aria-label="Open actions"
                @click.stop="toggleMenu(item, $event)"
                @keydown.enter.stop
                @keydown.space.stop
              >
                <Icon name="heroicons:ellipsis-vertical" size="1.15rem" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-x-6 gap-y-3 border-t border-neutral-100 px-4 py-3 text-sm text-neutral-600">
      <label class="inline-flex items-center gap-2">
        Rows per page:
        <select
          v-model.number="pageSize"
          class="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-800 outline-none focus:border-[#1f7a4d]"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>
      <span>{{ rangeLabel }}</span>
      <div class="inline-flex items-center gap-1">
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent"
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="page -= 1"
        >
          <Icon name="heroicons:chevron-left" size="1.1rem" />
        </button>
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent"
          :disabled="page >= pageCount"
          aria-label="Next page"
          @click="page += 1"
        >
          <Icon name="heroicons:chevron-right" size="1.1rem" />
        </button>
      </div>
    </div>
    <DeleteDialog v-model:open="confirmOpen" @confirm="confirmDelete" />
  </div>
  <Teleport to="body">
    <div v-if="openMenuId !== null" class="fixed inset-0 z-40" @click="openMenuId = null" />
    <div
      v-if="openMenuItem"
      class="fixed z-50 w-36 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 text-left shadow-lg"
      :style="menuStyle"
    >
      <button type="button" class="block w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" @click="choose('edit', openMenuItem.id)">
        Edit
      </button>
      <button type="button" class="block w-full px-3 py-2 text-sm text-red-700 hover:bg-neutral-50" @click="choose('delete', openMenuItem.id)">
        Delete
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import DeleteDialog from "~/components/dialog/deletedialog.vue"

export type TableColumn = {
  key: string
  label: string
  align?: "left" | "right"
  kind?: "text" | "status" | "icon" | "chip"
  chips?: Record<string, { class: string, icon?: string }>
  strong?: boolean
  truncate?: boolean
  nowrap?: boolean
}

export type TableItem = {
  id: string | number
} & Record<string, string | number | boolean>

const props = withDefaults(defineProps<{
  columns: TableColumn[]
  items: TableItem[]
  emptyText?: string
  actions?: boolean
  minWidth?: string
  pageSizes?: number[]
  clickableRows?: boolean
}>(), {
  emptyText: "No items found.",
  actions: true,
  clickableRows: false,
  minWidth: "min-w-[52rem]",
  pageSizes: () => [10, 25, 50],
})

const emit = defineEmits<{
  edit: [id: string | number]
  delete: [id: string | number]
  select: [id: string | number]
}>()

const storageUrl = String(useRuntimeConfig().public.storageUrl || "")
const page = ref(1)
const pageSize = ref(props.pageSizes[0] ?? 10)
const openMenuId = ref<string | number | null>(null)
const menuStyle = ref({ top: "0px", left: "0px" })
const confirmOpen = ref(false)
const pendingDeleteId = ref<string | number | null>(null)

const pageCount = computed(() => Math.max(1, Math.ceil(props.items.length / pageSize.value)))

const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return props.items.slice(start, start + pageSize.value)
})

const rangeLabel = computed(() => {
  if (!props.items.length) return "0 of 0"
  const start = (page.value - 1) * pageSize.value + 1
  const end = Math.min(page.value * pageSize.value, props.items.length)
  return `${start}–${end} of ${props.items.length}`
})

watch(() => props.items, () => {
  page.value = 1
  openMenuId.value = null
})

watch(pageSize, () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

function isIconName(value: unknown) {
  return typeof value === "string" && /^[\w-]+:[\w.-]+$/.test(value)
}

function storageSrc(path: string) {
  if (/^(https?:|data:|blob:|\/)/i.test(path)) return path
  const base = storageUrl.replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

function cellClass(column: TableColumn) {
  return [
    column.align === "right" ? "text-right" : "text-left",
    column.strong ? "font-medium text-neutral-900" : "text-neutral-600",
    column.truncate ? "max-w-xs" : "",
    column.nowrap ? "whitespace-nowrap" : "",
  ]
}

function statusLabel(value: unknown) {
  if (typeof value === "boolean") return value ? "Active" : "Inactive"
  return String(value ?? "")
}

function statusClass(value: unknown) {
  return statusLabel(value).toLowerCase() === "active"
    ? "bg-[#1f7a4d] text-white"
    : "bg-neutral-200 text-neutral-600"
}

function menuKey(item: TableItem) {
  const id = item.id ?? item.uuid
  if (id === undefined || id === null || id === "") return null
  return id
}

function selectRow(item: TableItem) {
  if (!props.clickableRows) return
  const key = menuKey(item)
  if (key !== null) emit("select", key)
}

function isMenuOpen(item: TableItem) {
  const key = menuKey(item)
  return key !== null && openMenuId.value === key
}

const openMenuItem = computed(() => props.items.find(item => menuKey(item) === openMenuId.value) ?? null)

function toggleMenu(item: TableItem, event: MouseEvent) {
  const key = menuKey(item)
  if (key === null) return
  if (openMenuId.value === key) {
    openMenuId.value = null
    return
  }
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const menuHeight = 84
  const openUp = rect.bottom + menuHeight > window.innerHeight
  menuStyle.value = {
    top: `${openUp ? rect.top - menuHeight - 4 : rect.bottom + 4}px`,
    left: `${rect.right - 144}px`,
  }
  openMenuId.value = key
}

function closeMenu() {
  openMenuId.value = null
}

onMounted(() => {
  window.addEventListener("scroll", closeMenu, true)
  window.addEventListener("resize", closeMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", closeMenu, true)
  window.removeEventListener("resize", closeMenu)
})

function choose(action: "edit" | "delete", id: string | number) {
  openMenuId.value = null
  if (action === "edit") {
    emit("edit", id)
    return
  }
  pendingDeleteId.value = id
  confirmOpen.value = true
}

function confirmDelete() {
  if (pendingDeleteId.value === null) return
  emit("delete", pendingDeleteId.value)
  pendingDeleteId.value = null
}
</script>
