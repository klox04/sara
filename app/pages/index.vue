<template>
  <main class="flex flex-1 flex-col">
    <HeroSection :banner="banner" :loading="loading" />
    <PrioritiesSection :items="priorities" :loading="loading" />
    <JourneySection :journey="journey" :loading="loading" />
    <StoriesPreview :stories="stories" :loading="loading" />
    <StatsSection :impact="impact" :loading="loading" />
    <ConnectSection />
  </main>
</template>

<script setup lang="ts">
import HeroSection from "~/components/home/HeroSection.vue"
import PrioritiesSection from "~/components/home/PrioritiesSection.vue"
import JourneySection from "~/components/home/JourneySection.vue"
import StoriesPreview from "~/components/home/StoriesPreview.vue"
import StatsSection from "~/components/home/StatsSection.vue"
import ConnectSection from "~/components/home/ConnectSection.vue"
import type { Banner } from "~/types/banner"
import type { Impact } from "~/types/impact"
import type { Journey } from "~/types/journey"
import type { Priority } from "~/types/priority"
import type { StoryPreview } from "~/types/story"

type HeroRecord = {
  name?: string
  headline?: string
  body?: string
  quote?: string
  file_path?: string
  video_file_path?: string | null
}

type PriorityRecord = {
  uuid?: string
  icon?: string
  title?: string
  description?: string
  is_active?: boolean
}

type MilestoneRecord = {
  uuid?: string
  year?: number | string
  file_path?: string
  title?: string
  organization?: string
  period_label?: string
  description?: string
  is_active?: boolean
}

type JourneyRecord = {
  eyebrow?: string
  title?: string
  description?: string
  milestones?: MilestoneRecord[]
}

type StoryRecord = {
  uuid?: string
  category?: { name?: string } | null
  title?: string
  description?: string
  file_path?: string
  is_active?: boolean
}

type StatisticRecord = {
  uuid?: string
  value?: string | number
  description?: string
  source_url?: string | null
  sort_order?: number
  is_active?: boolean
}

type StatisticStatementRecord = {
  statement?: string
  attribution?: string
  statistics?: StatisticRecord[]
}

const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const loading = ref(true)
const banner = ref<Banner | null>(null)
const priorities = ref<Priority[]>([])
const journey = ref<Journey | null>(null)
const stories = ref<StoryPreview[]>([])
const impact = ref<Impact | null>(null)

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function splitQuote(value: string) {
  const match = value.match(/^([\s\S]*?)\s*[—–]\s*([^—–]+)$/)
  const text = (match?.[1] ?? value).trim().replace(/^["“”]+|["“”]+$/g, "").trim()
  return { text, author: match?.[2]?.trim() ?? "" }
}

function applyHero(hero: HeroRecord) {
  if (!hero.name?.trim()) return
  const quote = splitQuote(hero.quote ?? "")
  banner.value = {
    name: hero.name,
    subtitle: hero.headline ?? "",
    body: hero.body ?? "",
    image: storageSrc(hero.file_path ?? ""),
    video: storageSrc(hero.video_file_path ?? ""),
    quote: quote.text,
    quoteAuthor: quote.author,
    primaryLabel: "Explore Her Story",
    primaryTo: "/stories",
    secondaryLabel: "Watch Video",
  }
}

function applyPriorities(records: PriorityRecord[]) {
  const items = records
    .filter(record => record.is_active !== false && record.title)
    .map((record, index) => ({
      id: record.uuid || `priority-${index}`,
      icon: record.icon || "heroicons:star",
      title: record.title ?? "",
      text: record.description ?? "",
    }))
  priorities.value = items
}

function milestonePlace(record: MilestoneRecord) {
  const organization = record.organization?.trim() ?? ""
  const period = record.period_label?.trim() ?? ""
  if (organization && period) return `${organization} (${period})`
  return organization || period
}

function applyJourney(record: JourneyRecord, milestoneRecords: MilestoneRecord[] = record.milestones ?? []) {
  const milestones = milestoneRecords
    .filter(milestone => milestone.is_active !== false)
    .sort((a, b) => Number(a.year ?? 0) - Number(b.year ?? 0))
    .map((milestone, index) => ({
      id: milestone.uuid || `milestone-${index}`,
      year: milestone.year ? String(milestone.year) : "",
      role: milestone.title ?? "",
      place: milestonePlace(milestone),
      text: milestone.description ?? "",
      image: storageSrc(milestone.file_path ?? ""),
    }))

  if (!record.title && !record.description && !milestones.length) return
  journey.value = {
    eyebrow: record.eyebrow ?? "",
    title: record.title ?? "",
    description: record.description ?? "",
    milestones,
  }
}

function applyStories(records: StoryRecord[]) {
  const items = records
    .filter(record => record.is_active !== false && record.title)
    .slice(0, 3)
    .map((record, index) => ({
      id: record.uuid || `story-${index}`,
      uuid: record.uuid,
      category: record.category?.name || "Story",
      title: record.title ?? "",
      excerpt: record.description ?? "",
      image: storageSrc(record.file_path ?? ""),
    }))
  stories.value = items
}

function applyImpact(record: StatisticStatementRecord) {
  const figures = (record.statistics ?? [])
    .filter(statistic => statistic.is_active !== false && statistic.value !== undefined && statistic.value !== "")
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((statistic, index) => ({
      id: statistic.uuid || `statistic-${index}`,
      value: String(statistic.value),
      label: statistic.description ?? "",
      source: statistic.source_url ?? "",
    }))

  const statement = record.statement?.trim().replace(/^["“”]+|["“”]+$/g, "").trim() ?? ""
  if (!statement && !figures.length) return
  impact.value = {
    statement,
    attribution: record.attribution ?? "",
    figures,
  }
}

function getHomepageData() {
  GET_API({ api: "public/home" })
    .then((response) => {
      const data = response.data?.data
      if (data?.hero) applyHero(data.hero)
      if (Array.isArray(data?.priorities)) applyPriorities(data.priorities)
      if (data?.journeys?.[0]) {
        applyJourney(data.journeys[0], Array.isArray(data.milestones) ? data.milestones : undefined)
      }
      if (Array.isArray(data?.stories)) applyStories(data.stories)
      if (data?.statistic_statements?.[0]) applyImpact(data.statistic_statements[0])
    })
    .catch((error: unknown) => {
      console.error("Error fetching homepage data:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getHomepageData()
})
</script>
