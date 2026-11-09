<template>
  <section>
    <PageHeader
      title="Messages"
      description="Read the messages sent through the Send a Message form on the website."
    />

    <div class="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <span class="inline-flex size-12 items-center justify-center rounded-lg bg-[#e7f6ec] text-[#1f7a4d]">
          <Icon name="heroicons:envelope" size="1.4rem" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-semibold text-neutral-900">All Messages</h2>
          <p class="mt-0.5 text-sm text-neutral-500">
            {{ loading ? "Loading messages…" : `${messages.length} ${messages.length === 1 ? "message" : "messages"} received` }}
          </p>
        </div>
      </div>

      <div class="p-5">
        <Field
          v-model="query"
          placeholder="Search name or message..."
          class="max-w-md"
        />

        <Table
          class="mt-4"
          :columns="columns"
          :items="tableItems"
          :actions="false"
          :empty-text="emptyText"
          clickable-rows
          @select="openMessage"
        />
      </div>
    </div>

    <MessageViewDialog v-model:open="viewOpen" :message="selected" />
  </section>
</template>

<script setup lang="ts">
import MessageViewDialog from "~/components/dialog/messageviewdialog.vue"

type MessageRow = {
  id: string | number
  name: string
  message: string
  received: string
  sortTime: number
}

const { GET_API } = useGlobalStore()

const messages = ref<MessageRow[]>([])
const query = ref("")
const loading = ref(true)
const loadFailed = ref(false)
const viewOpen = ref(false)
const selected = ref<MessageRow | null>(null)

function openMessage(id: string | number) {
  selected.value = messages.value.find(item => item.id === id) ?? null
  if (selected.value) viewOpen.value = true
}

const columns = [
  { key: "name", label: "Name", strong: true, nowrap: true },
  { key: "message", label: "Message", truncate: true },
  { key: "received", label: "Date Received", nowrap: true },
]

const emptyText = computed(() => {
  if (loading.value) return "Loading messages…"
  if (loadFailed.value) return "The messages could not be loaded."
  return query.value.trim() ? "No messages match that search." : "No messages yet."
})

const tableItems = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return messages.value
  return messages.value.filter(item =>
    [item.name, item.message].some(value => value.toLowerCase().includes(term)),
  )
})

function readText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function formatDate(value: string) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function getMessages() {
  loading.value = true
  loadFailed.value = false
  GET_API({ api: "messages" })
    .then((response) => {
      const rows = Array.isArray(response.data?.data) ? response.data.data : []
      messages.value = rows
        .map((row: Record<string, unknown>, index: number) => {
          const createdAt = readText(row.created_at)
          const uuid = readText(row.uuid)
          return {
            id: uuid || (typeof row.id === "string" || typeof row.id === "number" ? row.id : index),
            name: readText(row.name),
            message: readText(row.message),
            received: formatDate(createdAt),
            sortTime: new Date(createdAt).getTime() || 0,
          }
        })
        .sort((a: MessageRow, b: MessageRow) => b.sortTime - a.sortTime)
    })
    .catch(() => {
      messages.value = []
      loadFailed.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getMessages()
})
</script>
