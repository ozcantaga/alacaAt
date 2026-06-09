<template>
  <section class="py-16">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <h2 v-if="titleKey" class="text-2xl sm:text-3xl font-heading font-bold mb-4">
        {{ $t(titleKey) }}
      </h2>
      <p v-if="descriptionKey" class="mb-8">{{ $t(descriptionKey) }}</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink v-if="primaryButtonKey" :to="localePath(primaryLink)">
          <UButton
            :label="$t(primaryButtonKey)"
            size="lg"
            class="border-0"
            trailing-icon="i-heroicons-arrow-right"
            color="primary"
          />
        </NuxtLink>
        <NuxtLink v-if="secondaryButtonKey" :to="localePath(secondaryLink)">
          <UButton
            :label="$t(secondaryButtonKey)"
            size="lg"
            variant="outline"
            color="primary"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

withDefaults(defineProps<{
  titleKey?: string
  descriptionKey?: string
  primaryButtonKey?: string
  primaryLink?: string
  secondaryButtonKey?: string
  secondaryLink?: string
}>(), {
  primaryLink: '/reservation',
  secondaryLink: '/contact',
})
</script>
