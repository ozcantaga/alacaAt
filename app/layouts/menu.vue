<template>
  <div id="app-root-menu" class="min-h-screen flex flex-col bg-(--color-page-bg) transition-colors duration-500" :class="{ 'dark': isDark }">
    <!-- Standard Top Bar -->
    <LayoutTopBar />

    <!-- Centered Logo with Dark Mode Toggle -->
    <header class="py-4 relative flex justify-center items-center bg-transparent transition-colors duration-500">
      <NuxtLink :to="localePath('/')" class="block">
        <NuxtImg
          :src="config.images.logo"
          :alt="config.name"
          width="180"
          height="180"
          class="h-24 w-auto object-contain drop-shadow-md hover:drop-shadow-xl transition-all duration-300"
        />
      </NuxtLink>
      
      <!-- Dark Mode Toggle -->
      <button 
        @click="isDark = !isDark" 
        class="absolute right-6 top-1/2 -translate-y-1/2 p-2 opacity-50 hover:opacity-100 transition-all duration-300"
        :class="isDark ? 'text-white' : 'text-gray-700'"
        aria-label="Toggle Dark Mode"
      >
        <UIcon 
          :name="isDark ? 'i-heroicons-sun-solid' : 'i-heroicons-moon-solid'" 
          class="w-7 h-7" 
        />
      </button>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const { config } = useHotelConfig()
const localePath = useLocalePath()

const isDark = ref(false)

onMounted(() => {
  if (import.meta.client) {
    if (localStorage.getItem('custom-theme') === 'dark' || document.body.classList.contains('theme-dark')) {
      isDark.value = true
      document.body.classList.add('theme-dark')
    }
  }
})

watch(isDark, (val) => {
  if (import.meta.client) {
    if (val) {
      document.body.classList.add('theme-dark')
      localStorage.setItem('custom-theme', 'dark')
    } else {
      document.body.classList.remove('theme-dark')
      localStorage.setItem('custom-theme', 'light')
    }
  }
})
</script>


