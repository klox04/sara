<template>
  <section class="grid min-h-[34rem] bg-[#f4f1ea] lg:min-h-[10rem] lg:grid-cols-2">
    <div class="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
      <div class="max-w-xl">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Accomplishments
        </p>
        <h1 class="mt-4 font-serif text-[2.7rem] font-medium leading-[1.05] text-neutral-950 sm:text-6xl">
          Milestones &amp;<br>
          Reported Results
        </h1>
        <p class="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          A closer look at public-service records—with the context, reporting periods, and sources that inform these numbers. This section brings together key initiatives, achievements, and related documents across offices and programs.
        </p>
        <p class="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          Sample figures · Supporting sources pending
        </p>
      </div>
    </div>

    <div class="relative min-h-[24rem] overflow-hidden lg:min-h-full">
      <img
        :src="panel"
        alt="Philippine flag in front of a public building"
        class="absolute inset-0 h-full w-full object-cover object-[62%_center]"
      >
      <p class="absolute top-6 right-6 max-w-[11rem] text-right text-[10px] font-medium uppercase leading-relaxed tracking-[0.18em] text-neutral-600 sm:top-8 sm:right-8 sm:text-[11px]">
        Public institutions<br>
        Stronger communities<br>
        Brighter futures
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import panel from "~/assets/image/acomplish.png"
</script>
