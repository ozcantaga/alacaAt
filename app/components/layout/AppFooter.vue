<template>
  <footer id="app-footer" class="bg-(--color-page-bg) text-(--text-body) transition-colors duration-500">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand Column -->
        <div class="lg:col-span-1">
          <h2 class="text-2xl font-heading font-bold text-(--text-heading) mb-4" v-html="formatHotelName()">
          </h2>
          <div class="star-rating text-sm mb-4">
            <span v-for="s in getStarsArray()" :key="s" class="text-(--icon-primary)">★</span>
          </div>
          <p class="text-(--text-body) text-sm leading-relaxed mb-6">
            {{ t(config.shortDescription) }}
          </p>
          <!-- Social Icons -->
          <div class="flex items-center gap-3">
            <PremiumIcon
              v-if="config.social.instagram"
              name="i-simple-icons-instagram"
              :to="config.social.instagram"
              aria-label="Instagram"
              class="!bg-[#E07A5F] !text-(--text-inverse) hover:!bg-[#C8664D] hover:scale-110 transition-all duration-300"
            />
            <PremiumIcon
              v-if="config.social.whatsapp"
              name="i-simple-icons-whatsapp"
              :to="config.social.whatsapp"
              aria-label="WhatsApp"
              class="!bg-[#25D366] !text-white hover:!bg-[#128C7E] hover:scale-110 transition-all duration-300"
            />
            <PremiumIcon
              v-if="config.social.tripadvisor"
              name="i-simple-icons-tripadvisor"
              :to="config.social.tripadvisor"
              aria-label="TripAdvisor"
              class="!bg-(--color-primary-600) !text-(--text-inverse) hover:!bg-(--color-primary-700) hover:scale-110 transition-all duration-300"
            />
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-(--text-heading) font-semibold text-lg mb-6">
            {{ $t('footer.quickLinks') }}
          </h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks" :key="link.path">
              <NuxtLink
                :to="localePath(link.path)"
                class="text-(--text-body) hover:text-(--icon-primary) transition-colors duration-300 text-sm flex items-center gap-2"
              >
                <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
                {{ $t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-(--text-heading) font-semibold text-lg mb-6">
            {{ $t('footer.contactInfo') }}
          </h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-(--icon-primary) shrink-0 mt-0.5" />
              <span class="text-(--text-body) text-sm leading-relaxed">
                {{ t(config.contact.address) }}<br>
                {{ t(config.contact.city) }}, {{ t(config.contact.country) }}
              </span>
            </li>
            <li class="flex items-center gap-3">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 text-(--icon-primary) shrink-0" />
              <a
                :href="`tel:${config.contact.phone}`"
                class="text-(--text-body) hover:text-(--icon-primary) transition-colors text-sm"
              >
                {{ config.contact.phone }}
              </a>
            </li>
            <li class="flex items-center gap-3">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-(--icon-primary) shrink-0" />
              <a
                :href="`mailto:${config.contact.email}`"
                class="text-(--text-body) hover:text-(--icon-primary) transition-colors text-sm"
              >
                {{ config.contact.email }}
              </a>
            </li>
            <li v-if="config.contact.whatsapp" class="flex items-center gap-3">
              <UIcon name="i-simple-icons-whatsapp" class="w-5 h-5 text-(--icon-primary) shrink-0" />
              <a
                :href="`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}`"
                target="_blank"
                rel="noopener"
                class="text-(--text-body) hover:text-(--icon-primary) transition-colors text-sm"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <!-- Check-in/out Info & Booking -->
        <div>
          <h4 class="text-(--text-heading) font-semibold text-lg mb-6">
            {{ $t('rooms.checkIn') }} / {{ $t('rooms.checkOut') }}
          </h4>
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3 text-sm">
              <div class="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 text-(--icon-primary)" />
              </div>
              <div>
                <span class="text-(--text-body) block text-xs">{{ $t('rooms.checkIn') }}</span>
                <span class="text-(--text-heading) font-medium">{{ config.booking.checkInTime }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <div class="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-5 h-5 text-(--icon-primary)" />
              </div>
              <div>
                <span class="text-(--text-body) block text-xs">{{ $t('rooms.checkOut') }}</span>
                <span class="text-(--text-heading) font-medium">{{ config.booking.checkOutTime }}</span>
              </div>
            </div>
          </div>

          <NuxtLink :to="localePath('/reservation')">
            <UButton
              :label="$t('nav.bookNow')"
              block
              size="lg"
              class="border-0"
              
              trailing-icon="i-heroicons-arrow-right"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-black/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-(--text-body) text-sm">
          © <ClientOnly>{{ currentYear }}<template #fallback>2026</template></ClientOnly> <span v-html="formatHotelName()"></span>. {{ $t('footer.rights') }}
        </p>
        <div class="flex items-center gap-6">
          <a href="#" class="text-(--text-body) hover:text-(--color-primary-500) text-sm transition-colors">
            {{ $t('footer.privacyPolicy') }}
          </a>
          <a href="#" class="text-(--text-body) hover:text-(--color-primary-500) text-sm transition-colors">
            {{ $t('footer.termsOfService') }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { config, t, getStarsArray, formatHotelName } = useHotelConfig()
const localePath = useLocalePath()

const currentYear = new Date().getFullYear()

const footerLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/rooms', label: 'nav.rooms' },
  { path: '/gallery', label: 'nav.gallery' },
  { path: '/guide', label: 'nav.guide' },
  { path: '/about', label: 'nav.about' },
  { path: '/contact', label: 'nav.contact' },
]
</script>
