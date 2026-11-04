export type ToastType = "success" | "error" | "warning" | "info"

export type ToastItem = {
  id: number
  type: ToastType
  message: string
}

let nextId = 0

export function useToast() {
  const items = useState<ToastItem[]>("toasts", () => [])

  function dismiss(id: number) {
    items.value = items.value.filter(item => item.id !== id)
  }

  function toast(type: ToastType, message: string) {
    const id = ++nextId
    items.value = [...items.value, { id, type, message }]
    if (import.meta.client) {
      window.setTimeout(() => dismiss(id), 3000)
    }
  }

  return { items, toast, dismiss }
}
