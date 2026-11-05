<template>
  <section class="bg-[#f4f1ea]">
    <div class="mx-auto grid max-w-[1180px] items-center gap-8 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:gap-0 lg:py-16">
      <div class="lg:pr-14">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Beyond the headlines
        </p>
        <h2 class="mt-4 max-w-[21rem] font-serif text-4xl font-medium leading-[1.05] text-[#1d3b30] sm:text-5xl lg:text-[3.35rem]">
          Discover the wider picture.
        </h2>
      </div>

      <div class="lg:border-l lg:border-neutral-300 lg:pl-14">
        <p class="max-w-md text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          Explore the proposed photographic collections and historical documents that complement these editorial stories.
        </p>
        <NuxtLink
          to="/gallery"
          class="mt-6 inline-flex items-center gap-2.5 border border-neutral-400 bg-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 hover:border-neutral-600 hover:text-neutral-950"
        >
          Visit the gallery
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
