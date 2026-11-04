import axios, { type AxiosInstance } from "axios"

function readCsrfToken() {
  if (!import.meta.client) {
    return ""
  }

  const matches = document.cookie
    .split("; ")
    .filter(row => row.startsWith("XSRF-TOKEN="))
  const cookie = matches.at(-1)
  if (!cookie) {
    return ""
  }

  return decodeURIComponent(cookie.slice("XSRF-TOKEN=".length))
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const http: AxiosInstance = axios.create({
    baseURL: import.meta.client ? "/api/v1" : config.public.apiBase,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })

  http.interceptors.request.use((request) => {
    const token = readCsrfToken()
    if (token) {
      request.headers.set("X-XSRF-TOKEN", token)
    }
    return request
  })

  return {
    provide: {
      http,
    },
  }
})

declare module "#app" {
  interface NuxtApp {
    $http: AxiosInstance
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $http: AxiosInstance
  }
}
