<template>
  <section class="bg-white text-neutral-900">
    <div class="grid lg:min-h-[32rem] lg:grid-cols-2">
      <div class="relative h-80 sm:h-96 lg:h-auto">
        <img
          src="/media/imag1.JPG"
          alt="Sara Duterte speaking at a podium"
          class="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        >
      </div>

      <div class="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 xl:px-20">
        <div class="max-w-xl">
          <p class="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8a6f5a]">
            A space for your words
          </p>
          <h2 class="mt-8 text-3xl font-medium leading-tight text-neutral-950 sm:text-[2rem]">
            Every Message Has a Meaning.
          </h2>
          <p class="mt-4 text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            From simple greetings to heartfelt words, share what you wish to say. Selected messages may be shared with the community.
          </p>

          <div class="mt-8 border-t border-neutral-200 pt-10 text-center">
            <Icon name="heroicons:envelope" size="1.6rem" class="text-[#1d3b30]" aria-hidden="true" />
            <h3 class="mt-4 text-xl font-semibold text-neutral-950">
              Send Your Message
            </h3>
            <p class="mt-3 text-[15px] text-neutral-600">
              Have something to say? We'd love to hear from you.
            </p>
            <button
              type="button"
              aria-haspopup="dialog"
              class="mt-5 inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.04em] text-neutral-800 hover:text-forest"
              @click="messageOpen = true"
            >
              Send a message
              <Icon name="heroicons:arrow-up-right" size="0.95rem" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <MessageDialog v-model:open="messageOpen" />
  </section>
</template>

<script setup lang="ts">
import MessageDialog from "~/components/dialog/messagedialog.vue"

const messageOpen = ref(false)
</script>
