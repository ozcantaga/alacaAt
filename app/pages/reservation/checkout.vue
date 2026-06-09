<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { config, getRoom, t: tRoom, formatHotelName } = useHotelConfig()
const { reservationState, basePrices, fetchBasePrices } = useReservation()

const roomSlug = route.query.room as string
const room = computed(() => getRoom(roomSlug))

// Image Slider
const currentImageIndex = ref(0)
const nextImage = () => {
  if (room.value) currentImageIndex.value = (currentImageIndex.value + 1) % room.value.images.length
}
const prevImage = () => {
  if (room.value) currentImageIndex.value = (currentImageIndex.value - 1 + room.value.images.length) % room.value.images.length
}

// Form state
const guestForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  requests: ''
})
const formErrors = ref<Record<string, boolean>>({})

const paymentMethod = ref('bank-transfer') // 'bank-transfer' | 'pay-at-hotel' | 'online-card'

const paymentOptions = [
  {
    id: 'bank-transfer',
    icon: 'i-heroicons-building-library',
    title: 'Havale / EFT',
    desc: 'IBAN\'a transfer, giriş öncesi ödeme',
    badge: 'En Popüler',
  },
  {
    id: 'pay-at-hotel',
    icon: 'i-heroicons-home-modern',
    title: 'Otelde Ödeme',
    desc: 'Giriş tarihinde nakit veya kart',
    badge: null,
  },
  {
    id: 'online-card',
    icon: 'i-heroicons-credit-card',
    title: 'Online Kredi Kartı',
    desc: 'Güvenli ödeme sayfasına yönlendirilirsiniz',
    badge: null,
  },
]

onMounted(() => {
  if (!roomSlug || !room.value) {
    router.replace('/reservation')
    return
  }
  fetchBasePrices()
})

const checkInDate = computed(() => reservationState.value.checkIn)
const checkOutDate = computed(() => reservationState.value.checkOut)

const nightsCount = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 1
  const start = new Date(checkInDate.value)
  const end = new Date(checkOutDate.value)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 1
})

const pricePerNight = computed(() => {
  if (room.value?.price) return Number(room.value.price)
  const matchId = (room.value?.apiId || room.value?.slug || '').toString()
  return basePrices.value[matchId]?.price ? Number(basePrices.value[matchId].price) : 0
})

const currency = computed(() => {
  if (room.value?.currency) return room.value.currency
  const matchId = (room.value?.apiId || room.value?.slug || '').toString()
  return basePrices.value[matchId]?.currency || '₺'
})

// Fiyat hesaplamaları — %15 indirim
const DISCOUNT_RATE = 0.15
const originalPricePerNight = computed(() => Math.round(pricePerNight.value / (1 - DISCOUNT_RATE)))
const originalTotal = computed(() => originalPricePerNight.value * nightsCount.value)
const totalPrice = computed(() => pricePerNight.value * nightsCount.value)
const savedAmount = computed(() => originalTotal.value - totalPrice.value)

