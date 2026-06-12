// https://nuxt.com/docs/api/configuration/nuxt-config
import { hotelConfig } from './config/hotel.config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  features: {
    inlineStyles: true
  },

  vite: {
    define: {
      // Production'da hydration mismatch detaylarını devre dışı bırak (performans)
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // i18n modülünü ayrı chunk'a al
            if (id.includes('@intlify') || id.includes('@nuxtjs/i18n')) {
              return 'vendor-i18n'
            }
            // Nuxt UI ve Reka UI'ı ayrı chunk'a al
            if (id.includes('@nuxt/ui') || id.includes('reka-ui')) {
              return 'vendor-ui'
            }
          }
        }
      }
    }
  },

  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],

  // ─── CSS ─────────────────────────────────────────────────────────
  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'theme-mode-disabled-permanently',
  },

  // ─── SEO — Site Config ───────────────────────────────────────────
  site: {
    url: hotelConfig.seo.siteUrl,
    name: hotelConfig.name,
    description: hotelConfig.seo.defaultDescription.en,
    defaultLocale: 'tr',
  },

  // ─── App Config ──────────────────────────────────────────────────
  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      titleTemplate: hotelConfig.seo.titleTemplate,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { name: 'theme-color', content: hotelConfig.theme.primary[600] },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // ─── i18n ────────────────────────────────────────────────────────
  i18n: {
    langDir: 'locales',
    defaultLocale: 'tr',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'tr', name: 'Türkçe', language: 'tr-TR', file: 'tr.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  // ─── Google Fonts ────────────────────────────────────────────────
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Cormorant+Garamond': {
        wght: [400, 500, 600, 700],
        ital: [400, 600]
      },
    },
    display: 'swap',
    download: false,
    preload: false,
    useStylesheet: true,
  },

  // ─── Image Optimization ──────────────────────────────────────────
  image: {
  provider: 'vercel', 
    quality: 75,
    format: ['avif', 'webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // ─── OG Image & Schema ───────────────────────────────────────────
  ogImage: {
    enabled: true,
  },
  schemaOrg: {
    enabled: false,
  },



  // ─── Performance ─────────────────────────────────────────────────
  experimental: {
    payloadExtraction: true,
  },

  // ─── Nitro (Server) ──────────────────────────────────────────────
  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml'],
      ignore: ['/_vercel'],
      failOnError: false,
    },
    externals: {
      inline: [/^vue/, /^@vue/]
    }
  },
  routeRules: {
    // ─── Statik sayfaları prerender et (TTFB azaltma) ────────────
    '/': { prerender: true },
    '/about': { prerender: true },
    '/rooms': { prerender: true },
    '/gallery': { prerender: true },
    '/contact': { prerender: true },
    '/guide': { prerender: true },
    '/en': { prerender: true },
    '/en/about': { prerender: true },
    '/en/rooms': { prerender: true },
    '/en/gallery': { prerender: true },
    '/en/contact': { prerender: true },
    '/en/guide': { prerender: true },
    // ─── Cache kuralları ─────────────────────────────────────────
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  // ─── Runtime Config ──────────────────────────────────────────────
  runtimeConfig: {
    // Hotel API Provider: 'mock' | 'elektraweb' | 'hotelrunner'
    hotelProvider: process.env.HOTEL_PROVIDER || 'mock',

    // ElektraWeb API (process.env ile override edilebilir)
    elektraweb: {
      apiKey: process.env.ELEKTRAWEB_API_KEY || '',
      baseUrl: process.env.ELEKTRAWEB_BASE_URL || 'https://api.elektraweb.com',
      hotelId: process.env.ELEKTRAWEB_HOTEL_ID || '',
      // Ödeme sayfası base URL’i: https://YOUR_HOTEL.elektraweb.com
      paymentBaseUrl: process.env.ELEKTRAWEB_PAYMENT_URL || '',
    },

    // HotelRunner API (process.env ile override edilebilir)
    hotelrunner: {
      apiKey: process.env.HOTELRUNNER_API_KEY || '',
      token: process.env.HOTELRUNNER_TOKEN || '',
      hotelId: process.env.HOTELRUNNER_HOTEL_ID || '',
      // Ödeme sayfası URL’i için: https://book.hotelrunner.com/{appKey}/reservations/{id}/payment
      appKey: process.env.HOTELRUNNER_APP_KEY || '',
    },

    public: {
      hotelName: hotelConfig.name,
    },
  },
})
