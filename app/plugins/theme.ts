import { hotelConfig } from '~~/config/hotel.config'

export default defineNuxtPlugin((nuxtApp) => {
  const config = hotelConfig
  
  if (config.theme) {
    const { primary, accent, surface } = config.theme
    
    // Tema renklerini CSS değişkenlerine dönüştürüyoruz
    let cssVars = ':root {\n'
    
    // Primary renkler
    if (primary) {
      Object.entries(primary).forEach(([shade, color]) => {
        cssVars += `  --color-primary-${shade}: ${color};\n`
      })
    }
    
    // Accent renkler
    if (accent) {
      Object.entries(accent).forEach(([shade, color]) => {
        cssVars += `  --color-accent-${shade}: ${color};\n`
      })
    }
    
    // Surface renkler
    if (surface) {
      Object.entries(surface).forEach(([shade, color]) => {
        cssVars += `  --color-surface-${shade}: ${color};\n`
      })
    }
    
    cssVars += '}\n'
    
    // Nuxt'un head yönetimine bu CSS blokunu dinamik olarak enjekte ediyoruz.
    // Bu sayede CSS değişkenleri çalışma anında (runtime) Tailwind sistemine dahil oluyor.
    useHead({
      style: [
        {
          id: 'hotel-dynamic-theme',
          innerHTML: cssVars
        }
      ]
    })
  }
})
