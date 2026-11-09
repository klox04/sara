export interface Milestone {
  id: string
  year: string
  role: string
  place: string
  text: string
  image: string
}

export interface Journey {
  eyebrow: string
  title: string
  description: string
  milestones: Milestone[]
}
