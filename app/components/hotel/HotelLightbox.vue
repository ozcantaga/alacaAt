<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  items: { src: string; alt: string; description?: string }[]
  initialIndex?: number
  room?: any
}>()

const isOpen = defineModel('open', { type: Boolean, default: false })
const currentIndex = ref(props.initialIndex || 0)

const { t, locale } = useI18n()
const { t: tRoom, config, formatHotelName } = useHotelConfig()
const localePath = useLocalePath()

watch(
  () => props.initialIndex,
  (newIndex) => {
    if (newIndex !== undefined && isOpen.value) {
      currentIndex.value = newIndex
    }
  }
)

watch(isOpen, (newVal) => {
  if (newVal && props.initialIndex !== undefined) {
    currentIndex.value = props.initialIndex
  }
  if (import.meta.client) {
    document.body.style.overflow = newVal ? 'hidden' : ''
  }
})

const next = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prev = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'Escape') isOpen.value = false
}

// ─── Touch Swipe Desteği ────────────────────────────────────────────
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)

const onTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = true
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value) return
  if (!e.changedTouches[0]) return
  isSwiping.value = false
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const diffX = touchStartX.value - touchEndX
  const diffY = touchStartY.value - touchEndY
  
  // Yatay hareket dikey hareketten büyükse swipe kabul et
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) next()   // Sola kaydır → sonraki
    else prev()              // Sağa kaydır → önceki
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

// WhatsApp link
const whatsappLink = computed(() => {
  const roomName = props.room ? tRoom(props.room.name) : ''
  const msg = roomName
    ? `Merhaba, ${roomName} odası hakkında bilgi almak istiyorum.`
    : `Merhaba, rezervasyon hakkında bilgi almak istiyorum.`
    
  if (config.social?.whatsapp) {
    const separator = config.social.whatsapp.includes('?') ? '&' : '?'
    return `${config.social.whatsapp}${separator}text=${encodeURIComponent(msg)}`
  }

  const phone = config.contact?.whatsapp?.replace(/\s/g, '') || ''
  return `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(msg)}`
})


