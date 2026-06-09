<template>
  <header class="max-w-5xl mx-auto px-6 mb-12 text-center animate-fade-in-up" :class="headerClass">
    <!-- Badge -->
    <div class="inline-flex items-center gap-2 mb-4">
      <span class="w-6 h-[1px] opacity-40"></span>
      <span class="text-[9px] font-black tracking-[0.5em] uppercase text-(--text-body)">
        {{ badgeText }}
      </span>
      <span class="w-6 h-[1px] opacity-40"></span>
    </div>

    <!-- Title -->
    <h1 class="font-serif text-4xl md:text-6xl italic leading-tight text-(--text-heading)">
      <template v-if="highlightLastWord">
        {{ titleWords.before }} <span class="text-(--text-highlight)">{{ titleWords.after }}</span>
      </template>
      <template v-else>
        {{ titleText }}
      </template>
    </h1>

    <!-- Subtitle -->
    <p v-if="subtitleText" class="mt-6 text-lg max-w-2xl mx-auto leading-relaxed text-(--text-body)">
      {{ subtitleText }}
    </p>

    <!-- Slot for extra content (e.g. category filters) -->
    <slot />
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = withDefaults(defineProps<{
  badge?: string          // i18n key veya direkt string
  title?: string          // i18n key veya direkt string
  subtitle?: string       // i18n key veya direkt string
  highlightLastWord?: boolean  // Son kelimeyi highlight renginde göster
  headerClass?: string
}>(), {
  highlightLastWord: false,
  headerClass: '',
})

const badgeText = computed(() => props.badge ? t(props.badge) : '')
const titleText = computed(() => props.title ? t(props.title) : '')
const subtitleText = computed(() => props.subtitle ? t(props.subtitle) : '')

// Başlığı ilk kelimeler + son kelime(ler) olarak ayır
const titleWords = computed(() => {
  const full = titleText.value
  const parts = full.split(' ')
  if (parts.length <= 1) return { before: '', after: full }
  return {
    before: parts.slice(0, 1).join(' '),
    after: parts.slice(1).join(' ')
  }
})
</script>
