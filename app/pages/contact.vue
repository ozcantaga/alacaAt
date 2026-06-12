<script setup lang="ts">
const { config, t: hotelT, formatHotelName } = useHotelConfig()
const { t } = useI18n()

// SEO
useSeoMeta({
  title: () => `${t('contact.title') || 'İletişim'} | ${config.name}`,
  description: () => t('contact.subtitle') || 'Bizimle iletişime geçin',
  ogTitle: () => `${t('contact.title') || 'İletişim'} | ${config.name}`,
  ogDescription: () => t('contact.subtitle') || 'Bizimle iletişime geçin',
  ogType: 'website'
})

useHead({
  link: [{ rel: 'canonical', href: `${config.seo.siteUrl}/contact` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": config.name,
        "telephone": config.contact.phone,
        "email": config.contact.email,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": hotelT(config.contact.address),
          "addressLocality": hotelT(config.contact.city),
          "addressRegion": hotelT(config.contact.country),
          "postalCode": config.contact.postalCode,
          "addressCountry": "TR"
        }
      })
    }
  ]
})

const googleMapsLink = computed(() => {
  return `https://maps.google.com/maps?q=${config.location.lat},${config.location.lng}&z=${config.location.mapZoom}&output=embed`
})

// Performance Fix: Lazy Load Map
const mapContainer = ref<HTMLElement | null>(null)
const showMap = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      showMap.value = true
      observer.disconnect()
    }
  }, { rootMargin: '300px' })

  if (mapContainer.value) {
    observer.observe(mapContainer.value)
  }
})
</script>

<template>
  <div class="min-h-screen pt-32 md:pt-44 pb-20 dark:bg-(--color-primary-600) transition-colors duration-500">
    <div class="max-w-6xl mx-auto px-6">
      
      <header class="text-center mb-16 md:mb-24 animate-fade-in-up dark:text-(--text-inverse) transition-colors duration-500">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-6 h-px bg-current"></div>
          <span class="text-[9px] font-bold tracking-[0.5em] uppercase">{{ t('contact.badge') }}</span>
          <div class="w-6 h-px bg-current"></div>
        </div>
        <h1 class="font-serif text-4xl md:text-6xl italic leading-tight">
          {{ t('contact.titleMain') }} <br>
          <span class="">{{ t('contact.titleSub') }}</span>
        </h1>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch mb-20">
        
        <!-- Sol: İletişim Bilgileri (Tasarımınızdan) -->
        <div class="lg:col-span-5 animate-slide-in-left animate-delay-200">
          <div class="p-8 lg:p-10 rounded-[2rem] bg-(--ui-bg-elevated) shadow-sm border border-black/5  h-full flex flex-col justify-between relative overflow-hidden group">
            <address class="space-y-8 relative z-10 text-left not-italic">
              
              <div v-if="config.contact.phone" class="flex items-center gap-5 group/item">
                <div class="contact-icon-wrapper shrink-0">
                  <UIcon name="i-heroicons-phone" class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black tracking-[0.3em] mb-1 uppercase italic">{{ t('contact.phoneLabel') }}</span>
                  <a :href="`tel:${config.contact.phone}`" class="text-xl md:text-2xl italic font-serif transition-colors">
                    {{ config.contact.phone }}
                  </a>
                </div>
              </div>

              <div v-if="config.contact.email" class="flex items-center gap-5 group/item">
                <div class="contact-icon-wrapper shrink-0">
                  <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black tracking-[0.3em] mb-1 uppercase italic">{{ t('contact.emailLabel') }}</span>
                  <a :href="`mailto:${config.contact.email}`" class="text-[11px] md:text-[12px] font-bold transition-colors tracking-widest uppercase break-all">
                    {{ config.contact.email }}
                  </a>
                </div>
              </div>

              <div v-if="config.contact.address" class="flex items-start gap-5 group/item">
                <div class="contact-icon-wrapper shrink-0">
                  <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black tracking-[0.3em] mb-1 uppercase italic">{{ t('contact.addressLabel') }}</span>
                  <p class="text-[13px] font-medium italic leading-relaxed max-w-[240px] font-serif">
                    {{ hotelT(config.contact.address) }}
                    <br />
                    {{ config.contact.postalCode }} {{ hotelT(config.contact.city) }} / {{ hotelT(config.contact.country) }}
                  </p>
                </div>
              </div>

              <!-- Sosyal Medya İkonları -->
              <div class="pt-6 mt-6 border-t flex items-center gap-3 relative z-20">
                <a
                  v-if="config.social.instagram"
                  :href="config.social.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  class="social-icon-btn bg-[#E07A5F] text-(--text-inverse) hover:bg-[#C8664D] hover:scale-110 transition-all duration-300"
                >
                  <UIcon name="i-simple-icons-instagram" class="w-4 h-4" />
                </a>
                <a
                  v-if="config.social.whatsapp"
                  :href="config.social.whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  class="social-icon-btn bg-[#25D366] text-white hover:bg-[#128C7E] hover:scale-110 transition-all duration-300"
                >
                  <UIcon name="i-simple-icons-whatsapp" class="w-4 h-4" />
                </a>
                <a
                  v-if="config.social.tripadvisor"
                  :href="config.social.tripadvisor"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TripAdvisor"
                  class="social-icon-btn bg-(--color-primary-600) text-(--text-inverse) hover:bg-(--color-primary-700) hover:scale-110 transition-all duration-300"
                >
                  <UIcon name="i-simple-icons-tripadvisor" class="w-4 h-4" />
                </a>
              </div>
            </address>

            <UIcon name="i-heroicons-sparkles" class="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 w-24 h-24 md:w-48 md:h-48 -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000 opacity-[0.07]" />
          </div>
        </div>

        <!-- Sağ: İletişim Formu (Mevcut projemizdeki özellik) -->
        <div class="lg:col-span-7 animate-slide-in-right animate-delay-300">
           <div class="p-8 lg:p-10 rounded-[2rem] bg-(--ui-bg-elevated) shadow-md border border-black/5  h-full flex flex-col justify-center">
             <h2 class="text-2xl md:text-3xl font-heading font-bold mb-3">
              {{ $t('contact.form.send') }}
            </h2>
            <hr class="w-16 h-[2px] mb-8 border-none rounded" />
            
            <SharedContactForm />
          </div>
        </div>
      </div>

      <!-- Alt: Harita (Performance fixed with Lazy Loading) -->
      <div v-if="googleMapsLink" ref="mapContainer" class="w-full mt-10 animate-fade-in-up animate-delay-400">
        <div class="relative p-3 md:p-4 rounded-[2.5rem] shadow-inner bg-black/5  overflow-hidden min-h-[400px] md:min-h-[500px]">
          <iframe 
            v-if="showMap"
            :src="googleMapsLink"
            class="w-full h-[400px] md:h-[500px] rounded-[1.8rem] grayscale hover:grayscale-0 transition-all duration-1000"
            style="border:0;" 
            allowfullscreen="true" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :title="config.name + ' Google Haritalar Konumu'"
          ></iframe>
          
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div class="px-5 py-2.5 backdrop-blur-md border rounded-full shadow-lg flex items-center gap-3">
               <div class="w-2 h-2 rounded-full animate-pulse"></div>
               <span class="text-[9px] font-bold tracking-[0.3em] uppercase whitespace-nowrap" v-html="formatHotelName()"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

