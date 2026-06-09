<script setup lang="ts">
import { HOTEL_GUIDE } from '~/utils/guide'

// 1. ARAÇLAR
const { t, tm, rt, locale } = useI18n()
const route = useRoute()
const { config, formatHotelName } = useHotelConfig()
const localePath = useLocalePath()
const colorMode = useColorMode()

const businessName = config.name || 'AlacaAtolye Alaçatı'
const siteUrl = 'https://alacaathotel.com.tr'

// 2. STATE (Slider Kontrolü İçin)
const isSliderOpen = ref(false)
const selectedImgIndex = ref(0)

// 3. VERİ BULMA VE BİRLEŞTİRME
const place = computed(() => {
  const itemId = String(route.params.id || '').toLowerCase().trim()
  
  let foundRaw = null
  let categoryKey = ''

  for (const [catKey, items] of Object.entries(HOTEL_GUIDE)) {
    const match = items.find((i: any) => i.id === itemId)
    if (match) {
      foundRaw = match
      categoryKey = catKey
      break
    }
  }

  if (!foundRaw) return null

  const i18nItems = tm(`guide.places.${categoryKey}`) as any[]
  const translated = Array.isArray(i18nItems) 
    ? i18nItems.find((i: any) => String(rt(i.id)).toLowerCase().trim() === itemId) 
    : null

  // Albüm verisini HotelLightbox'ın beklediği formata çeviriyoruz
  const formattedAlbum = foundRaw.album?.map((img: string, idx: number) => ({
    id: `guide-${idx}`,
    src: img,
    alt: translated?.title ? rt(translated.title) : foundRaw.id,
    technicalCategory: categoryKey
  })) || []

  return {
    ...foundRaw,
    catKey: categoryKey,
    catLabel: t(`guide.categories.${categoryKey}`),
    title: translated?.title ? rt(translated.title) : foundRaw.id,
    description: translated?.description ? rt(translated.description) : '',
    details: translated?.details ? rt(translated.details) : '',
    location: translated?.location ? rt(translated.location) : 'Alaçatı',
    distance: translated?.distance ? rt(translated.distance) : '-',
    best_time: translated?.best_time ? rt(translated.best_time) : '-',
    visitor_tip: translated?.visitor_tip ? rt(translated.visitor_tip) : null,
    features: translated?.features ? translated.features.map((f: any) => rt(f)) : [],
    formattedAlbum // Slider için hazırlandı
  }
})

// 4. Slider Fonksiyonu
const openAlbum = (index: number) => {
  selectedImgIndex.value = index
  isSliderOpen.value = true
}

// 5. HAVA DURUMU & SEO
const placeIdRef = computed(() => String(route.params.id || ''))
const { finalWeather, coordinates } = useLiveWeather(placeIdRef)

watchEffect(() => {
  if (place.value) {
    const p = place.value
    const pageTitle = `${p.title} | ${businessName}`
    const imageUrl = p.image.startsWith('http') ? p.image : `${siteUrl}${p.image}`

    useSeoMeta({
      title: pageTitle,
      description: p.description,
      ogImage: imageUrl,
    })
  }
})
</script>

