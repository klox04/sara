<template>
  <section class="bg-[#f6f4ef]">
    <div class="mx-auto grid max-w-[1180px] items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-20">
      <figure class="relative overflow-hidden">
        <img
          src="/media/imag1.JPG"
          alt="Sara Duterte"
          class="aspect-[5/4] w-full object-cover object-[center_12%] sm:aspect-[4/3]"
        >
        <blockquote class="absolute left-5 top-6 max-w-[11rem] font-script text-[1.65rem] leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:left-7 sm:top-8 sm:max-w-[13rem] sm:text-[1.9rem]">
          <p>“Education builds people and stronger communities.”</p>
          <footer class="mt-2 text-[1.35rem] sm:text-[1.5rem]">
            — Sara Duterte
          </footer>
        </blockquote>
      </figure>

      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Foundations
        </p>
        <h2 class="mt-3 font-serif text-4xl font-medium leading-tight text-neutral-950 sm:text-5xl">
          Education &amp; Early Career
        </h2>
        <p class="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          Her academic background and early professional experiences laid the foundation for a life in public service. These formative years shaped her approach to governance — practical, people-centered, and focused on real-world solutions.
        </p>
        <NuxtLink
          to="/public-service"
          class="mt-7 inline-flex items-center gap-2.5 text-sm font-medium text-neutral-900 hover:text-forest"
        >
          Explore public service
          <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
