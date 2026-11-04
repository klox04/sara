<template>
  <section class="bg-[#f6f4ef]">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        Areas of public work
      </p>
      <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
        A broader view of service
      </h2>

      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <article
          v-for="area in areas"
          :key="area.title"
          class="flex flex-col border border-neutral-200 bg-white px-6 py-7"
        >
          <Icon :name="area.icon" class="text-neutral-700" size="1.6rem" aria-hidden="true" />
          <h3 class="mt-5 font-serif text-2xl font-medium text-neutral-950">
            {{ area.title }}
          </h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
            {{ area.detail }}
          </p>
          <NuxtLink
            to="/archive"
            class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-forest"
          >
            Explore records
            <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const areas = [
  {
    icon: "heroicons:building-library",
    title: "Local Governance",
    detail: "City development, community programs, and people-centered services in Davao City.",
  },
  {
    icon: "heroicons:book-open",
    title: "Education",
    detail: "Initiatives for learners, teachers, and stronger school communities.",
  },
  {
    icon: "heroicons:user-group",
    title: "Office of the Vice President",
    detail: "National programs, partnerships, and initiatives for the Filipino people.",
  },
]
</script>
