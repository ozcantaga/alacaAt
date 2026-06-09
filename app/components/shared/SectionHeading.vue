<template>
  <div class="text-center mb-12 lg:mb-16">
    <span
      v-if="badge"
      class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
    >
      {{ badge }}
    </span>
    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
      {{ title }}
    </h2>
    <hr class="divider-primary mx-auto mb-4" />
    <p
      v-if="subtitle"
      class="text-lg max-w-2xl mx-auto"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  badge?: string
}>()
</script>
