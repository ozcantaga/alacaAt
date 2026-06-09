<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <div
      v-for="(amenity, index) in amenities"
      :key="index"
      class="group text-center p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg bg-(--ui-bg-elevated) animate-fade-in-up"
      :style="{ animationDelay: `${(index % 4) * 100 + 100}ms` }"
    >
      <!-- Icon -->
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
        <UIcon :name="amenity.icon" class="w-7 h-7" />
      </div>

      <!-- Name -->
      <h3 class="text-sm font-semibold mb-2">
        {{ t(amenity.name) }}
      </h3>

      <!-- Description -->
      <p class="text-xs leading-relaxed">
        {{ t(amenity.description) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HotelAmenity } from '~~/config/hotel.config'

const { t } = useHotelConfig()

defineProps<{
  amenities: HotelAmenity[]
}>()
</script>
