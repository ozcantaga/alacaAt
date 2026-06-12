<template>
  <div data-allow-mismatch>

    <!-- Hero Section -->
    <LayoutAppHero
      :show-stars="true"
      :show-cta="true"
      :full-height="true"
      :cta-link="localePath('/rooms')"
      :secondary-cta-link="'whatsapp'"
    >
      <template #title>
        <span v-if="$te('hero.title_1')">{{ $t('hero.title_1') }}</span>
        <span v-else v-html="formatHotelName()"></span>
      </template>
      <template #subtitle>
        {{ $te('hero.title_2') ? $t('hero.title_2') : t(config.tagline) }}
      </template>
      <template #description>
        {{ $te('hero.subtitle') ? $t('hero.subtitle') : '' }}
      </template>
    </LayoutAppHero>

    <!-- Welcome Section -->
    <section id="welcome" class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Text Content -->
          <div class="animate-slide-in-left">
            <span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              {{ $t('home.welcomeTitle') }}
            </span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              {{ t(config.tagline) }}
            </h2>
            <hr class="divider-primary mb-6" />
            <p class="leading-relaxed mb-6 text-lg">
              {{ t(config.description) }}
            </p>
            <div class="flex items-center gap-4">
              <div class="star-rating text-base">
                <span v-for="s in getStarsArray()" :key="s">★</span>
              </div>
              <span class="text-sm">
                {{ config.stars }} {{ $t('common.stars') }}
              </span>
            </div>
          </div>

          <!-- Image Grid -->
          <div class="grid grid-cols-2 gap-4 animate-slide-in-right">
            <div class="space-y-4">
              <div class="img-zoom rounded-2xl overflow-hidden aspect-[3/4]">
                <NuxtImg
                  :src="config.gallery[5]?.src || config.images.hero[0]"
                  :alt="config.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  quality="50"
                  format="webp"
                  width="400"
                  height="533"
                  sizes="xs:300px sm:400px md:400px lg:400px"
                />
              </div>
            </div>
            <div class="space-y-4 mt-8">
              <div class="img-zoom rounded-2xl overflow-hidden aspect-[3/4]">
                <NuxtImg
                  :src="config.gallery[3]?.src || config.images.hero[1]"
                  :alt="config.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  quality="50"
                  format="webp"
                  width="400"
                  height="533"
                  sizes="xs:300px sm:400px md:400px lg:400px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rooms Section -->
    <section id="rooms" class="py-12 md:py-16 relative">
      <div class="max-w-[1440px] mx-auto px-6 relative z-10">
        <!-- Luxury Heading -->
        <div class="flex flex-col items-center text-center mb-16">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-px"></div>
            <span class="tracking-[0.4em] uppercase text-[10px] font-bold italic">
              {{ $t('home.featuredRoomsSubtitle') || 'KONAKLAMA' }}
            </span>
            <div class="w-12 h-px"></div>
          </div>
          <h2 class="font-serif text-4xl md:text-5xl font-light leading-tight">
            {{ $t('home.featuredRooms') || 'Özel Odalarımız' }}
          </h2>
        </div>

        <LazyBaseSlider
          :items="featuredRooms"
          :hideArrows="false"
          itemClass="w-[85vw] sm:w-[380px] md:w-[420px]"
          spacingClass="gap-6 md:gap-10 pb-8 pt-4"
          paddingOffset="0.5rem"
        >
          <template #default="{ item: room }">
            <HotelRoomCard
              :room="room"
              class="h-full"
            />
          </template>
        </LazyBaseSlider>

        <!-- View All Button -->
        <div class="text-center mt-16 flex justify-center">
          <NuxtLink
            :to="localePath('/rooms')"
            class="px-10 py-4 border rounded-full transition-all duration-500 tracking-widest text-xs uppercase font-bold group flex items-center justify-center gap-3 bg-(--ui-bg-elevated)"
          >
            {{ $t('home.viewAll') || 'TÜM ODALARI İNCELE' }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Amenities Section -->
    <section id="amenities" class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LazySharedSectionHeading
          :title="$t('home.amenities')"
          :subtitle="$t('home.amenitiesSubtitle')"
        />
        <LazyHotelAmenityGrid :amenities="getAmenities()" />
      </div>
    </section>

    <!-- Gallery Preview Section -->
    <section id="gallery-preview" class="py-12 md:py-16 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div class="max-w-[1440px] mx-auto px-6 relative z-10">
        <!-- Luxury Heading -->
        <div class="flex flex-col items-center text-center mb-16">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-px"></div>
            <span class="tracking-[0.4em] uppercase text-[10px] font-bold italic">
              {{ $t('home.gallerySubtitle') || 'ATMOSFER' }}
            </span>
            <div class="w-12 h-px"></div>
          </div>
          <h2 class="font-serif text-4xl md:text-5xl font-light leading-tight">
            {{ $t('home.galleryTitle') || 'Eşsiz Bir Deneyim' }}
          </h2>
        </div>

        <LazyHotelGallerySection
          :items="config.gallery"
          :show-filters="false"
          :limit="5"
          compact
        />

        <!-- View All Button -->
        <div class="text-center mt-16 flex justify-center">
          <NuxtLink
            :to="localePath('/gallery')"
            class="px-10 py-4 border rounded-full transition-all duration-500 tracking-widest text-xs uppercase font-bold group flex items-center justify-center gap-3"
          >
            {{ $t('home.viewAll') || 'TÜM GALERİYİ İNCELE' }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <LazyHotelTestimonialCard id="testimonials" />

    <!-- Location Section -->
    <section id="location" class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LazySharedSectionHeading
          :title="$t('home.locationTitle')"
          :subtitle="$t('home.locationSubtitle')"
        />
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Info Cards -->
          <div class="space-y-4">
            <div class="p-5 rounded-xl shadow-inner bg-black/5 ">
              <div class="flex items-center gap-3 mb-2">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                <span class="font-semibold text-sm">{{ $t('contact.info.address') }}</span>
              </div>
              <p class="text-sm pl-8">{{ getFullAddress() }}</p>
            </div>
            <div class="p-5 rounded-xl shadow-inner bg-black/5 ">
              <div class="flex items-center gap-3 mb-2">
                <UIcon name="i-heroicons-phone" class="w-5 h-5" />
                <span class="font-semibold text-sm">{{ $t('contact.info.phone') }}</span>
              </div>
              <a :href="`tel:${config.contact.phone}`" class="text-sm pl-8 transition-colors">
                {{ config.contact.phone }}
              </a>
            </div>
            <div class="p-5 rounded-xl shadow-inner bg-black/5 ">
              <div class="flex items-center gap-3 mb-2">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                <span class="font-semibold text-sm">{{ $t('contact.info.email') }}</span>
              </div>
              <a :href="`mailto:${config.contact.email}`" class="text-sm pl-8 transition-colors">
                {{ config.contact.email }}
              </a>
            </div>
          </div>
          <!-- Map -->
          <div class="lg:col-span-2">
            <LazyHotelLocationMap height="350" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="relative py-12 md:py-16 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0">
        <NuxtImg
          :src="config.images.hero[config.images.hero.length - 1]"
          :alt="config.name"
          class="w-full h-full object-cover"
          loading="lazy"
          quality="50"
          format="webp"
          width="1920"
          height="1080"
          sizes="xs:640px sm:768px md:1024px lg:1280px xl:1536px"
        />
        <div class="absolute inset-0 bg-black/60" />
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 text-(--text-inverse)">
          {{ $t('home.ctaTitle') }}
        </h2>
        <hr class="divider-primary mx-auto mb-6" />
        <p class="text-lg mb-10 max-w-xl mx-auto text-(--text-inverse)">
          {{ $t('home.ctaSubtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton
            :to="localePath('/reservation')"
            :label="$t('nav.bookNow')"
            size="xl"
            class="border-0 px-10 py-3 text-lg shadow-xl"
            trailing-icon="i-heroicons-arrow-right"
           color="primary"/>
          <UButton
            :to="localePath('/contact')"
            :label="$t('nav.contact')"
            size="xl"
            variant="outline"
            class="px-10 py-3 text-lg"
           color="primary"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { config, t, getStarsArray, getAmenities, getTestimonials, getFullAddress, formatHotelName } = useHotelConfig()
const { locale } = useI18n()
const localePath = useLocalePath()

// Show first 6 rooms on home page for the slider
const featuredRooms = computed(() => config.rooms.slice(0, 6))

// Page SEO
useHead({
  title: config.name,
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Alacaat Otel",
        "url": "https://www.alacathote.com.tr/",
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Odalarımız",
            "description": "Alaçatı butik otel odaları ve süitleri. Havuz manzaralı, şömineli, lüks konaklama seçenekleri.",
            "url": "https://www.alacathote.com.tr/rooms"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Hakkımızda",
            "description": "Alacaat Butik Otel'in hikayesi, Alaçatı'daki konumumuz ve sunduğumuz özel deneyimler.",
            "url": "https://www.alacathote.com.tr/about"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Keşfet (Rehber)",
            "description": "Alaçatı'da gezilecek yerler, plajlar, restoranlar ve Alaçatı sörf okulları.",
            "url": "https://www.alacathote.com.tr/guide"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "İletişim",
            "description": "Alacaat Butik Otel iletişim bilgileri, adres, telefon ve harita konumu.",
            "url": "https://www.alacathote.com.tr/contact"
          }
        ]
      })
    }
  ]
})

useSeoMeta({
  title: config.name,
  description: t(config.seo.defaultDescription),
  ogTitle: config.name,
  ogDescription: t(config.seo.defaultDescription),
  ogImage: config.seo.ogImage,
  ogType: 'website',
})
</script>
