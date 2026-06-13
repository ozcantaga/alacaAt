import type { HotelProvider, ProviderRoom, AvailabilityParams, AvailabilityResult, BookingParams, BookingResult } from './types'

// =============================================================================
// 🔌 ELEKTRAWEB PROVIDER — Channel Manager API Entegrasyonu
// =============================================================================
// Dokümantasyon: https://developer.elektraweb.com
//
// API anahtarı geldiğinde nuxt.config.ts'de şu ayarları yapın:
//   runtimeConfig: {
//     hotelProvider: 'elektraweb',
//     elektraweb: {
//       apiKey: 'YOUR_API_KEY',
//       baseUrl: 'https://api.elektraweb.com',
//       hotelId: 'YOUR_HOTEL_ID',
//       paymentBaseUrl: 'https://YOUR_HOTEL.elektraweb.com', // Ödeme sayfası base URL
//     }
//   }
//
// Simülasyon Modu:
//   apiKey boş bırakılırsa provider otomatik olarak SIM moduna geçer.
//   SIM modu, ElektraWeb'in gerçek response formatını birebir taklit eder.
//   Bunu .env'de aktifleştirmek için:
//     HOTEL_PROVIDER=elektraweb
//     ELEKTRAWEB_API_KEY=   ← boş bırak → SIM modu
// =============================================================================

// ─── Simülasyon Veri Seti (ElektraWeb gerçek oda ID formatı) ─────────────────
// ElektraWeb genellikle integer ya da kısa string ID kullanır
const EW_SIM_ROOMS: Record<string, {
  room_id: string
  room_name: string
  room_type: string
  base_rate: number
  currency: string
  capacity: number
  is_active: boolean
}> = {
  'ametis':   { room_id: 'ametis',   room_name: 'Deluxe Oda - Ametis',    room_type: 'DELUXE',   base_rate: 250, currency: 'EUR', capacity: 2, is_active: true },
  'florit':   { room_id: 'florit',   room_name: 'Deluxe Oda - Florit',    room_type: 'SUITE',    base_rate: 500, currency: 'EUR', capacity: 2, is_active: true },
  'kalsit':   { room_id: 'kalsit',   room_name: 'Deluxe Oda - Kalsit',    room_type: 'DELUXE',   base_rate: 280, currency: 'EUR', capacity: 3, is_active: true },
  'kehribar': { room_id: 'kehribar', room_name: 'Standart Oda - Kehribar', room_type: 'STANDARD', base_rate: 300, currency: 'EUR', capacity: 2, is_active: true },
  'mercan':   { room_id: 'mercan',   room_name: 'Standart Oda - Mercan',   room_type: 'STANDARD', base_rate: 270, currency: 'EUR', capacity: 2, is_active: true },
  'oniks':    { room_id: 'oniks',    room_name: 'Deluxe Oda - Oniks',     room_type: 'DELUXE',   base_rate: 240, currency: 'EUR', capacity: 2, is_active: true },
  'opal':     { room_id: 'opal',     room_name: 'Deluxe Oda - Opal',      room_type: 'DELUXE',   base_rate: 310, currency: 'EUR', capacity: 2, is_active: true },
  'safir':    { room_id: 'safir',    room_name: 'Deluxe Oda - Safir',     room_type: 'DELUXE',   base_rate: 350, currency: 'EUR', capacity: 2, is_active: true },
  'yakut':    { room_id: 'yakut',    room_name: 'Deluxe Oda - Yakut',     room_type: 'PREMIUM',  base_rate: 400, currency: 'EUR', capacity: 3, is_active: true },
  'yesim':    { room_id: 'yesim',    room_name: 'Deluxe Oda - Yeşim',     room_type: 'DELUXE',   base_rate: 220, currency: 'EUR', capacity: 2, is_active: true },
  'zumrut':   { room_id: 'zumrut',   room_name: 'Deluxe Oda - Zümrüt',    room_type: 'PREMIUM',  base_rate: 450, currency: 'EUR', capacity: 4, is_active: true },
}

// ElektraWeb'in tanımladığı meal plan kodları
const EW_MEAL_PLANS = ['BB', 'HB', 'FB', 'AI']

// ElektraWeb rate plan'ları (gerçek formatta)
const EW_RATE_PLANS = [
  { rate_plan_id: 'EW-STD-001', rate_plan_name: 'Standart Fiyat',   discount_pct: 0 },
  { rate_plan_id: 'EW-ERL-001', rate_plan_name: 'Erken Rezervasyon', discount_pct: 15 },
  { rate_plan_id: 'EW-NRF-001', rate_plan_name: 'İade Edilmez',      discount_pct: 20 },
]

/** ElektraWeb API'nin gerçek cancel policy formatı */
function ewCancelPolicy(checkIn: string, ratePlanId: string): string {
  const checkInDate = new Date(checkIn)
  const deadline = new Date(checkInDate)
  deadline.setDate(deadline.getDate() - 3)
  const fmt = deadline.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  if (ratePlanId.includes('NRF')) return 'İade edilmez - Tüm ödemeler kesilir.'
  return `${fmt} tarihine kadar ücretsiz iptal. Sonrasında 1 gece ücret alınır.`
}

