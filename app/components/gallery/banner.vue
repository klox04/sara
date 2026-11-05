<template>
  <section class="relative overflow-hidden bg-[#f7f6f2]">
    <img
      :src="gallery"
      alt=""
      class="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[68%] object-cover object-[68%_center] lg:block"
      :style="sideFade"
    >

    <div class="relative mx-auto flex max-w-[1440px] items-center px-6 py-14 sm:px-10 sm:py-16 lg:min-h-[24rem] lg:py-20 lg:pl-16 xl:pl-20">
      <div class="max-w-xl lg:max-w-[34rem]">
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-[#5d6f64]">
          Through the lens
        </p>
        <h1 class="mt-4 font-serif text-[2.6rem] font-medium leading-none text-[#1d3b30] sm:text-6xl lg:text-[4rem]">
          Photo &amp; Video Gallery
        </h1>
        <p class="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          A space for moments, people, and places. Explore the collections that document the work, visits, and stories across the country.
        </p>
      </div>
    </div>

    <img
      :src="gallery"
      alt="Hands holding a camera in front of printed photographs"
      class="h-72 w-full object-cover object-[70%_center] sm:h-80 lg:hidden"
      :style="topFade"
    >
  </section>
</template>

<script setup lang="ts">
import gallery from "~/assets/image/gallery.png"

const sideFade = {
  maskImage: "linear-gradient(to right, transparent 0%, transparent 8%, rgb(0 0 0 / 0.45) 28%, black 58%)",
  WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 8%, rgb(0 0 0 / 0.45) 28%, black 58%)",
}

const topFade = {
  maskImage: "linear-gradient(to bottom, transparent 0%, transparent 4%, black 36%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 4%, black 36%)",
}
</script>
