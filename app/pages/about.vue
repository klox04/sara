<template>
  <main>
    <AboutBanner :banner="banner" :loading="loading" />
    <AboutBiography :paragraphs="biography" :roles="roles" :loading="loading" />
    <AboutFoundations :programs="programs" :loading="loading" />
    <!-- <AboutTimeline :stops="timeline" :loading="loading" /> -->
    <AboutAreas :areas="areas" :loading="loading" />
    <AboutRecords :records="records" :loading="loading" />
  </main>
</template>

<script setup lang="ts">
import AboutBanner from "~/components/about/banner.vue"
import AboutBiography from "~/components/about/biography.vue"
import AboutFoundations from "~/components/about/foundations.vue"
import AboutTimeline from "~/components/about/timeline.vue"
import AboutAreas from "~/components/about/areas.vue"
import AboutRecords from "~/components/about/records.vue"
import type { AboutArea, AboutBanner as AboutBannerData, AboutProgram, AboutRecordItem, AboutRole, AboutTimelineStop } from "~/types/about"

type PublicRecord = {
  uuid?: string
  title?: string
  description?: string
  record_date?: string | null
  category?: { name?: string, icon?: string | null } | null
  institution?: { name?: string } | null
  type?: { name?: string } | null
}

type ProgramRecord = {
  uuid?: string
  initiative?: { name?: string } | null
  title?: string
  description?: string
  file_path?: string
}

type AboutRecord = {
  title?: string
  subtitle?: string
  quote?: string
  file_path?: string
}

type MilestoneRecord = {
  uuid?: string
  year?: number | string
  file_path?: string
  icon?: string | null
  title?: string
  organization?: string
  period_label?: string | null
  description?: string
  is_active?: boolean
}

const { GET_API } = useGlobalStore()
const storageUrl = String(useRuntimeConfig().public.storageUrl || "")

const loading = ref(true)
const banner = ref<AboutBannerData | null>(null)
const biography = ref<string[]>([])
const roles = ref<AboutRole[]>([])
const programs = ref<AboutProgram[]>([])
const timeline = ref<AboutTimelineStop[]>([])
const areas = ref<AboutArea[]>([])
const records = ref<AboutRecordItem[]>([])

function categoryIcon(record: PublicRecord) {
  const icon = record.category?.icon ?? ""
  return icon.includes(":") ? icon : "heroicons:document-text"
}

function storageSrc(path: string) {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function applyBanner(record: AboutRecord) {
  const title = record.title?.trim() ?? ""
  if (!title) return
  banner.value = {
    title,
    subtitle: record.subtitle?.trim() ?? "",
    quote: record.quote?.trim().replace(/^["“”]+|["“”]+$/g, "").trim() ?? "",
    image: storageSrc(record.file_path ?? ""),
  }
}

function applyBiography(record: { body?: string } | null | undefined) {
  biography.value = (record?.body ?? "")
    .split(/\n\s*\n|\r?\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
}

function applyRoles(records: MilestoneRecord[]) {
  roles.value = records
    .filter(record => record.is_active !== false && record.title)
    .sort((a, b) => Number(a.year ?? 0) - Number(b.year ?? 0))
    .map((record, index) => {
      const period = record.period_label?.trim() || (record.year ? String(record.year) : "")
      return {
        id: record.uuid || `role-${index}`,
        title: record.title ?? "",
        meta: [period, record.organization?.trim()].filter(Boolean).join(" · "),
        detail: record.description?.trim() ?? "",
        icon: record.icon && record.icon.includes(":") ? record.icon : "heroicons:building-library",
      }
    })
}

function applyTimeline(records: MilestoneRecord[]) {
  timeline.value = records
    .filter(record => record.is_active !== false && record.title)
    .sort((a, b) => Number(a.year ?? 0) - Number(b.year ?? 0))
    .map((record, index) => ({
      id: record.uuid || `stop-${index}`,
      year: record.year ? String(record.year) : "",
      icon: record.icon && record.icon.includes(":") ? record.icon : "heroicons:building-library",
      title: record.title ?? "",
      place: record.organization?.trim() ?? "",
      years: record.period_label?.trim() ?? "",
      detail: record.description?.trim() ?? "",
    }))
}

function applyPrograms(records: ProgramRecord[]) {
  programs.value = records
    .filter(record => record.title)
    .map((record, index) => ({
      id: record.uuid || `program-${index}`,
      initiative: record.initiative?.name ?? "",
      title: record.title ?? "",
      description: record.description?.trim() ?? "",
      image: storageSrc(record.file_path ?? ""),
    }))
}

function applyAreas(records: PublicRecord[]) {
  areas.value = records
    .filter(record => record.title)
    .map((record, index) => ({
      id: record.uuid || `record-${index}`,
      icon: categoryIcon(record),
      category: record.category?.name ?? "",
      title: record.title ?? "",
      detail: record.description?.trim() ?? "",
    }))
}

function applyRecords(list: PublicRecord[]) {
  records.value = list
    .filter(record => record.title)
    .map((record, index) => {
      const year = record.record_date?.slice(0, 4) ?? ""
      return {
        id: record.uuid || `archive-record-${index}`,
        icon: categoryIcon(record),
        meta: [record.type?.name, year, record.institution?.name].filter(Boolean).join(" · "),
        title: record.title ?? "",
        detail: record.description?.trim() ?? "",
      }
    })
}

function getAboutData() {
  GET_API({ api: "public/about" })
    .then((response) => {
      const data = response.data?.data
      if (data?.about) applyBanner(data.about)
      applyBiography(data?.biography)
      if (Array.isArray(data?.milestones)) {
        applyRoles(data.milestones)
        applyTimeline(data.milestones)
      }
      if (Array.isArray(data?.programs)) applyPrograms(data.programs)
      if (Array.isArray(data?.featured_records)) applyAreas(data.featured_records)
      if (Array.isArray(data?.records)) applyRecords(data.records)
    })
    .catch((error: unknown) => {
      console.error("Error fetching about data:", error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getAboutData()
})
</script>
