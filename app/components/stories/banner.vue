<template>
  <section class="overflow-hidden bg-[linear-gradient(90deg,#f7f6f2_0%,#f6f5f1_36%,#f3f2ed_54%,#ecebe6_70%,#e4e5e2_86%,#e0e2df_100%)]">
    <div class="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div class="flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-20">
        <div class="max-w-xl">
          <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-[#5d6f64]">
            The Journal
          </p>
          <h1 class="mt-4 font-serif text-[2.7rem] font-medium leading-none text-[#1d3b30] sm:text-6xl lg:text-[4.15rem]">
            Stories &amp; Updates
          </h1>
          <p class="mt-5 max-w-md text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
            People, places, and perspectives. A collection of stories about public life, community service, and the everyday progress of Filipinos across the country.
          </p>
        </div>
      </div>

      <div class="relative flex min-h-64 items-center justify-end px-8 py-10 sm:min-h-72 sm:px-12 lg:min-h-full lg:px-16">
        <div
          class="pointer-events-none absolute top-1/2 left-[2%] h-[calc(100%-1.25rem)] w-auto -translate-y-1/2 aspect-[900/1120] bg-[#b7c3b4] opacity-80 sm:left-[8%]"
          :style="mapMask"
          aria-hidden="true"
        />
        <blockquote class="relative z-10 max-w-[9.5rem] text-right font-script text-[1.85rem] leading-[1.15] text-[#3f3f3f] sm:max-w-[11.5rem] sm:text-[2.35rem] lg:mr-4">
          <p>Real progress happens through people.</p>
          <span class="mt-3 ml-auto block h-px w-12 bg-[#6d6d6d]" aria-hidden="true" />
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import map from "~/assets/image/philippines.svg"

const mapMask = {
  maskImage: `url(${map})`,
  WebkitMaskImage: `url(${map})`,
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskSize: "contain",
  WebkitMaskSize: "contain",
}
</script>
