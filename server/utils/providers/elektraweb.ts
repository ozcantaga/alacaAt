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
// =============================================================================

export class ElektraWebProvider implements HotelProvider {
  readonly name = 'elektraweb'
  private apiKey: string
  private baseUrl: string
  private hotelId: string
  private paymentBaseUrl: string

  constructor(config: { elektraweb: { apiKey: string; baseUrl: string; hotelId: string; paymentBaseUrl?: string } }) {
    this.apiKey = config.elektraweb.apiKey
    this.baseUrl = config.elektraweb.baseUrl
    this.hotelId = config.elektraweb.hotelId
    this.paymentBaseUrl = config.elektraweb.paymentBaseUrl || `https://booking.elektraweb.com/${this.hotelId}`
  }

  async getRooms(): Promise<ProviderRoom[]> {
    // TODO: ElektraWeb API'den oda listesini çek
    // const res = await $fetch(`${this.baseUrl}/v1/hotels/${this.hotelId}/rooms`, {
    //   headers: { 'Authorization': `Bearer ${this.apiKey}` }
    // })
    // return res.rooms.map(r => ({
    //   externalId: r.room_id,
    //   name: r.room_name,
    //   basePrice: r.base_rate,
    //   currency: r.currency || 'EUR',
    //   available: r.is_active,
    // }))
    throw new Error('ElektraWeb provider henüz yapılandırılmadı. API anahtarını ekleyin.')
  }

  async checkAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]> {
    // TODO: ElektraWeb müsaitlik sorgusu
    // const res = await $fetch(`${this.baseUrl}/v1/hotels/${this.hotelId}/availability`, {
    //   headers: { 'Authorization': `Bearer ${this.apiKey}` },
    //   query: {
    //     check_in: params.checkIn,
    //     check_out: params.checkOut,
    //     adults: params.adults,
    //     children: params.children,
    //   }
    // })
    // return res.rooms.map(r => ({
    //   externalId: r.room_id,
    //   price: r.rate,
    //   currency: r.currency || 'EUR',
    //   available: r.available > 0,
    //   mealPlan: r.meal_plan,
    //   cancellationPolicy: r.cancellation_policy,
    // }))
    throw new Error('ElektraWeb provider henüz yapılandırılmadı.')
  }

  async createBooking(params: BookingParams): Promise<BookingResult> {
    // TODO: ElektraWeb rezervasyon oluşturma
    // const res = await $fetch(`${this.baseUrl}/v1/hotels/${this.hotelId}/bookings`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${this.apiKey}` },
    //   body: {
    //     room_id: params.roomExternalId,
    //     check_in: params.checkIn,
    //     check_out: params.checkOut,
    //     guest: params.guest,
    //     adults: params.adults,
    //     children: params.children,
    //   }
    // })
    //
    // const bookingId = res.booking_id?.toString()
    //
    // return {
    //   success: true,
    //   confirmationCode: res.confirmation_code,
    //   reservationId: bookingId,
    //   // ElektraWeb ödeme sayfası — Kart verisi ElektraWeb'de işlenir, sitemizde değil
    //   paymentUrl: bookingId
    //     ? `${this.paymentBaseUrl}/payment/${bookingId}?lang=tr`
    //     : undefined,
    // }
    throw new Error('ElektraWeb provider henüz yapılandırılmadı.')
  }
}

