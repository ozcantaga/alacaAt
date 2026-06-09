<script setup lang="ts" generic="T">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  items: T[]
  hideArrows?: boolean
  itemClass?: string
  spacingClass?: string
  paddingOffset?: string
}>()

const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

const updateIndex = () => {
  if (!containerRef.value) return
  const scrollLeft = containerRef.value.scrollLeft
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  const gap = 32 // Approximate gap from 'gap-8' (2rem = 32px)
  
  const maxScrollLeft = containerRef.value.scrollWidth - containerRef.value.clientWidth
  
  if (itemWidth > 0) {
    if (scrollLeft >= maxScrollLeft - 10) {
      // Reached the end
      currentIndex.value = props.items.length - 1
    } else {
      currentIndex.value = Math.round(scrollLeft / (itemWidth + gap))
    }
  }
}

const nextSlide = () => {
  if (!containerRef.value) return
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  const gap = 32
  containerRef.value.scrollBy({ left: itemWidth + gap, behavior: 'smooth' })
}

const prevSlide = () => {
  if (!containerRef.value) return
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  const gap = 32
  containerRef.value.scrollBy({ left: -(itemWidth + gap), behavior: 'smooth' })
}

onMounted(() => {
  containerRef.value?.addEventListener('scroll', updateIndex)
})

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener('scroll', updateIndex)
})

defineExpose({
  prevSlide,
  nextSlide,
  currentIndex
})
</script>

<template>
  <div class="relative w-full">
    <div 
      ref="containerRef"
      tabindex="0"
      aria-label="Kaydırılabilir İçerik"
      class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide focus:outline-none focus:ring-2 rounded-xl"
      :class="spacingClass"
      :style="{ paddingLeft: paddingOffset, paddingRight: paddingOffset }"
    >
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="snap-start shrink-0"
        :class="itemClass"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>
    
    <!-- Optional Arrows if hideArrows is false -->
    <ClientOnly>
      <template v-if="!hideArrows">
        <button 
          v-show="currentIndex > 0"
          @click="prevSlide" 
          aria-label="Önceki"
          class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 backdrop-blur-md rounded-full shadow-xl items-center justify-center transition-all duration-500 border"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </button>
        <button 
          v-show="currentIndex < items.length - 1"
          @click="nextSlide" 
          aria-label="Sonraki"
          class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 backdrop-blur-md rounded-full shadow-xl items-center justify-center transition-all duration-500 border"
        >
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
        </button>
      </template>
    </ClientOnly>
  </div>
</template>


