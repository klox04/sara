<template>
  <section class="bg-white">
    <div class="mx-auto grid max-w-[1180px] items-center gap-8 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:py-20">
      <img
        src="/media/DSC00816.jpg"
        alt="Sara Duterte greeting children during a community visit"
        class="h-64 w-full object-cover object-[68%_45%] sm:h-80 lg:h-[22rem]"
      >

      <div class="max-w-md">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Featured story
        </p>
        <h2 class="mt-3 font-serif text-4xl font-medium leading-[1.05] text-[#1d3b30] sm:text-5xl">
          Working With Communities
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          A closer look at community visits and service activities across the country, and the people who make them possible.
        </p>
        <p class="mt-5 text-[13px] text-neutral-500">
          Community
          <span aria-hidden="true"> · </span>
          March 12, 2024
        </p>
        <NuxtLink
          to="/archive"
          class="mt-6 inline-flex items-center gap-2.5 bg-[#1a3328] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
        >
          Read the story
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
