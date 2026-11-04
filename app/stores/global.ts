type ApiPayload = {
  api: string
} & Record<string, unknown>

function http() {
  return useNuxtApp().$http
}

function csrfRequest(api = "/sanctum/csrf-cookie") {
  if (/^https?:\/\//i.test(api)) {
    return http().get(api)
  }

  const path = api.startsWith("/") ? api : `/${api}`
  if (import.meta.client) {
    return http().get(path, { baseURL: window.location.origin })
  }

  return http().get(new URL(path, useRuntimeConfig().public.apiBase).href)
}

export const useGlobalStore = defineStore("global", {
  actions: {
    POST_API(payload: ApiPayload) {
      return http().post(payload.api, payload)
    },
    NEW_POST_API(payload: { api: string, data: FormData }) {
      return http().post(payload.api, payload.data)
    },
    PATCH_API(payload: ApiPayload) {
      return http().patch(payload.api, payload)
    },
    DELETE_API(payload: ApiPayload) {
      return http().delete(payload.api, { data: payload })
    },
    GET_API(payload: ApiPayload) {
      const { api, ...params } = payload
      return http().get(api, { params })
    },
    GET_CSRF_API(payload: { api?: string } = {}) {
      return csrfRequest(payload.api)
    },
  },
})
