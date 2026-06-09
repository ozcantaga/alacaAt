<script setup lang="ts">
import { HOTEL_GUIDE } from '~/utils/guide'

// 1. ARAÇLAR VE SEO
const { t, tm, rt, locale } = useI18n()
const localePath = useLocalePath()
const { config } = useHotelConfig()

useSeoMeta({
  title: () => `${t('guide.badge') ?? 'Rehber'} | ${config.name}`,
  description: () => t('guide.description'),
})

// 2. KATEGORİ YÖNETİMİ
const guideCategories = computed(() => {
  const keys = Object.keys(HOTEL_GUIDE)
  return [
    { id: 'all', label: locale.value === 'tr' ? 'HEPSİ' : 'ALL' },
    ...keys.map(cat => ({
      id: cat,
      label: t(`guide.categories.${cat}`) || cat
    }))
  ]
})

// 3. VERİ İŞLEME (Masonry Ritiği İçin)
const allPlaces = computed(() => {
  return Object.entries(HOTEL_GUIDE).flatMap(([catKey, items]) => {
    return items.map((item: any, idx: number) => {
      const categoryPlaces = tm(`guide.places.${catKey}`) as any[]
      const translated = Array.isArray(categoryPlaces) 
        ? categoryPlaces.find(p => rt(p.id) === item.id)
        : null

      return {
        id: item.id,
        catKey: catKey,
        image: item.image,
        title: translated ? rt(translated.title) : item.id,
        description: translated ? rt(translated.description) : '',
        link: localePath(`/guide/${item.id}`),
        heightClass: idx % 3 === 0 ? 'aspect-[3/4.2]' : 'aspect-[3/3.8]'
      }
    })
  })
})

const activeCategory = ref('all')
const enableAnimation = ref(false)
const filteredPlaces = computed(() => {
  if (activeCategory.value === 'all') return allPlaces.value
  return allPlaces.value.filter(p => p.catKey === activeCategory.value)
})
</script>

<template>
  <div class="min-h-screen pt-32 pb-20 font-sans">
    
    <SharedPageHeader
      title="guide.titleFull"
      :highlight-last-word="true"
      subtitle="guide.description"
    >
      <!-- Override title slot for custom dual-part title -->
      <template #default>
        <SharedCategoryFilter
          :categories="guideCategories"
          v-model="activeCategory"
          wrapper-class="mt-8"
          @change="enableAnimation = true"
        />
      </template>
    </SharedPageHeader>

    <div class="max-w-7xl mx-auto px-4 md:px-6">
        <TransitionGroup 
          :name="enableAnimation ? 'guide-masonry' : undefined"
          tag="div"
          class="columns-2 md:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8"
        >
          <NuxtLink
            v-for="(place, index) in filteredPlaces" 
            :key="place.id"
            :to="place.link"
            :class="[ 'group relative block overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-700 shadow-sm hover:shadow-2xl break-inside-avoid', place.heightClass ]"
          >
            <NuxtImg
              :src="place.image"
              :alt="place.title"
              sizes="xs:320px sm:400px md:400px lg:500px"
              format="webp"
              quality="50"
              :loading="index < 3 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              class="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-110"
            />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div class="absolute top-4 left-4 md:top-8 md:left-8">
              <span class="bg-(--ui-bg-elevated) text-(--text-heading) border border-black/5  shadow-sm text-[7px] md:text-[9px] font-bold px-3 py-1.5 md:px-5 md:py-2 rounded-full uppercase tracking-widest italic">
                {{ t(`guide.categories.${place.catKey}`) }}
              </span>
            </div>

            <div class="absolute inset-x-0 bottom-0 p-5 md:p-10 space-y-2 md:space-y-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h2 class="text-xl md:text-3xl font-serif italic leading-none tracking-tighter text-white">
                {{ place.title }}
              </h2>
              <p class="hidden md:block text-xs italic line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 text-(--text-inverse)">
                {{ place.description }}
              </p>
            </div>
          </NuxtLink>
        </TransitionGroup>

        <div v-if="filteredPlaces.length === 0" class="text-center py-40 opacity-30 italic font-serif text-2xl">
          {{ t('guide.empty') }}
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Guide Masonry Animasyonları */
.guide-masonry-move,
.guide-masonry-enter-active,
.guide-masonry-leave-active {
  transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1);
}
.guide-masonry-enter-from,
.guide-masonry-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.guide-masonry-leave-active {
  position: absolute;
}
</style>
