<template>
  <section class="bg-[#10241c] text-white">
    <div class="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-16">
      <div class="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-xl">
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
            By the Numbers
          </p>
          <h2 class="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            Real Work. Measurable Results.
          </h2>
        </div>
        <div class="flex max-w-md flex-col gap-5 sm:flex-row sm:items-center lg:max-w-lg lg:justify-end">
          <p class="text-sm leading-relaxed text-white/75">
            A track record of programs, initiatives, and recognitions across years of public service.
          </p>
          <NuxtLink
            to="/accomplishments"
            class="inline-flex shrink-0 items-center justify-center gap-2 border border-white/80 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] hover:bg-white hover:text-[#10241c]"
          >
            View more
            <Icon name="heroicons:arrow-right" size="0.9rem" />
          </NuxtLink>
        </div>
      </div>

      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.05fr)_minmax(16rem,0.85fr)] lg:gap-8">
        <article v-for="item in figures" :key="item.value">
          <p class="font-serif text-5xl leading-none">{{ item.value }}</p>
          <p class="mt-4 max-w-[14rem] text-sm leading-relaxed text-white/75">{{ item.label }}</p>
          <a :href="item.source" class="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80 hover:text-white">
            View source
            <Icon name="heroicons:arrow-right" size="0.85rem" />
          </a>
        </article>

        <blockquote class="lg:border-l lg:border-white/15 lg:pl-8">
          <p class="font-serif text-2xl italic leading-snug text-white/95 sm:text-[1.7rem]">
            “ Progress is not just about numbers, but about people’s lives getting better. ”
          </p>
          <footer class="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
            — Sara Duterte
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const figures = [
  {
    value: "118",
    label: "Awards and recognitions received by Davao City (Sept 2016 – Feb 2022)",
    source: "#",
  },
  {
    value: "1,904",
    label: "City government scholars reported in the 2019 SOCA",
    source: "#",
  },
  {
    value: "112",
    label: "Classrooms constructed through Special Education Fund projects",
    source: "#",
  },
  {
    value: "₱279B",
    label: "Reported Davao investment portfolio in 2018 (from ₱230B in 2016)",
    source: "#",
  },
]
</script>
