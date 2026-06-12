<template>
  <div id="app-root" class="min-h-screen flex flex-col">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LazyLayoutAppFooter />

    <ClientOnly>
      <LazyHotelReservationBar v-if="deferReservationBar" />
    </ClientOnly>

    <!-- Back to Top Button -->
    <Transition name="fade-slide">
      <button
        v-if="showBackToTop"
        id="back-to-top-btn"
        aria-label="Yukarı Çık"
        class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer bg-(--ui-bg-elevated) text-(--text-heading) border-none"
        @click="scrollToTop"
      >
        <UIcon name="i-heroicons-arrow-up" class="w-6 h-6" />
      </button>
    </Transition>


  </div>
</template>

<script setup lang="ts">
const { config } = useHotelConfig()
const showBackToTop = ref(false)
const deferReservationBar = ref(false)

let interactionTimer: ReturnType<typeof setTimeout> | null = null

const initReservationBar = () => {
  if (deferReservationBar.value) return
  deferReservationBar.value = true
  if (interactionTimer) clearTimeout(interactionTimer)
  
  if (import.meta.client) {
    window.removeEventListener('scroll', initReservationBar)
    window.removeEventListener('mousemove', initReservationBar)
    window.removeEventListener('touchstart', initReservationBar)
  }
}

const handleScroll = () => {
  window.requestAnimationFrame(() => {
    showBackToTop.value = window.scrollY > 400
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Defer heavy ReservationBar until user interacts or 20 seconds pass
  interactionTimer = setTimeout(initReservationBar, 20000)
  window.addEventListener('scroll', initReservationBar, { passive: true, once: true })
  window.addEventListener('mousemove', initReservationBar, { passive: true, once: true })
  window.addEventListener('touchstart', initReservationBar, { passive: true, once: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
