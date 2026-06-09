<template>
  <component
    :is="to ? (isExternal ? 'a' : NuxtLink) : 'button'"
    :to="!isExternal ? to : undefined"
    :href="isExternal ? to : undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :aria-label="ariaLabel"
    class="w-10 h-10 rounded-full bg-black/5  hover:bg-(--color-primary-500) text-(--text-heading) hover:text-(--ui-bg-elevated) flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer border-0 ring-0"
    v-bind="$attrs"
  >
    <UIcon :name="name" class="w-5 h-5" />
  </component>
</template>

<script setup lang="ts">
import { resolveComponent, computed } from 'vue'

const props = defineProps<{
  name: string
  to?: string
  ariaLabel?: string
}>()

const NuxtLink = resolveComponent('NuxtLink')

const isExternal = computed(() => {
  if (!props.to) return false
  return props.to.startsWith('http') || props.to.startsWith('mailto:') || props.to.startsWith('tel:')
})
</script>
