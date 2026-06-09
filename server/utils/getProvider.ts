import type { HotelProvider } from './providers/types'
import { MockProvider } from './providers/mock'
import { ElektraWebProvider } from './providers/elektraweb'
import { HotelRunnerProvider } from './providers/hotelrunner'

// =============================================================================
// Provider Factory — nuxt.config.ts runtimeConfig'e göre doğru provider'ı seçer
// =============================================================================

let _cachedProvider: HotelProvider | null = null

export const getProvider = (): HotelProvider => {
  // Singleton — aynı provider'ı tekrar tekrar oluşturma
  if (_cachedProvider) return _cachedProvider

  const config = useRuntimeConfig()
  const providerName = config.hotelProvider || 'mock'

  switch (providerName) {
    case 'elektraweb':
      _cachedProvider = new ElektraWebProvider(config as any)
      break
    case 'hotelrunner':
      _cachedProvider = new HotelRunnerProvider(config as any)
      break
    default:
      _cachedProvider = new MockProvider()
  }

  console.log(`[Hotel API] Provider aktif: ${_cachedProvider.name}`)
  return _cachedProvider
}
