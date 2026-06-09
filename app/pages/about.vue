<template>
  <div>
    <!-- Hero -->
    <LayoutAppHero
      :images="[config.images.about]"
      :title="$t('about.title')"
      :subtitle="$t('about.subtitle')"
      :show-stars="false"
      :show-cta="false"
      :show-scroll-indicator="false"
      :full-height="false"
      :auto-slide="false"
    />

    <!-- Story Section -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Image -->
          <div class="animate-slide-in-left">
            <div class="img-zoom rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <NuxtImg
                :src="config.gallery[0]?.src || config.images.hero[0]"
                :alt="config.name"
                class="w-full h-full object-cover"
                loading="lazy"
                format="webp"
                sizes="sm:100vw md:50vw lg:800px"
              />
            </div>
          </div>

          <!-- Text -->
          <div class="animate-slide-in-right">
            <span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              {{ $t('about.established', { year: config.established }) }}
            </span>
            <h2 class="text-3xl sm:text-4xl font-heading font-bold mb-4">
              {{ $t('about.storyTitle') }}
            </h2>
            <hr class="divider-primary mb-6" />
            <p class="leading-relaxed text-lg">
              {{ t(config.story) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SharedSectionHeading
          :title="$t('about.valuesTitle')"
          :subtitle="$t('about.valuesSubtitle')"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(value, index) in config.values"
            :key="index"
            class="text-center p-8 rounded-2xl bg-(--ui-bg-elevated) shadow-sm border border-black/5  transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon :name="value.icon" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-heading font-bold mb-3">
              {{ t(value.title) }}
            </h3>
            <p class="text-sm leading-relaxed">
              {{ t(value.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- YouTube Tanıtım Videosu -->
    <section class="section-padding">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="h-[1px] w-8" />
            <span class="text-[9px] font-black tracking-[0.4em] uppercase">
              {{ locale === 'tr' ? 'TANITIM' : 'DISCOVER' }}
            </span>
            <div class="h-[1px] w-8" />
          </div>
          <h2 class="text-3xl sm:text-4xl font-serif italic mb-3">
            {{ locale === 'tr' ? 'Otelimizi Keşfedin' : 'Discover Our Hotel' }}
          </h2>
          <p class="text-sm max-w-xl mx-auto">
            {{ locale === 'tr' ? 'Alaçatı\'nın kalbinde, size unutulmaz bir konaklama deneyimi sunuyoruz.' : 'In the heart of Alaçatı, we offer you an unforgettable accommodation experience.' }}
          </p>
        </div>

        <div ref="videoContainer" class="relative p-2 md:p-3 rounded-[2rem] overflow-hidden shadow-inner bg-black/5  aspect-video group">
          <iframe
            v-if="showVideo"
            src="https://www.youtube.com/embed/6swnxv2Ttic?rel=0&modestbranding=1&showinfo=0"
            title="Alacaat Hotel Tanıtım Videosu"
            class="w-full h-full rounded-[1.5rem]"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          />
        </div>
      </div>
    </section>

   


    <!-- Sürdürülebilirlik Bölümü -->
    <section class="section-padding">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Başlık -->
        <div class="text-center mb-12">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="h-[1px] w-8" />
            <span class="text-[9px] font-black tracking-[0.4em] uppercase">
              {{ locale === 'tr' ? 'SÜRDÜRÜLEBİLİRLİK' : 'SUSTAINABILITY' }}
            </span>
            <div class="h-[1px] w-8" />
          </div>
          <h2 class="text-3xl sm:text-4xl font-serif italic mb-3">
            {{ locale === 'tr' ? 'Doğaya Saygımız' : 'Our Commitment to Nature' }}
          </h2>
          <p class="text-sm max-w-2xl mx-auto leading-relaxed">
            {{ locale === 'tr' 
              ? 'Sürdürülebilir turizm ilkelerine bağlı olarak, çevreye ve topluma karşı sorumluluklarımızı yerine getiriyoruz. Enerji verimliliği, atık yönetimi ve yerel topluluk desteği konularında aktif adımlar atıyoruz.' 
              : 'Committed to sustainable tourism principles, we fulfill our responsibilities towards the environment and community. We take active steps in energy efficiency, waste management, and local community support.' 
            }}
          </p>
        </div>

        <!-- Sorumluluk Maddeleri -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div
            v-for="(item, idx) in sustainabilityItems"
            :key="idx"
            class="flex items-start gap-3 p-4 rounded-xl bg-(--ui-bg-elevated) shadow-sm border border-black/5 "
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <UIcon :name="item.icon" class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-xs font-bold mb-0.5">{{ item.title[locale] || item.title.en }}</h3>
              <p class="text-[10px] leading-relaxed">{{ item.desc[locale] || item.desc.en }}</p>
            </div>
          </div>
        </div>

        <!-- PDF İndirme Kartları -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Sürdürülebilir Turizm Belgesi -->
          <a
            href="/docs/surdurulebilir-turizm-belgesi.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-5 p-5 rounded-xl bg-(--ui-bg-elevated) shadow-sm border border-black/5  hover:shadow-lg transition-all duration-500 hover:-translate-y-0.5"
          >
            <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <UIcon name="i-heroicons-document-check" class="w-7 h-7" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold mb-1 transition-colors duration-300">
                {{ locale === 'tr' ? 'Sürdürülebilir Turizm Belgesi' : 'Sustainable Tourism Certificate' }}
              </h3>
              <p class="text-[11px]">
                {{ locale === 'tr' ? 'Resmi sertifikamızı görüntüleyin' : 'View our official certification' }}
              </p>
            </div>
            <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 transition-all duration-300 group-hover:translate-y-0.5 flex-shrink-0" />
          </a>

          <!-- Sürdürülebilirlik Raporu -->
          <a
            href="/docs/surdurulebilirlik-raporu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-5 p-5 rounded-xl bg-(--ui-bg-elevated) shadow-sm border border-black/5  hover:shadow-lg transition-all duration-500 hover:-translate-y-0.5"
          >
            <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <UIcon name="i-heroicons-chart-bar" class="w-7 h-7" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold mb-1 transition-colors duration-300">
                {{ locale === 'tr' ? 'Sürdürülebilirlik Raporu' : 'Sustainability Report' }}
              </h3>
              <p class="text-[11px]">
                {{ locale === 'tr' ? 'Detaylı raporumuzu inceleyin' : 'Review our detailed report' }}
              </p>
            </div>
            <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 transition-all duration-300 group-hover:translate-y-0.5 flex-shrink-0" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { config, t, formatHotelName } = useHotelConfig()
const { locale } = useI18n()

const videoContainer = ref<HTMLElement | null>(null)
const showVideo = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      showVideo.value = true
      observer.disconnect()
    }
  }, { rootMargin: '300px' })

  if (videoContainer.value) {
    observer.observe(videoContainer.value)
  }
})

