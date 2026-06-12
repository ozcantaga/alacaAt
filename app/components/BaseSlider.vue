<script setup lang="ts" generic="T">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  items: T[]
  hideArrows?: boolean
  hideDots?: boolean
  itemClass?: string
  spacingClass?: string
  paddingOffset?: string
}>()

const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

let cachedItemWidth = 0
let cachedMaxScrollLeft = 0
let isCacheValid = false

const calculateDimensions = () => {
  if (!containerRef.value) return
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  cachedItemWidth = itemWidth
  cachedMaxScrollLeft = containerRef.value.scrollWidth - containerRef.value.clientWidth
  isCacheValid = true
}

const updateIndex = () => {
  if (!containerRef.value) return

  if (!isCacheValid) {
    calculateDimensions()
  }

  requestAnimationFrame(() => {
    if (!containerRef.value) return
    const scrollLeft = containerRef.value.scrollLeft
    const gap = 32

    if (cachedItemWidth > 0) {
      let newIndex = 0
      if (scrollLeft >= cachedMaxScrollLeft - 10) {
        newIndex = props.items.length - 1
      } else {
        newIndex = Math.round(scrollLeft / (cachedItemWidth + gap))
      }
      if (currentIndex.value !== newIndex) {
        currentIndex.value = newIndex
      }
    }
  })
}

const nextSlide = () => {
  if (!containerRef.value) return
  calculateDimensions()
  containerRef.value.scrollBy({ left: cachedItemWidth + 32, behavior: 'smooth' })
}

const prevSlide = () => {
  if (!containerRef.value) return
  calculateDimensions()
  containerRef.value.scrollBy({ left: -(cachedItemWidth + 32), behavior: 'smooth' })
}

const goTo = (idx: number) => {
  if (!containerRef.value) return
  calculateDimensions()
  containerRef.value.scrollTo({ left: idx * (cachedItemWidth + 32), behavior: 'smooth' })
}

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.items.length - 1)

// Progress bar pozisyonu (0→1)
const progressPercent = computed(() =>
  props.items.length <= 1 ? 1 : currentIndex.value / (props.items.length - 1)
)

onMounted(() => {
  containerRef.value?.addEventListener('scroll', updateIndex, { passive: true })
  window.addEventListener('resize', () => { isCacheValid = false }, { passive: true })
})

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener('scroll', updateIndex)
  window.removeEventListener('resize', () => { isCacheValid = false })
})

defineExpose({ prevSlide, nextSlide, goTo, currentIndex })
</script>

<template>
  <div class="relative w-full">

    <!-- Scrollable track -->
    <div
      ref="containerRef"
      tabindex="0"
      aria-label="Kaydırılabilir İçerik"
      class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide focus:outline-none rounded-xl"
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

    <!-- Desktop Arrows -->
    <ClientOnly>
      <template v-if="!hideArrows">
        <button
          v-show="hasPrev"
          @click="prevSlide"
          aria-label="Önceki"
          class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center backdrop-blur-md rounded-full shadow-xl transition-all duration-500 border"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </button>
        <button
          v-show="hasNext"
          @click="nextSlide"
          aria-label="Sonraki"
          class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center backdrop-blur-md rounded-full shadow-xl transition-all duration-500 border"
        >
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
        </button>
      </template>
    </ClientOnly>

    <!-- Progress track + dots -->
    <ClientOnly>
      <div
        v-if="!hideDots && items.length > 1"
        class="mt-5 flex flex-col items-center gap-3"
      >
        <!-- İnce progress çubuğu (sadece mobil) -->
        <div class="md:hidden w-16 h-[2px] rounded-full overflow-hidden bg-(--text-muted)/20">
          <div
            class="h-full rounded-full bg-(--color-primary-500) transition-all duration-500 ease-out"
            :style="{ width: `${progressPercent * 100}%` }"
          />
        </div>

        <!-- Nokta göstergeleri (tüm ekranlar) -->
        <div class="flex items-center justify-center gap-1.5" role="tablist" aria-label="Slayt seçimi">
          <button
            v-for="(_, idx) in items"
            :key="idx"
            role="tab"
            :aria-selected="idx === currentIndex"
            :aria-label="`Slayt ${idx + 1}`"
            class="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer group"
            @click="goTo(idx)"
          >
            <span
              class="rounded-full transition-all duration-400 ease-in-out"
              :class="idx === currentIndex
                ? 'w-4 h-[5px] bg-(--color-primary-500)'
                : 'w-[5px] h-[5px] bg-(--text-muted)/30 group-hover:bg-(--text-muted)/60'"
            ></span>
          </button>
        </div>
      </div>
    </ClientOnly>

  </div>
</template>
