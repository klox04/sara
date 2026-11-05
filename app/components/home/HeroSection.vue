<template>
  <section class="relative isolate min-h-[calc(100svh-4.25rem)] overflow-hidden bg-neutral-900 text-white">
    <img
      :src="banner.image || fallbackImage"
      alt="Sara Duterte with her hand over her heart beside the Philippine flag"
      class="absolute inset-x-0 top-0 h-[88%] w-full object-cover object-[68%_10%] [mask-image:linear-gradient(to_bottom,black_64%,transparent)] sm:inset-0 sm:h-full sm:object-[60%_16%] sm:[mask-image:none] lg:object-[center_18%]"
    >

    <div
      class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.78)_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.5)_34%,rgba(0,0,0,0.08)_58%,rgba(0,0,0,0.35)_100%)]"
    />

    <div class="relative mx-auto flex min-h-[calc(100svh-4.25rem)] w-full max-w-[1440px] flex-col justify-end px-5 pb-8 pt-16 sm:px-8 lg:justify-center lg:px-16 lg:py-16">
      <div class="max-w-xl">
        <h1 class="max-w-[15rem] whitespace-pre-line font-serif text-[2.65rem] font-medium uppercase leading-[0.86] tracking-[0.02em] sm:max-w-none sm:text-6xl lg:text-[5.4rem]">
          {{ banner.title }}
        </h1>

        <div class="mt-4 h-px w-16 bg-white sm:mt-5 sm:w-24" />

        <p class="mt-4 whitespace-pre-line font-serif text-[1.35rem] italic leading-tight sm:mt-5 sm:text-3xl lg:text-[2rem]">
          {{ banner.subtitle }}
        </p>

        <p class="mt-4 max-w-md text-[13px] leading-relaxed text-white/90 sm:mt-5 sm:text-[15px]">
          {{ banner.body }}
        </p>

        <div class="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
          <NuxtLink
            v-if="banner.primaryLabel"
            :to="banner.primaryTo || '/stories'"
            class="inline-flex items-center justify-center gap-2.5 rounded-sm bg-forest px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#163026] sm:justify-start"
          >
            {{ banner.primaryLabel }}
            <Icon name="heroicons:arrow-right" size="1.25rem" aria-hidden="true" />
          </NuxtLink>

          <NuxtLink
            v-if="banner.secondaryLabel && banner.secondaryTo"
            :to="banner.secondaryTo"
            class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-white/85 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-white/10 sm:justify-start"
          >
            <Icon name="heroicons:play-circle" size="1.25rem" aria-hidden="true" />
            {{ banner.secondaryLabel }}
          </NuxtLink>
          <button
            v-else-if="banner.secondaryLabel"
            type="button"
            class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-white/85 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-white/10 sm:justify-start"
          >
            <Icon name="heroicons:play-circle" size="1.25rem" aria-hidden="true" />
            {{ banner.secondaryLabel }}
          </button>
        </div>
      </div>

      <blockquote v-if="banner.quote" class="mt-6 max-w-[15rem] self-end text-right font-script text-[1.65rem] leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-3xl lg:absolute lg:right-10 lg:top-[18%] lg:mt-0 lg:max-w-[14.5rem] lg:text-[2.35rem] lg:leading-[1.15]">
        <p>“{{ banner.quote }}”</p>
        <footer class="mt-2 text-[1.35rem] sm:text-2xl lg:text-[1.7rem]">
          — {{ banner.quoteAuthor }}
        </footer>
      </blockquote>
    </div>
  </section>
</template>

<script setup lang="ts">
import fallbackImage from "~/assets/image/landingpage.JPG"
import { contentSeed, type ContentRecord } from "~~/shared/content"

const fallback = contentSeed.banners[0]!

const { data } = await useAsyncData("banners", () =>
  $fetch<ContentRecord[]>("/api/content/banners").catch(() => [] as ContentRecord[]),
)

function text(record: ContentRecord | undefined, key: string) {
  const value = record?.[key]
  if (typeof value === "string") return value
  const backup = fallback[key]
  return typeof backup === "string" ? backup : ""
}

const banner = computed(() => {
  const record = data.value?.[0]
  return {
    image: text(record, "image"),
    title: text(record, "title"),
    subtitle: text(record, "subtitle"),
    body: text(record, "body"),
    quote: text(record, "quote"),
    quoteAuthor: text(record, "quoteAuthor") || "Sara Duterte",
    primaryLabel: text(record, "primaryLabel"),
    primaryTo: text(record, "primaryTo") || "/stories",
    secondaryLabel: text(record, "secondaryLabel"),
    secondaryTo: text(record, "secondaryTo"),
  }
})
</script>
