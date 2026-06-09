import { ref } from 'vue'

export type GuestCounts = {
  adults: number
  childrenFree: number // 0-5 yaş
  childrenDiscount: number // 6-11 yaş
  childrenAdult: number // 11+ yaş
}

export type ReservationState = {
  checkIn: string | null
  checkOut: string | null
  guests: GuestCounts
}

// Global state for base prices across the app
const basePrices = ref<Record<string, { price: number, currency: string }>>({})
const isBasePricesLoading = ref(false)

// Global state for reservation to persist across pages
const reservationState = ref<ReservationState>({
  checkIn: null,
  checkOut: null,
  guests: {
    adults: 2,
    childrenFree: 0,
    childrenDiscount: 0,
    childrenAdult: 0
  }
})

export const useReservation = () => {
  const isSearchLoading = ref(false)
  // Vue/Nuxt instance mevcutken (composable çağrıldığında) config'i al
  const { config } = useHotelConfig()
  const searchResults = ref<any[]>(config.rooms)

  // ─── Server API'den Baz Fiyatları Çek ─────────────────────────────
  const fetchBasePrices = async () => {
    if (Object.keys(basePrices.value).length > 0) return basePrices.value
    isBasePricesLoading.value = true
    try {
      const response = await $fetch('/api/rooms')
      if (response.success && response.data) {
        const priceMap: Record<string, { price: number, currency: string }> = {}
        for (const room of response.data) {
          priceMap[room.externalId] = {
            price: room.basePrice,
            currency: room.currency,
          }
        }
        basePrices.value = priceMap
      }
    } catch (e) {
      console.error('Baz fiyatlar çekilemedi', e)
    } finally {
      isBasePricesLoading.value = false
    }
    return basePrices.value
  }

  // Total calculated guests (for display)
  const totalGuests = computed(() => {
    return (
      reservationState.value.guests.adults +
      reservationState.value.guests.childrenFree +
      reservationState.value.guests.childrenDiscount +
      reservationState.value.guests.childrenAdult
    )
  })

  // ─── Server API'den Müsaitlik Sorgula ─────────────────────────────
  const searchAvailableRooms = async () => {
    if (!reservationState.value.checkIn || !reservationState.value.checkOut) {
      return []
    }

    isSearchLoading.value = true

    try {
      const totalChildren = 
        reservationState.value.guests.childrenFree + 
        reservationState.value.guests.childrenDiscount + 
        reservationState.value.guests.childrenAdult

      const response = await $fetch('/api/availability', {
        query: {
          checkIn: reservationState.value.checkIn,
          checkOut: reservationState.value.checkOut,
          adults: reservationState.value.guests.adults,
          children: totalChildren,
        }
      })

      if (response.success && response.data) {
        // Config odaları ile API sonuçlarını eşleştir
        searchResults.value = config.rooms
          .map(room => {
            const matchId = room.apiId || room.slug
            const apiRoom = response.data.find((r: any) => r.externalId === matchId)

            if (!apiRoom || !apiRoom.available) return null

            return {
              ...room,
              price: apiRoom.price,
              currency: apiRoom.currency,
              mealPlan: apiRoom.mealPlan,
              rateCode: apiRoom.rateCode,
            }
          })
          .filter(Boolean)
      }
    } catch (error) {
      console.error("Oda araması başarısız:", error)
      searchResults.value = []
    } finally {
      isSearchLoading.value = false
    }

    return searchResults.value
  }

  return {
    reservationState,
    totalGuests,
    isSearchLoading,
    searchResults,
    searchAvailableRooms,
    basePrices,
    isBasePricesLoading,
    fetchBasePrices
  }
}
