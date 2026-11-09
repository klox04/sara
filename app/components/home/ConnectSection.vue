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
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Connect with Sara
          </p>
          <h2 class="mt-3 max-w-[22rem] font-serif text-4xl leading-[1.08] text-neutral-950 sm:max-w-none sm:text-5xl">
            Invite. Share. Be Part of the Journey.
          </h2>
          <p class="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
            We welcome invitations, messages, and stories from individuals, organizations, and communities.
          </p>

          <div class="mx-auto mt-10 w-full max-w-sm text-center">
            <div class="flex items-center gap-4 text-neutral-800">
              <span class="h-px flex-1 bg-neutral-300" aria-hidden="true" />
              <Icon name="heroicons:envelope" size="1.65rem" aria-hidden="true" />
              <span class="h-px flex-1 bg-neutral-300" aria-hidden="true" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-neutral-950">
              Send a Message
            </h3>
            <p class="mt-2 text-sm text-neutral-600">
              Share your thoughts and messages.
            </p>
            <button
              type="button"
              aria-haspopup="dialog"
              class="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 hover:text-forest"
              @click="messageOpen = true"
            >
              Send a message
              <Icon name="heroicons:arrow-right" size="0.9rem" aria-hidden="true" />
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