const sustainabilityItems = [
  {
    icon: 'i-heroicons-bolt',
    title: { tr: 'Enerji Verimliliği', en: 'Energy Efficiency' },
    desc: { tr: 'Güneş enerjisi panelleri ve LED aydınlatma ile enerji tüketimini minimize ediyoruz.', en: 'We minimize energy consumption with solar panels and LED lighting.' },
  },
  {
    icon: 'i-heroicons-arrow-path',
    title: { tr: 'Atık Yönetimi', en: 'Waste Management' },
    desc: { tr: 'Geri dönüşüm programı ve sıfır plastik hedefi ile çevre kirliliğini önlüyoruz.', en: 'We prevent pollution with recycling programs and zero plastic goals.' },
  },
  {
    icon: 'i-heroicons-globe-europe-africa',
    title: { tr: 'Yerel Topluluk', en: 'Local Community' },
    desc: { tr: 'Yerel üreticilerden tedarik ederek bölge ekonomisine katkı sağlıyoruz.', en: 'We contribute to the local economy by sourcing from local producers.' },
  },
  {
    icon: 'i-heroicons-heart',
    title: { tr: 'Su Tasarrufu', en: 'Water Conservation' },
    desc: { tr: 'Akıllı sulama ve su geri kazanım sistemleri kullanıyoruz.', en: 'We use smart irrigation and water recycling systems.' },
  },
]

useHead({
  title: useI18n().t('about.title'),
})

useSeoMeta({
  description: t(config.description),
  ogTitle: `${useI18n().t('about.title')} | ${config.name}`,
})
</script>
