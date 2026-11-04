<template>
  <NuxtPage v-if="isLogin" />

  <div v-else class="min-h-svh bg-[#f7f6f3]">
    <SharedToolbar
      :username="null"
      @toggle-nav="navOpen = !navOpen"
      @sign-out="signOut"
    />
    <SharedNavigation :menus="items" :open="navOpen" @close="navOpen = false" />
    <main class="h-svh overflow-y-auto py-8 pl-5 pr-5 pt-24 sm:pr-8 md:pl-64">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import SharedNavigation from "~/components/shared/Navigation.vue"
import SharedToolbar from "~/components/shared/Toolbar.vue"

const route = useRoute()
const isLogin = computed(() => route.path === "/admin")
const navOpen = ref(false)
const items = [
  { title: "Homepage", href: "/admin/banners", action: "heroicons:photo" },
  { title: "About", href: "/admin/about", action: "heroicons:user" },
  { title: "Public Service", href: "/admin/public-service", action: "heroicons:squares-2x2" },
]

function signOut() {
  $fetch("/api/logout", { method: "POST" })
    .then(() => navigateTo("/admin"))
}
</script>
