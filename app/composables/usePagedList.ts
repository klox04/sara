type ApiRow = Record<string, unknown>

type PagedListOptions<T> = {
  api: string
  map: (row: ApiRow, index: number) => T
  filter?: (item: T, term: string) => boolean
  params?: () => Record<string, unknown>
  perPage?: number
}

export function usePagedList<T>(options: PagedListOptions<T>) {
  const { GET_API } = useGlobalStore()

  const rows = shallowRef<T[]>([])
  const query = ref("")
  const searchTerm = ref("")
  const page = ref(1)
  const perPage = ref(options.perPage ?? 10)
  const total = ref(0)
  const loading = ref(true)
  const failed = ref(false)
  let request = 0

  const offset = computed(() => (page.value - 1) * perPage.value)

  const items = computed(() => {
    const term = searchTerm.value.toLowerCase()
    if (!term || !options.filter) return rows.value
    return rows.value.filter(item => options.filter!(item, term))
  })

  function load() {
    const current = ++request
    const search = searchTerm.value
    loading.value = true
    failed.value = false
    return GET_API({
      api: options.api,
      per_page: perPage.value,
      page: page.value,
      ...options.params?.(),
      ...(search ? { search } : {}),
    })
      .then((response: { data?: { data?: unknown, meta?: { total?: unknown } } }) => {
        if (current !== request) return
        const data = Array.isArray(response.data?.data) ? response.data.data as ApiRow[] : []
        const count = response.data?.meta?.total
        total.value = typeof count === "number" ? count : data.length
        rows.value = data.map(options.map)
      })
      .catch(() => {
        if (current !== request) return
        rows.value = []
        total.value = 0
        failed.value = true
      })
      .finally(() => {
        if (current === request) loading.value = false
      })
  }

  watch(page, () => {
    load()
  })

  watch(perPage, () => {
    if (page.value === 1) load()
    else page.value = 1
  })

  function reset() {
    if (page.value === 1) load()
    else page.value = 1
  }

  function search() {
    searchTerm.value = query.value.trim()
    reset()
  }

  watch(query, (value) => {
    if (!value.trim() && searchTerm.value) search()
  })

  onMounted(() => {
    load()
  })

  return { rows, items, query, searchTerm, page, perPage, total, offset, loading, failed, load, reset, search }
}
