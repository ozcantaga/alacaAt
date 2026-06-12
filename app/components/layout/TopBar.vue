<script setup lang="ts">
/**
 * Premium TopBar
 * Fokus: Kusursuz dikey hizalama, sağa kenetli sosyal medya, editoryal boşluklar.
 */
const { config } = useHotelConfig()
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>)
)

const currentLocale = computed(() =>
  availableLocales.value.find(l => l.code === locale.value)
)

const switchLang = async (code: string) => {
  await setLocale(code as 'tr' | 'en')
}
</script>

<template>
  <aside
    id="top-bar"
    role="complementary"
    aria-label="Üst Menü İletişim"
    class="w-full h-10 md:h-12 border-b px-4 md:px-16 flex justify-between items-center relative overflow-hidden z-[170] bg-(--ui-bg-elevated)"
  >
    <!-- Arka Plan Işıltısı (Silver Glow) -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="silver-glow" />
    </div>

    <!-- SOL: İletişim Bilgisi -->
    <div class="relative z-10 flex items-center h-full gap-2 md:gap-4">
      <!-- Telefon -->
      <a
        v-if="config.contact.phone"
        :href="`tel:${config.contact.phone}`"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-300 hover:bg-black/10 hover:shadow-inner"
      >
        <UIcon
          name="i-heroicons-phone"
          class="w-3 h-3 md:w-3.5 md:h-3.5"
        />
        <span class="text-[9px] md:text-[10px] font-medium tracking-[0.15em] italic">
          {{ config.contact.phone }}
        </span>
      </a>

      <!-- Ayırıcı -->
      <span class="hidden md:block w-px h-3.5 mx-1" />

      <!-- Email -->
      <a
        v-if="config.contact.email"
        :href="`mailto:${config.contact.email}`"
        class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-300 hover:bg-black/10 hover:shadow-inner"
      >
        <UIcon
          name="i-heroicons-envelope"
          class="w-3 h-3 md:w-3.5 md:h-3.5"
        />
        <span class="text-[9px] md:text-[10px] font-medium tracking-[0.15em] italic">
          {{ config.contact.email }}
        </span>
      </a>
    </div>

    <!-- SAĞ: Sosyal Medya (Sıkıştırılmış ve Sağa Yaslı) + Dil Değiştirici -->
    <div class="relative z-10 flex items-center justify-end h-full gap-2">
      <!-- Sosyal Medya İkonları -->
      <div class="flex items-center hidden sm:flex translate-y-[1px] gap-3">
        <a
          v-if="config.social.instagram"
          :href="config.social.instagram"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          class="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 hover:bg-black/10 hover:shadow-inner scale-[0.85] sm:scale-100"
        >
          <UIcon name="i-simple-icons-instagram" class="w-4 h-4" />
        </a>
        
        <!-- TripAdvisor -->
        <a 
          v-if="config.social.tripadvisor"
          :href="config.social.tripadvisor" 
          target="_blank" 
          class="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 hover:bg-black/10 hover:shadow-inner scale-[0.85] sm:scale-100"
          aria-label="TripAdvisor"
        >
          <UIcon name="i-simple-icons-tripadvisor" class="w-4 h-4" />
        </a>

        <!-- WhatsApp -->
        <a 
          v-if="config.social.whatsapp"
          :href="config.social.whatsapp" 
          target="_blank" 
          class="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 hover:bg-black/10 hover:shadow-inner scale-[0.85] sm:scale-100"
          aria-label="WhatsApp üzerinden bizimle iletişime geçin"
        >
          <UIcon name="i-simple-icons-whatsapp" class="w-4 h-4" />
        </a>
      </div>

      <!-- Ayırıcı -->
      <span class="hidden sm:block w-px h-3.5 mx-1" />

      <!-- Dil Değiştirici -->
      <div class="flex items-center gap-0.5">
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          class="px-2 py-0.5 rounded text-[9px] font-semibold tracking-[0.1em] uppercase transition-all duration-400 cursor-pointer border-none outline-none leading-[1.6]"
          :class="locale === loc.code ? 'bg-(--color-primary-500) text-(--text-inverse)' : 'bg-transparent text-(--text-muted) hover:bg-black/10 hover:shadow-inner'"
          :aria-label="`Switch to ${loc.name}`"
          @click="switchLang(loc.code)"
        >
          {{ loc.code.toUpperCase() }}
        </button>
      </div>
    </div>
  </aside>
</template>


