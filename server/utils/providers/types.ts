// =============================================================================
// 🏨 HOTEL PROVIDER INTERFACE — ElektraWeb / HotelRunner / Mock
// =============================================================================
// Tüm provider'lar bu arayüzü implemente eder.
// Provider değiştirmek için sadece nuxt.config.ts runtimeConfig güncellenir.
// =============================================================================

/** Dış sistemden gelen oda bilgisi */
export interface ProviderRoom {
  externalId: string           // ElektraWeb/HotelRunner'daki oda ID
  name: string
  basePrice: number
  currency: string
  available: boolean
}

/** Müsaitlik sorgu parametreleri */
export interface AvailabilityParams {
  checkIn: string              // YYYY-MM-DD
  checkOut: string             // YYYY-MM-DD
  adults: number
  children: number
}

/** Müsaitlik sorgu sonucu (oda bazında) */
export interface AvailabilityResult {
  externalId: string           // hotel.config.ts'deki apiId ile eşleşir
  price: number                // Gecelik fiyat
  totalPrice?: number          // Toplam fiyat (opsiyonel)
  currency: string
  available: boolean
  rateCode?: string            // HotelRunner rate plan kodu
  rateName?: string            // Fiyat planı adı
  cancellationPolicy?: string  // İptal politikası
  mealPlan?: string            // Konaklama tipi (BB, HB, FB, AI)
}

/** Rezervasyon oluşturma parametreleri */
export interface BookingParams {
  roomExternalId: string       // hotel.config.ts'deki apiId
  checkIn: string
  checkOut: string
  guest: {
    firstName: string
    lastName: string
    email: string
    phone: string
    country?: string
    note?: string              // Misafir notu
  }
  adults: number
  children: number
  rateCode?: string            // Seçilen fiyat planı (HotelRunner)
}

/** Rezervasyon sonucu */
export interface BookingResult {
  success: boolean
  confirmationCode?: string    // Onay kodu
  reservationId?: string       // Dış sistem rezervasyon ID
  paymentUrl?: string          // Ödeme sayfası URL (HotelRunner / ElektraWeb)
  message?: string
  errors?: string[]
}

/** Tüm provider'ların uygulaması gereken ortak arayüz */
export interface HotelProvider {
  /** Provider adı (loglama için) */
  readonly name: string

  /** Oda listesi ve temel fiyatları getir */
  getRooms(): Promise<ProviderRoom[]>

  /** Belirli tarihler için müsaitlik ve fiyat sorgula */
  checkAvailability(params: AvailabilityParams): Promise<AvailabilityResult[]>

  /** Rezervasyon oluştur */
  createBooking(params: BookingParams): Promise<BookingResult>
}
