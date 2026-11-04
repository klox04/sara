<template>
  <label class="block">
    <span v-if="label" class="text-sm font-semibold" :class="message ? 'text-red-700' : 'text-neutral-800'">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="Boolean(message)"
      class="w-full rounded-md border px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-neutral-50"
      :class="[controlClass, label ? 'mt-2' : '']"
      @input="onInput"
    />
    <input
      v-else
      :value="modelValue"
      :type="type === 'number' ? 'number' : 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="Boolean(message)"
      class="w-full rounded-md border px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-neutral-50"
      :class="[controlClass, label ? 'mt-2' : '']"
      @input="onInput"
    >
    <span v-if="message" class="mt-1 block text-sm text-red-600">{{ message }}</span>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  type?: "text" | "textarea" | "number"
  rows?: number
  required?: boolean
  errorMessages?: string | string[]
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: "",
  label: "",
  type: "text",
  rows: 4,
  required: false,
  errorMessages: "",
  placeholder: "",
  disabled: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
}>()

const message = computed(() => {
  const value = props.errorMessages
  if (Array.isArray(value)) return value.find(item => item.trim()) || ""
  return value.trim()
})

const controlClass = computed(() => message.value
  ? "border-red-500 text-red-900 focus:border-red-600"
  : "border-neutral-300 focus:border-[#1f7a4d]")

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value
  emit("update:modelValue", props.type === "number" ? (value === "" ? "" : Number(value)) : value)
}
</script>
