<template>
  <div>
    <!-- Filter Tabs -->
    <div v-if="showFilters" class="flex flex-wrap items-center justify-center gap-2 mb-10">
      <button
        v-for="category in categories"
        :key="category"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
        :class="activeCategory === category ? 'border' : 'border'"
        @click="activeCategory = category"
      >
        {{ $t(`gallery.${category}`) }}
      </button>
    </div>

    <!-- Gallery Grid -->
    <div 
      class="grid gap-3 sm:gap-4"
      :class="compact ? 'grid-cols-1 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[300px]' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'"
    >
      <div
        v-for="(item, index) in filteredItems"
        :key="item.src"
        class="img-zoom relative rounded-2xl overflow-hidden cursor-pointer group"
        :class="[ !compact ? 'aspect-square' : '', !compact && index === 0 ?'md:col-span-2 md:row-span-2':'', compact && index === 0 ?'md:col-span-2 md:row-span-2':'', compact && index !== 0 ?'md:col-span-1 md:row-span-1':'', 'animate-scale-in' ]"
        :style="{ animationDelay: `${(index % 4) * 100 + 100}ms` }"
        @click="openLightbox(index)"
      >
        <NuxtImg
          :src="item.src"
          :alt="t(item.alt)"
          class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
          format="webp"
          sizes="sm:50vw md:33vw lg:800px"
        />
        <!-- Hover Overlay -->
        <div class="absolute inset-0 transition-all duration-500 flex items-center justify-center">
          <UIcon
            name="i-heroicons-magnifying-glass-plus"
            class="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100"
          />
        </div>
      </div>
    </div>

    <!-- Lightbox Modal — ClientOnly: UModal portal SSR'da hydration mismatch yaratır -->
    <ClientOnly>
      <UModal v-model:open="lightboxOpen" :ui="{ content: 'max-w-5xl sm:max-w-5xl' }">
        <template #content>
          <div class="relative">
            <!-- Close Button -->
            <button
              class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              :aria-label="$t('common.close')"
              @click="lightboxOpen = false"
            >
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>

            <!-- Image -->
            <div class="flex items-center justify-center min-h-[50vh]">
              <NuxtImg
                :src="filteredItems[lightboxIndex]?.src"
                :alt="filteredItems[lightboxIndex] ? t(filteredItems[lightboxIndex]!.alt) : ''"
                class="max-w-full max-h-[80vh] object-contain"
                format="webp"
                sizes="sm:100vw lg:1200px"
              />
            </div>

            <!-- Navigation -->
            <div class="absolute inset-y-0 left-0 flex items-center pl-4">
              <button
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                :aria-label="$t('common.previous')"
                @click="prevImage"
              >
                <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
              </button>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-4">
              <button
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                :aria-label="$t('common.next')"
                @click="nextImage"
              >
                <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
              </button>
            </div>

            <!-- Counter & Description -->
            <div class="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-center text-white pointer-events-none drop-shadow-md">
              <h3 class="text-lg md:text-xl font-serif italic mb-1">{{ filteredItems[lightboxIndex] ? t(filteredItems[lightboxIndex]!.alt) : '' }}</h3>
              <div class="text-sm px-4 py-1.5 rounded-full backdrop-blur-md bg-black/30">
                {{ lightboxIndex + 1 }} / {{ filteredItems.length }}
              </div>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { HotelGalleryItem } from '~~/config/hotel.config'

const { t, getGalleryCategories } = useHotelConfig()

const props = withDefaults(defineProps<{
  items: HotelGalleryItem[]
  showFilters?: boolean
  compact?: boolean
  limit?: number
}>(), {
  showFilters: true,
  compact: false,
})

const categories = getGalleryCategories()
const activeCategory = ref('all')

const filteredItems = computed(() => {
  let items = activeCategory.value === 'all'
    ? props.items
    : props.items.filter(item => item.category === activeCategory.value)

  if (props.limit) {
    items = items.slice(0, props.limit)
  }

  return items
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const prevImage = () => {
  lightboxIndex.value = lightboxIndex.value > 0
    ? lightboxIndex.value - 1
    : filteredItems.value.length - 1
}

const nextImage = () => {
  lightboxIndex.value = lightboxIndex.value < filteredItems.value.length - 1
    ? lightboxIndex.value + 1
    : 0
}
</script>
