<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { config, t } = useHotelConfig()
const { locale } = useI18n()

// Global SEO defaults
useHead({
  titleTemplate: config.seo.titleTemplate,
  htmlAttrs: {
    lang: () => locale.value,
    dir: 'ltr',
  },
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: config.name,
  ogImage: config.seo.ogImage,
  twitterCard: 'summary_large_image',
  twitterSite: config.seo.twitterHandle,
})

onMounted(() => {
  if (import.meta.client) {
    // Dark-theme CSS'i arka planda yükle (body.theme-dark selector'ü ile korumalı, varsayılan olarak aktif değil)
    const loadDarkTheme = () => import('@/assets/css/dark-theme.css')
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadDarkTheme)
    } else {
      setTimeout(loadDarkTheme, 2000)
    }
  }
})
</script>
