<template>
  <section
    id="hero-section"
    class="relative w-full overflow-hidden"
    :class="fullHeight ? 'h-screen min-h-[600px]' : 'h-[70vh] min-h-[500px]'"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <Transition name="fade" mode="out-in">
        <NuxtImg
          :key="currentImageIndex"
          :src="images[currentImageIndex]"
          :alt="config.name"
          class="w-full h-full object-cover"
          :loading="currentImageIndex === 0 ? 'eager' : 'lazy'"
          :fetchpriority="currentImageIndex === 0 ? 'high' : 'auto'"
          :preload="currentImageIndex === 0"
          format="webp"
          quality="75"
          sizes="100vw"
          width="1920"
          height="1080"
        />
      </Transition>
    </div>

    <!-- Gradient Overlay for High Contrast -->
    <div
      class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/70 via-black/30 to-black/20"
      aria-hidden="true"
    />

    <!-- Content -->
    <div class="relative z-20 h-full flex items-center justify-center">
      <div class="max-w-4xl mx-auto px-6 text-center w-full">
        <!-- Title & Subtitle -->
        <h1 class="hero-title text-4xl sm:text-5xl md:text-7xl mb-6 font-serif italic leading-[1.1] tracking-tighter animate-fade-in-up text-white drop-shadow-lg">
          <span class="block">
            <slot name="title">
              <span v-if="title">{{ title }}</span>
              <span v-else v-html="formatHotelName()"></span>
            </slot>
          </span>
          <span class="block md:mt-2" v-if="subtitle || $slots.subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </span>
        </h1>

        <!-- Optional text description slot -->
        <p class="font-medium text-sm md:text-lg tracking-wide max-w-lg mx-auto italic leading-relaxed drop-shadow-md animate-fade-in-up animate-delay-300 text-white/90">
          <slot name="description"></slot>
        </p>

        <!-- CTA Buttons -->
        <div
          v-if="showCta"
          class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-500"
        >
          <NuxtLink v-if="ctaLink" :to="ctaLink" class="bg-(--ui-bg-elevated) text-(--text-heading) px-10 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl w-full sm:w-auto hover:scale-105">
            {{ ctaLabel || ($te('hero.bookYourStay') ? $t('hero.bookYourStay') : 'REZERVASYON YAP') }}
          </NuxtLink>

          <!-- We use secondaryCtaLink if provided, else whatsapp -->
          <NuxtLink v-if="secondaryCtaLink && secondaryCtaLink !== 'whatsapp'" :to="secondaryCtaLink" class="flex items-center justify-center gap-3 border backdrop-blur-md px-10 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 w-full sm:w-auto shadow-xl">
            {{ secondaryCtaLabel || ($te('hero.discover') ? $t('hero.discover') : 'KEŞFET') }}
          </NuxtLink>
          <a
            v-else-if="secondaryCtaLink === 'whatsapp' || !secondaryCtaLink"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-3 bg-[#128C7E] text-white hover:bg-[#075E54] px-10 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 w-full sm:w-auto shadow-xl"
            aria-label="WhatsApp ile İletişime Geçin"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      v-if="showScrollIndicator"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce"
    >
      <UIcon name="i-heroicons-chevron-down" class="w-8 h-8" />
    </div>

    <!-- Image Navigation Dots (if multiple images) -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-8 right-8 z-20 flex items-center gap-2"
    >
      <button
        v-for="(_, index) in images"
        :key="index"
        class="relative w-11 h-11 sm:w-4  sm:h-4 flex items-center justify-center group cursor-pointer"
        :aria-label="`Image ${index + 1}`"
        @click="currentImageIndex = index"
      >
        <span 
          class="rounded-full transition-all duration-300 h-2.5"
          :class="index === currentImageIndex ? 'w-8' : 'w-2.5'"
        ></span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { config, getStarsArray, formatHotelName } = useHotelConfig()

interface Props {
  images?: string[]
  title?: string
  subtitle?: string
  showStars?: boolean
  showCta?: boolean
  showScrollIndicator?: boolean
  fullHeight?: boolean
  ctaLink?: string
  ctaLabel?: string
  secondaryCtaLink?: string
  secondaryCtaLabel?: string
  autoSlide?: boolean
  autoSlideInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  showStars: true,
  showCta: true,
  showScrollIndicator: true,
  fullHeight: true,
  autoSlide: true,
  autoSlideInterval: 6000,
})

const images = computed(() =>
  props.images.length > 0 ? props.images : config.images.hero
)

const currentImageIndex = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

const startAutoSlide = () => {
  if (!props.autoSlide || images.value.length <= 1) return
  slideInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  }, props.autoSlideInterval)
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

onMounted(() => {
  startAutoSlide()
})



onUnmounted(() => {
  stopAutoSlide()
})

// Restart auto-slide when user manually selects an image
watch(currentImageIndex, () => {
  stopAutoSlide()
  startAutoSlide()
})

// WhatsApp URL Generator with fallback
const whatsappUrl = computed(() => {
  if (config.social?.whatsapp) return config.social.whatsapp;
  const phone = config.contact?.whatsapp || config.contact?.phone || ''
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) cleaned = '9' + cleaned
  else if (!cleaned.startsWith('90') && cleaned.length === 10) cleaned = '90' + cleaned
  return `https://wa.me/${cleaned}`
})
</script>


