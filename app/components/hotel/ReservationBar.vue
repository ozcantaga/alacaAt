<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useReservation } from '~/composables/useReservation'
import { 
  RangeCalendarRoot, RangeCalendarGrid, RangeCalendarCell, RangeCalendarCellTrigger, 
  RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, 
  RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading,
  DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogClose, DialogDescription
} from 'reka-ui'
import type { DateRange } from 'reka-ui'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'

const { reservationState, totalGuests } = useReservation()
const localePath = useLocalePath()
const router = useRouter()
const { t, locale } = useI18n()

// --- SCROLL & ROUTE LOGIC ---
const isShrunken = ref(true)
const isManuallyExpanded = ref(false)
const isMobileModalOpen = ref(false)
const isMobile = ref(false)
const route = useRoute()

// Sayfa değiştiğinde mobil modal'ı kapat (Reka UI Dialog DOM'da kalıntı bırakıyor)
watch(() => route.fullPath, () => {
  isMobileModalOpen.value = false
})

const isHomePage = computed(() => {
  const path = route.path.replace(/^\/(en|tr)(\/|$)/, '/')
  return path === '/' || path === ''
})

const updateMobile = () => {
  if (import.meta.client) isMobile.value = window.innerWidth < 768
}

// Başlangıç durumunu ayarla
watchEffect(() => {
  if (isManuallyExpanded.value) return
  const scrollY = import.meta.client ? window.scrollY : 0
  if (isHomePage.value && scrollY <= 100 && !isMobile.value) {
    isShrunken.value = false
  } else {
    isShrunken.value = true
  }
})

let expandScrollY = 0

const handleScroll = () => {
  if (!import.meta.client) return
  const currentScrollY = window.scrollY
  
  if (isManuallyExpanded.value) {
    // Kullanıcı tıklayıp açtıktan sonra 50px'den fazla kaydırırsa tekrar küçült
    if (Math.abs(currentScrollY - expandScrollY) > 50) {
      isManuallyExpanded.value = false
      if (!isHomePage.value || currentScrollY > 100 || isMobile.value) {
        isShrunken.value = true
      }
    }
    return
  }
  
  if (isHomePage.value && !isMobile.value) {
    if (currentScrollY > 100) {
      isShrunken.value = true
    } else {
      isShrunken.value = false
    }
  } else {
    isShrunken.value = true
  }
}

const expandBar = () => {
  if (isMobile.value) {
    isMobileModalOpen.value = true
    return
  }
  isShrunken.value = false
  isManuallyExpanded.value = true
  expandScrollY = import.meta.client ? window.scrollY : 0
}

onMounted(() => {
  // Tarihleri client tarafında başlat — server timezone (UTC) ile client timezone farkından kaçın
  dateRange.value = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 2 })
  }
  calendarPlaceholder.value = today(getLocalTimeZone())

  window.addEventListener('scroll', handleScroll, { passive: true })
  updateMobile()
  window.addEventListener('resize', updateMobile, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateMobile)
})

// --- DATE LOGIC ---
// today() SSR'da server timezone (UTC) kullanıyor, client ise yerel saati (UTC+3) kullanıyor.
// Bu farklılık hydration mismatch'e yol açıyor. null başlatıp onMounted'da set etmek gerekli.
const dateRange = ref<any>(null)
const calendarPlaceholder = ref<any>(null)

// Update global state when date picker changes
watch(dateRange, (newRange) => {
  if (newRange?.start) {
    reservationState.value.checkIn = newRange.start.toString()
  }
  if (newRange?.end) {
    reservationState.value.checkOut = newRange.end.toString()
  }
}, { deep: true, immediate: true })

