export interface InitiativeIcon {
  value: string
  label: string
  icon: string
}

export const initiativeIcons: InitiativeIcon[] = [
  { value: "education", label: "Education", icon: "heroicons:academic-cap" },
  { value: "health", label: "Health", icon: "uil:heartbeat" },
  { value: "social-services", label: "Social Services", icon: "heroicons:user-group" },
  { value: "economy-jobs", label: "Economy & Jobs", icon: "heroicons:chart-bar" },
  { value: "infrastructure", label: "Infrastructure", icon: "heroicons:building-office-2" },
  { value: "peace-security", label: "Peace & Security", icon: "heroicons:shield-check" },
  { value: "disaster-preparedness", label: "Disaster Preparedness", icon: "heroicons:lifebuoy" },
  { value: "environment-climate", label: "Environment & Climate", icon: "heroicons:globe-asia-australia" },
]

export function initiativeIcon(value: string) {
  if (value.includes(":")) return value
  return initiativeIcons.find(item => item.value === value)?.icon ?? "heroicons:tag"
}
