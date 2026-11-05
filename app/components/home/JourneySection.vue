<template>
  <section id="journey" class="overflow-hidden bg-[#f7f6f3] text-forest">
    <div class="relative mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10 lg:py-20">
      <div class="relative">
        <div class="relative z-10 text-center lg:text-left">
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Her Journey
          </p>
          <h2 class="mt-3 font-serif text-5xl leading-[0.95] text-neutral-900 sm:text-6xl">
            A Life in<br>
            Public Service
          </h2>
          <p class="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-600 lg:mx-0">
            From Davao to the national stage, a continued commitment to the Filipino people.
          </p>
          <NuxtLink
            to="/about"
            class="mt-7 inline-flex items-center gap-2 border border-neutral-800 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            View Full Timeline
            <Icon name="heroicons:arrow-right" class="size-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div
          aria-hidden="true"
          class="pointer-events-none hidden bg-[#ddd6c8] lg:absolute lg:top-[46%] lg:-left-6 lg:block lg:h-[38rem] lg:w-[22rem] lg:-translate-y-1/2"
          :style="{
            WebkitMaskImage: `url(${philippinesMap})`,
            maskImage: `url(${philippinesMap})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }"
        />
      </div>

      <ol class="relative z-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <li v-for="(stop, index) in stops" :key="stop.id" class="text-center">
          <p class="font-serif text-[1.7rem] leading-none text-neutral-800">
            {{ stop.year }}
          </p>
          <div class="relative mt-3 flex h-3 items-center justify-center">
            <span
              class="absolute top-1/2 hidden h-px -translate-y-1/2 bg-neutral-300 lg:block"
              :class="index === 0 ? 'left-1/2 w-1/2' : index === stops.length - 1 ? 'left-0 w-1/2' : 'left-0 w-full'"
            />
            <span class="relative z-10 size-2.5 rounded-full bg-neutral-800" />
          </div>
          <div class="mx-auto mt-4 size-28 overflow-hidden rounded-full bg-neutral-200 sm:size-32">
            <img
              :src="stop.image"
              :alt="`${stop.role}, ${stop.place}`"
              class="h-full w-full object-cover object-top"
            >
          </div>
          <h3 class="mt-4 text-sm font-semibold text-neutral-900">
            {{ stop.role }}
          </h3>
          <p class="mt-1 text-[13px] text-neutral-700">
            {{ stop.place }}
          </p>
          <p class="mx-auto mt-2 max-w-[12.5rem] text-[12px] leading-relaxed text-neutral-500">
            {{ stop.text }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import philippinesMap from "~/assets/image/philippines.svg"
import { contentSeed, type ContentRecord } from "~~/shared/content"

const { data } = await useAsyncData("journey", () =>
  $fetch<ContentRecord[]>("/api/content/journey").catch(() => [] as ContentRecord[]),
)

const stops = computed(() => {
  const source = data.value?.length ? data.value : contentSeed.journey
  return source.map(stop => ({
    id: stop.id,
    year: typeof stop.year === "string" ? stop.year : "",
    role: typeof stop.role === "string" ? stop.role : "",
    place: typeof stop.place === "string" ? stop.place : "",
    text: typeof stop.text === "string" ? stop.text : "",
    image: typeof stop.image === "string" ? stop.image : "",
  }))
})
</script>