const formattedDate = computed(() => {
  if (!dateRange.value?.start) return t('reservation.selectCheckIn')
  const startStr = `${dateRange.value.start.day}.${dateRange.value.start.month}.${dateRange.value.start.year}`
  if (!dateRange.value?.end) return `${startStr} - ${t('reservation.selectCheckOut')}`
  const endStr = `${dateRange.value.end.day}.${dateRange.value.end.month}.${dateRange.value.end.year}`
  return `${startStr} - ${endStr}`
})

// --- GUEST LOGIC ---
const updateGuest = (type: keyof typeof reservationState.value.guests, delta: number) => {
  const current = reservationState.value.guests[type]
  if (current + delta < 0) return
  if (type === 'adults' && current + delta < 1) return // En az 1 yetişkin olmalı
  reservationState.value.guests[type] += delta
}

const navigateToReservation = () => {
  router.push(localePath('/reservation'))
}
</script>

<template>
  <aside aria-label="Rezervasyon Barı" class="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-4 md:pb-6 px-4 pointer-events-none">
    <div class="relative w-full max-w-5xl flex justify-center items-end h-[80px]">
      
      <!-- SHRINKEN BUTTON -->
      <Transition name="fade-slide-up">
        <div 
          v-if="isShrunken" 
          class="absolute bottom-0 pointer-events-auto flex items-center gap-3 p-2 rounded-full shadow-2xl cursor-pointer transition-colors border bg-(--ui-bg-elevated) text-(--text-heading)"
          @click="expandBar"
        >
          <div class="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-inner bg-(--text-highlight) text-white">
            <UIcon name="i-heroicons-tag" class="w-3 h-3" />
            {{ t('reservation.discountBadge') }}
          </div>
          <div class="font-bold text-sm px-4 flex items-center gap-2">
            {{ t('nav.bookNow') || 'Rezervasyon Yap' }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </div>
      </Transition>

      <!-- EXPANDED BAR (Desktop Sadece) -->
      <Transition name="fade-slide-down">
        <div 
          v-if="!isShrunken && !isMobile" 
          class="absolute bottom-0 pointer-events-auto bg-(--color-page-bg) backdrop-blur-xl border rounded-3xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 w-full transition-all duration-500 origin-bottom"

      >
        
        <!-- DATE PICKER (Reka UI Popover via Nuxt UI UPopover for simplicity) -->
        <UPopover mode="click" class="w-full md:w-auto flex-1">
          <div class="flex items-center gap-3 p-3 md:p-4 rounded-2xl cursor-pointer transition-colors w-full border bg-(--ui-bg-elevated)">
            <div class="w-10 h-10 rounded-full shadow-sm flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-[10px] font-bold uppercase tracking-widest mb-0.5">{{ t('reservation.dateRange') }}</p>
              <p class="text-sm font-semibold">{{ formattedDate }}</p>
            </div>
          </div>
          
          <template #content>
            <div class="p-4 rounded-3xl shadow-xl border min-w-[320px] bg-(--ui-bg-elevated)">
              <RangeCalendarRoot 
                v-model="dateRange" 
                v-model:placeholder="calendarPlaceholder"
                :locale="locale === 'tr' ? 'tr-TR' : 'en-US'"
                :fixed-weeks="true"
                class="w-full" 
                v-slot="{ grid, weekDays }"
              >
                <RangeCalendarHeader class="flex items-center justify-between mb-4">
                  <button type="button" @click="calendarPlaceholder = calendarPlaceholder.subtract({ months: 1 })" class="p-2 rounded-lg transition-colors cursor-pointer">
                    <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 pointer-events-none" />
                  </button>
                  <RangeCalendarHeading class="font-bold" />
                  <button type="button" @click="calendarPlaceholder = calendarPlaceholder.add({ months: 1 })" class="p-2 rounded-lg transition-colors cursor-pointer">
                    <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 pointer-events-none" />
                  </button>
                </RangeCalendarHeader>

                <div class="flex gap-4">
                  <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()">
                    <RangeCalendarGridHead>
                      <RangeCalendarGridRow class="flex w-full mb-2">
                        <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-10 text-[10px] font-bold text-center uppercase">
                          {{ day }}
                        </RangeCalendarHeadCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridHead>
                    <RangeCalendarGridBody>
                      <RangeCalendarGridRow v-for="(week, weekIdx) in month.rows" :key="weekIdx" class="flex w-full">
                        <RangeCalendarCell 
                          v-for="(day, dayIdx) in week" 
                          :key="dayIdx" 
                          :date="day"
                          class="w-10 h-10 p-0 text-sm focus-within:z-20 relative"
                        >
                          <RangeCalendarCellTrigger 
                            :day="day" 
                            :month="month.value" 
                            class="w-full h-full flex items-center justify-center rounded-lg cursor-pointer transition-colors data-[today]:font-bold data-[unavailable]:line-through data-[selected]:bg-(--text-highlight) data-[selected]:text-white hover:bg-black/5"
                          >
                            {{ day.day }}
                          </RangeCalendarCellTrigger>
                        </RangeCalendarCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridBody>
                  </RangeCalendarGrid>
                </div>
              </RangeCalendarRoot>
            </div>
          </template>
        </UPopover>

        <div class="hidden md:block w-[1px] h-12 shrink-0"></div>

        <!-- GUEST PICKER -->
        <UPopover mode="click" class="w-full md:w-auto flex-1">
          <div class="flex items-center gap-3 p-3 md:p-4 rounded-2xl cursor-pointer transition-colors w-full border bg-(--ui-bg-elevated)">
            <div class="w-10 h-10 rounded-full shadow-sm flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-users" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-[10px] font-bold uppercase tracking-widest mb-0.5">{{ t('reservation.guests') }}</p>
              <p class="text-sm font-semibold">{{ totalGuests }} {{ t('reservation.person') }}</p>
            </div>
          </div>

          <template #content>
            <div class="p-6 w-80 space-y-6 rounded-3xl shadow-xl border bg-(--ui-bg-elevated)">
              
              <!-- Yetişkin -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold">{{ t('reservation.adult') }}</p>
                  <p class="text-[10px] uppercase tracking-wider">{{ t('reservation.adultDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button type="button" @click="updateGuest('adults', -1)" class="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50" :disabled="reservationState.guests.adults <= 1">-</button>
                  <span class="w-4 text-center font-bold">{{ reservationState.guests.adults }}</span>
                  <button type="button" @click="updateGuest('adults', 1)" class="w-8 h-8 flex items-center justify-center rounded-full">+</button>
                </div>
              </div>

              <div class="h-[1px] w-full"></div>

              <!-- Çocuk (0-5) -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold">{{ t('reservation.child') }}</p>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">{{ t('reservation.free') }}</span>
                  </div>
                  <p class="text-[10px] uppercase tracking-wider">{{ t('reservation.childFreeDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button type="button" @click="updateGuest('childrenFree', -1)" class="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50" :disabled="reservationState.guests.childrenFree <= 0">-</button>
                  <span class="w-4 text-center font-bold">{{ reservationState.guests.childrenFree }}</span>
                  <button type="button" @click="updateGuest('childrenFree', 1)" class="w-8 h-8 flex items-center justify-center rounded-full">+</button>
                </div>
              </div>

              <!-- Çocuk (6-11) -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold">{{ t('reservation.child') }}</p>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">{{ t('reservation.discount') }}</span>
                  </div>
                  <p class="text-[10px] uppercase tracking-wider">{{ t('reservation.childDiscountDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button type="button" @click="updateGuest('childrenDiscount', -1)" class="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50" :disabled="reservationState.guests.childrenDiscount <= 0">-</button>
                  <span class="w-4 text-center font-bold">{{ reservationState.guests.childrenDiscount }}</span>
                  <button type="button" @click="updateGuest('childrenDiscount', 1)" class="w-8 h-8 flex items-center justify-center rounded-full">+</button>
                </div>
              </div>

            </div>
          </template>
        </UPopover>

        <!-- BOOK NOW BUTTON -->
        <button 
          @click="navigateToReservation"
          class="w-full md:w-auto shrink-0 h-14 px-8 rounded-2xl font-bold tracking-widest uppercase text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group bg-(--color-primary-500) text-(--text-inverse)"
        >
          <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <div class="flex items-center justify-center gap-3">
            {{ t('nav.bookNow') || 'Rezervasyon Yap' }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>
    </Transition>
    </div>

    <!-- MOBILE FULL SCREEN MODAL -->
    <DialogRoot v-model:open="isMobileModalOpen">
      <DialogPortal>
        <DialogOverlay class="md:hidden fixed inset-0 z-[190] mobile-dialog-overlay" />
        <DialogContent 
          class="md:hidden fixed bottom-0 left-0 w-full z-[200] shadow-2xl border-t flex flex-col font-sans mobile-dialog-content bg-(--ui-bg-elevated)"
          style="top: auto; height: calc(100vh - 80px);"
        >
        <!-- Header -->
        <div class="flex items-center justify-between p-2 border-b shrink-0">
          <DialogTitle class="text-sm font-bold font-serif italic">{{ t('nav.bookNow') || 'Rezervasyon Yap' }}</DialogTitle>
          <DialogDescription class="sr-only">{{ t('reservation.selectDates') || 'Tarih ve misafir seçimi yapın' }}</DialogDescription>
          <DialogClose as-child>
            <button type="button" class="p-1 rounded-full">
              <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
            </button>
          </DialogClose>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-3 py-1 space-y-2 pb-12">
          
          <!-- DATE PICKER SECTION -->
          <div class="space-y-1">
            <div class="flex items-center gap-1.5">
               <div class="w-5 h-5 rounded-full flex items-center justify-center">
                 <UIcon name="i-heroicons-calendar-days" class="w-3 h-3" />
               </div>
               <p class="font-bold uppercase tracking-widest text-[9px]">{{ t('reservation.dateRange') }}</p>
            </div>
            
            <RangeCalendarRoot 
              v-model="dateRange" 
              v-model:placeholder="calendarPlaceholder"
              :locale="locale === 'tr' ? 'tr-TR' : 'en-US'"
              :fixed-weeks="true"
              class="w-full mx-auto max-w-[260px]" 
              v-slot="{ grid, weekDays }"
            >
              <RangeCalendarHeader class="flex items-center justify-between mb-2">
                <button type="button" @click="calendarPlaceholder = calendarPlaceholder.subtract({ months: 1 })" class="p-1 rounded transition-colors cursor-pointer">
                  <UIcon name="i-heroicons-chevron-left" class="w-4 h-4 pointer-events-none" />
                </button>
                <RangeCalendarHeading class="text-xs font-bold" />
                <button type="button" @click="calendarPlaceholder = calendarPlaceholder.add({ months: 1 })" class="p-1 rounded transition-colors cursor-pointer">
                  <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 pointer-events-none" />
                </button>
              </RangeCalendarHeader>

              <div class="flex flex-col gap-1">
                <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full">
                  <RangeCalendarGridHead>
                    <RangeCalendarGridRow class="flex w-full justify-between mb-1">
                      <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-8 text-[9px] font-bold text-center uppercase">
                        {{ day }}
                      </RangeCalendarHeadCell>
                    </RangeCalendarGridRow>
                  </RangeCalendarGridHead>
                  <RangeCalendarGridBody>
                    <RangeCalendarGridRow v-for="(week, weekIdx) in month.rows" :key="weekIdx" class="flex w-full justify-between mb-0.5">
                      <RangeCalendarCell 
                        v-for="(day, dayIdx) in week" 
                        :key="dayIdx" 
                        :date="day"
                        class="w-8 h-8 p-0 text-[10px] focus-within:z-20 relative flex items-center justify-center"
                      >
                        <RangeCalendarCellTrigger 
                          :day="day" 
                          :month="month.value" 
                          class="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-colors data-[today]:font-bold data-[unavailable]:line-through data-[selected]:bg-(--text-highlight) data-[selected]:text-white hover:bg-black/5"
                        >
                          {{ day.day }}
                        </RangeCalendarCellTrigger>
                      </RangeCalendarCell>
                    </RangeCalendarGridRow>
                  </RangeCalendarGridBody>
                </RangeCalendarGrid>
              </div>
            </RangeCalendarRoot>
          </div>

          <hr class="" />

          <!-- GUEST PICKER SECTION -->
          <div class="space-y-1.5">
            <div class="flex items-center gap-1.5">
               <div class="w-5 h-5 rounded-full flex items-center justify-center">
                 <UIcon name="i-heroicons-users" class="w-3 h-3" />
               </div>
               <p class="font-bold uppercase tracking-widest text-[9px]">{{ t('reservation.guests') }}</p>
            </div>
            
            <div class="space-y-2">
              <!-- Yetişkin -->
              <div class="flex items-center justify-between">
                <p class="text-xs font-bold">{{ t('reservation.adult') }}</p>
                <div class="flex items-center gap-2">
                  <button type="button" @click="updateGuest('adults', -1)" class="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-50 text-xs" :disabled="reservationState.guests.adults <= 1">-</button>
                  <span class="w-4 text-center font-bold text-xs">{{ reservationState.guests.adults }}</span>
                  <button type="button" @click="updateGuest('adults', 1)" class="w-6 h-6 flex items-center justify-center rounded-full text-xs">+</button>
                </div>
              </div>

              <!-- Çocuk (0-5) -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                  <p class="text-xs font-bold">{{ t('reservation.child') }}</p>
                  <span class="text-[9px]">(0-5)</span>
                  <span class="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">{{ t('reservation.free') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" @click="updateGuest('childrenFree', -1)" class="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-50 text-xs" :disabled="reservationState.guests.childrenFree <= 0">-</button>
                  <span class="w-4 text-center font-bold text-xs">{{ reservationState.guests.childrenFree }}</span>
                  <button type="button" @click="updateGuest('childrenFree', 1)" class="w-6 h-6 flex items-center justify-center rounded-full text-xs">+</button>
                </div>
              </div>

              <!-- Çocuk (6-11) -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                  <p class="text-xs font-bold">{{ t('reservation.child') }}</p>
                  <span class="text-[9px]">(6-11)</span>
                  <span class="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">{{ t('reservation.discount') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" @click="updateGuest('childrenDiscount', -1)" class="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-50 text-xs" :disabled="reservationState.guests.childrenDiscount <= 0">-</button>
                  <span class="w-4 text-center font-bold text-xs">{{ reservationState.guests.childrenDiscount }}</span>
                  <button type="button" @click="updateGuest('childrenDiscount', 1)" class="w-6 h-6 flex items-center justify-center rounded-full text-xs">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Button -->
        <div class="p-2 border-t shrink-0">
           <button 
             type="button"
             @click="navigateToReservation(); isMobileModalOpen = false"
             class="w-full h-10 rounded-lg font-bold tracking-widest uppercase text-[10px] shadow-lg transition-all"
           >
             {{ t('nav.bookNow') || 'Rezervasyon Yap' }}
           </button>
        </div>
      </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </aside>
</template>

<style scoped>
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Mobile Modal Slide Animation for Reka UI Dialog */
.mobile-dialog-content[data-state="open"] {
  animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
.mobile-dialog-content[data-state="closed"] {
  animation: slideDown 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.mobile-dialog-overlay[data-state="open"] {
  animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
.mobile-dialog-overlay[data-state="closed"] {
  animation: fadeOut 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes slideDown {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

</style>
