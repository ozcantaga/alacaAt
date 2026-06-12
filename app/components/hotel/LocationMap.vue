<template>
  <div class="p-2 md:p-3 rounded-2xl overflow-hidden shadow-inner bg-black/5 flex items-center justify-center" :style="{ minHeight: height + 'px' }">
    <iframe v-if="loadBelowFold"
      :src="mapUrl"
      :title="$t('contact.mapTitle')"
      class="w-full rounded-xl"
      :height="height"
      style="border: 0"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
    <div v-else class="animate-pulse w-full h-full bg-black/5 rounded-xl"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

const loadBelowFold = ref(false)

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
  
  interactionTimer = setTimeout(init, 8500)
  window.addEventListener('scroll', init, { passive: true, once: true })
  window.addEventListener('mousemove', init, { passive: true, once: true })
  window.addEventListener('touchstart', init, { passive: true, once: true })
  window.addEventListener('keydown', init, { passive: true, once: true })
})
</script>
