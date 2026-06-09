<template>
  <div class="p-2 md:p-3 rounded-2xl overflow-hidden shadow-inner bg-black/5 ">
    <iframe
      :src="mapUrl"
      :title="$t('contact.mapTitle')"
      class="w-full rounded-xl"
      :height="height"
      style="border: 0"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
</template>

<script setup lang="ts">
const { config } = useHotelConfig()

withDefaults(defineProps<{
  height?: string
}>(), {
  height: '400',
})

const mapUrl = computed(() => {
  const { lat, lng, mapZoom } = config.location
  return `https://www.google.com/maps?q=${lat},${lng}&z=${mapZoom}&output=embed`
})
</script>
