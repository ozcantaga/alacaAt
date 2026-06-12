<script setup lang="ts">
/**
 * Premium Boutique Header
 * Fokus: Akışkan Geçişler, Cam (Glassmorphism) Efekti, Kusursuz Tipografi.
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const { config } = useHotelConfig()
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const isDark = ref(false)

onMounted(() => {
  if (localStorage.getItem('custom-theme') === 'dark' || document.body.classList.contains('theme-dark')) {
    isDark.value = true
    document.body.classList.add('theme-dark')
  }
})

watch(isDark, (val) => {
  if (val) {
    document.body.classList.add('theme-dark')
    localStorage.setItem('custom-theme', 'dark')
  } else {
    document.body.classList.remove('theme-dark')
    localStorage.setItem('custom-theme', 'light')
  }
})

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const isVisible = ref(true)
const lastScrollPosition = ref(0)
const isMounted = ref(false)

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/rooms', label: 'nav.rooms' },
  { path: '/gallery', label: 'nav.gallery' },
  { path: '/guide', label: 'nav.guide' },
  { path: '/about', label: 'nav.about' },
  { path: '/contact', label: 'nav.contact' },
]

const isHomePage = computed(() => {
  const path = route.path.replace(/^\/(en|tr)(\/|$)/, '/')
  return path === '/' || path === ''
})

const handleScroll = () => {
  if (!import.meta.client) return
  window.requestAnimationFrame(() => {
    const currentScroll = window.scrollY
    
    // 40px geçince ince (scrolled) stile geç
    isScrolled.value = currentScroll > 40
    
    // Akıllı Gizleme: Aşağı kaydırınca menü yoksa gizle, yukarı kaydırınca göster
    if (currentScroll > 120 && currentScroll > lastScrollPosition.value && !mobileMenuOpen.value) {
      isVisible.value = false
    } else {
      isVisible.value = true
    }
    lastScrollPosition.value = currentScroll
  })
}

onMounted(() => {
  isMounted.value = true
  window.addEventListener('scroll', handleScroll, { passive: true })
  // handleScroll'u hemen çağırmıyoruz — SSR ile tutarlı başlangıç durumu için
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(mobileMenuOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
    if (val) isVisible.value = true 
  }
})

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>)
)

const switchLang = async (code: string) => {
  await setLocale(code as 'tr' | 'en')
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <header 
    id="app-header"
    class="fixed top-0 left-0 w-full z-[150] transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
    :class="isMounted && !isVisible ? '-translate-y-full' : 'translate-y-0'"
  >
    <!-- TopBar (Sadece sayfa başındayken gösterilir) -->
    <div 
      class="transition-all duration-500 overflow-hidden"
      :class="isMounted && isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'"
    >
      <LayoutTopBar />
    </div>

    <nav 
      class="w-full transition-all duration-700 ease-out px-4 sm:px-6 lg:px-12 flex justify-between items-center relative z-[165] bg-(--color-page-bg)/90 text-(--text-heading) backdrop-blur-md border-b"
      :class="isMounted && isScrolled ? 'py-3.5' : 'py-6'"
    >
      <!-- Sol: Logo (Sadece Görsel) -->
      <NuxtLink :to="localePath('/')" class="flex items-center group shrink-0 outline-none">
         
        <NuxtImg 
   v-if="config.images.logo"
    :src="config.images.logo" 
    loading="eager"
    fetchpriority="high"
    format="avif" 
    :alt="config.name"
    width="320"
    height="160"
    class="transition-all duration-700 group-hover:scale-105 shrink-0 object-contain w-auto"
    :class="isMounted && isScrolled ? 'h-10 md:h-12' : 'h-16 md:h-20'"
  
  />
      </NuxtLink>

      <!-- Orta/Sağ: Desktop Navigasyon -->
      <div class="hidden lg:flex items-center gap-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="localePath(link.path)"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-inner hover:bg-(--color-primary-400) hover:text-white active:scale-95 active:shadow-none"
          active-class="font-bold text-white bg-(--color-primary-500) shadow-inner"
        >
          {{ $t(link.label) }}
        </NuxtLink>
        <!-- Dark Mode Toggle -->
        <ClientOnly>
          <button
            class="ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 text-(--text-heading) hover:bg-black/10 hover:shadow-inner"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="isDark = !isDark"
          >
            <UIcon :name="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'" class="w-5 h-5" />
          </button>
          <template #fallback>
            <div class="ml-2 w-10 h-10" />
          </template>
        </ClientOnly>

        <!-- CTA Button -->
        <NuxtLink :to="localePath('/reservation')" class="ml-4">
          <UButton
            :label="$t('nav.bookNow')"
            
            size="md"
            class="border-0 shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-xs font-bold"
           color="primary"/>
        </NuxtLink>
      </div>

      <!-- Mobil Menü Butonu -->
      <button
        class="lg:hidden p-2 rounded-lg transition-colors outline-none"
        :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        aria-expanded="false"
        @click="toggleMobileMenu"
      >
        <UIcon :name="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3-bottom-right'" class="w-7 h-7" />
      </button>
    </nav>

    <!-- Mobil Menü İçeriği (Reka UI felsefesi ile akıcı tam ekran) -->
    <Transition name="slide-down">
      <div
        v-show="mobileMenuOpen"
        id="mobile-menu"
        class="lg:hidden bg-(--color-page-bg) shadow-2xl absolute top-full left-0 w-full border-t"
      >
        <div class="px-6 py-8 space-y-4 flex flex-col h-[calc(100vh-70px)] overflow-y-auto">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="localePath(link.path)"
            class="block px-4 py-4 border-b text-lg font-medium transition-all uppercase tracking-[0.2em] text-center"
            active-class="text-(--text-highlight) font-bold bg-white/10 border-l-4 border-(--text-highlight) pl-3"
            @click="mobileMenuOpen = false"
          >
            {{ $t(link.label) }}
          </NuxtLink>

          <!-- Alt Alan: Dil & CTA -->
          <div class="mt-auto pt-10 pb-12 flex flex-col items-center gap-6">
            <div class="flex items-center gap-4">
              <button
                v-for="loc in availableLocales"
                :key="loc.code"
                class="px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-all uppercase border"
                :class="locale === loc.code
                  ? 'bg-(--text-highlight) text-white border-(--text-highlight) shadow-md'
                  : 'border-current opacity-60 hover:opacity-100'"
                @click="switchLang(loc.code)"
              >
                {{ loc.code }}
              </button>

              <ClientOnly>
                <button
                  class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border shadow-sm"
                  :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                  @click="isDark = !isDark"
                >
                  <UIcon :name="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'" class="w-5 h-5" />
                </button>
                <template #fallback>
                  <div class="w-10 h-10" />
                </template>
              </ClientOnly>
            </div>

            <NuxtLink :to="localePath('/reservation')" class="w-full max-w-xs mt-2">
              <UButton
                :label="$t('nav.bookNow')"
                block
                size="xl"
                class="border-0 py-4 uppercase tracking-[0.2em] font-bold shadow-lg"
                @click="mobileMenuOpen = false"
               color="primary"/>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
nav {
  /* GPU Performans optimizasyonu */
  will-change: transform;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: scaleY(0);
  opacity: 0;
}
</style>
