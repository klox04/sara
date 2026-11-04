export const collectionNames = [
  "banners",
  "programs",
  "journey",
  "stories",
  "achievements",
  "statistics",
  "galleries",
  "archive",
] as const

export const singletonNames = ["about", "connect"] as const

export type CollectionName = typeof collectionNames[number]
export type SingletonName = typeof singletonNames[number]
export type FieldType = "text" | "textarea" | "image" | "images" | "number"

export type ContentField = {
  key: string
  label: string
  type: FieldType
}

export type ContentRecord = {
  id: string
  sort: number
  published: boolean
  [key: string]: string | number | boolean | string[]
}

export type CollectionConfig = {
  label: string
  description: string
  titleKey: string  
  fields: ContentField[]
}

export const collections: Record<CollectionName, CollectionConfig> = {
  banners: {
    label: "Homepage",
    description: "Homepage hero",
    titleKey: "title",
    fields: [
      { key: "image", label: "Image", type: "image" },
      { key: "title", label: "Title", type: "textarea" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "quoteAuthor", label: "Quote author", type: "text" },
      { key: "primaryLabel", label: "Primary button", type: "text" },
      { key: "primaryTo", label: "Primary link", type: "text" },
      { key: "secondaryLabel", label: "Secondary button", type: "text" },
      { key: "secondaryTo", label: "Secondary link", type: "text" },
    ],
  },
  programs: {
    label: "Programs",
    description: "Public service priorities",
    titleKey: "title",
    fields: [
      { key: "icon", label: "Icon", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "text", label: "Text", type: "textarea" },
    ],
  },
  journey: {
    label: "Journey",
    description: "Public service timeline",
    titleKey: "role",
    fields: [
      { key: "year", label: "Year", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "place", label: "Place", type: "text" },
      { key: "text", label: "Text", type: "textarea" },
      { key: "image", label: "Portrait", type: "image" },
    ],
  },
  stories: {
    label: "Stories",
    description: "Stories and articles",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  achievements: {
    label: "Achievements",
    description: "Accomplishments",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  statistics: {
    label: "Statistics",
    description: "Homepage figures",
    titleKey: "label",
    fields: [
      { key: "value", label: "Value", type: "text" },
      { key: "label", label: "Label", type: "text" },
      { key: "note", label: "Note", type: "text" },
    ],
  },
  galleries: {
    label: "Galleries",
    description: "Photo albums",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "images", label: "Images", type: "images" },
    ],
  },
  archive: {
    label: "Archive",
    description: "Documents and records",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "date", label: "Date", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "link", label: "Link", type: "text" },
    ],
  },
}

export const singletons = {
  about: {
    label: "About",
    description: "About page",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
    ] satisfies ContentField[],
  },
  connect: {
    label: "Connect",
    description: "Contact details",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
    ] satisfies ContentField[],
  },
}

export const adminModules = [
  ...collectionNames.map(name => ({
    to: `/admin/${name}`,
    label: collections[name].label,
    description: collections[name].description,
  })),
  ...singletonNames.map(name => ({
    to: `/admin/${name}`,
    label: singletons[name].label,
    description: singletons[name].description,
  })),
].filter(module => module.to !== "/admin/about")

function item(id: string, sort: number, fields: Record<string, string | string[]>): ContentRecord {
  return { id, sort, published: true, ...fields }
}

