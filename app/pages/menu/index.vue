<template>
  <div class="max-w-4xl mx-auto pb-20 bg-(--color-page-bg) min-h-screen transition-colors duration-500">
    <!-- Categories Wrap -->
    <div class="sticky top-0 z-10 bg-(--color-page-bg) py-4 px-2 transition-colors duration-500">
      <div class="flex flex-wrap justify-center gap-2 mx-auto">
        <button
          v-for="cat in menuConfig.categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          class="flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-full transition-all duration-300 text-[10px] md:text-xs font-bold tracking-wide uppercase shadow-sm"
          :class="activeCategoryId === cat.id ? 'bg-(--text-highlight) text-white shadow-md' : 'bg-(--ui-bg-elevated) text-(--text-body) border border-(--ui-border) hover:border-(--text-highlight)'"
        >
          <UIcon :name="cat.icon" class="w-4 h-4" />
          <span>{{ getLocalizedText(cat.label) }}</span>
        </button>
      </div>
    </div>

    <div v-if="activeCategory" class="px-4 py-8 max-w-3xl mx-auto">
      
      <!-- SubCategories (if any) -->
      <div v-if="activeCategory.subCategories" class="flex justify-center gap-8 mb-8">
        <button
          v-for="sub in activeCategory.subCategories"
          :key="sub.id"
          @click="selectSubCategory(sub.id)"
          class="pb-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 relative"
          :class="activeSubCategoryId === sub.id ? 'text-(--text-highlight)' : 'text-(--text-muted) hover:text-(--text-body)'"
        >
          {{ getLocalizedText(sub.label) }}
          <div v-if="activeSubCategoryId === sub.id" class="absolute bottom-0 left-0 w-full h-[2px] bg-(--text-highlight)"></div>
        </button>
      </div>

      <!-- Hero Image -->
      <div class="flex justify-center mb-10 px-2">
        <div class="w-full max-w-[650px] aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-none border-4 border-white dark:border-(--ui-bg-elevated)">
          <NuxtImg :src="activeCategory.heroImage" width="800" quality="80" format="webp" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Item List -->
      <div class="space-y-6">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="flex gap-4 pb-6 last:border-0"
        >
          <!-- Icon Left -->
          <div v-if="item.icon" class="flex-shrink-0 mt-1">
            <UIcon :name="item.icon" class="w-5 h-5 text-(--icon-primary) opacity-70" />
          </div>
          
          <!-- Content Center -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1">
              <h3 class="text-lg font-bold text-(--text-heading)">{{ getLocalizedText(item.title) }}</h3>
              <span v-if="item.popular" class="bg-(--text-highlight) text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                Popüler
              </span>
            </div>
            <p class="text-sm text-(--text-body) opacity-80 leading-relaxed max-w-2xl mt-2">
              {{ getLocalizedText(item.description) }}
            </p>
          </div>

          <!-- Price Right -->
          <div class="flex-shrink-0 flex items-start justify-end ml-4 mt-1">
            <div class="flex items-center bg-black/5 dark:bg-white/10 shadow-inner px-3 py-1 rounded-xl">
              <span class="text-[15px] font-bold text-(--color-primary-600) dark:text-white tracking-wide">{{ item.price }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="filteredItems.length === 0" class="text-center py-10 text-(--text-body) opacity-60">
          Bu kategoride henüz ürün bulunmuyor.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { menuConfig } from '../../../config/menu.config'

definePageMeta({
  layout: 'menu'
})

const { locale } = useI18n()

// Helper for localization mapping without destructuring full i18n
const getLocalizedText = (record: Record<string, string>) => {
  return record[locale.value] || record['tr']
}

const activeCategoryId = ref(menuConfig.categories[0]?.id || '')
const activeSubCategoryId = ref<string | null>(null)

const activeCategory = computed(() => {
  return menuConfig.categories.find(c => c.id === activeCategoryId.value)
})

const selectCategory = (id: string) => {
  activeCategoryId.value = id
  const cat = menuConfig.categories.find(c => c.id === id)
  if (cat?.subCategories && cat.subCategories.length > 0) {
    activeSubCategoryId.value = cat.subCategories[0]?.id || null
  } else {
    activeSubCategoryId.value = null
  }
}

onMounted(() => {
  selectCategory(activeCategoryId.value)
})

const selectSubCategory = (id: string) => {
  activeSubCategoryId.value = id
}

const filteredItems = computed(() => {
  return menuConfig.items.filter(item => {
    if (item.categoryId !== activeCategoryId.value) return false
    if (activeCategory.value?.subCategories && item.subCategoryId !== activeSubCategoryId.value) {
      return false
    }
    return true
  })
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
