<template>
  <div class="flex min-h-svh flex-col bg-gray-50">
    <SiteHeader v-if="showPublicHeader" />
    <NuxtPage class="flex flex-1 flex-col" />
    <SiteFooter v-if="showPublicHeader" />
    <SharedToast />
  </div>
</template>

<script setup lang="ts">
import SharedToast from "~/components/shared/Toast.vue"

const route = useRoute()
const showPublicHeader = computed(() => !route.path.startsWith("/admin"))
const { siteTitle, siteIcon, load: loadSiteSettings, watchColorScheme } = useSiteSettings()
let stopColorScheme: (() => void) | undefined

useHead({
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: siteTitle },
  link: [{ key: "site-icon", rel: "icon", href: siteIcon }],
})

onMounted(() => {
  stopColorScheme = watchColorScheme()
  loadSiteSettings()
})

onBeforeUnmount(() => {
  stopColorScheme?.()
})
</script>