// Form doğrulama
const validateForm = () => {
  const errors: Record<string, boolean> = {}
  if (!guestForm.value.firstName.trim()) errors.firstName = true
  if (!guestForm.value.lastName.trim()) errors.lastName = true
  if (!guestForm.value.email.trim() || !guestForm.value.email.includes('@')) errors.email = true
  if (!guestForm.value.phone.trim()) errors.phone = true
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const isSubmitting = ref(false)
const bookingError = ref('')
const bookingSuccess = ref<null | {
  confirmationCode: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  total: string
  whatsappUrl: string
}>(null)

const handleComplete = async () => {
  if (!validateForm()) {
    // Hata alanına scroll
    const firstError = document.querySelector('.border-red-400')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  isSubmitting.value = true
  bookingError.value = ''

  try {
    const result = await $fetch('/api/booking', {
      method: 'POST',
      body: {
        roomExternalId: room.value?.apiId || room.value?.slug,
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        guest: {
          firstName: guestForm.value.firstName,
          lastName: guestForm.value.lastName,
          email: guestForm.value.email,
          phone: guestForm.value.phone,
          note: guestForm.value.requests,
        },
        adults: reservationState.value.guests.adults,
        children: reservationState.value.guests.childrenFree + reservationState.value.guests.childrenDiscount + reservationState.value.guests.childrenAdult,
        rateCode: room.value?.rateCode,
      }
    })

    if (result.success) {
      // Online kart ödemesi — HotelRunner/ElektraWeb ödeme sayfasına yönlendir
      if (paymentMethod.value === 'online-card' && result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl
        return
      }

      // Havale / Otelde ödeme — Başarı modalini göster + WhatsApp mesajı hazırla
      const phone = config.contact?.whatsapp || config.contact?.phone || ''
      let cleaned = phone.replace(/[^0-9]/g, '')
      if (cleaned.startsWith('0')) cleaned = '9' + cleaned
      else if (!cleaned.startsWith('90') && cleaned.length === 10) cleaned = '90' + cleaned

      const roomName = room.value ? tRoom(room.value.name) : ''
      const checkIn = checkInDate.value ? new Date(checkInDate.value).toLocaleDateString('tr-TR') : '-'
      const checkOut = checkOutDate.value ? new Date(checkOutDate.value).toLocaleDateString('tr-TR') : '-'
      const adults = reservationState.value.guests.adults
      const children = reservationState.value.guests.childrenFree + reservationState.value.guests.childrenDiscount
      const confirmCode = result.data?.confirmationCode || ''

      const paymentLabel = paymentMethod.value === 'bank-transfer' ? 'Havale / EFT'
        : paymentMethod.value === 'pay-at-hotel' ? 'Otelde Ödeme (Giriş Tarihinde)'
        : 'Online Kredi Kartı'

      const msg = `Merhaba, www.alacathotel.com.tr üzerinden iletişime geçiyorum.\n\n` +
        `Rezervasyon Talebim:\n` +
        (confirmCode ? `Onay Kodu: ${confirmCode}\n` : '') +
        `Oda: ${roomName}\n` +
        `Giriş: ${checkIn}\n` +
        `Çıkış: ${checkOut}\n` +
        `Kişi: ${adults} Yetişkin${children > 0 ? `, ${children} Çocuk` : ''}\n` +
        `Ödeme Yöntemi: ${paymentLabel}\n` +
        `Toplam Fiyat: ${currency.value}${totalPrice.value} (Sitedeki %15 İndirimli Fiyat)\n\n` +
        `İletişim Bilgilerim:\n` +
        `İsim: ${guestForm.value.firstName} ${guestForm.value.lastName}\n` +
        `Telefon: ${guestForm.value.phone}\n` +
        `E-posta: ${guestForm.value.email}\n` +
        `Özel İstek: ${guestForm.value.requests || '-'}`

      const encoded = encodeURIComponent(msg)

      // Başarı modalini göster
      bookingSuccess.value = {
        confirmationCode: confirmCode,
        roomName,
        checkIn,
        checkOut,
        nights: nightsCount.value,
        total: `${currency.value}${totalPrice.value.toLocaleString('tr-TR')}`,
        whatsappUrl: `https://wa.me/${cleaned}?text=${encoded}`,
      }
      // Sayfayı kilitle
      document.body.style.overflow = 'hidden'
    }
  } catch (error: any) {
    bookingError.value = error?.data?.statusMessage || 'Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
    console.error('Booking error:', error)
    // Hata mesajına scroll
    await nextTick()
    const errorEl = document.querySelector('[data-booking-error]')
    errorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccess = (goHome = false) => {
  bookingSuccess.value = null          // modalı kapat
  document.body.style.overflow = ''    // scroll kilidi kaldır
  if (goHome) router.push('/')
}

// Component yıkılınca overflow kilitlenmemiş kalsın diye güvenlik
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen pt-28 pb-20 font-sans bg-(--color-page-bg)">
    <div class="max-w-7xl mx-auto px-4 md:px-6" v-if="room">

      <!-- Page Header -->
      <div class="text-center mb-10 animate-fade-in-up">
        <span class="inline-block text-[9px] font-black tracking-[0.5em] uppercase text-(--text-muted) mb-3">
          {{ t('reservation.checkout.title') }}
        </span>
        <h1 class="font-serif text-4xl md:text-5xl italic text-(--text-heading)">
          {{ t('reservation.checkout.subtitle') }}
        </h1>
        <!-- Trust Bar -->
        <div class="flex items-center justify-center gap-6 mt-4 flex-wrap">
          <span class="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5 text-(--text-highlight)" />
            256-bit SSL Güvenli
          </span>
          <span class="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5 text-(--text-highlight)" />
            Ücretsiz İptal (7 gün öncesine kadar)
          </span>
          <span class="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <UIcon name="i-heroicons-tag" class="w-3.5 h-3.5 text-(--text-highlight)" />
            %15 Web İndirimi
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

        <!-- ════════════════════════════════ -->
        <!-- Left Column: Form & Payment     -->
        <!-- ════════════════════════════════ -->
        <div class="lg:col-span-7 space-y-6">

          <!-- Step 1: Guest Info -->
          <div class="rounded-2xl border border-(--text-muted)/15 bg-(--ui-bg-elevated) shadow-lg p-6 md:p-8">
            <h2 class="font-serif text-xl italic mb-6 flex items-center gap-3 text-(--text-heading)">
              <span class="w-8 h-8 rounded-full flex items-center justify-center not-italic text-sm font-bold text-white shrink-0"
                    style="background-color: var(--text-highlight)">1</span>
              {{ t('reservation.checkout.guestInfo') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Ad -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.firstName') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  v-model="guestForm.firstName"
                  type="text"
                  class="w-full h-12 px-4 rounded-xl border outline-none transition-all text-(--text-body) bg-(--color-page-bg) placeholder:text-(--text-muted)/40"
                  :class="formErrors.firstName ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-(--text-muted)/20 focus:ring-1 focus:ring-(--text-highlight)/50 focus:border-(--text-highlight)'"
                  placeholder="Adınız"
                />
                <p v-if="formErrors.firstName" class="text-xs text-red-500">Bu alan zorunludur.</p>
              </div>
              <!-- Soyad -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.lastName') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  v-model="guestForm.lastName"
                  type="text"
                  class="w-full h-12 px-4 rounded-xl border outline-none transition-all text-(--text-body) bg-(--color-page-bg) placeholder:text-(--text-muted)/40"
                  :class="formErrors.lastName ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-(--text-muted)/20 focus:ring-1 focus:ring-(--text-highlight)/50 focus:border-(--text-highlight)'"
                  placeholder="Soyadınız"
                />
                <p v-if="formErrors.lastName" class="text-xs text-red-500">Bu alan zorunludur.</p>
              </div>
              <!-- E-posta -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.email') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  v-model="guestForm.email"
                  type="email"
                  class="w-full h-12 px-4 rounded-xl border outline-none transition-all text-(--text-body) bg-(--color-page-bg) placeholder:text-(--text-muted)/40"
                  :class="formErrors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-(--text-muted)/20 focus:ring-1 focus:ring-(--text-highlight)/50 focus:border-(--text-highlight)'"
                  placeholder="ornek@email.com"
                />
                <p v-if="formErrors.email" class="text-xs text-red-500">Geçerli bir e-posta giriniz.</p>
              </div>
              <!-- Telefon -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.phone') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  v-model="guestForm.phone"
                  type="tel"
                  class="w-full h-12 px-4 rounded-xl border outline-none transition-all text-(--text-body) bg-(--color-page-bg) placeholder:text-(--text-muted)/40"
                  :class="formErrors.phone ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-(--text-muted)/20 focus:ring-1 focus:ring-(--text-highlight)/50 focus:border-(--text-highlight)'"
                  placeholder="+90 5xx xxx xx xx"
                />
                <p v-if="formErrors.phone" class="text-xs text-red-500">Bu alan zorunludur.</p>
              </div>
              <!-- Özel İstekler -->
              <div class="md:col-span-2 space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.requests') }}
                  <span class="normal-case tracking-normal font-normal ml-1">(isteğe bağlı)</span>
                </label>
                <textarea
                  v-model="guestForm.requests"
                  rows="3"
                  class="w-full p-4 rounded-xl border border-(--text-muted)/20 focus:ring-1 focus:ring-(--text-highlight)/50 focus:border-(--text-highlight) outline-none transition-all resize-none text-(--text-body) bg-(--color-page-bg) placeholder:text-(--text-muted)/40"
                  placeholder="Erken giriş, yüksek kat tercihi vb."
                />
              </div>
            </div>
          </div>

          <!-- Step 2: Payment -->
          <div class="rounded-2xl border border-(--text-muted)/15 bg-(--ui-bg-elevated) shadow-lg p-6 md:p-8">
            <h2 class="font-serif text-xl italic mb-6 flex items-center gap-3 text-(--text-heading)">
              <span class="w-8 h-8 rounded-full flex items-center justify-center not-italic text-sm font-bold text-white shrink-0"
                    style="background-color: var(--text-highlight)">2</span>
              {{ t('reservation.checkout.payment') }}
            </h2>

            <!-- Ödeme Yöntemi Seçimi -->
            <div class="space-y-3 mb-6">
              <button
                v-for="opt in paymentOptions"
                :key="opt.id"
                @click="paymentMethod = opt.id"
                class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left"
                :class="paymentMethod === opt.id
                  ? 'border-(--text-highlight) bg-(--text-highlight)/5'
                  : 'border-(--text-muted)/15 bg-(--color-page-bg) hover:border-(--text-muted)/30'"
              >
                <!-- Radio dot -->
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                     :class="paymentMethod === opt.id ? 'border-(--text-highlight)' : 'border-(--text-muted)/40'">
                  <div v-if="paymentMethod === opt.id" class="w-2.5 h-2.5 rounded-full" style="background-color: var(--text-highlight)" />
                </div>
                <!-- Icon -->
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                     :class="paymentMethod === opt.id ? 'text-white' : 'text-(--text-muted) bg-(--text-muted)/10'"
                     :style="paymentMethod === opt.id ? 'background-color: var(--text-highlight)' : ''">
                  <UIcon :name="opt.icon" class="w-5 h-5" />
                </div>
                <!-- Text -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-sm text-(--text-heading)">{{ opt.title }}</span>
                    <span v-if="opt.badge"
                      class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      :class="opt.badge === 'Yakında' ? 'bg-(--text-muted)/10 text-(--text-muted)' : 'text-white'"
                      :style="opt.badge !== 'Yakında' ? 'background-color: var(--text-highlight)' : ''"
                    >{{ opt.badge }}</span>
                  </div>
                  <p class="text-xs text-(--text-muted) mt-0.5">{{ opt.desc }}</p>
                </div>
              </button>
            </div>

            <!-- Seçilen Yönteme Göre Detay -->
            <!-- Havale / EFT -->
            <div v-if="paymentMethod === 'bank-transfer'" class="p-5 rounded-2xl border border-(--text-muted)/15 bg-(--color-page-bg) animate-fade-in">
              <div class="flex items-start gap-3 mb-4">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mt-0.5 shrink-0" style="color: var(--text-highlight)" />
                <p class="text-sm text-(--text-muted) leading-relaxed">
                  Rezervasyon talebiniz <strong class="text-(--text-heading)">HotelRunner</strong> sistemine iletilir.
                  Onay bildirimi WhatsApp üzerinden ulaşır. Ödemeyi aşağıdaki IBAN'a yapın.
                </p>
              </div>
              <div class="p-4 rounded-xl border border-(--text-muted)/20 bg-(--ui-bg-elevated) space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">Banka</span>
                  <span class="font-semibold text-sm text-(--text-heading)">Garanti BBVA — Çeşme</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">Alıcı</span>
                  <span class="font-semibold text-sm text-(--text-heading)"><span v-html="formatHotelName()" /> Turizm A.Ş.</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">{{ t('reservation.checkout.iban') }}</span>
                  <span class="font-mono font-semibold text-sm select-all text-(--text-heading)">TR12 0006 2000 0001 2345 6789 00</span>
                </div>
              </div>
              <p class="text-xs text-(--text-muted) mt-3">
                <UIcon name="i-heroicons-exclamation-circle" class="w-3.5 h-3.5 inline mr-1" />
                Açıklama kısmına <strong>adınızı-soyadınızı</strong> ve <strong>giriş tarihinizi</strong> yazmayı unutmayın.
              </p>
            </div>

            <!-- Otelde Ödeme -->
            <div v-else-if="paymentMethod === 'pay-at-hotel'" class="p-5 rounded-2xl border border-(--text-muted)/15 bg-(--color-page-bg) animate-fade-in">
              <div class="flex items-start gap-3 mb-4">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mt-0.5 shrink-0" style="color: var(--text-highlight)" />
                <p class="text-sm text-(--text-muted) leading-relaxed">
                  Rezervasyon talebiniz <strong class="text-(--text-heading)">HotelRunner</strong> sistemine iletilir.
                  Ödemenizi giriş tarihinde <strong class="text-(--text-heading)">nakit veya kredi kartıyla</strong> otelde yapabilirsiniz.
                </p>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600 shrink-0" />
                <p class="text-xs text-amber-700">
                  Otelde ödeme seçeneğinde iptal koşulları farklılık gösterebilir. Giriş tarihinden 48 saat önce bildirim yapılması gerekmektedir.
                </p>
              </div>
            </div>

            <!-- Online Kredi Kartı -->
            <div v-else-if="paymentMethod === 'online-card'" class="p-5 rounded-2xl border border-(--text-muted)/15 bg-(--color-page-bg) animate-fade-in">
              <div class="flex items-start gap-3 mb-4">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 mt-0.5 shrink-0" style="color: var(--text-highlight)" />
                <div>
                  <p class="text-sm text-(--text-muted) leading-relaxed mb-2">
                    Rezervasyon talebiniz kaydedildikten sonra sizi <strong class="text-(--text-heading)">iyzico / HotelRunner</strong>
                    güvenli ödeme sayfasına yönlendireceğiz. Kart bilgileriniz <strong class="text-(--text-heading)">yalnızca</strong>
                    bu sertifikalı sistem üzerinden işlenir — sitemize hiçbir kart verisi iletilmez.
                  </p>
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="flex items-center gap-1 text-xs text-(--text-muted)">
                      <UIcon name="i-heroicons-lock-closed" class="w-3 h-3" /> PCI-DSS Level 1
                    </span>
                    <span class="flex items-center gap-1 text-xs text-(--text-muted)">
                      <UIcon name="i-heroicons-shield-check" class="w-3 h-3" /> 3D Secure
                    </span>
                    <span class="flex items-center gap-1 text-xs text-(--text-muted)">
                      <UIcon name="i-heroicons-check-badge" class="w-3 h-3" /> SSL 256-bit
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 p-3 rounded-xl text-xs font-medium" style="background-color: var(--text-highlight); color: white">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 shrink-0" />
                Bu özellik yakında aktif olacak. Şimdilik Havale/EFT veya Otelde Ödeme seçeneklerini kullanabilirsiniz.
              </div>
            </div>

            <!-- Hata -->
            <div
              v-if="bookingError"
              data-booking-error
              class="mt-4 p-4 rounded-xl border border-red-300 text-sm"
              style="background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.3); color: #dc2626"
            >
              <div class="flex items-start gap-3">
                <UIcon name="i-heroicons-x-circle" class="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p class="font-bold mb-0.5">Rezervasyon Oluşturulamadı</p>
                  <p class="text-xs opacity-80">{{ bookingError }}</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              @click="handleComplete"
              :disabled="isSubmitting"
              class="mt-6 w-full h-14 px-8 rounded-2xl font-bold tracking-widest uppercase text-sm shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              style="background-color: var(--color-primary-500)"
            >
              <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              <UIcon v-else-if="paymentMethod === 'online-card'" name="i-heroicons-arrow-right" class="w-5 h-5" />
              <UIcon v-else name="i-heroicons-check-circle" class="w-5 h-5" />
              {{ isSubmitting ? 'Rezervasyon Oluşturuluyor...' : paymentMethod === 'online-card' ? 'Rezervasyonu Oluştur ve Ödemeye Geç' : t('reservation.checkout.complete') }}
            </button>

            <p class="text-center text-xs text-(--text-muted) mt-3">
              <UIcon name="i-heroicons-lock-closed" class="w-3 h-3 inline mr-1" />
              Rezervasyon verileriniz HotelRunner/Elektraweb güvenli altyapısıyla işlenir.
            </p>
          </div>


          <!-- İptal Politikası -->
          <div class="rounded-2xl border border-(--text-muted)/15 bg-(--ui-bg-elevated) shadow-lg p-6 md:p-8">
            <h2 class="font-serif text-xl italic mb-5 flex items-center gap-3 text-(--text-heading)">
              <span class="w-8 h-8 rounded-full flex items-center justify-center not-italic text-sm font-bold text-white shrink-0"
                    style="background-color: var(--text-highlight)">3</span>
              İptal Politikası
            </h2>
            <div class="space-y-3">
              <div class="flex items-start gap-3 p-4 rounded-xl border border-(--text-muted)/15 bg-(--color-page-bg)">
                <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p class="font-bold text-sm text-(--text-heading)">Ücretsiz İptal</p>
                  <p class="text-sm text-(--text-muted) mt-0.5">Giriş tarihinden <strong>7 gün öncesine</strong> kadar yapılan iptallerde tam iade yapılır.</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-xl border border-(--text-muted)/15 bg-(--color-page-bg)">
                <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p class="font-bold text-sm text-(--text-heading)">Kısmi İptal</p>
                  <p class="text-sm text-(--text-muted) mt-0.5">Giriş tarihine <strong>3–7 gün</strong> kala yapılan iptallerde 1 gece tutarı tahsil edilir.</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-xl border border-(--text-muted)/15 bg-(--color-page-bg)">
                <div class="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-heroicons-x-circle" class="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p class="font-bold text-sm text-(--text-heading)">İptal Yapılamaz</p>
                  <p class="text-sm text-(--text-muted) mt-0.5">Giriş tarihine <strong>3 günden az</strong> kalan rezervasyonlarda iade yapılmaz.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ════════════════════════════════ -->
        <!-- Right Column: Order Summary     -->
        <!-- ════════════════════════════════ -->
        <div class="lg:col-span-5">
          <div class="sticky top-28 rounded-2xl border border-(--text-muted)/15 bg-(--ui-bg-elevated) shadow-lg overflow-hidden">

            <!-- Image Slider -->
            <div class="relative aspect-[4/3] overflow-hidden bg-(--color-page-bg)">
              <transition name="img-fade" mode="out-in">
                <NuxtImg
                  :key="currentImageIndex"
                  :src="room.images[currentImageIndex]"
                  :alt="tRoom(room.name)"
                  class="w-full h-full object-cover"
                  sizes="sm:100vw lg:560px"
                />
              </transition>

              <!-- Slider Arrows -->
              <template v-if="room.images.length > 1">
                <button
                  @click="prevImage"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
                </button>
                <button
                  @click="nextImage"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
                </button>
              </template>

              <!-- Dot Indicators -->
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" v-if="room.images.length > 1">
                <button
                  v-for="(_, i) in room.images"
                  :key="i"
                  @click="currentImageIndex = i"
                  class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  :class="i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'"
                />
              </div>

              <!-- Room name overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div class="absolute bottom-8 left-4 right-4 pointer-events-none">
                <h3 class="font-serif text-2xl italic text-white">{{ tRoom(room.name) }}</h3>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-xs text-white/80 flex items-center gap-1">
                    <UIcon name="i-heroicons-user-group" class="w-3.5 h-3.5" />
                    Maks. {{ room.maxGuests }} Misafir
                  </span>
                  <span class="text-xs text-white/80 flex items-center gap-1">
                    <UIcon name="i-heroicons-squares-2x2" class="w-3.5 h-3.5" />
                    {{ room.size }} m²
                  </span>
                </div>
              </div>
            </div>

            <!-- Summary Content -->
            <div class="p-5 md:p-6 space-y-5">

              <!-- Discount Badge -->
              <div class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white"
                   style="background-color: var(--text-highlight)">
                <UIcon name="i-heroicons-tag" class="w-4 h-4" />
                {{ t('reservation.discountBadge') }} Web İndirimi Uygulandı!
              </div>

              <!-- Giriş / Çıkış -->
              <div class="flex items-center justify-between p-4 rounded-xl border border-(--text-muted)/15 bg-(--color-page-bg)">
                <div class="text-center">
                  <span class="block text-[9px] font-bold uppercase tracking-widest text-(--text-muted) mb-1">{{ t('reservation.checkIn') }}</span>
                  <ClientOnly>
                    <span class="font-bold text-sm text-(--text-heading)">{{ checkInDate ? new Date(checkInDate).toLocaleDateString('tr-TR') : '-' }}</span>
                    <template #fallback><span class="font-bold text-sm">-</span></template>
                  </ClientOnly>
                </div>
                <div class="flex flex-col items-center">
                  <div class="w-8 h-[1px] bg-(--text-muted)/20" />
                  <span class="text-[9px] text-(--text-muted) mt-1">
                    <ClientOnly>{{ nightsCount }} Gece<template #fallback>-</template></ClientOnly>
                  </span>
                </div>
                <div class="text-center">
                  <span class="block text-[9px] font-bold uppercase tracking-widest text-(--text-muted) mb-1">{{ t('reservation.checkOut') }}</span>
                  <ClientOnly>
                    <span class="font-bold text-sm text-(--text-heading)">{{ checkOutDate ? new Date(checkOutDate).toLocaleDateString('tr-TR') : '-' }}</span>
                    <template #fallback><span class="font-bold text-sm">-</span></template>
                  </ClientOnly>
                </div>
              </div>

              <!-- Misafirler -->
              <div class="flex items-center gap-3 px-1">
                <UIcon name="i-heroicons-users" class="w-4 h-4 text-(--text-muted)" />
                <span class="text-sm text-(--text-body)">
                  {{ reservationState.guests.adults }} {{ t('reservation.adult') }}
                  <template v-if="reservationState.guests.childrenFree + reservationState.guests.childrenDiscount > 0">
                    , {{ reservationState.guests.childrenFree + reservationState.guests.childrenDiscount }} {{ t('reservation.child') }}
                  </template>
                </span>
              </div>

              <div class="h-px bg-(--text-muted)/10" />

              <!-- Fiyat Detayı -->
              <div class="space-y-2.5">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-(--text-muted)">Gecelik (İndirimli)</span>
                  <span class="text-(--text-body)">{{ currency }}{{ pricePerNight.toLocaleString('tr-TR') }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-(--text-muted)">Gece Sayısı</span>
                  <ClientOnly>
                    <span class="text-(--text-body)">{{ nightsCount }} gece</span>
                    <template #fallback><span>-</span></template>
                  </ClientOnly>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-(--text-muted)">Liste Fiyatı (%15 İndirim Öncesi)</span>
                  <ClientOnly>
                    <span class="line-through text-(--text-muted)/60">{{ currency }}{{ originalTotal.toLocaleString('tr-TR') }}</span>
                    <template #fallback><span class="line-through text-(--text-muted)/60">-</span></template>
                  </ClientOnly>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="font-medium" style="color: var(--text-highlight)">İndirim Tutarı</span>
                  <ClientOnly>
                    <span class="font-bold" style="color: var(--text-highlight)">-{{ currency }}{{ savedAmount.toLocaleString('tr-TR') }}</span>
                    <template #fallback><span>-</span></template>
                  </ClientOnly>
                </div>
              </div>

              <!-- TOPLAM -->
              <div class="pt-4 border-t border-(--text-muted)/15">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold uppercase tracking-widest text-(--text-heading)">{{ t('reservation.checkout.total') }}</span>
                  <div class="text-right">
                    <ClientOnly>
                      <div class="text-2xl font-black" style="color: var(--text-highlight)">
                        {{ currency }}{{ totalPrice.toLocaleString('tr-TR') }}
                      </div>
                      <div class="text-xs text-(--text-muted) mt-0.5">Tüm vergiler dahil</div>
                      <template #fallback>
                        <div class="text-2xl font-black" style="color: var(--text-highlight)">—</div>
                      </template>
                    </ClientOnly>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- BAŞARI MODALİ -->
  <!-- ═══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="bookingSuccess"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); cursor: pointer"
        @click="closeSuccess(false)"
      >
        <div
          class="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          style="background: var(--ui-bg-elevated); border: 1px solid color-mix(in srgb, var(--text-muted) 20%, transparent)"
          @click.stop
        >
          <!-- Çıkma X butonu -->
          <button
            @click="closeSuccess(false)"
            class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style="background: color-mix(in srgb, var(--text-muted) 12%, transparent); color: var(--text-muted)"
            title="Kapat"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
          <!-- Üst yeşil bant -->
          <div class="h-2 w-full" style="background: linear-gradient(90deg, #22c55e, #16a34a)" />

          <div class="p-8">
            <!-- İkon -->
            <div class="flex justify-center mb-5">
              <div class="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                   style="background: linear-gradient(135deg, #22c55e, #16a34a)">
                <UIcon name="i-heroicons-check" class="w-10 h-10 text-white" />
              </div>
            </div>

            <!-- Başlık -->
            <div class="text-center mb-6">
              <h2 class="font-serif text-2xl italic mb-1" style="color: var(--text-heading)">Rezervasyon Alındı!</h2>
              <p class="text-sm" style="color: var(--text-muted)">Talebiniz başarıyla oluşturuldu.</p>
              <div
                v-if="bookingSuccess.confirmationCode"
                class="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-white"
                style="background-color: var(--text-highlight)"
              >
                Onay: {{ bookingSuccess.confirmationCode }}
              </div>
            </div>

            <!-- Detaylar -->
            <div class="rounded-2xl p-4 mb-6 space-y-3" style="background: var(--color-page-bg); border: 1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)">
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-muted)">Oda</span>
                <span class="font-semibold" style="color: var(--text-heading)">{{ bookingSuccess.roomName }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-muted)">Giriş</span>
                <span class="font-semibold" style="color: var(--text-heading)">{{ bookingSuccess.checkIn }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-muted)">Ayrılış</span>
                <span class="font-semibold" style="color: var(--text-heading)">{{ bookingSuccess.checkOut }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span style="color: var(--text-muted)">Süre</span>
                <span class="font-semibold" style="color: var(--text-heading)">{{ bookingSuccess.nights }} Gece</span>
              </div>
              <div class="h-px" style="background: color-mix(in srgb, var(--text-muted) 12%, transparent)" />
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-heading)">Toplam</span>
                <span class="text-xl font-black" style="color: var(--text-highlight)">{{ bookingSuccess.total }}</span>
              </div>
            </div>

            <!-- Butonlar -->
            <div class="space-y-3">
              <a
                :href="bookingSuccess.whatsappUrl"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style="background: #25D366"
                @click="closeSuccess(false)"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.994 0C5.369 0 0 5.369 0 11.994c0 2.1.546 4.07 1.5 5.784L0 24l6.386-1.476A11.94 11.94 0 0011.994 24C18.619 24 24 18.631 24 11.994 24 5.369 18.619 0 11.994 0zm0 21.818c-1.855 0-3.604-.501-5.104-1.376l-.366-.217-3.789.875.893-3.688-.239-.379A9.813 9.813 0 012.182 12c0-5.415 4.407-9.818 9.812-9.818 5.416 0 9.824 4.403 9.824 9.818 0 5.416-4.408 9.818-9.824 9.818z"/>
                </svg>
                WhatsApp ile Onayla
              </a>
              <button
                @click="closeSuccess(true)"
                class="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style="background: color-mix(in srgb, var(--text-muted) 10%, transparent); color: var(--text-body)"
              >
                <UIcon name="i-heroicons-home" class="w-4 h-4" />
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>

<style scoped>
.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity 0.4s ease;
}
.img-fade-enter-from,
.img-fade-leave-to {
  opacity: 0;
}

/* Başarı Modalı Animasyonu */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.92) translateY(8px);
  opacity: 0;
}
</style>

