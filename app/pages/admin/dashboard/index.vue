<template>
  <section>
    <h1 class="mt-3 font-serif text-5xl text-neutral-900">Admin</h1>
    <p class="mt-4 max-w-lg text-sm leading-relaxed text-neutral-600">
      Manage the sections that appear on the public site.
    </p>
    <ul class="mt-10 grid gap-4 sm:grid-cols-2">
      <li v-for="module in modules" :key="module.to">
        <NuxtLink :to="module.to" class="block border border-neutral-200 bg-white px-5 py-5 hover:border-forest">
          <h2 class="font-serif text-2xl text-neutral-900">{{ module.label }}</h2>
          <p class="mt-2 text-sm text-neutral-600">{{ module.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const modules = [
  { to: "/admin/banners", label: "Homepage", description: "Homepage hero and sections" },
  { to: "/admin/about", label: "About", description: "About page" },
  { to: "/admin/public-service", label: "Public Service", description: "Programs and community initiatives" },
]
</script>