// =============================================================================

export class ElektraWebProvider implements HotelProvider {
  readonly name = 'elektraweb'
  private apiKey: string
  private baseUrl: string
  private hotelId: string
  private paymentBaseUrl: string
  private isSimMode: boolean

  constructor(config: { elektraweb: { apiKey: string; baseUrl: string; hotelId: string; paymentBaseUrl?: string } }) {
    this.apiKey = config.elektraweb.apiKey
    this.baseUrl = config.elektraweb.baseUrl
    this.hotelId = config.elektraweb.hotelId
    this.paymentBaseUrl = config.elektraweb.paymentBaseUrl || `https://booking.elektraweb.com/${this.hotelId}`

    // API anahtarı yoksa SIM moduna geç
    this.isSimMode = !this.apiKey || this.apiKey.trim() === ''

    if (this.isSimMode) {
      console.log('[ElektraWeb] ⚡ SIM MODU AKTİF — Gerçek API anahtarı bulunmadı, simüle ediliyor.')
    }
  }

  // ─── getRooms ─────────────────────────────────────────────────────────────
  async getRooms(): Promise<ProviderRoom[]> {
    if (this.isSimMode) {
      // SIM: ElektraWeb API gecikmesini simüle et (~150-400ms)
      await new Promise(r => setTimeout(r, 150 + Math.random() * 250))
      console.log('[ElektraWeb SIM] GET /v1/hotels/{id}/rooms → 200 OK (simüle)')

      return Object.values(EW_SIM_ROOMS).map(r => ({
        externalId: r.room_id,
        name: r.room_name,
        basePrice: r.base_rate,
        currency: r.currency,
        available: r.is_active,
      }))
    }

    // CANLI: Gerçek ElektraWeb API çağrısı
    const res = await $fetch(`${this.baseUrl}/v1/hotels/${this.hotelId}/rooms`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    }) as any
    return res.rooms.map((r: any) => ({
      externalId: r.room_id,
      name: r.room_name,
      basePrice: r.base_rate,
      currency: r.currency || 'EUR',
      available: r.is_active,
    }))
  }

  // ─── checkAvailability ────────────────────────────────────────────────────
  async checkAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]> {
    if (this.isSimMode) {
      // SIM: Gerçekçi gecikme
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400))
      console.log(`[ElektraWeb SIM] GET /v1/hotels/{id}/availability?check_in=${params.checkIn}&check_out=${params.checkOut}&adults=${params.adults} → 200 OK (simüle)`)

      const checkInDate = new Date(params.checkIn)
      const checkOutDate = new Date(params.checkOut)
      const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000))

      const dayOfWeek = checkInDate.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6
      const month = checkInDate.getMonth()
      const isSummer = month >= 5 && month <= 7     // Haziran–Ağustos
      const isHighSeason = month >= 4 && month <= 8  // Mayıs–Eylül

      // Fiyat katsayısı (ElektraWeb dinamik fiyatlamayı simüle eder)
      let rateMultiplier = 1.0
      if (isWeekend)    rateMultiplier += 0.15
      if (isSummer)     rateMultiplier += 0.55
      else if (isHighSeason) rateMultiplier += 0.25
      if (params.adults > 2) rateMultiplier += (params.adults - 2) * 0.12

      // Belirleyici müsaitlik (tarih + oda kombinasyonuna göre)
      const seed = Math.floor(checkInDate.getTime() / 86400000)

      const results: AvailabilityResult[] = []
      let idx = 0

      for (const [slug, room] of Object.entries(EW_SIM_ROOMS)) {
        // %75 müsaitlik oranı (ElektraWeb tipik davranışı)
        const pseudoRnd = (seed * 31 + idx * 17 + 7) % 100
        const available = pseudoRnd < 75

        // Rate plan seç (erken rezervasyon bonusu simüle et)
        const daysUntilCheckIn = Math.max(0, Math.round((checkInDate.getTime() - Date.now()) / 86400000))
        const stdPlan    = EW_RATE_PLANS[0] ?? { rate_plan_id: 'EW-STD-001', rate_plan_name: 'Standart Fiyat',    discount_pct: 0  }
        const earlyPlan  = EW_RATE_PLANS[1] ?? stdPlan
        const nrfPlan    = EW_RATE_PLANS[2] ?? stdPlan
        let ratePlan = stdPlan
        if (daysUntilCheckIn >= 30) ratePlan = earlyPlan  // Erken rezervasyon
        if (pseudoRnd > 80)          ratePlan = nrfPlan    // İade edilmez

        const nightlyRate = Math.round(room.base_rate * rateMultiplier * (1 - ratePlan.discount_pct / 100))
        const totalRate = nightlyRate * nights

        // Meal plan (Haziran–Ağustos BB, diğerleri BB/HB karışık)
        const mealPlan = isSummer ? 'BB' : EW_MEAL_PLANS[idx % 2]

        results.push({
          externalId: slug,
          price: nightlyRate,
          totalPrice: totalRate,
          currency: room.currency,
          available,
          rateCode: ratePlan.rate_plan_id,
          rateName: ratePlan.rate_plan_name,
          mealPlan,
          cancellationPolicy: ewCancelPolicy(params.checkIn, ratePlan.rate_plan_id),
        })

        idx++
      }

      return results
    }

    // CANLI: Gerçek ElektraWeb API çağrısı
    const res = await $fetch(`${this.baseUrl}/v1/hotels/${this.hotelId}/availability`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      query: {
        check_in: params.checkIn,
        check_out: params.checkOut,
        adults: params.adults,
        children: params.children,
      }
    }) as any

    const checkOutDate = new Date(params.checkOut)
    const nights = Math.max(1, Math.round((checkOutDate.getTime() - new Date(params.checkIn).getTime()) / 86400000))

    return res.rooms.map((r: any) => ({
      externalId: r.room_id,
      price: r.rate,
      totalPrice: r.rate * nights,
      currency: r.currency || 'EUR',
      available: r.available > 0,
      rateCode: r.rate_plan_id,
      rateName: r.rate_plan_name,
      mealPlan: r.meal_plan,
      cancellationPolicy: r.cancellation_policy,
    }))
  }

  // ─── createBooking ───────────────────────────────────────────────────────────────────────────
  async createBooking(params: BookingParams): Promise<BookingResult> {
    // ─── Kanal bilgisi (her zaman site URL'i) ────────────────────────────────
    const channel = params.bookingChannel || 'alacaathotel.com.tr'

    if (this.isSimMode) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400))

      // Gerçekçi ElektraWeb booking response formatını simüle et
      const ewBookingId   = `EW${Date.now().toString(36).toUpperCase()}`
      const confirmCode   = `EWB-${ewBookingId}`
      const bookingStatus = 'CONFIRMED'   // ElektraWeb: CONFIRMED | PENDING | CANCELLED

      console.log(`\n[ElektraWeb SIM] ┌───────────────────────────────────────────────────────────────`)
      console.log(`[ElektraWeb SIM] │ POST /v1/hotels/${this.hotelId}/bookings`)
      console.log(`[ElektraWeb SIM] │ Yanıt: 201 Created`)
      console.log(`[ElektraWeb SIM] │ booking_id         : ${ewBookingId}`)
      console.log(`[ElektraWeb SIM] │ confirmation_code  : ${confirmCode}`)
      console.log(`[ElektraWeb SIM] │ booking_status     : ${bookingStatus}  ✅ ONAYLANDI`)
      console.log(`[ElektraWeb SIM] │ booking_channel    : ${channel}  🌐 Kanal kaydı`)
      console.log(`[ElektraWeb SIM] │ booking_source_url : https://${channel}/reservation/checkout`)
      console.log(`[ElektraWeb SIM] │ room_id            : ${params.roomExternalId}`)
      console.log(`[ElektraWeb SIM] │ check_in           : ${params.checkIn}`)
      console.log(`[ElektraWeb SIM] │ check_out          : ${params.checkOut}`)
      console.log(`[ElektraWeb SIM] │ guest              : ${params.guest.firstName} ${params.guest.lastName}`)
      console.log(`[ElektraWeb SIM] └───────────────────────────────────────────────────────────────\n`)

      return {
        success: true,
        confirmationCode: confirmCode,
        reservationId: ewBookingId,
        bookingStatus,
        channelRecorded: true,
        paymentUrl: `${this.paymentBaseUrl}/payment/${ewBookingId}?lang=tr`,
        message: `Rezervasyonunuz ElektraWeb sistemine iletildi. Kanal: ${channel} | Onay: ${confirmCode} | Durum: ${bookingStatus}`,
      }
    }

    // CANLI: Gerçek ElektraWeb rezervasyonu + kanal bilgisi
    const res = await $fetch(`${this.baseUrl}/v1/hotels/${this.hotelId}/bookings`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: {
        room_id: params.roomExternalId,
        check_in: params.checkIn,
        check_out: params.checkOut,
        guest: {
          first_name: params.guest.firstName,
          last_name:  params.guest.lastName,
          email:      params.guest.email,
          phone:      params.guest.phone,
          country:    params.guest.country,
          notes:      params.guest.note,
        },
        adults:   params.adults,
        children: params.children,
        rate_plan_id: params.rateCode,
        // ElektraWeb kanal izleme — hangi siteden geldi?
        booking_channel:    channel,
        booking_source_url: `https://${channel}/reservation/checkout`,
        booking_source:     'DIRECT_WEBSITE',
      }
    }) as any

    const bookingId = res.booking_id?.toString()

    return {
      success: true,
      confirmationCode: res.confirmation_code,
      reservationId: bookingId,
      paymentUrl: bookingId
        ? `${this.paymentBaseUrl}/payment/${bookingId}?lang=tr`
        : undefined,
      message: res.message,
    }
  }
}
