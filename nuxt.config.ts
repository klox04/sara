import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/icon/module", "nuxt-echarts"],
  compatibilityDate: "2025-07-15",

  echarts: {
    renderer: "svg",
    charts: ["LineChart", "PieChart"],
    components: ["GridComponent", "TooltipComponent", "MarkPointComponent"],
  },

  app: {
    head: {
      title: "Sara Duterte",
      link: [
        { rel: "icon", type: "image/png", href: "/forest_eagle_mountain_icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Great+Vibes&family=Nanum+Pen+Script&family=Inter:wght@400;500;600&display=swap",
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    adminUser: "",
    adminPassword: "",
    sessionSecret: "sara-local-session-secret",
    public: {
      apiBase: "http://localhost:50507/api/v1",
      storageUrl: process.env.STORAGE_URL || "",
    },
  },

  nitro: {
    routeRules: {
      "/api/v1/**": {
        proxy: `${(process.env.NUXT_PUBLIC_API_BASE || "http://localhost:50507/api/v1").replace(/\/$/, "")}/**`,
      },
      "/sanctum/**": {
        proxy: `${new URL(process.env.NUXT_PUBLIC_API_BASE || "http://localhost:50507/api/v1").origin}/sanctum/**`,
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});