export const contentSeed: Record<CollectionName, ContentRecord[]> = {
  banners: [
    item("banner-home", 1, {
      image: "/media/landingpage.JPG",
      title: "Sara\nDuterte",
      subtitle: "Public Service. Real Change. A Stronger Philippines.",
      body: "From Davao to national public service, Sara Duterte has dedicated her life to serving communities, empowering people, and building a better future for every Filipino.",
      quote: "Mas malaking bukas para sa bawat Pilipino.",
      quoteAuthor: "Sara Duterte",
      primaryLabel: "Explore Her Story",
      primaryTo: "/stories",
      secondaryLabel: "Watch Video",
      secondaryTo: "",
    }),
  ],
  programs: [
    item("program-education", 1, { icon: "boxicons:education", title: "Education", text: "More opportunities for every learner" }),
    item("program-health", 2, { icon: "uil:heartbeat", title: "Health", text: "Stronger, healthier communities" }),
    item("program-social", 3, { icon: "heroicons:user-group", title: "Social Services", text: "A more inclusive society" }),
    item("program-economy", 4, { icon: "bi:bar-chart", title: "Economy & Jobs", text: "More livelihoods, stronger communities" }),
    item("program-infrastructure", 5, { icon: "heroicons:building-office-2", title: "Infrastructure", text: "Building for people" }),
    item("program-peace", 6, { icon: "heroicons:shield-check", title: "Peace & Security", text: "Safer, stronger cities and communities" }),
    item("program-disaster", 7, { icon: "icon-park-outline:leaves", title: "Disaster Preparedness", text: "Ready for tomorrow" }),
  ],
  journey: [
    item("journey-2007", 1, {
      year: "2007",
      role: "Vice Mayor",
      place: "Davao City",
      text: "Began her journey in elected public service.",
      image: "/media/imag1.JPG",
    }),
    item("journey-2010", 2, {
      year: "2010",
      role: "Mayor",
      place: "Davao City (2010–2013)",
      text: "Focused on inclusive development and people-centered programs.",
      image: "/media/image2.jpg",
    }),
    item("journey-2016", 3, {
      year: "2016",
      role: "Mayor",
      place: "Davao City (2016–2022)",
      text: "Expanded programs in education, health, infrastructure, and economic development.",
      image: "/media/image3.JPG",
    }),
    item("journey-2022", 4, {
      year: "2022",
      role: "Vice President",
      place: "Republic of the Philippines (2022–Present)",
      text: "Continuing to serve Filipinos across the nation.",
      image: "/media/imag4.jpg",
    }),
  ],
  stories: [
    item("story-service", 1, {
      title: "A life in public service",
      slug: "a-life-in-public-service",
      excerpt: "From Davao to the national stage, a continued commitment to the Filipino people.",
      body: "Sara Duterte began her elected service in Davao City and carried that work to the national government. Her public life has stayed centered on education, health, and communities that need a stronger tomorrow.",
      image: "/media/imag4.jpg",
    }),
    item("story-davao", 2, {
      title: "Serving Davao",
      slug: "serving-davao",
      excerpt: "Years in city government shaped the programs she continues to champion.",
      body: "As vice mayor and then mayor, she focused on inclusive development and services that families could feel in daily life. Those years remain the foundation of her national work.",
      image: "/media/image2.jpg",
    }),
  ],
  achievements: [
    item("achievement-education", 1, {
      title: "Education for every learner",
      year: "2016",
      summary: "Expanded programs that open more opportunities for students and schools.",
      image: "/media/image3.JPG",
    }),
    item("achievement-national", 2, {
      title: "National public service",
      year: "2022",
      summary: "Continued service to Filipinos across the country as Vice President.",
      image: "/media/imag4.jpg",
    }),
  ],
  statistics: [
    item("stat-start", 1, { value: "2007", label: "Public service began", note: "Vice Mayor, Davao City" }),
    item("stat-programs", 2, { value: "7", label: "Priority areas", note: "Education through preparedness" }),
    item("stat-role", 3, { value: "2022", label: "Vice President", note: "Serving the nation" }),
  ],
  galleries: [
    item("gallery-service", 1, {
      title: "A life in service",
      images: ["/media/imag1.JPG", "/media/image2.jpg", "/media/image3.JPG", "/media/imag4.jpg"],
    }),
  ],
  archive: [
    item("archive-timeline", 1, {
      title: "Public service timeline",
      date: "2007–Present",
      summary: "A record of elected service from Davao City to the national government.",
      link: "/about",
    }),
  ],
}

export const singletonSeed = {
  about: {
    heading: "About",
    body: "From Davao to the national stage, Sara Duterte has continued a commitment to the Filipino people through education, health, and public service.",
    image: "/media/landingpage.JPG",
  },
  connect: {
    heading: "Connect",
    body: "Reach the public service office for questions, partnerships, and community concerns.",
    email: "info@saraduterte.ph",
    phone: "",
    address: "Republic of the Philippines",
  },
}

export function isCollection(value: string): value is CollectionName {
  return (collectionNames as readonly string[]).includes(value)
}

export function isSingleton(value: string): value is SingletonName {
  return (singletonNames as readonly string[]).includes(value)
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
