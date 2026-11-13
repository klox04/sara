<template>
  <section
    v-if="loading"
    class="relative isolate flex min-h-[calc(100svh-4.25rem)] items-end overflow-hidden bg-neutral-900 lg:items-center"
    aria-busy="true"
  >
    <span class="sr-only">Loading banner…</span>
    <div class="mx-auto w-full max-w-[1440px] animate-pulse px-5 pb-8 pt-16 sm:px-8 lg:px-16 lg:py-16">
      <div class="h-14 w-3/4 max-w-md bg-white/10 sm:h-20" />
      <div class="mt-3 h-14 w-1/2 max-w-xs bg-white/10 sm:h-20" />
      <div class="mt-6 h-px w-24 bg-white/20" />
      <div class="mt-6 h-6 w-2/3 max-w-sm bg-white/10" />
      <div class="mt-5 h-3 w-full max-w-md bg-white/5" />
      <div class="mt-2 h-3 w-5/6 max-w-sm bg-white/5" />
      <div class="mt-8 flex gap-3">
        <div class="h-11 w-44 bg-white/10" />
        <div class="h-11 w-36 bg-white/5" />
      </div>
    </div>
  </section>

  <section v-else-if="!banner" class="bg-[#10241c] text-white">
    <div class="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
      <EmptyState
        dark
        icon="heroicons:photo"
        title="The homepage banner is being updated"
        text="Check back soon for the latest from Sara Duterte. In the meantime, explore her stories and public service."
        to="/stories"
        link-label="Explore stories"
      />
    </div>
  </section>

  <section v-else class="relative isolate min-h-[calc(100svh-4.25rem)] overflow-hidden bg-neutral-900 text-white">
    <img
      v-if="banner.image"
      :src="banner.image"
      :alt="banner.imageAlt || banner.name"
      class="absolute inset-x-0 top-0 h-[88%] w-full object-cover object-[68%_10%] [mask-image:linear-gradient(to_bottom,black_64%,transparent)] sm:inset-0 sm:h-full sm:object-[60%_16%] sm:[mask-image:none] lg:object-[center_18%]"
    >

    <div
      class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.78)_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.5)_34%,rgba(0,0,0,0.08)_58%,rgba(0,0,0,0.35)_100%)]"
    />

    <div class="relative mx-auto flex min-h-[calc(100svh-4.25rem)] w-full max-w-[1440px] flex-col justify-end px-5 pb-8 pt-16 sm:px-8 lg:justify-center lg:px-16 lg:py-16">
      <div class="max-w-xl">
        <h1 class="max-w-[15rem] whitespace-pre-line font-serif text-[2.65rem] font-medium uppercase leading-[0.86] tracking-[0.02em] sm:max-w-none sm:text-6xl lg:text-[5.4rem]">
          {{ banner.name }}
        </h1>

        <div class="mt-4 h-px w-16 bg-white sm:mt-5 sm:w-24" />

        <p v-if="banner.subtitle" class="mt-4 whitespace-pre-line font-serif text-[1.35rem] italic leading-tight sm:mt-5 sm:text-3xl lg:text-[2rem]">
          {{ banner.subtitle }}
        </p>

        <p v-if="banner.body" class="mt-4 max-w-md text-[13px] leading-relaxed text-white/90 sm:mt-5 sm:text-[15px]">
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

          <button
            v-if="banner.secondaryLabel && hasVideo"
            type="button"
            aria-haspopup="dialog"
            class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-white/85 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-white/10 sm:justify-start"
            @click="videoOpen = true"
          >
            <Icon name="heroicons:play-circle" size="1.25rem" aria-hidden="true" />
            {{ banner.secondaryLabel }}
          </button>
          <NuxtLink
            v-else-if="banner.secondaryLabel && banner.secondaryTo"
            :to="banner.secondaryTo"
            class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-white/85 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-white/10 sm:justify-start"
          >
            <Icon name="heroicons:play-circle" size="1.25rem" aria-hidden="true" />
            {{ banner.secondaryLabel }}
          </NuxtLink>
        </div>
      </div>

      <blockquote v-if="banner.quote" class="mt-6 max-w-[15rem] self-end text-right font-script text-[1.65rem] leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-3xl lg:absolute lg:right-10 lg:top-[18%] lg:mt-0 lg:max-w-[14.5rem] lg:text-[2.35rem] lg:leading-[1.15]">
        <p>“{{ banner.quote }}”</p>
        <footer v-if="banner.quoteAuthor" class="mt-2 text-[1.35rem] sm:text-2xl lg:text-[1.7rem]">
          — {{ banner.quoteAuthor }}
        </footer>
      </blockquote>
    </div>

    <VideoDialog
      v-if="hasVideo"
      v-model:open="videoOpen"
      :src="banner.video"
      :youtube-url="banner.youtubeUrl"
      :poster="banner.image"
      :heading="banner.secondaryLabel"
      :title="banner.subtitle ? `${banner.name}: ${banner.subtitle}` : banner.name"
      :description="banner.body"
    />
  </section>
</template>

<script setup lang="ts">
import EmptyState from "~/components/EmptyState.vue"
import VideoDialog from "~/components/dialog/videodialog.vue"
import type { Banner } from "~/types/banner"

const { banner, loading = false } = defineProps<{
  banner: Banner | null
  loading?: boolean
}>()

const videoOpen = ref(false)
const hasVideo = computed(() => Boolean(banner?.video || banner?.youtubeUrl))
</script>
