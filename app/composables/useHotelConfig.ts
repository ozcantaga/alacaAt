import { hotelConfig } from '~~/config/hotel.config'
import type { HotelConfig, HotelRoom, HotelAmenity, HotelGalleryItem, HotelTestimonial } from '~~/config/hotel.config'

/**
 * Composable to access hotel configuration data with i18n support.
 * Provides type-safe access to all hotel data and helper functions
 * for localized content retrieval.
 */
export const useHotelConfig = () => {
  const { locale } = useI18n()

  const config: HotelConfig = hotelConfig

  /**
   * Get localized content from a Record<string, string> object.
   * Falls back to English if the current locale content is not found.
   */
  const t = (content: Record<string, string>): string => {
    return content[locale.value] || content['en'] || Object.values(content)[0] || ''
  }

  /**
   * Get a specific room by slug
   */
  const getRoom = (slug: string): HotelRoom | undefined => {
    return config.rooms.find(room => room.slug === slug)
  }

  /**
   * Get all rooms
   */
  const getRooms = (): HotelRoom[] => {
    return config.rooms
  }

  /**
   * Get gallery items, optionally filtered by category
   */
  const getGalleryItems = (category?: string): HotelGalleryItem[] => {
    if (!category || category === 'all') return config.gallery
    return config.gallery.filter(item => item.category === category)
  }

  /**
   * Get gallery categories that have items
   */
  const getGalleryCategories = (): string[] => {
    const categories = new Set(config.gallery.map(item => item.category))
    return ['all', ...Array.from(categories)]
  }

  /**
   * Get all amenities
   */
  const getAmenities = (): HotelAmenity[] => {
    return config.amenities
  }

  /**
   * Get all testimonials
   */
  const getTestimonials = (): HotelTestimonial[] => {
    return config.testimonials
  }

  /**
   * Get formatted address string
   */
  const getFullAddress = (): string => {
    const { address, city, country, postalCode } = config.contact
    return `${t(address)}, ${postalCode} ${t(city)}, ${t(country)}`
  }

  /**
   * Get star rating as an array (for rendering star icons)
   */
  const getStarsArray = (): number[] => {
    return Array.from({ length: config.stars }, (_, i) => i + 1)
  }

  /**
   * Get Google Maps embed URL
   */
  const getMapEmbedUrl = (): string => {
    const { lat, lng, mapZoom } = config.location
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}°N+${lng}°E!5e0!3m2!1str!2str!4v1!5m2!1str!2str&z=${mapZoom}`
  }

  /**
   * Get formatted HTML string for the hotel name to highlight 'At'
   */
  const formatHotelName = (): string => {
    return config.name.replace('AlacaAt', `Alaca<span class="text-(--text-highlight)">At</span>`)
  }

  return {
    config,
    t,
    formatHotelName,
    getRoom,
    getRooms,
    getGalleryItems,
    getGalleryCategories,
    getAmenities,
    getTestimonials,
    getFullAddress,
    getStarsArray,
    getMapEmbedUrl,
  }
}
