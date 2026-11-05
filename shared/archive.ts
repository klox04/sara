export type ArchiveRecord = {
  title: string
  date: string
  category: string
  institution: string
  type: string
}

export type ArchiveFilterKey = "year" | "category" | "institution" | "type"

export type ArchiveFilters = Record<ArchiveFilterKey, string>

export const archiveRecords: ArchiveRecord[] = [
  { title: "A Stronger Philippines Through Its People", date: "Jul 25, 2022", category: "Public Address", institution: "Office of the Vice President", type: "Speech" },
  { title: "Inclusive Education for Every Filipino", date: "Mar 14, 2021", category: "Education", institution: "Office of the Vice President", type: "Policy Document" },
  { title: "OVP Program Report 2022", date: "Dec 2022", category: "Programs & Initiatives", institution: "Office of the Vice President", type: "Report" },
  { title: "Statement on Community Resilience", date: "Nov 8, 2021", category: "Public Address", institution: "Office of the Vice President", type: "Statement" },
  { title: "Davao City Local Governance Reforms", date: "Aug 30, 2019", category: "Local Governance", institution: "Davao City Government", type: "Report" },
  { title: "Build Better Communities Program", date: "Jan 12, 2020", category: "Communities", institution: "Davao City Government", type: "Program Brief" },
  { title: "Women and Children First: A Safer Philippines", date: "Mar 22, 2021", category: "Social Development", institution: "Office of the Vice President", type: "Policy Document" },
  { title: "2021 Accomplishment Report", date: "Dec 2021", category: "Accomplishments", institution: "Office of the Vice President", type: "Report" },
  { title: "Remarks at the National Youth Summit", date: "Apr 5, 2019", category: "Youth Development", institution: "Davao City Government", type: "Speech" },
  { title: "Partnerships for Stronger LGUs", date: "Aug 18, 2020", category: "Local Governance", institution: "Davao City Government", type: "Policy Document" },
]

export function archiveYear(date: string) {
  return date.match(/\d{4}/)?.[0] ?? ""
}

export function emptyArchiveFilters(): ArchiveFilters {
  return { year: "", category: "", institution: "", type: "" }
}
