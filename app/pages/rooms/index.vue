<template>
  <div class="min-h-screen pt-32 pb-20">
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
            v-for="(room, index) in getRooms()"
            :key="room.slug"
            :room="room"
            :priority="index === 0"
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <SharedCtaSection
      title-key="home.ctaTitle"
      description-key="rooms.priceOnRequest"
      primary-button-key="nav.bookNow"
      primary-link="/reservation"
      secondary-button-key="nav.contact"
      secondary-link="/contact"
    />
  </div>
</template>

<script setup lang="ts">
const { config, getRooms } = useHotelConfig()
const localePath = useLocalePath()

useHead({
  title: `${useI18n().t('rooms.title')}`,
})

useSeoMeta({
  description: useI18n().t('rooms.subtitle'),
  ogTitle: `${useI18n().t('rooms.title')} | ${config.name}`,
})
</script>
