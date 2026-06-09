<script setup lang="ts">
import { ref, computed } from 'vue'
import { reviews } from '~/utils/reviews'


const { t } = useI18n()
const { config, formatHotelName } = useHotelConfig()
const businessName = config.name || 'AlacaAt Alaçatı'

const sliderRef = ref<any>(null)

// Lighthouse Fix: Butonların durumuna göre dinamik aria-label
const isPrevDisabled = computed(() => !sliderRef.value || sliderRef.value.currentIndex <= 0)
const isNextDisabled = computed(() => !sliderRef.value || sliderRef.value.currentIndex >= reviews.length - 1)
</script>

<template>
  <section 
    class="py-16 md:py-24 overflow-hidden border-t"
    aria-labelledby="testimonials-title"
  >
    <div class="max-w-[1440px] mx-auto px-6">
      <div class="flex flex-col lg:flex-row gap-12 items-start relative">
        
        <div class="w-full lg:w-[380px] shrink-0 z-30 relative py-4">
          <div class="lg:sticky lg:top-28 space-y-12">
            
            <header class="space-y-6">
            
              
              <h2 id="testimonials-title" class="font-serif text-4xl md:text-5xl font-light leading-[1.1] tracking-tight">
                <span v-html="formatHotelName()"></span> 
                <span class="block italic text-2xl mt-3 tracking-wide">
                  {{ t('testimonials.experience_subtitle') }}
                </span>
              </h2>
            </header>

            <div class="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-8 w-full">
              <div 
                class="inline-flex flex-col gap-4 p-8 rounded-[2rem] shadow-inner bg-black/5  w-full"
                role="img" 
                :aria-label="`TripAdvisor puanı: 5 üzerinden 5.0`"
              >
                <div class="flex items-center gap-1.5" aria-hidden="true">
                  <span v-for="i in 5" :key="i" class="w-3.5 h-3.5 rounded-full"></span>
                </div>
                
                <div class="flex items-baseline gap-4">
                  <span class="font-serif text-6xl leading-none font-medium italic">5,0</span>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">
                      {{ t('testimonials.score_label') }}
                    </span>
                    <span class="text-[8px] font-bold uppercase tracking-[0.2em] mt-1">
                      {{ t('testimonials.tripadvisor_global') }}
                    </span>
                  </div>
                </div>
              </div>

              <ClientOnly>
                <div class="hidden lg:flex gap-4">
                  <button 
                    @click="sliderRef?.prevSlide()" 
                    type="button"
                    :disabled="isPrevDisabled"
                    :aria-label="t('common.previous') || 'Önceki yorum'"
                    class="w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                  >
                    <Icon name="ph:caret-left-light" size="24" />
                  </button>
                  <button 
                    @click="sliderRef?.nextSlide()" 
                    type="button"
                    :disabled="isNextDisabled"
                    :aria-label="t('common.next') || 'Sonraki yorum'"
                    class="w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                  >
                    <Icon name="ph:caret-right-light" size="24" />
                  </button>
                </div>
              </ClientOnly>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-[calc(100vw-480px)] relative z-10">
          <BaseSlider 
            ref="sliderRef"
            :items="reviews" 
            :hideArrows="true"
            itemClass="w-[85vw] md:w-[420px] p-10 h-[450px] flex flex-col justify-between border rounded-[2.5rem] transition-all duration-700 hover:shadow-2xl group/card bg-(--ui-bg-elevated)"
            paddingOffset="0.5rem"
            spacingClass="gap-8 pb-16 pt-4"
          >
            <template #default="{ item: comment }">
              <blockquote class="m-0 h-full flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center mb-10">
                    <div class="flex gap-1" :aria-label="`Puan: 5 üzerinden 5`" role="img">
                      <span v-for="s in 5" :key="s" class="w-2.5 h-2.5 rounded-full"></span>
                    </div>
                    <time :datetime="comment.date" class="text-[9px] uppercase tracking-[0.25em] font-black font-sans">
                      {{ comment.date }}
                    </time>
                  </div>
                  
                  <h3 class="font-sans font-bold text-[12px] mb-6 uppercase tracking-[0.2em] leading-relaxed italic">
                    "{{ comment.title }}"
                  </h3>
                  
                  <p class="text-[16px] leading-[1.8] font-serif italic line-clamp-6">
                    {{ comment.text }}
                  </p>
                </div>
                
                <footer class="flex items-center gap-5 border-t pt-8 group">
                  <div class="w-6 h-px group-hover:w-12 transition-all duration-700"></div>
                  <cite class="font-serif text-[20px] italic font-light not-italic">
                    {{ comment.name }}
                  </cite>
                </footer>
              </blockquote>
            </template>
          </BaseSlider>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Yorum kartlarına hover derinliği */
:deep(.group\/card) {
  will-change: transform;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
:deep(.group\/card:hover) {
  transform: translateY(-8px);
}
</style>
