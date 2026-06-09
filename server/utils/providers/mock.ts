import type { HotelProvider, ProviderRoom, AvailabilityParams, AvailabilityResult, BookingParams, BookingResult } from './types'

// =============================================================================
// 🧪 MOCK PROVIDER — Gerçek API gelene kadar örnek verilerle çalışır
// =============================================================================

/** Oda bazında base fiyatlar (hotel.config.ts slug'ları ile eşleşir) */
const MOCK_ROOMS: Record<string, { name: string; basePrice: number }> = {
  'ametis':   { name: 'Deluxe Oda (Ametis)',   basePrice: 250 },
  'florit':   { name: 'Deluxe Oda (Florit)',   basePrice: 500 },
  'kalsit':   { name: 'Deluxe Oda (Kalsit)',   basePrice: 280 },
  'kehribar': { name: 'Standart Oda (Kehribar)', basePrice: 300 },
  'mercan':   { name: 'Standart Oda (Mercan)',  basePrice: 270 },
  'oniks':    { name: 'Deluxe Oda (Oniks)',    basePrice: 240 },
  'opal':     { name: 'Deluxe Oda (Opal)',     basePrice: 310 },
  'safir':    { name: 'Deluxe Oda (Safir)',    basePrice: 350 },
  'yakut':    { name: 'Deluxe Oda (Yakut)',    basePrice: 400 },
  'yesim':    { name: 'Deluxe Oda (Yeşim)',    basePrice: 220 },
  'zumrut':   { name: 'Deluxe Oda (Zümrüt)',   basePrice: 450 },
}

export class MockProvider implements HotelProvider {
  readonly name = 'mock'

  async getRooms(): Promise<ProviderRoom[]> {
    // Gerçek API gecikmesini simüle et
    await new Promise(r => setTimeout(r, 200))

    return Object.entries(MOCK_ROOMS).map(([id, data]) => ({
      externalId: id,
      name: data.name,
      basePrice: data.basePrice,
      currency: '€',
      available: true,
    }))
  }

  async checkAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]> {
    await new Promise(r => setTimeout(r, 300))

    const checkInDate = new Date(params.checkIn)
    const isWeekend = checkInDate.getDay() === 0 || checkInDate.getDay() === 6
    const month = checkInDate.getMonth()
    const isSummer = month >= 5 && month <= 7

    // Dinamik fiyat çarpanı
    let multiplier = 1
    if (isWeekend) multiplier += 0.2
    if (isSummer) multiplier += 0.5
    if (params.adults > 2) multiplier += (params.adults - 2) * 0.1

    // Deterministik müsaitlik (tarih bazlı)
    const dayIndex = Math.floor(checkInDate.getTime() / 86400000)

    let idx = 0
    return Object.entries(MOCK_ROOMS).map(([id, data]) => {
      const pseudoRandom = (dayIndex + idx * 7) % 10
      idx++
      return {
        externalId: id,
        price: Math.round(data.basePrice * multiplier),
        currency: '€',
        available: pseudoRandom > 2, // %70 müsait
        mealPlan: 'BB', // Bed & Breakfast
        rateName: 'Standart Fiyat',
      }
    })
  }

  async createBooking(params: BookingParams): Promise<BookingResult> {
    await new Promise(r => setTimeout(r, 500))

    // Mock onay kodu üret
    const code = `ALT-${Date.now().toString(36).toUpperCase()}`

    return {
      success: true,
      confirmationCode: code,
      reservationId: `mock-${code}`,
      message: `Rezervasyonunuz başarıyla oluşturuldu. Onay kodu: ${code}`,
    }
  }
}
