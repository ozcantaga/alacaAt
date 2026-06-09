import { ref, computed } from 'vue'
import { getLocationCoordinates } from '~/utils/location'

export const useLiveWeather = (placeIdRef: any) => {
  // Mock weather data since we don't have an active API key
  const finalWeather = ref({
    temp: 28,
    wind: 15,
    icon: 'ph:sun-dim-fill',
    condition: 'Sunny'
  })

  // Dinamik lokasyon kordinatlarını utils/location.ts'den çekiyoruz
  const coordinates = computed(() => {
    const id = placeIdRef.value || 'default'
    return getLocationCoordinates(id)
  })

  return {
    finalWeather,
    coordinates
  }
}
