<template>
  <div class="min-h-screen pt-32 pb-20" data-allow-mismatch>
    <!-- Header -->
    <SharedPageHeader
      badge="nav.rooms"
      title="rooms.title"
      subtitle="rooms.subtitle"
      :highlight-last-word="true"
    />

    <!-- Rooms Grid -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HotelRoomCard
            v-for="(room, index) in visibleRooms"
            :key="room.slug"
            :room="room"
            :priority="index < 3"
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <template v-if="loadBelowFold || !isClient">
      <SharedCtaSection
        title-key="home.ctaTitle"
        description-key="rooms.priceOnRequest"
        primary-button-key="nav.bookNow"
        primary-link="/reservation"
        secondary-button-key="nav.contact"
        secondary-link="/contact"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { config, getRooms } = useHotelConfig()
const localePath = useLocalePath()

const isClient = import.meta.client
const loadBelowFold = ref(false)
const clientLimit = ref(1)

if (isClient) {
  clientLimit.value = window.innerWidth >= 1024 ? 3 : 1
}

const visibleRooms = computed(() => {
  const allRooms = getRooms()
  if (!isClient || loadBelowFold.value) return allRooms
  return allRooms.slice(0, clientLimit.value)
})

onMounted(() => {
  let interactionTimer: ReturnType<typeof setTimeout> | null = null
  const init = () => {
    if (loadBelowFold.value) return
    loadBelowFold.value = true
    if (interactionTimer) clearTimeout(interactionTimer)
    window.removeEventListener('scroll', init)
    window.removeEventListener('mousemove', init)
    window.removeEventListener('touchstart', init)
    window.removeEventListener('keydown', init)
  }
  
  interactionTimer = setTimeout(init, 1500)
  window.addEventListener('scroll', init, { passive: true, once: true })
  window.addEventListener('mousemove', init, { passive: true, once: true })
  window.addEventListener('touchstart', init, { passive: true, once: true })
  window.addEventListener('keydown', init, { passive: true, once: true })
})

useHead({
  title: `${useI18n().t('rooms.title')}`,
})

useSeoMeta({
  description: useI18n().t('rooms.subtitle'),
  ogTitle: `${useI18n().t('rooms.title')} | ${config.name}`,
})
</script>
