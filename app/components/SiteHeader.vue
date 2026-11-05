<template>
  <header class="sticky top-0 z-50 border-b border-neutral-200/80 bg-white">
    <div class="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3.5 sm:px-6 min-[1180px]:grid min-[1180px]:grid-cols-[auto_1fr_auto] min-[1180px]:items-center lg:px-8">
      <NuxtLink to="/" class="min-w-0 shrink leading-none">
        <span class="block whitespace-nowrap font-serif text-[0.95rem] font-medium uppercase tracking-[0.12em] text-forest min-[420px]:text-[1.15rem] min-[420px]:tracking-[0.16em] sm:text-[1.65rem] sm:tracking-[0.2em]">
          Sara Duterte
        </span>
        <span class="mt-1 hidden whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.22em] text-forest sm:block">
          People • Service • A Stronger Philippines
        </span>
      </NuxtLink>

      <nav class="hidden items-center justify-self-center gap-x-5 whitespace-nowrap min-[1180px]:flex xl:gap-x-7" aria-label="Primary">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="linkClass(link.to)"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }} 
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center justify-self-center min-[1180px]:ml-0">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center text-neutral-800 min-[1180px]:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
    <nav
      v-if="menuOpen"
      id="mobile-nav"
      class="border-t border-neutral-200 bg-white min-[1180px]:hidden"
      aria-label="Mobile"
    >
      <div class="mx-auto flex max-w-[1440px] flex-col px-4 py-2 sm:px-6">
        <NuxtLink
          v-for="link in links"
          :key="`mobile-${link.to}`"
          :to="link.to"
          class="border-b border-neutral-100 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-800 last:border-b-0"
          :class="isActive(link.to) ? 'text-forest' : ''"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const menuOpen = ref(false)

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Public Service", to: "/public-service" },
  { label: "Accomplishments", to: "/accomplishments" },
  { label: "Stories", to: "/stories" },
  { label: "Gallery", to: "/gallery" },
  { label: "Archive", to: "/archive" },
]

function isActive(to: string) {
  if (to === "/") {
    return route.path === "/" && route.hash === ""
  }

  if (to.startsWith("/#")) {
    return route.path === "/" && route.hash === to.slice(1)
  }

  if (to === "/about") {
    return route.path === "/about"
  }

  if (to === "/stories") {
    return route.path.startsWith("/stories")
  }

  return route.path === to
}

function linkClass(to: string) {
  return [
    "relative text-[11px] font-medium uppercase tracking-[0.16em] text-forest transition-colors hover:text-neutral-950",
    isActive(to)
      ? "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[2px] after:bg-forest"
      : "",
  ]
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
</script>
