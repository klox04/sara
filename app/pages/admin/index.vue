<template>
  <main class="relative min-h-svh">
    <img
      src="/media/loginbg.png"
      alt=""
      class="absolute inset-0 h-full w-full object-cover object-[20%_center] lg:object-center"
    >
    <div class="absolute left-1/2 top-1/2 w-[min(92vw,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#f4f2ec] px-8 py-9 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:px-10 lg:left-[55%] lg:w-[min(32rem,42vw)]">
      <h1 class="text-center font-serif text-[1.7rem] font-medium uppercase tracking-[0.18em] text-neutral-900">
        Sara Duterte
      </h1>
      <p class="mt-3 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
        <span class="h-px flex-1 bg-neutral-300" />
        Admin
        <span class="h-px flex-1 bg-neutral-300" />
      </p>

      <form class="mt-8 space-y-5" @submit.prevent="signIn">
        <div>
          <label for="admin-username" class="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700">
            Username
          </label>
          <input
            id="admin-username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-forest"
          >
        </div>

        <div>
          <label for="admin-password" class="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700">
            Password
          </label>
          <div class="relative mt-2">
            <input
              id="admin-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 pr-11 text-sm text-neutral-900 outline-none focus:border-forest"
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-neutral-500 hover:text-neutral-800"
              :aria-pressed="showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" size="1.15rem" />
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-700" role="alert">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full rounded-md bg-[#1a3328] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white hover:bg-[#14281f] disabled:opacity-60"
          :disabled="pending"
        >
          {{ pending ? "Signing in" : "Sign in" }}
        </button>
      </form>

      <NuxtLink
        to="/"
        class="mt-5 block text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#5f7f6e] hover:text-forest"
      >
        Back to site
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const { POST_API, GET_CSRF_API } = useGlobalStore()

const username = ref("")
const password = ref("")
const showPassword = ref(false)
const errorMessage = ref("")
const pending = ref(false)
const adminSession = useCookie("sara_admin", {
  path: "/",
  sameSite: "lax",
  secure: !import.meta.dev,
  maxAge: 60 * 60 * 24 * 7,
})

function readError(error: unknown) {
  const response = error as { response?: { data?: { message?: unknown, errors?: Record<string, string[]> } } }
  const data = response.response?.data
  const firstError = data?.errors ? Object.values(data.errors)[0] : undefined
  if (Array.isArray(firstError) && typeof firstError[0] === "string") return firstError[0]
  if (typeof data?.message === "string" && data.message) return data.message
  return "Could not reach the login service"
}

function signIn() {
  errorMessage.value = ""
  pending.value = true

  GET_CSRF_API({ api: "/sanctum/csrf-cookie" })
    .then(() => POST_API({
      api: "auth/login",
      email: username.value,
      password: password.value,
    }))
    .then(async () => {
      adminSession.value = "1"
      try {
        await $fetch("/session", { method: "POST" })
      }
      catch {
        // The static host has no Node route for /session.
      }
    })
    .then(() => navigateTo("/admin/banners"))
    .catch((error) => {
      errorMessage.value = readError(error)
    })
    .finally(() => {
      pending.value = false
    })
}
</script>