</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex"
        role="dialog"
        aria-modal="true"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- Glass Backdrop -->
        <div class="absolute inset-0 bg-black/95 backdrop-blur-3xl" @click="isOpen = false"></div>

        <!-- Background Image (Full Screen) -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Transition name="lightbox-img" mode="out-in">
            <img
              :key="currentIndex"
              v-if="items[currentIndex]"
              :src="items[currentIndex]?.src"
              :alt="items[currentIndex]?.alt"
              class="absolute inset-0 w-full h-full object-cover md:object-contain block"
            />
          </Transition>
          <div class="absolute inset-0 z-10"></div>
          <div class="absolute inset-0 z-10"></div>
        </div>

        <!-- Close Button (Top Left) -->
        <button
          class="absolute top-4 left-4 md:top-5 md:left-5 z-50 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border group"
          aria-label="Kapat"
          @click="isOpen = false"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4 md:w-5 md:h-5 transition-colors" />
        </button>

        <!-- Navigation: Previous -->
        <button
          class="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border group hidden md:flex"
          aria-label="Önceki"
          @click.stop="prev"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 md:w-7 md:h-7 transition-colors" />
        </button>

        <!-- Navigation: Next -->
        <button
          class="absolute top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border group hidden md:flex right-5 md:right-[calc(30%+1.25rem)]"
          aria-label="Sonraki"
          @click.stop="next"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 md:w-7 md:h-7 transition-colors" />
        </button>

        <!-- Counter (Top Center on mobile, Bottom Left on desktop) -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-auto md:bottom-6 md:left-6 z-50 pointer-events-none">
          <div class="text-[10px] md:text-xs font-mono px-3 py-1 md:px-4 md:py-1.5 rounded-full backdrop-blur-md border tracking-widest bg-black/40 text-white/90">
            {{ currentIndex + 1 }} <span class="mx-0.5 opacity-40">/</span> {{ items.length }}
          </div>
        </div>

        <!-- RIGHT PANEL: Info Sidebar -->
        <div class="hidden md:flex absolute top-0 right-0 h-full w-[30%] z-40 flex-col justify-between backdrop-blur-xl border-l">

          <!-- Top: Title & Description -->
          <div class="p-10 pt-14 flex-1 overflow-y-auto">

            <!-- Room Mode -->
            <template v-if="room">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase mb-5 bg-(--ui-bg-elevated)">
                <UIcon name="i-heroicons-sparkles" class="w-3 h-3" />
                Premium
              </div>

              <h2 class="font-serif text-2xl lg:text-4xl italic leading-tight mb-4">
                {{ tRoom(room.name) }}
              </h2>

              <div class="w-10 h-[1px] opacity-50 mb-5"></div>

              <p class="leading-relaxed text-sm mb-6 text-[rgba(255,255,255,0.85)]" v-html="tRoom(room.description)">
              </p>

              <!-- Metadata -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="p-3 rounded-lg border">
                  <span class="block text-[10px] uppercase tracking-wider mb-1">Boyut</span>
                  <span class="font-medium text-sm">{{ room.size }} m²</span>
                </div>
                <div class="p-3 rounded-lg border">
                  <span class="block text-[10px] uppercase tracking-wider mb-1">Kapasite</span>
                  <span class="font-medium text-sm">{{ room.maxGuests }} Kişi</span>
                </div>
              </div>

              <!-- Amenities -->
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="amenity in room.amenities?.slice(0, 6)"
                  :key="amenity"
                  class="px-2.5 py-1 rounded-md border text-[11px]"
                >
                  {{ $t(`amenityNames.${amenity}`) || amenity }}
                </span>
              </div>
            </template>

            <!-- Gallery Mode -->
            <template v-else-if="items[currentIndex]">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase mb-5 bg-(--ui-bg-elevated)">
                <UIcon name="i-heroicons-photo" class="w-3 h-3" />
                GALERİ
              </div>

              <h2 class="font-serif text-2xl lg:text-4xl italic leading-tight mb-4" v-html="formatHotelName()">
              </h2>

              <div class="w-10 h-[1px] opacity-50 mb-5"></div>

              <h3 class="text-lg font-medium text-white mb-2" v-if="items[currentIndex]?.alt">
                {{ items[currentIndex]?.alt }}
              </h3>

              <p class="leading-relaxed text-sm text-[rgba(255,255,255,0.85)]" v-if="items[currentIndex]?.description" v-html="items[currentIndex]?.description">
              </p>
            </template>
          </div>

          <!-- Bottom: Action Buttons -->
          <div class="p-10 pt-0 space-y-3">
            <!-- Reservation -->
            <NuxtLink
              :to="localePath('/reservation')"
              class="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl bg-(--ui-bg-elevated) text-(--text-muted) hover:bg-(--color-primary-500) hover:text-(--text-inverse)"
            >
              <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
              Rezervasyon Yap
            </NuxtLink>

            <!-- WhatsApp -->
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl bg-(--ui-bg-elevated) text-(--text-muted) hover:bg-[#25D366] hover:text-white"
            >
              <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div class="flex md:hidden absolute bottom-0 left-0 right-0 z-40 flex-col p-6 pt-16 bg-gradient-to-t from-black/80 to-transparent">
          <h2 v-if="items[currentIndex]" class="font-serif text-xl italic leading-tight mb-1 text-white">
            {{ room ? tRoom(room.name) : items[currentIndex]?.alt }}
          </h2>
          <p v-if="!room && items[currentIndex]?.description" class="text-xs text-white/80 line-clamp-2 mb-2" v-html="items[currentIndex]?.description"></p>
          <p v-if="room && room.description" class="text-xs text-white/80 line-clamp-2 mb-2" v-html="tRoom(room.description)"></p>
          <div class="flex gap-2 mt-3">
            <NuxtLink
              :to="localePath('/reservation')"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 bg-(--ui-bg-elevated) text-(--text-muted) hover:bg-(--color-primary-500) hover:text-(--text-inverse)"
            >
              Rezervasyon
            </NuxtLink>
            <a
              :href="whatsappLink"
              target="_blank"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-xs tracking-wider uppercase bg-(--ui-bg-elevated) text-(--text-muted) hover:bg-[#25D366] hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Main overlay transition */
.lightbox-enter-active {
  transition: opacity 0.4s ease;
}
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* Image crossfade */
.lightbox-img-enter-active,
.lightbox-img-leave-active {
  transition: opacity 0.5s ease;
}
.lightbox-img-enter-from,
.lightbox-img-leave-to {
  opacity: 0;
}
</style>
