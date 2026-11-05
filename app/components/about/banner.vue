<template>
<section class="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-[46rem]">
      <img
        src="/media/landingpage.JPG"
        alt="Sara Duterte beside the Philippine flag"
        class="absolute inset-0 h-full w-full object-cover object-[72%_20%]"
      >

      <div class="relative mx-auto flex min-h-[34rem] max-w-[1440px] items-center px-6 py-16 sm:min-h-[40rem] sm:px-10 lg:min-h-[46rem] lg:px-16">
        <div class="max-w-xl">
          <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-white">
            Her Story
          </p>
          <h1 class="mt-4 max-w-[16rem] font-serif text-[2.7rem] font-medium leading-[1.05] text-white sm:max-w-lg sm:text-6xl lg:text-[4.15rem]">
            A Life in<br>
            Public Service
          </h1>
          <p class="mt-5 max-w-md text-sm leading-relaxed text-white sm:text-[15px]">
            An editorial introduction to a career spanning Davao City and national public office — shaped by community, service, and a lifelong commitment to the Filipino people.
          </p>
          <NuxtLink
            to="/#journey"
            class="mt-8 inline-flex w-fit items-center gap-3 bg-[#1a3328] px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white hover:bg-[#14281f]"
          >
            Explore the timeline
            <Icon name="heroicons:arrow-right" size="1rem" aria-hidden="true" />
          </NuxtLink>
        </div>

        <blockquote class="absolute right-6 top-10 max-w-[12.5rem] text-right font-script text-[1.7rem] leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:right-10 sm:top-14 sm:max-w-[15rem] sm:text-[2.15rem] lg:right-16 lg:top-16 lg:text-[2.35rem]">
          <p>“Mas malaking bukas para sa bawat Pilipino.”</p>
          <footer class="mt-2 text-[1.35rem] sm:text-[1.55rem]">
            — Sara Duterte
          </footer>
        </blockquote>
      </div>
    </section>
</template>