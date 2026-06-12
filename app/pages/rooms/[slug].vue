<template>
  <div v-if="room">
    <!-- Hero -->
    <LayoutAppHero
      :images="room.images"
      :title="t(room.name)"
      :show-stars="false"
      :show-cta="false"
      :show-scroll-indicator="false"
      :full-height="false"
      :auto-slide="true"
      :auto-slide-interval="5000"
    />

    <!-- Room Details -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <h1 class="flex items-center gap-3 text-3xl sm:text-4xl font-heading font-bold text-(--text-heading) mb-4">
              <UIcon 
                v-if="gemstoneStyle"
                name="i-lucide-gem" 
                class="w-8 h-8 md:w-10 md:h-10 shrink-0" 
                :class="gemstoneStyle"
              />
              {{ t(room.name) }}
            </h1>
            <hr class="divider-gold mb-6" />

            <!-- Features Badges -->
            <div class="flex flex-wrap items-center gap-3 mb-8">
              <span class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
                <UIcon name="i-heroicons-users" class="w-4 h-4" />
                {{ $t('rooms.maxGuests', { count: room.maxGuests }) }}
              </span>
              <span class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
                <UIcon name="i-heroicons-square-3-stack-3d" class="w-4 h-4" />
                {{ $t('rooms.roomSize', { size: room.size }) }}
              </span>
            </div>

            <!-- Description -->
            <p class="leading-relaxed text-lg mb-10 text-(--text-body)">
              {{ t(room.description) }}
            </p>

            <!-- Room Amenities -->
            <h2 class="text-xl font-heading font-bold text-(--text-heading) mb-6">
              {{ $t('rooms.amenities') }}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              <div
                v-for="amenity in room.amenities"
                :key="amenity"
                class="flex items-center gap-3 p-3 rounded-xl bg-black/5  border-0 shadow-inner"
              >
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-(--color-primary-500) shrink-0" />
                <span class="text-sm text-(--text-body) font-medium">{{ $t(`amenityNames.${amenity}`) }}</span>
              </div>
            </div>

            <!-- Guest Reviews -->
            <div v-if="room.reviews && room.reviews.length > 0" class="mb-12">
              <h2 class="text-xl font-heading font-bold text-(--text-heading) mb-6">
                {{ $t('rooms.guestReviews') }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(review, index) in room.reviews" 
                  :key="index"
                  class="p-5 rounded-2xl bg-(--ui-bg-elevated) shadow-sm border-0 relative"
                >
                  <div class="flex items-center gap-1 mb-3">
                    <UIcon v-for="i in review.rating" :key="i" name="i-heroicons-star-16-solid" class="w-4 h-4 text-(--color-primary-500)" />
                  </div>
                  <p class="italic text-sm leading-relaxed mb-4 text-(--text-body)">
                    "{{ t(review.text) }}"
                  </p>
                  <p class="text-sm font-semibold">
                    — {{ review.author }}
                  </p>
                  <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-8 h-8 absolute bottom-4 right-4 opacity-50" />
                </div>
              </div>
            </div>

            <!-- Image Gallery -->
            <h2 class="text-xl font-heading font-bold mb-6">
              {{ $t('home.galleryTitle') }}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="(img, idx) in room.images"
                :key="idx"
                class="img-zoom rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all"
                @click="openLightbox(idx)"
              >
                <NuxtImg
                  :src="img"
                  :alt="`${t(room.name)} - ${idx + 1}`"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  format="webp"
                  width="400"
                  height="300"
                  sizes="xs:50vw sm:50vw md:33vw lg:400px xl:500px"
                />
              </div>
            </div>

            <!-- FAQ Section -->
            <div class="mt-16" v-if="config.faq && config.faq.length > 0">
              <h2 class="text-xl font-heading font-bold text-(--text-heading) mb-6">
                {{ $t('faq.title') }}
              </h2>
              <UAccordion 
                :items="config.faq.map(item => ({ label: $t(item.question), content: $t(item.answer) }))" 
                size="lg" 
                variant="ghost"
                multiple
                class="bg-(--color-page-bg)  border-(--text-muted)/15"
              >
                <template #body="{ item }">
                  <p class="text-sm text-gray-300 bg-white leading-relaxed px-4 pb-4 pt-1  p-2 md:p-3 rounded-2xl overflow-hidden shadow-inner ">
                    {{ item.content }}
                  </p>
                </template>
              </UAccordion>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Booking Card -->
              <div class="p-6 rounded-2xl border shadow-sm">
                <h2 class="text-lg font-heading font-bold mb-4">
                  {{ $t('rooms.bookRoom') }}
                </h2>

                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between py-3 border-b">
                    <span class="text-sm">{{ $t('rooms.checkIn') }}</span>
                    <span class="text-sm font-medium">{{ config.booking.checkInTime }}</span>
                  </div>
                  <div class="flex items-center justify-between py-3 border-b">
                    <span class="text-sm">{{ $t('rooms.checkOut') }}</span>
                    <span class="text-sm font-medium">{{ config.booking.checkOutTime }}</span>
                  </div>
                  <div class="flex items-center justify-between py-3">
                    <span class="text-sm">{{ $t('rooms.priceFrom') }}</span>
                    <span class="text-lg font-bold">
                      <span class="text-sm">{{ displayCurrency }}</span>{{ displayPrice || '...' }}
                    </span>
                  </div>
                </div>

                <NuxtLink :to="localePath('/reservation/checkout?room=' + room.slug)">
                  <UButton
                    :label="$t('nav.bookNow')"
                    block
                    size="lg"
                    class="border-0"
                    trailing-icon="i-heroicons-arrow-right"
                   color="primary"/>
                </NuxtLink>

                <p class="text-xs text-center mt-3">
                  {{ $t('rooms.priceOnRequest') }}
                </p>
              </div>

              <!-- Contact Card -->
              <div class="p-6 rounded-2xl border">
                <h3 class="text-sm font-semibold mb-3">
                  {{ $t('nav.contact') }}
                </h3>
                <div class="space-y-3">
                  <a
                    :href="`tel:${config.contact.phone}`"
                    class="flex items-center gap-3 text-sm transition-colors"
                  >
                    <UIcon name="i-heroicons-phone" class="w-4 h-4" />
                    {{ config.contact.phone }}
                  </a>
                  <a
                    v-if="config.contact.whatsapp"
                    :href="`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}`"
                    target="_blank"
                    rel="noopener"
                    class="flex items-center gap-3 text-sm transition-colors"
                  >
                    <UIcon name="i-simple-icons-whatsapp" class="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    :href="`mailto:${config.contact.email}`"
                    class="flex items-center gap-3 text-sm transition-colors"
                  >
                    <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                    {{ config.contact.email }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Rooms -->
        <div class="mt-20">
          <LazySharedSectionHeading
            :title="$t('rooms.otherRooms')"
          />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LazyHotelRoomCard
              v-for="otherRoom in otherRooms"
              :key="otherRoom.slug"
              :room="otherRoom"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Room Full Screen Lightbox -->
    <LazyHotelLightbox
      v-if="lightboxItems.length > 0"
      :items="lightboxItems"
      v-model:open="isLightboxOpen"
      :initial-index="selectedImageIndex"
      :room="room"
    />
  </div>

  <!-- 404 -->
  <div v-else class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-heading font-bold mb-4">404</h1>
      <p class="mb-6">{{ $t('common.error') }}</p>
      <NuxtLink :to="localePath('/rooms')">
        <UButton :label="$t('common.goBack')" variant="outline"  color="primary"/>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()
const { config, t, getRooms } = useHotelConfig()
const localePath = useLocalePath()
const { fetchBasePrices, basePrices } = useReservation()

const gemstoneColorMap: Record<string, string> = {
  ametis: 'text-purple-500',
  florit: 'text-teal-400',
  kalsit: 'text-amber-500',
  kehribar: 'text-yellow-600',
  mercan: 'text-rose-500',
  oniks: '',
  opal: 'text-cyan-400',
  safir: 'text-blue-600',
  yakut: 'text-red-600',
  yesim: 'text-emerald-500',
  zumrut: 'text-green-600'
}

const room = computed(() => {
  const r = config.rooms.find(r => r.slug === route.params.slug)
  if (!r) throw createError({ statusCode: 404, message: 'Room not found' })
  return r
})

const gemstoneStyle = computed(() => {
  if (!room.value) return ''
  return gemstoneColorMap[room.value.slug] || ''
})

// Fetch base prices on mount
onMounted(() => {
  fetchBasePrices()
})

const displayPrice = computed(() => {
  const matchId = room.value.apiId || room.value.slug
  const base = basePrices.value[matchId]
  return base ? base.price : null
})

const displayCurrency = computed(() => {
  const matchId = room.value.apiId || room.value.slug
  const base = basePrices.value[matchId]
  return base ? base.currency : '€'
})

const otherRooms = computed(() =>
  getRooms().filter(r => r.slug !== room.value.slug).slice(0, 3)
)

// Lightbox State
const isLightboxOpen = ref(false)
const selectedImageIndex = ref(0)

const lightboxItems = computed(() => {
  if (!room.value) return []
  return room.value.images.map(img => ({
    src: img,
    alt: t(room.value!.name)
  }))
})

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  isLightboxOpen.value = true
}

// SEO
watchEffect(() => {
  if (room.value) {
    useHead({ title: t(room.value.name) })
    useSeoMeta({
      description: t(room.value.shortDescription),
      ogTitle: `${t(room.value.name)} | ${config.name}`,
      ogDescription: t(room.value.description),
      ogImage: room.value.images[0],
    })
  }
})

// Schema.org for individual room
watchEffect(() => {
  if (room.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HotelRoom',
            'name': t(room.value.name),
            'description': t(room.value.description),
            'image': room.value.images,
            'occupancy': {
              '@type': 'QuantitativeValue',
              'maxValue': room.value.maxGuests,
            },
            'floorSize': {
              '@type': 'QuantitativeValue',
              'value': room.value.size,
              'unitCode': 'MTK',
            },
          })
        }
      ]
    })
  }
})
</script>
