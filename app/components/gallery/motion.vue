<template>
  <section class="bg-[#f7f6f1]">
    <div class="mx-auto grid max-w-[1180px] items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-12">
      <div class="relative min-h-52 overflow-hidden sm:min-h-60">
        <img
          src="/media/IMG_3065.JPG"
          alt="Sara Duterte speaking at a podium"
          class="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        >
        <div class="absolute inset-0 bg-black/25" aria-hidden="true" />
        <span class="absolute top-1/2 left-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a3328]" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="ml-0.5 h-5 w-5 fill-current">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </span>
        <p class="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
          Video collection
          <span class="mt-1 block text-[11px] font-normal normal-case tracking-normal text-white/80">12 items</span>
        </p>
      </div>

      <div class="max-w-md pb-2 lg:py-4">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          In motion
        </p>
        <h2 class="mt-3 font-serif text-4xl font-medium leading-tight text-neutral-950 sm:text-5xl">
          Speeches &amp; video collections
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-neutral-600">
          Approved footage and captions will be added here. No playable video has been supplied for this preview.
        </p>
        <NuxtLink
          to="/archive"
          class="mt-6 inline-flex items-center gap-2 bg-[#1a3328] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#14281f]"
        >
          Explore videos
          <Icon name="heroicons:arrow-right" size="0.95rem" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
