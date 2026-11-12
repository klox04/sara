export type AccomplishmentFigure = {
  icon: string
  symbol?: string
  value: string
  title: string
  period: string
}

export type YearPoint = {
  year: number
  value: number
}

export type InitiativeShare = {
  label: string
  count: number
  share: number
  color: string
}

export const figurePeriod = "Sample figure · 2016 – 2022"

export const accomplishmentFigures: AccomplishmentFigure[] = [
  { icon: "heroicons:trophy", value: "118", title: "Awards and Recognitions", period: figurePeriod },
  { icon: "heroicons:academic-cap", value: "1,904", title: "Educational Scholarship Recipients", period: figurePeriod },
  { icon: "heroicons:building-office-2", value: "112", title: "Classroom Construction Projects", period: figurePeriod },
  { icon: "", symbol: "₱", value: "₱279B", title: "Reported Investment Portfolio", period: figurePeriod },
]

export const scholarshipRecipients = {
  title: "Scholarship Recipients",
  subtitle: "Number of recipients (2016 – 2022)",
  axisLabel: "Number of Recipients",
  points: [
    { year: 2016, value: 250 },
    { year: 2017, value: 430 },
    { year: 2018, value: 650 },
    { year: 2019, value: 900 },
    { year: 2020, value: 1230 },
    { year: 2021, value: 1620 },
    { year: 2022, value: 1904 },
  ] satisfies YearPoint[],
}

export const initiativesOverview = {
  title: "Initiatives Overview",
  subtitle: "Total reported count (2016 – 2022)",
  total: 342,
  totalLabel: "Total Initiatives",
  slices: [
    { label: "Classroom Construction Projects", count: 112, share: 33, color: "#1d4d32" },
    { label: "Awards & Recognitions", count: 118, share: 35, color: "#5f8f5b" },
    { label: "Scholarships", count: 1904, share: 28, color: "#c7dcb9" },
    { label: "Other Programs", count: 16, share: 4, color: "#efe5d8" },
  ] satisfies InitiativeShare[],
}