<template>
  <div class="min-h-screen pb-20 font-sans">
    
    <div v-if="place">
      <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <NuxtImg :src="place.image" :alt="place.title" sizes="xs:640px sm:768px md:1024px lg:1280px" fetchpriority="high" format="webp" quality="80" class="w-full h-full object-cover animate-slow-zoom opacity-80" loading="eager" />
          <div class="absolute inset-0"></div>
        </div>
        <div class="relative z-10 text-center px-6">
          <NuxtLink :to="localePath('/guide')" class="inline-flex items-center gap-2 mb-8 group backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-white transition-all duration-500">
             <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
             <span class="text-[10px] font-bold uppercase tracking-widest">{{ t('guide.detail.back') }}</span>
          </NuxtLink>
          <h1 class="font-serif text-5xl md:text-8xl lg:text-9xl italic leading-none tracking-tighter drop-shadow-2xl max-w-5xl mx-auto" style="color: white !important;">
            {{ place.title }}
          </h1>
          <p class="font-serif text-2xl md:text-3xl italic mt-6" style="color: rgba(255,255,255,0.85) !important;">{{ place.location }}</p>
        </div>
      </section>

      <div class="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div class="rounded-3xl shadow-2xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 border bg-(--ui-bg-elevated)">
          <div class="text-center md:border-r flex flex-col justify-center">
            <span class="text-[9px] font-black uppercase tracking-widest mb-2 italic">Mesafe</span>
            <p class="font-serif italic text-2xl">{{ place.distance }}</p>
          </div>
          <div class="text-center md:border-r flex flex-col justify-center">
            <span class="text-[9px] font-black uppercase tracking-widest mb-2 italic">En İyi Zaman</span>
            <p class="font-serif italic text-2xl">{{ place.best_time }}</p>
          </div>
          <ClientOnly>
            <div class="text-center md:border-r flex flex-col justify-center">
              <span class="text-[9px] font-black uppercase tracking-widest mb-2">Hava Durumu</span>
              <div class="flex items-center justify-center gap-2">
                 <UIcon :name="finalWeather.icon" class="w-6 h-6" />
                 <p class="font-serif italic text-2xl">{{ finalWeather.temp }}°C</p>
              </div>
            </div>
            <div class="text-center flex flex-col justify-center">
              <span class="text-[9px] font-black uppercase tracking-widest mb-2">Rüzgar</span>
              <p class="font-serif italic text-2xl">{{ finalWeather.wind }} <small class="text-[10px]">KM/H</small></p>
            </div>
          </ClientOnly>
        </div>
      </div>

      <section class="py-24 max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          <div class="lg:col-span-7 space-y-16">
            <div class="space-y-10">
              <blockquote class="text-3xl md:text-5xl font-light leading-snug font-serif italic border-l-4 pl-8 md:pl-12">
                "{{ place.description }}"
              </blockquote>
              <p v-if="place.details" class="text-lg font-sans leading-relaxed whitespace-pre-line pt-4">
                {{ place.details }}
              </p>
            </div>
            <div v-if="place.visitor_tip" class="p-10 rounded-3xl border relative overflow-hidden group bg-(--ui-bg-elevated)">

              <div class="relative z-10">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] block mb-4 italic"><span v-html="formatHotelName()"></span> {{ locale === 'tr' ? 'Tavsiyesi' : 'Tip' }}</span>
                <p class="italic font-serif text-2xl leading-relaxed">{{ place.visitor_tip }}</p>
              </div>
            </div>
          </div>

          <aside class="lg:col-span-5 space-y-10">
            
            <div v-if="place.formattedAlbum?.length" class="p-8 md:p-10 rounded-3xl shadow-sm border bg-(--ui-bg-elevated)">
               <div class="flex items-center justify-between mb-8 border-b pb-5">
                  <p class="text-[9px] font-bold uppercase tracking-[0.2em]">{{ locale === 'tr' ? 'Keşif Albümü' : 'Discovery Album' }}</p>
                  <span class="font-serif italic text-lg">{{ place.formattedAlbum.length }} {{ locale === 'tr' ? 'Kare' : 'Photos' }}</span>
               </div>
               
               <div class="grid grid-cols-3 gap-3">
                  <div 
                    v-for="(img, index) in place.formattedAlbum.slice(0, 6)" 
                    :key="index"
                    class="relative aspect-square overflow-hidden rounded-xl cursor-pointer group border"
                    @click="openAlbum(index)"
                  >
                    <NuxtImg 
                      :src="img.src" 
                      :alt="img.alt"
                      width="200"
                      height="200"
                      format="webp"
                      quality="70"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="xs:150px sm:200px md:200px"
                    />
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <UIcon name="i-heroicons-magnifying-glass-plus" class="w-6 h-6" />
                    </div>
                  </div>
               </div>
               
               <p v-if="place.formattedAlbum.length > 6" class="text-center text-[10px] italic mt-5">
                 +{{ place.formattedAlbum.length - 6 }} {{ locale === 'tr' ? "resim daha galeride" : "more photos in gallery" }}
               </p>
            </div>
            
            <div v-if="place.features?.length" class="p-10 rounded-3xl shadow-sm border bg-(--ui-bg-elevated)">
               <div class="flex flex-wrap gap-3">
                  <span v-for="feat in place.features" :key="feat" 
                        class="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border guide-tag">
                    # {{ feat }}
                  </span>
               </div>
            </div>

            <a 
              v-if="coordinates"
              :href="`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`" 
              target="_blank" 
              class="flex flex-col items-center justify-center gap-6 w-full py-16 shadow-2xl transition-all duration-700 group bg-(--ui-bg-elevated) rounded-3xl border"
            >
              <UIcon name="i-heroicons-map" class="w-12 h-12 transition-colors" />
              <span class="text-[12px] font-bold uppercase tracking-[0.4em] block">{{ t('guide.detail.get_directions') }}</span>
            </a>
          </aside>
        </div>
      </section>
    </div>

    <div v-else class="h-screen flex items-center justify-center text-center px-6">
      <NuxtLink :to="localePath('/guide')" class="px-6 py-3 rounded-lg font-bold tracking-widest uppercase text-xs transition-colors">
        {{ t('guide.return_all') }}
      </NuxtLink>
    </div>

    <!-- Mevcut HotelLightbox bileşeni tembel yükleme (lazy load) ile kullanılıyor -->
    <LazyHotelLightbox
      v-if="place?.formattedAlbum?.length"
      :items="place.formattedAlbum"
      v-model:open="isSliderOpen"
      :initial-index="selectedImgIndex"
    />

  </div>
</template>

<style scoped>
.animate-slow-zoom { animation: slowZoom 60s linear infinite alternate; }
@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.2); } }
</style>

<style>
/* Global style to ensure dark mode targets the tag correctly regardless of scoped attributes */
.guide-tag {
  color: var(--color-primary-500, #1b4965) !important;
  background-color: color-mix(in srgb, var(--color-primary-500, #1b4965) 10%, transparent) !important;
  border-color: color-mix(in srgb, var(--color-primary-500, #1b4965) 20%, transparent) !important;
}

html.dark .guide-tag,
html.dark-mode .guide-tag,
body.dark .guide-tag,
body.dark-mode .guide-tag,
body.theme-dark .guide-tag,
.dark .guide-tag,
.dark-mode .guide-tag,
.theme-dark .guide-tag {
  color: var(--ui-text-inverted, #ffffff) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
