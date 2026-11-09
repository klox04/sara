<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[2px]"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
        aria-describedby="message-dialog-text"
        class="relative my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white px-5 pt-8 pb-6 shadow-2xl sm:px-11 sm:pt-9 sm:pb-8"
      >
        <svg
          viewBox="0 0 320 160"
          class="pointer-events-none absolute -bottom-2 -left-2 w-64 text-[#1f7a4d] sm:w-80"
          fill="currentColor"
          aria-hidden="true"
        >
          <path opacity="0.06" d="M0 40C40 30 70 60 110 85s90 45 140 50 70 25 70 25H0Z" />
          <path opacity="0.08" d="M0 80c30-6 60 10 95 32s80 30 120 34 45 14 45 14H0Z" />
        </svg>

        <button
          type="button"
          class="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 sm:top-6 sm:right-6"
          aria-label="Close"
          @click="close"
        >
          <Icon name="heroicons:x-mark" size="1.4rem" />
        </button>

        <div class="relative text-center">
          <span class="inline-flex size-14 items-center justify-center rounded-xl bg-[#e7f2ea] text-[#1a3328]">
            <Icon name="heroicons:envelope" size="1.75rem" aria-hidden="true" />
          </span>
          <h2 id="message-dialog-title" class="mt-4 font-serif text-[2.1rem] font-medium leading-tight text-neutral-950 sm:text-[2.6rem]">
            Send a Message
          </h2>
          <p id="message-dialog-text" class="mt-2 text-sm text-neutral-600 sm:text-[15px]">
            Share your thoughts, ideas, or messages.
          </p>
        </div>

        <form class="relative mt-7" novalidate @submit.prevent="submit">
          <label for="message-name" class="text-[15px] font-semibold" :class="errors.name ? 'text-red-700' : 'text-neutral-900'">
            Name <span class="text-red-500">*</span>
          </label>
          <div class="relative mt-2">
            <Icon name="heroicons:user" size="1.1rem" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              id="message-name"
              ref="nameInput"
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Enter your full name"
              :maxlength="maxName"
              class="w-full rounded-lg border bg-white py-3 pr-4 pl-11 text-[15px] outline-none"
              :class="errors.name ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1a3328]'"
              :aria-invalid="Boolean(errors.name)"
              @input="clearError('name')"
            >
          </div>
          <span v-if="errors.name" class="mt-1 block text-sm text-red-600">{{ errors.name }}</span>

          <label for="message-body" class="mt-5 block text-[15px] font-semibold" :class="errors.message ? 'text-red-700' : 'text-neutral-900'">
            Message <span class="text-red-500">*</span>
          </label>
          <div class="relative mt-2">
            <Icon name="heroicons:pencil" size="1.05rem" class="pointer-events-none absolute top-3.5 left-4 text-neutral-500" />
            <textarea
              id="message-body"
              v-model="form.message"
              rows="4"
              placeholder="Write your message here..."
              :maxlength="maxMessage"
              class="w-full rounded-lg border bg-white py-3 pr-4 pl-11 text-[15px] outline-none"
              :class="errors.message ? 'border-red-500 text-red-900' : 'border-neutral-300 focus:border-[#1a3328]'"
              :aria-invalid="Boolean(errors.message)"
              @input="clearError('message')"
            />
          </div>
          <div class="mt-1 flex items-start justify-between gap-4">
            <span class="text-sm text-red-600">{{ errors.message }}</span>
            <span class="shrink-0 text-sm text-neutral-500">{{ form.message.length }} / {{ maxMessage.toLocaleString() }}</span>
          </div>

          <div class="mt-7 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-[15px] font-semibold text-neutral-900 hover:bg-neutral-50"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2.5 rounded-lg bg-[#1a3328] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#14281f] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="sending"
            >
              <Icon name="heroicons:paper-airplane" size="1.15rem" class="-rotate-45" aria-hidden="true" />
              {{ sending ? "Sending…" : "Send Message" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
type ApiErrorData = {
  message?: unknown
  errors?: Record<string, string[] | string>
}

const open = defineModel<boolean>("open", { default: false })
const { POST_API } = useGlobalStore()
const { toast } = useToast()
const maxName = 255
const maxMessage = 1000

const form = reactive({ name: "", message: "" })
const errors = reactive<Record<string, string>>({})
const sending = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)
let returnFocus: HTMLElement | null = null

function clearError(key: string) {
  delete errors[key]
}

function clearErrors() {
  for (const key of Object.keys(errors)) delete errors[key]
}

function close() {
  if (sending.value) return
  open.value = false
}

function validate() {
  clearErrors()
  if (!form.name.trim()) errors.name = "Name is required."
  if (!form.message.trim()) errors.message = "Message is required."
  return !errors.name && !errors.message
}

function applyApiErrors(data: ApiErrorData | undefined) {
  for (const key of ["name", "message"]) {
    const value = data?.errors?.[key]
    const text = Array.isArray(value) ? value.find(item => typeof item === "string") : value
    if (typeof text === "string" && text) errors[key] = text
  }
  if (errors.name || errors.message) return
  toast("error", typeof data?.message === "string" && data.message ? data.message : "Your message could not be sent. Please try again.")
}

function submit() {
  if (sending.value || !validate()) return
  sending.value = true
  POST_API({
    api: "messages",
    name: form.name.trim(),
    message: form.message.trim(),
  })
    .then(() => {
      toast("success", "Thank you! Your message has been sent.")
      form.name = ""
      form.message = ""
      sending.value = false
      open.value = false
    })
    .catch((error: { response?: { data?: ApiErrorData } }) => {
      applyApiErrors(error.response?.data)
    })
    .finally(() => {
      sending.value = false
    })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) close()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    clearErrors()
    returnFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"
    await nextTick()
    nameInput.value?.focus()
  }
  else {
    document.body.style.overflow = ""
    returnFocus?.focus()
    returnFocus = null
  }
})

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
  document.body.style.overflow = ""
})
</script>
