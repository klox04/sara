export interface AboutRole {
  id: string
  title: string
  meta: string
  detail: string
  icon: string
}

export interface AboutTimelineStop {
  id: string
  year: string
  icon: string
  title: string
  place: string
  years: string
  detail: string
}

export interface AboutRecordItem {
  id: string
  icon: string
  meta: string
  title: string
  detail: string
}

export interface AboutArea {
  id: string
  icon: string
  category: string
  title: string
  detail: string
}

export interface AboutProgram {
  id: string
  initiative: string
  title: string
  description: string
  image: string
}

export interface AboutBanner {
  title: string
  subtitle: string
  quote: string
  image: string
}
