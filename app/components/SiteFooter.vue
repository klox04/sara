<template>
  <footer class="bg-forest text-white">
    <div class="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:px-12">
      <NuxtLink to="/" class="shrink-0 leading-none">
        <span class="block font-serif text-[1.55rem] font-medium uppercase tracking-[0.16em]">
          Sara Duterte
        </span>
        <span class="mt-2 block text-[11px] tracking-wide text-white/75">
          People • Service • A Stronger Philippines
        </span>
      </NuxtLink>

      <div class="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
        <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90" aria-label="Footer">
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="hover:text-white"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-4">
          <a
            v-for="item in socials"
            :key="item.label"
            :href="item.href"
            class="text-white/90 hover:text-white"
            :aria-label="item.label"
          >
            <Icon v-if="item.icon" :name="item.icon" size="1.15rem" />
            <svg v-else viewBox="0 0 24 24" class="size-[1.05rem] fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      <p class="shrink-0 font-script text-[1.85rem] leading-tight text-white/95 lg:text-right">
        Para sa mas<br>
        magandang bukas.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { label: "Privacy Policy", to: "#privacy" },
  { label: "Terms of Use", to: "#terms" },
  { label: "Contact", to: "/connect" },
]

const socials = [
  { label: "Facebook", href: "#", icon: "uil:facebook" },
  { label: "X", href: "#", icon: "" },
  { label: "Instagram", href: "#", icon: "uil:instagram" },
  { label: "YouTube", href: "#", icon: "uil:youtube" },
]
</script>
