<template>
  <NuxtLink
    :to="bookingMode ? localePath('/reservation/checkout?room=' + room.slug) : localePath(`/rooms/${room.slug}`)"
    class="group flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border bg-(--ui-bg-elevated)"
  >
    <!-- Image -->
    <div class="relative aspect-[16/10] overflow-hidden">
      <NuxtImg
        :src="room.images[0]"
        :alt="t(room.name)"
        class="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        format="webp"
        sizes="sm:100vw md:50vw lg:400px"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <!-- Size Badge -->
      <div class="absolute top-3 right-3 z-10">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm tracking-wide">
          {{ room.size }} {{ $t('rooms.size') }}
        </span>
      </div>

      <!-- Hover CTA -->
      <div class="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <span class="flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase">
          {{ $t('home.viewDetails') }}
          <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 md:p-5 flex-1 flex flex-col">
      <!-- Room Name -->
      <h2 class="text-base md:text-lg font-serif italic mb-1.5 transition-colors duration-300">
        {{ t(room.name) }}
      </h2>

      <!-- Short Description -->
      <p class="text-[11px] md:text-xs mb-3 line-clamp-2 leading-relaxed min-h-[2.5rem]">
        {{ t(room.shortDescription) }}
      </p>

      <!-- Guest, Size & Price Info -->
      <div class="flex items-end justify-between mb-3 mt-auto">
        <div class="flex flex-col gap-2 text-[10px]">
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-users" class="w-3.5 h-3.5" />
            {{ $t('rooms.maxGuests', { count: room.maxGuests }) }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-square-3-stack-3d" class="w-3.5 h-3.5" />
            {{ $t('rooms.roomSize', { size: room.size }) }}
          </span>
        </div>
        
        <div v-if="displayPrice" class="text-right">
          <p class="text-[9px] font-black uppercase tracking-widest mb-0.5">{{ $t('reservation.perNight') }}</p>
          <p class="text-lg font-bold">
            <span class="text-sm">{{ displayCurrency }}</span>{{ displayPrice }}
          </p>
          <p v-if="bookingMode && room.mealPlan" class="text-[9px] font-semibold uppercase tracking-wider mt-0.5 text-(--text-highlight)">
            {{ room.mealPlan === 'BB' ? $t('rooms.bedBreakfast') || 'Oda + Kahvaltı' : room.mealPlan }}
          </p>
        </div>
      </div>

      <!-- Amenity Chips with Icons -->
      <div class="flex flex-wrap gap-1.5 pt-3 border-t">
        <span
          v-for="amenity in room.amenities.slice(0, 5)"
          :key="amenity"
          class="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
        >
          <UIcon :name="amenityIcon(amenity)" class="w-3 h-3" />
          {{ $t(`amenityNames.${amenity}`) }}
        </span>
        <span
          v-if="room.amenities.length > 5"
          class="flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium"
        >
          +{{ room.amenities.length - 5 }}
        </span>
      </div>

      <div v-if="bookingMode" class="mt-4 pt-3 border-t">
        <div class="w-full text-center py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors bg-(--color-primary-500) text-(--text-inverse)">
          {{ $t('reservation.selectRoom') || 'Odayı Seç' }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { HotelRoom } from '~~/config/hotel.config'
import { computed, onMounted } from 'vue'

const { t } = useHotelConfig()
const localePath = useLocalePath()

const props = withDefaults(defineProps<{
  room: HotelRoom
  bookingMode?: boolean
  priority?: boolean
}>(), {
  bookingMode: false,
  priority: false
})

// Fiyatlar sadece bookingMode aktifken gösterilir (anasayfada API çağrısı yapılmaz)
const basePricesRef = props.bookingMode
  ? useReservation().basePrices
  : ref<Record<string, { price: number; currency: string }>>({})

const displayPrice = computed(() => {
  if (!props.bookingMode) return null  // Anasayfada fiyat gösterme
  if (props.room.price) return props.room.price
  const matchId = props.room.apiId || props.room.slug
  const base = basePricesRef.value[matchId]
  return base ? base.price : null
})

const displayCurrency = computed(() => {
  if (!props.bookingMode) return ''
  if (props.room.currency) return props.room.currency
  const matchId = props.room.apiId || props.room.slug
  const base = basePricesRef.value[matchId]
  return base ? base.currency : '€'
})

/** Amenity key → ikon eşleştirmesi */
const amenityIcon = (key: string): string => {
  const icons: Record<string, string> = {
    'wifi': 'i-heroicons-wifi',
    'minibar': 'i-heroicons-cube',
    'safe': 'i-heroicons-lock-closed',
    'ac': 'i-heroicons-sun',
    'tv': 'i-heroicons-tv',
    'balcony': 'i-heroicons-window',
    'sea-view': 'i-heroicons-eye',
    'garden-view': 'i-heroicons-sparkles',
    'room-service': 'i-heroicons-bell-alert',
    'jacuzzi': 'i-heroicons-fire',
    'champagne': 'i-heroicons-gift',
    'extra-bed': 'i-heroicons-moon',
  }
  return icons[key] || 'i-heroicons-check-circle'
}
</script>
