export interface Figure {
  id: string
  value: string
  label: string
  source: string
}

export interface Impact {
  statement: string
  attribution: string
  figures: Figure[]
}
