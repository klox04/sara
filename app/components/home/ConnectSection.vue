<template>
  <section class="bg-white text-neutral-900">
    <div class="grid lg:min-h-[26rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div class="relative h-80 sm:h-96 lg:h-auto">
        <img
          src="/media/imag1.JPG"
          alt="Sara Duterte"
          class="absolute inset-0 h-full w-full object-cover object-[center_22%]"
        >
      </div>
      <div class="p-8">
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Connect with Sara
        </p>
        <h2 class="mt-3 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
          Invite. Share. Be Part of the Journey.
        </h2>
        <p class="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          We welcome invitations, messages, and stories from individuals, organizations, and communities.
        </p>

        <ul class="mt-5 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <li v-for="item in actions" :key="item.title">
            <Icon :name="item.icon" size="1.7rem" class="text-neutral-800" />
            <h3 class="mt-4 text-sm font-semibold">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-neutral-600">{{ item.text }}</p>
            <NuxtLink :to="item.to" class="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-800 hover:text-forest">
              {{ item.action }}
              <Icon name="heroicons:arrow-right" size="0.85rem" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const actions = [

  {
    icon: "heroicons:envelope",
    title: "Send a Message",
    text: "Share your thoughts and messages.",
    action: "Send a message",
    to: "/connect",
  },
  {
    icon: "heroicons:identification",
    title: "Media & Press",
    text: "For interview requests and media inquiries.",
    action: "Contact media",
    to: "/connect",
  },
  {
    icon: "heroicons:user-group",
    title: "Partnerships",
    text: "Explore opportunities to work together.",
    action: "Get in touch",
    to: "/connect",
  },
]
</script>
