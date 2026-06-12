<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'

const { t, locale } = useI18n()
const { config } = useHotelConfig()

// State
const isSliderOpen = ref(false)
const selectedImgIndex = ref(0)
const activeCategory = ref('all')
const enableAnimation = ref(false)

// SEO
useSeoMeta({
  title: () => `${t('gallery.title') ?? 'Galeri'} | ${config.name}`,
  description: () => t('gallery.seo_description') ?? config.shortDescription[locale.value],
})

// Kategorileri Dinamik Çek
const galleryCategories = computed(() => {
  const uniqueCats = [...new Set(config.gallery.map(c => c.category).filter(Boolean))] as string[]
  return [
    { id: 'all', label: t('gallery.all') || 'HEPSİ' },
    ...uniqueCats.map(cat => ({
      id: cat,
      label: t(`gallery.${cat}`) !== `gallery.${cat}` 
        ? t(`gallery.${cat}`) 
        : cat.toUpperCase()
    }))
  ]
})

// Veriyi formatla
const allItems = computed(() => {
  return config.gallery.map((img, idx) => {
    let description = img.description?.[locale.value] || ''

    // Odalar için oda açıklamalarını çek
    if (img.category === 'room') {
      const parts = img.src.split('/')
      if (parts.length >= 4 && parts[2] === 'rooms') {
        const slug = (parts[3] as string).toLowerCase()
        const room = config.rooms.find(r => r.slug === slug)
        if (room?.description) {
          description = (room.description[locale.value] as string) || ''
        }
      }
    }

    return {
      id: `img-${idx}`, 
      technicalCategory: img.category,
      // Vercel/IPX root path fix
      src: img.src.startsWith('/') ? img.src : `/${img.src}`,
      alt: img.alt?.[locale.value] ?? config.name,
      description
    }
  })
})

// Filtreleme
const filteredGallery = computed(() => {
  if (activeCategory.value === 'all') return allItems.value
  return allItems.value.filter(item => item.technicalCategory === activeCategory.value)
})

// Galeri Açma
const openGallery = (id: string) => {
  const index = filteredGallery.value.findIndex(item => item.id === id)
  selectedImgIndex.value = index !== -1 ? index : 0
  isSliderOpen.value = true
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-20">
    
    <SharedPageHeader
      badge="gallery.subtitle"
      title="gallery.title"
      :highlight-last-word="true"
    >
      <!-- Category Filters inside header -->
      <SharedCategoryFilter
        :categories="galleryCategories"
        v-model="activeCategory"
        wrapper-class="mt-8 border-b pb-8"
        @change="enableAnimation = true"
      />
    </SharedPageHeader>

    <div class="max-w-[1600px] mx-auto px-6">
      <!-- Masonry layout -->
      <TransitionGroup 
        :name="enableAnimation ? 'gallery-list' : undefined" 
        tag="div" 
        class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6"
      >
        <div 
          v-for="(item, index) in filteredGallery" 
          :key="item.id"
          class="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 border aspect-[4/3]"
          @click="openGallery(item.id)"
        >
          <NuxtImg
            :src="item.src"
            :alt="item.alt"
            width="400"
            height="300"
            sizes="xs:100vw sm:50vw md:33vw lg:33vw xl:400px"
            format="webp"
            quality="50"
            :loading="index < 4 ? 'eager' : 'lazy'"
            :fetchpriority="index < 2 ? 'high' : 'auto'"
            class="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-110"
          />

          <!-- Alt gradient + içerik overlay (Mobilde daima görünür, Masaüstünde hover) -->
          <div class="gallery-overlay absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700">
            <div class="translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span class="inline-block text-[8px] tracking-[0.3em] uppercase font-black border-b pb-1 mb-2 text-white/70">
                BÜYÜT
              </span>
              <h2 class="font-serif text-lg md:text-xl italic leading-tight text-white drop-shadow-md">
                {{ item.alt }}
              </h2>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="filteredGallery.length === 0" class="text-center py-40 opacity-30 italic font-serif text-2xl">
        {{ t('gallery.empty') || 'Gösterilecek resim bulunamadı.' }}
      </div>
    </div>

    <!-- Lightbox Modal -->
    <LazyHotelLightbox
      :items="filteredGallery"
      v-model:open="isSliderOpen"
      :initial-index="selectedImgIndex"
    />

  </div>
</template>

<style scoped>
/* Kategori değişiminde animasyonlar — sadece kategori değiştiğinde çalışır */
.gallery-list-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.gallery-list-leave-active {
  transition: opacity 0.2s ease;
  position: absolute;
  visibility: hidden;
}
.gallery-list-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.gallery-list-leave-to {
  opacity: 0;
}
.gallery-list-move {
  transition: transform 0.4s ease;
}

/* Mobil: overlay her zaman görünür */
.gallery-overlay {
  opacity: 1;
}

/* Masaüstü (768px+): başlangıçta gizli, hover'da ortaya çıkar */
@media (min-width: 768px) {
  .gallery-overlay {
    opacity: 0;
  }
  .group:hover .gallery-overlay {
    opacity: 1;
  }
}
</style>
