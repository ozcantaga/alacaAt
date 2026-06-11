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

const updateIndex = () => {
  if (!containerRef.value) return
  const scrollLeft = containerRef.value.scrollLeft
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  const gap = 32

  const maxScrollLeft = containerRef.value.scrollWidth - containerRef.value.clientWidth

  if (itemWidth > 0) {
    if (scrollLeft >= maxScrollLeft - 10) {
      currentIndex.value = props.items.length - 1
    } else {
      currentIndex.value = Math.round(scrollLeft / (itemWidth + gap))
    }
  }
}

const nextSlide = () => {
  if (!containerRef.value) return
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  containerRef.value.scrollBy({ left: itemWidth + 32, behavior: 'smooth' })
}

const prevSlide = () => {
  if (!containerRef.value) return
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  containerRef.value.scrollBy({ left: -(itemWidth + 32), behavior: 'smooth' })
}

const goTo = (idx: number) => {
  if (!containerRef.value) return
  const itemWidth = containerRef.value.firstElementChild?.clientWidth || 0
  containerRef.value.scrollTo({ left: idx * (itemWidth + 32), behavior: 'smooth' })
}

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.items.length - 1)

// Progress bar pozisyonu (0→1)
const progressPercent = computed(() =>
  props.items.length <= 1 ? 1 : currentIndex.value / (props.items.length - 1)
)

onMounted(() => {
  containerRef.value?.addEventListener('scroll', updateIndex)
})

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener('scroll', updateIndex)
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
            class="rounded-full transition-all duration-400 ease-in-out"
            :class="idx === currentIndex
              ? 'w-4 h-[5px] bg-(--color-primary-500)'
              : 'w-[5px] h-[5px] bg-(--text-muted)/30 hover:bg-(--text-muted)/60'"
            @click="goTo(idx)"
          />
        </div>
      </div>
    </ClientOnly>

  </div>
</template>
