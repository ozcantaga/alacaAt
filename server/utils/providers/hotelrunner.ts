import type { HotelProvider, ProviderRoom, AvailabilityParams, AvailabilityResult, BookingParams, BookingResult } from './types'

// =============================================================================
// 🔌 HOTELRUNNER PROVIDER — Channel Manager API Entegrasyonu
// =============================================================================
// Dokümantasyon: https://app.hotelrunner.com/api/docs
//
// API anahtarı geldiğinde nuxt.config.ts'de şu ayarları yapın:
//   runtimeConfig: {
//     hotelProvider: 'hotelrunner',
//     hotelrunner: {
//       apiKey: 'YOUR_API_KEY',
//       token: 'YOUR_HR_TOKEN',
//       hotelId: 'YOUR_HOTEL_ID',
//       appKey: 'YOUR_APP_KEY',   // Ödeme URL'i için (book.hotelrunner.com/{appKey})
//     }
//   }
// =============================================================================

export class HotelRunnerProvider implements HotelProvider {
  readonly name = 'hotelrunner'
  private apiKey: string
  private token: string
  private hotelId: string
  private appKey: string
  private baseUrl = 'https://app.hotelrunner.com/api/v2'
  private paymentBaseUrl = 'https://book.hotelrunner.com'

  constructor(config: { hotelrunner: { apiKey: string; token: string; hotelId: string; appKey?: string } }) {
    this.apiKey = config.hotelrunner.apiKey
    this.token = config.hotelrunner.token
    this.hotelId = config.hotelrunner.hotelId
    this.appKey = config.hotelrunner.appKey || config.hotelrunner.hotelId
  }

  async getRooms(): Promise<ProviderRoom[]> {
    // TODO: HotelRunner API'den oda listesini çek
    // const res = await $fetch(`${this.baseUrl}/apps/rooms`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.token}`,
    //     'HR-API-Key': this.apiKey,
    //   }
    // })
    // return res.rooms.map(r => ({
    //   externalId: r.id.toString(),
    //   name: r.name,
    //   basePrice: r.default_price,
    //   currency: r.currency || 'TRY',
    //   available: r.active,
    // }))
    throw new Error('HotelRunner provider henüz yapılandırılmadı. API anahtarını ekleyin.')
  }

  async checkAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]> {
    // TODO: HotelRunner müsaitlik sorgusu
    // const res = await $fetch(`${this.baseUrl}/apps/availability`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.token}`,
    //     'HR-API-Key': this.apiKey,
    //   },
    //   query: {
    //     checkin_date: params.checkIn,
    //     checkout_date: params.checkOut,
    //     adults: params.adults,
    //     children: params.children,
    //   }
    // })
    // return res.results.map(r => ({
    //   externalId: r.room_id.toString(),
    //   price: r.price,
    //   totalPrice: r.total_price,
    //   currency: r.currency || 'TRY',
    //   available: r.availability > 0,
    //   rateCode: r.rate_plan_id?.toString(),
    //   rateName: r.rate_plan_name,
    //   mealPlan: r.meal_plan,
    //   cancellationPolicy: r.cancellation_policy,
    // }))
    throw new Error('HotelRunner provider henüz yapılandırılmadı.')
  }

  async createBooking(params: BookingParams): Promise<BookingResult> {
    // TODO: HotelRunner rezervasyon oluşturma
    // const res = await $fetch(`${this.baseUrl}/apps/reservations`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.token}`,
    //     'HR-API-Key': this.apiKey,
    //   },
    //   body: {
    //     room_id: params.roomExternalId,
    //     checkin_date: params.checkIn,
    //     checkout_date: params.checkOut,
    //     rate_plan_id: params.rateCode,
    //     guest: {
    //       first_name: params.guest.firstName,
    //       last_name: params.guest.lastName,
    //       email: params.guest.email,
    //       phone: params.guest.phone,
    //       country: params.guest.country,
    //       notes: params.guest.note,
    //     },
    //     adults: params.adults,
    //     children: params.children,
    //   }
    // })
    //
    // const reservationId = res.reservation_id?.toString()
    //
    // return {
    //   success: res.status === 'confirmed' || res.status === 'pending',
    //   confirmationCode: res.confirmation_number,
    //   reservationId,
    //   // HotelRunner ödeme sayfası — Kart verisi HotelRunner'da işlenir, sitemizde değil
    //   paymentUrl: reservationId
    //     ? `${this.paymentBaseUrl}/${this.appKey}/reservations/${reservationId}/payment`
    //     : undefined,
    //   message: res.message,
    // }
    throw new Error('HotelRunner provider henüz yapılandırılmadı.')
  }
}

