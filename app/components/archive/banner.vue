<template>
  <section class="relative overflow-hidden bg-[#faf9f7]">
    <img
      :src="book"
      alt="Green bound volumes labeled Public Service, Programs and Initiatives, and Reports beside the Philippine flag"
      class="pointer-events-none absolute inset-y-0 right-0 hidden aspect-[11/5] h-full max-w-[66%] object-cover object-[center_60%] lg:block"
      :style="sideFade"
    >

    <div class="relative mx-auto flex max-w-[1440px] items-center px-6 py-14 sm:px-10 sm:py-16 lg:min-h-[clamp(24rem,28vw,32rem)] lg:py-16 lg:pl-16 xl:pl-24">
      <div class="max-w-xl lg:max-w-[21rem] xl:max-w-[28rem]">
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-600">
          Official records library
        </p>
        <h1 class="mt-4 font-serif text-[2.75rem] font-medium leading-[0.95] text-[#1d3b30] sm:text-6xl lg:text-[4.25rem]">
          Records &amp;<br>
          Publications
        </h1>
        <p class="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          Explore official records, public addresses, reports, policy documents, and other publications that document the work, programs, and initiatives of Vice President Sara Duterte.
        </p>
      </div>
    </div>

    <blockquote
      class="absolute top-2 right-0 hidden w-[15rem] px-8 py-6 font-hand text-[1.9rem] leading-[1.05] text-neutral-800 lg:block xl:top-4 xl:right-4 xl:w-[17rem] xl:text-[2.15rem]"
      :style="quoteGlow"
    >
      <p>“Records build memory. Memory builds a stronger Philippines.”</p>
      <footer class="mt-2 text-right text-[1.45rem] xl:text-[1.6rem]">
        — Sara Duterte
      </footer>
    </blockquote>

    <blockquote class="relative px-6 pb-6 text-right font-hand text-[1.7rem] leading-[1.05] text-neutral-800 sm:px-10 sm:text-[2rem] lg:hidden">
      <p class="ml-auto max-w-[16rem] sm:max-w-[20rem]">
        “Records build memory. Memory builds a stronger Philippines.”
      </p>
      <footer class="mt-1 text-[1.35rem] sm:text-[1.5rem]">
        — Sara Duterte
      </footer>
    </blockquote>

    <img
      :src="book"
      alt="Green bound volumes labeled Public Service, Programs and Initiatives, and Reports beside the Philippine flag"
      class="h-64 w-full object-cover object-[30%_center] sm:h-96 lg:hidden"
      :style="topFade"
    >
  </section>
</template>

<script setup lang="ts">
import book from "~/assets/image/book.png"

const sideFade = {
  maskImage: "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.35) 12%, rgb(0 0 0 / 0.8) 22%, black 32%)",
  WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.35) 12%, rgb(0 0 0 / 0.8) 22%, black 32%)",
}

const quoteGlow = {
  background: "radial-gradient(closest-side, rgb(250 249 247 / 0.92), rgb(250 249 247 / 0.78) 60%, rgb(250 249 247 / 0))",
}

const topFade = {
  maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
}
</script>
