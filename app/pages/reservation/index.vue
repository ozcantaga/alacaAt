<script setup lang="ts">
import { onMounted } from 'vue'
import { useReservation } from '~/composables/useReservation'
import { CalendarDate, parseDate } from '@internationalized/date'

const { reservationState, totalGuests, searchAvailableRooms, searchResults, isSearchLoading, fetchBasePrices } = useReservation()
const { t } = useI18n()
const { config } = useHotelConfig()

useSeoMeta({
  title: () => `Rezervasyon | ${config.name}`,
  description: () => `Müsait odalarımızı listeleyin ve ${config.name} kalitesiyle rezervasyonunuzu tamamlayın.`,
})

onMounted(() => {
  fetchBasePrices()
})

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  try {
    const d = parseDate(dateStr)
    return `${d.day}.${d.month}.${d.year}`
  } catch (e) {
    return dateStr
  }
}

import { 
  RangeCalendarRoot, RangeCalendarGrid, RangeCalendarCell, RangeCalendarCellTrigger, 
  RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, 
  RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, 
} from 'reka-ui'
import { today, getLocalTimeZone } from '@internationalized/date'
import { ref, computed, watch } from 'vue'

const dateRange = ref<any>({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone()).add({ days: 2 })
})
const calendarPlaceholder = ref<any>(today(getLocalTimeZone()))

// Update global state when date picker changes
watch(dateRange, (newRange) => {
  if (newRange?.start) {
    reservationState.value.checkIn = newRange.start.toString()
  }
  if (newRange?.end) {
    reservationState.value.checkOut = newRange.end.toString()
  }
}, { deep: true })

const formattedDate = computed(() => {
  if (!dateRange.value?.start) return t('reservation.selectCheckIn')
  const startStr = `${dateRange.value.start.day}.${dateRange.value.start.month}.${dateRange.value.start.year}`
  if (!dateRange.value?.end) return `${startStr} - ${t('reservation.selectCheckOut')}`
  const endStr = `${dateRange.value.end.day}.${dateRange.value.end.month}.${dateRange.value.end.year}`
  return `${startStr} - ${endStr}`
})

const updateGuest = (type: keyof typeof reservationState.value.guests, delta: number) => {
  const current = reservationState.value.guests[type]
  if (current + delta < 0) return
  if (type === 'adults' && current + delta < 1) return
  reservationState.value.guests[type] += delta
}

const triggerSearch = () => {
  searchAvailableRooms()
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-40 font-sans">
    
    <SharedPageHeader
      badge="nav.bookNow"
      title="reservation.title"
    />

    <div class="max-w-7xl mx-auto px-4 md:px-6">
      
            <!-- Interactive Editor -->
      <div class="rounded-3xl shadow-xl border p-3 md:p-4 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-(--ui-bg-elevated)">
        
        <!-- DATE PICKER -->
        <UPopover mode="click" class="w-full md:w-auto flex-1">
          <button type="button" class="flex items-center gap-3 p-3 md:p-4 rounded-2xl cursor-pointer transition-colors w-full border bg-(--ui-bg-elevated)">
            <div class="w-10 h-10 rounded-full shadow-sm flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-[10px] font-bold uppercase tracking-widest mb-0.5">{{ t('reservation.dateRange') }}</p>
              <p class="text-sm font-semibold">{{ formattedDate }}</p>
            </div>
          </button>
          
          <template #content>
            <div class="p-4 rounded-3xl shadow-xl border min-w-[320px] bg-(--ui-bg-elevated)">
              <RangeCalendarRoot 
                v-model="dateRange" 
                v-model:placeholder="calendarPlaceholder"
                :locale="t('nav.bookNow') === 'Book Now' ? 'en-US' : 'tr-TR'"
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
          <button type="button" class="flex items-center gap-3 p-3 md:p-4 rounded-2xl cursor-pointer transition-colors w-full border bg-(--ui-bg-elevated)">
            <div class="w-10 h-10 rounded-full shadow-sm flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-users" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-[10px] font-bold uppercase tracking-widest mb-0.5">{{ t('reservation.guests') }}</p>
              <p class="text-sm font-semibold">{{ totalGuests }} {{ t('reservation.person') }}</p>
            </div>
          </button>

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

        <!-- SEARCH BUTTON -->
        <button 
          @click="triggerSearch"
          class="w-full md:w-auto shrink-0 h-14 px-8 rounded-2xl font-bold tracking-widest uppercase text-sm shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 bg-(--color-primary-500) text-(--text-inverse) hover:bg-(--color-primary-600) hover:text-white"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
          {{ t('nav.bookNow') || 'Ara' }}
        </button>

      </div>

      <!-- Sonuçlar -->
      <div>
        <div v-if="isSearchLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Skeleton Loading -->
          <div v-for="i in 3" :key="i" class="rounded-3xl p-4 shadow-sm border animate-pulse bg-(--ui-bg-elevated)">
            <div class="w-full aspect-[4/3] rounded-2xl mb-4"></div>
            <div class="h-6 rounded w-2/3 mb-2"></div>
            <div class="h-4 rounded w-1/2 mb-6"></div>
            <div class="flex justify-between items-center">
              <div class="h-8 rounded w-1/3"></div>
              <div class="h-10 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="searchResults.length === 0" class="text-center py-20 rounded-3xl border shadow-sm bg-(--ui-bg-elevated)">
          <UIcon name="i-heroicons-face-frown" class="w-16 h-16 mx-auto mb-4" />
          <h3 class="font-serif italic text-3xl mb-2">{{ t('reservation.notFound') }}</h3>
          <p class="">{{ t('reservation.notFoundDesc') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HotelRoomCard
            v-for="(room, index) in searchResults"
            :key="room.slug"
            :room="room"
            :booking-mode="true"
            :priority="index === 0"
          />
        </div>
      </div>

    </div>
  </div>
</template>
