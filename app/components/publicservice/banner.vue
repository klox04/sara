<template>
  <section class="bg-[#f6f4ef]">
    <div class="mx-auto grid max-w-[1180px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.85fr)] lg:gap-16 lg:py-24">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Public service
        </p>
        <h1 class="mt-4 max-w-xl font-serif text-[2.7rem] font-medium leading-[1.05] text-neutral-950 sm:text-6xl">
          Programs &amp;<br>
          Community Initiatives
        </h1>
        <p class="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          Explore the areas of service, the ideas behind each initiative, and the records that provide context. These programs reflect a people-centered approach to building stronger, more resilient communities.
        </p>
        <NuxtLink
          to="#initiatives"
          class="mt-8 inline-flex w-fit items-center gap-3 bg-[#1a3328] px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
        >
          Explore the initiatives
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div
        class="relative min-h-[18rem] overflow-hidden bg-[#e7ebe4] sm:min-h-[22rem]"
        :style="{
          backgroundImage: 'linear-gradient(to right, rgba(28,58,48,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,58,48,0.08) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }"
      >
        <p class="absolute top-5 right-5 max-w-[9rem] text-right text-[10px] font-medium uppercase leading-relaxed tracking-[0.16em] text-neutral-500">
          People-led initiatives<br>
          Stronger communities
        </p>

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex h-44 w-44 items-center justify-center rounded-full border border-neutral-500/25 sm:h-52 sm:w-52">
            <div class="flex h-28 w-28 items-center justify-center rounded-full border border-neutral-500/35 sm:h-32 sm:w-32">
              <Icon name="heroicons:user-group" class="text-neutral-700" size="2.6rem" aria-hidden="true" />
            </div>
          </div>
        </div>

        <p class="absolute inset-x-3 bottom-5 text-center text-[9px] font-medium uppercase tracking-[0.12em] whitespace-nowrap text-neutral-600 sm:text-[10px]">
          Service ideas
          <span class="px-1.5" aria-hidden="true">→</span>
          Community programs
          <span class="px-1.5" aria-hidden="true">→</span>
          Lasting impact
        </p>
      </div>
    </div>
  </section>
</template>
