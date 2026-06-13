import { computed } from 'vue'
import { getLocationCoordinates } from '~/utils/location'

export const useLiveWeather = (placeIdRef: any) => {
  // Dinamik lokasyon kordinatlarını çekiyoruz
  const coordinates = computed(() => {
    const id = placeIdRef.value || 'default'
    return getLocationCoordinates(id)
  })

  // Open-Meteo API'den asenkron hava durumu verisi çekiyoruz
  const { data: weatherData } = useAsyncData(
    `weather-${placeIdRef.value || 'default'}`, 
    () => {
      const coords = coordinates.value
      if (!coords || !coords.lat || !coords.lng) return Promise.resolve(null)
      return $fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,wind_speed_10m,weather_code`)
    },
    {
      watch: [coordinates]
    }
  )

  // WMO Hava Durumu kodlarını Iconify (Phosphor) ikonlarına çevirme
  const getWeatherIcon = (code: number) => {
    if (code === 0) return 'ph:sun-fill' // Açık güneşli
    if (code === 1 || code === 2) return 'ph:cloud-sun-fill' // Az bulutlu
    if (code === 3) return 'ph:cloud-fill' // Çok bulutlu
    if (code === 45 || code === 48) return 'ph:cloud-fog-fill' // Sisli
    if (code >= 51 && code <= 67) return 'ph:cloud-rain-fill' // Yağmurlu
    if (code >= 71 && code <= 77) return 'ph:cloud-snow-fill' // Karlı
    if (code >= 80 && code <= 82) return 'ph:cloud-rain-fill' // Sağanak yağış
    if (code >= 85 && code <= 86) return 'ph:cloud-snow-fill' // Sağanak kar
    if (code >= 95) return 'ph:cloud-lightning-fill' // Fırtına
    return 'ph:sun-dim-fill'
  }

  const finalWeather = computed(() => {
    const data = weatherData.value as any
    if (data && data.current) {
      return {
        temp: Math.round(data.current.temperature_2m),
        wind: Math.round(data.current.wind_speed_10m),
        icon: getWeatherIcon(data.current.weather_code),
        condition: 'Loaded'
      }
    }
    // Fallback verisi (Yüklenirken veya API hatasında)
    return {
      temp: 28,
      wind: 15,
      icon: 'ph:sun-dim-fill',
      condition: 'Sunny'
    }
  })

  return {
    finalWeather,
    coordinates
  }
}
