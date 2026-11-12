<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:py-20">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            At a glance · Sample figures · Supporting sources pending
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
            Public service in numbers
          </h2>
        </div>
        <p class="max-w-sm text-sm leading-relaxed text-neutral-500 lg:text-right">
          An at-a-glance view of key reported results and initiatives, with illustrative statistics based on available records (2016 – 2022) and sources pending.
        </p>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="figure in figures"
          :key="figure.title"
          class="border border-neutral-200 bg-white px-5 py-6"
        >
          <Icon v-if="figure.icon" :name="figure.icon" class="text-neutral-700" size="1.35rem" aria-hidden="true" />
          <span v-else class="font-serif text-2xl leading-none text-neutral-700" aria-hidden="true">{{ figure.symbol }}</span>
          <p class="mt-4 font-serif text-4xl font-medium lining-nums text-neutral-950">{{ figure.value }}</p>
          <p class="mt-2 text-sm font-medium text-neutral-800">{{ figure.title }}</p>
          <p class="mt-3 text-xs text-neutral-400">{{ figure.period }}</p>
        </article>
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <article class="border border-neutral-200 bg-white px-5 py-6 sm:px-6">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">
            {{ scholarshipRecipients.title }}
          </h3>
          <p class="mt-1 text-xs text-neutral-500">{{ scholarshipRecipients.subtitle }}</p>
          <div class="mt-4 h-72 sm:h-80">
            <VChart :option="scholarshipOption" autoresize class="h-full w-full" />
          </div>
        </article>

        <article class="border border-neutral-200 bg-white px-5 py-6 sm:px-6">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">
            {{ initiativesOverview.title }}
          </h3>
          <p class="mt-1 text-xs text-neutral-500">{{ initiativesOverview.subtitle }}</p>
          <div class="mt-4 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div class="relative mx-auto aspect-square w-full max-w-[18rem]">
              <VChart :option="initiativesOption" autoresize class="h-full w-full" />
              <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="font-serif text-5xl font-medium leading-none lining-nums text-neutral-950">
                  {{ initiativesOverview.total.toLocaleString("en-US") }}
                </span>
                <span class="mt-2 text-sm leading-tight text-neutral-700">
                  {{ initiativesOverview.totalLabel }}
                </span>
              </div>
            </div>
            <ul class="space-y-4">
              <li v-for="slice in initiativesOverview.slices" :key="slice.label" class="flex items-start gap-3">
                <span class="mt-0.5 size-4 shrink-0" :style="{ backgroundColor: slice.color }" aria-hidden="true" />
                <span class="text-sm leading-snug text-neutral-800">
                  {{ slice.label }}
                  <span class="block text-neutral-500">({{ slice.count.toLocaleString("en-US") }}) · {{ slice.share }}%</span>
                </span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { accomplishmentFigures, initiativesOverview, scholarshipRecipients } from "~/data/accomplishments"

const figures = accomplishmentFigures

const axisText = { color: "#525252", fontSize: 11, fontFamily: "Inter, sans-serif" }
const lineColor = "#1d4d32"
const calloutShape = "path://M4,0H60A4,4,0,0,1,64,4V26A4,4,0,0,1,60,30H38L32,36L26,30H4A4,4,0,0,1,0,26V4A4,4,0,0,1,4,0Z"

function formatCount(value: number | string) {
  return Number(value).toLocaleString("en-US")
}

const scholarshipOption = computed(() => {
  const points = scholarshipRecipients.points
  const last = points[points.length - 1]
  return {
    grid: { left: 64, right: 28, top: 56, bottom: 32 },
    tooltip: {
      trigger: "axis",
      valueFormatter: formatCount,
      borderColor: "#e5e5e5",
      textStyle: { color: "#171717", fontFamily: "Inter, sans-serif", fontSize: 12 },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: points.map(point => String(point.year)),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#d4d4d4" } },
      axisLabel: axisText,
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 2000,
      interval: 250,
      name: scholarshipRecipients.axisLabel,
      nameLocation: "middle",
      nameGap: 48,
      nameTextStyle: { ...axisText, color: "#737373" },
      axisLabel: { ...axisText, formatter: formatCount },
      splitLine: { lineStyle: { color: "#eceee9" } },
    },
    series: [
      {
        name: scholarshipRecipients.title,
        type: "line",
        smooth: false,
        data: points.map(point => point.value),
        symbol: "emptyCircle",
        symbolSize: 8,
        lineStyle: { color: lineColor, width: 2 },
        itemStyle: { color: lineColor, borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(176, 207, 156, 0.5)" },
              { offset: 1, color: "rgba(176, 207, 156, 0.06)" },
            ],
          },
        },
        markPoint: last
          ? {
              symbol: calloutShape,
              symbolSize: [64, 36],
              symbolOffset: [0, -28],
              itemStyle: { color: lineColor },
              label: {
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                offset: [0, -3],
                formatter: () => formatCount(last.value),
              },
              data: [{ coord: [String(last.year), last.value] }],
            }
          : undefined,
      },
    ],
  }
})

const initiativesOption = computed(() => ({
  tooltip: {
    trigger: "item",
    borderColor: "#e5e5e5",
    textStyle: { color: "#171717", fontFamily: "Inter, sans-serif", fontSize: 12 },
    formatter: (params: { name: string, value: number }) => `${params.name}: ${params.value}%`,
  },
  series: [
    {
      name: initiativesOverview.title,
      type: "pie",
      radius: ["58%", "94%"],
      startAngle: 90,
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: { borderColor: "#ffffff", borderWidth: 2 },
      emphasis: { scale: true, scaleSize: 4 },
      data: initiativesOverview.slices.map(slice => ({
        name: slice.label,
        value: slice.share,
        itemStyle: { color: slice.color },
      })),
    },
  ],
}))
</script>
