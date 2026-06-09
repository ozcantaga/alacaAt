<template>
  <div class="min-h-screen flex items-center justify-center bg-(--ui-bg)">
    <div class="text-center px-4 max-w-xl mx-auto">
      <div class="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-(--ui-bg-elevated) shadow-sm border border-(--ui-border)">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-(--color-primary-500)" />
      </div>
      
      <h1 class="text-6xl md:text-8xl font-heading font-bold text-(--ui-text-highlighted) mb-4">
        {{ error?.statusCode || 404 }}
      </h1>
      
      <h2 class="text-2xl md:text-3xl font-heading font-medium text-(--ui-text) mb-6">
        Sayfa Bulunamadı
      </h2>
      
      <p class="text-(--ui-text-muted) mb-10 text-lg leading-relaxed">
        Aradığınız sayfa taşınmış, silinmiş veya geçici olarak kullanılamıyor olabilir. Lütfen URL'yi kontrol edin veya ana sayfaya dönerek gezinmeye devam edin.
      </p>

      <div class="mb-10">
        <UButton
          size="xl"
          class="bg-(--color-primary-500) hover:bg-(--color-primary-600) text-white border-0 px-8 rounded-full transition-transform hover:scale-105"
          @click="handleError"
        >
          Ana Sayfaya Dön
        </UButton>
      </div>

      <!-- Contact Info Section -->
      <div class="pt-8 border-t border-(--ui-border) text-left">
        <h3 class="text-lg font-heading font-semibold text-(--ui-text-highlighted) mb-4 text-center">
          Yardıma mı ihtiyacınız var? Bize Ulaşın
        </h3>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a :href="`tel:${config.contact.phone}`" class="flex items-center gap-2 text-(--ui-text-muted) hover:text-(--color-primary-500) transition-colors">
            <UIcon name="i-heroicons-phone" class="w-5 h-5" />
            {{ config.contact.phone }}
          </a>
          <a :href="`mailto:${config.contact.email}`" class="flex items-center gap-2 text-(--ui-text-muted) hover:text-(--color-primary-500) transition-colors">
            <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
            {{ config.contact.email }}
          </a>
          <a v-if="config.contact.whatsapp" :href="`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}`" target="_blank" rel="noopener" class="flex items-center gap-2 text-(--ui-text-muted) hover:text-(--color-primary-500) transition-colors">
            <UIcon name="i-simple-icons-whatsapp" class="w-5 h-5" />
            WhatsApp Destek
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clearError } from 'nuxt/app'
import { useHotelConfig } from './composables/useHotelConfig'

const { config } = useHotelConfig()

const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>
