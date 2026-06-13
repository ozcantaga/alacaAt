<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// ─── Toast Sistemi ────────────────────────────────────────────────────────────
type Toast = { id: number; type: 'success' | 'error' | 'warning'; title: string; message: string }
const toasts = ref<Toast[]>([])
let _toastId = 0

const showToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
  const id = ++_toastId
  toasts.value.push({ id, type, title, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 6000)
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { t } = useI18n()
const { config, getRoom, t: tRoom, formatHotelName } = useHotelConfig()
const { reservationState, basePrices, fetchBasePrices } = useReservation()

const roomSlug = route.query.room as string
const room = computed(() => getRoom(roomSlug))
// Navigasyon sırasında içerik kaybolmasın diye stable ref
const stableRoom = ref(getRoom(roomSlug))

// Image Slider
const currentImageIndex = ref(0)
const nextImage = () => {
  if (stableRoom.value) currentImageIndex.value = (currentImageIndex.value + 1) % stableRoom.value.images.length
}
const prevImage = () => {
  if (stableRoom.value) currentImageIndex.value = (currentImageIndex.value - 1 + stableRoom.value.images.length) % stableRoom.value.images.length
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

// Sayfa meta — checkout'a özel transition'ı kapat + guard
definePageMeta({
  // out-in modunda room computed null olunca transition takılıyordu
  pageTransition: false,
  middleware: [
    function (to) {
      const roomSlug = to.query.room as string
      if (!roomSlug) {
        return navigateTo('/reservation')
      }
    }
  ]
})

onMounted(() => {
  if (!stableRoom.value) {
    navigateTo(localePath('/reservation'))
    return
  }
  // Stable ref'i mount'ta bir kez dondur
  stableRoom.value = room.value
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
  if (stableRoom.value?.price) return Number(stableRoom.value.price)
  const matchId = (stableRoom.value?.apiId || stableRoom.value?.slug || '').toString()
  return basePrices.value[matchId]?.price ? Number(basePrices.value[matchId].price) : 0
})

const currency = computed(() => {
  if (stableRoom.value?.currency) return stableRoom.value.currency
  const matchId = (stableRoom.value?.apiId || stableRoom.value?.slug || '').toString()
  return basePrices.value[matchId]?.currency || '₺'
})

// İptal tarihi hesaplama (Girişten 15 gün önce)
const cancellationDate = computed(() => {
  if (!checkInDate.value) return null
  const date = new Date(checkInDate.value)
  date.setDate(date.getDate() - 15)
  return date
})

const formatCancelDate = computed(() => {
  if (!cancellationDate.value) return ''
  return cancellationDate.value.toLocaleDateString('tr-TR', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
})

const formatCancelDateLong = computed(() => {
  if (!cancellationDate.value) return ''
  return cancellationDate.value.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
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
  totalRaw: number
  currency: string
  pricePerNight: number
  guestName: string
  guestEmail: string
  guestPhone: string
  paymentMethodLabel: string
  bookingStatus: string        // ElektraWeb'den gelen durum (CONFIRMED, PENDING vb.)
  channelRecorded: boolean     // alacaathotel.com.tr kanalı ElektraWeb'e iletildi mi?
  whatsappUrl: string
  emailUrl: string
  cancellationPolicyText: string
}>(null)

const printDocument = () => {
  window.print()
}

const handleComplete = async () => {
  if (!validateForm()) {
    // Eksik alanları listele
    const missing: string[] = []
    if (formErrors.value.firstName) missing.push('Ad')
    if (formErrors.value.lastName)  missing.push('Soyad')
    if (formErrors.value.email)     missing.push('E-posta')
    if (formErrors.value.phone)     missing.push('Telefon')
    showToast('warning', 'Lütfen eksik alanları doldurun', missing.join(' · '))
    // Hata alanına scroll
    await nextTick()
    const firstError = document.querySelector('[data-error="true"]') || document.querySelector('.border-red-400')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  isSubmitting.value = true
  bookingError.value = ''

  try {
    const result = await $fetch('/api/booking', {
      method: 'POST',
      body: {
      roomExternalId: stableRoom.value?.apiId || stableRoom.value?.slug,
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
        rateCode: stableRoom.value?.rateCode,
      }
    })

    if (result.success) {
      // Online kart ödemesi — HotelRunner/ElektraWeb ödeme sayfasına yönlendir
      if (paymentMethod.value === 'online-card' && result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl
        return
      }

      // Havale / Otelde ödeme — Toast + Modal + WhatsApp mesajı
      const phone = config.contact?.whatsapp || config.contact?.phone || ''
      let cleaned = phone.replace(/[^0-9]/g, '')
      if (cleaned.startsWith('0')) cleaned = '9' + cleaned
      else if (!cleaned.startsWith('90') && cleaned.length === 10) cleaned = '90' + cleaned

      const roomName = stableRoom.value ? tRoom(stableRoom.value.name) : ''
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

      // ✅ Başarı toast bildirimi
      const statusLabel = result.data?.bookingStatus === 'CONFIRMED' ? 'ONAYLANDI ✅' : result.data?.bookingStatus || 'Sisteme iletildi'
      showToast('success', 'Rezervasyon Alındı!', confirmCode ? `Onay: ${confirmCode} | Durum: ${statusLabel}` : 'Talebiniz sisteme başarıyla iletildi.')

      // Başarı modalini göster
      bookingSuccess.value = {
        confirmationCode: confirmCode,
        roomName,
        checkIn,
        checkOut,
        nights: nightsCount.value,
        total: `${currency.value}${totalPrice.value.toLocaleString('tr-TR')}`,
        totalRaw: totalPrice.value,
        currency: currency.value,
        pricePerNight: pricePerNight.value,
        guestName: `${guestForm.value.firstName} ${guestForm.value.lastName}`,
        guestEmail: guestForm.value.email,
        guestPhone: guestForm.value.phone,
        paymentMethodLabel: paymentLabel,
        bookingStatus: result.data?.bookingStatus || 'OK',
        channelRecorded: !!result.data?.channelRecorded,
        whatsappUrl: `https://wa.me/${cleaned}?text=${encoded}`,
        emailUrl: `mailto:?subject=Rezervasyon Belgesi - ${config.name}&body=${encoded}`,
        cancellationPolicyText: (() => {
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          return (cancellationDate.value && cancellationDate.value < now)
            ? 'İptal / İade süresi dolmuştur. İptallerde kesinti uygulanır.'
            : (cancellationDate.value ? `${formatCancelDateLong.value} tarihine kadar ücretsiz iptal edilebilir.` : '')
        })()
      }
      // Sayfayı kilitle
      document.body.style.overflow = 'hidden'
    }
  } catch (error: any) {
    const msg = error?.data?.statusMessage || 'Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
    bookingError.value = msg
    // ❌ Hata toast bildirimi
    showToast('error', 'Rezervasyon Başarısız', msg)
    console.error('Booking error:', error)
    // Hata mesajına scroll
    await nextTick()
    const errorEl = document.querySelector('[data-booking-error]')
    errorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccess = async (goHome = false) => {
  document.body.style.overflow = ''    // önce overflow kilidi kaldır
  bookingSuccess.value = null
  if (goHome) await navigateTo(localePath('/'))
}

// Component yıkılmadan önce overflow mutlaka temizle
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen pt-36 md:pt-44 pb-20 font-sans bg-(--color-page-bg)">
    <!-- stableRoom kullan: navigasyon sırasında room null olsa içerik kaybolmaz -->
    <div class="max-w-7xl mx-auto px-4 md:px-6" v-if="stableRoom">

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
                <label for="firstName" class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.firstName') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  id="firstName"
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
                <label for="lastName" class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.lastName') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  id="lastName"
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
                <label for="email" class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.email') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  id="email"
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
                <label for="phone" class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.phone') }} <span class="text-(--text-highlight)">*</span>
                </label>
                <input
                  id="phone"
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
                <label for="requests" class="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
                  {{ t('reservation.checkout.requests') }}
                  <span class="normal-case tracking-normal font-normal ml-1">(isteğe bağlı)</span>
                </label>
                <textarea
                  id="requests"
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


          <!-- İptal Politikası ve Talimatlar -->
          <div class="rounded-2xl border border-(--text-muted)/15 bg-(--ui-bg-elevated) shadow-lg p-6 md:p-8">
            <h2 class="font-serif text-xl italic mb-5 flex items-center gap-3 text-(--text-heading)">
              <span class="w-8 h-8 rounded-full flex items-center justify-center not-italic text-sm font-bold text-white shrink-0"
                    style="background-color: var(--text-highlight)">3</span>
              Politikalar ve Talimatlar
            </h2>
            
            <div class="space-y-6">
              <!-- İptal Politikası -->
              <div>
                <h3 class="font-bold text-base mb-3 text-(--text-heading)">İptal politikası</h3>
                <div class="bg-green-100/50 text-green-800 px-4 py-3 rounded-lg text-sm font-medium mb-3 border border-green-200">
                  <ClientOnly>
                    <span v-if="formatCancelDate">{{ formatCancelDate }} tarihinden önce tam geri ödemeli</span>
                    <span v-else>Girişten 15 gün öncesine kadar tam geri ödemeli</span>
                    <template #fallback><span>Girişten 15 gün öncesine kadar tam geri ödemeli</span></template>
                  </ClientOnly>
                </div>
                <p class="text-sm text-(--text-muted) leading-relaxed">
                  <ClientOnly>
                    <span v-if="formatCancelDateLong">{{ formatCancelDateLong }} tarihinde saat 23:59 (konaklama yerinin yerel saati) sonrası iptal veya değişiklik yapılırsa ya da rezervasyona gelinmezse rezervasyon için ödenen toplam tutarın %20 kadarına eşit bir konaklama yeri ücreti alınır.</span>
                    <span v-else>Belirtilen tarihten sonraki iptallerde %20 kesinti uygulanır.</span>
                    <template #fallback><span>Belirtilen tarihten sonraki iptallerde %20 kesinti uygulanır.</span></template>
                  </ClientOnly>
                </p>
              </div>

              <hr class="border-(--text-muted)/15" />

              <!-- Özel Giriş Talimatları -->
              <div>
                <h3 class="font-bold text-base mb-3 text-(--text-heading)">Özel giriş talimatları</h3>
                <p class="text-sm text-(--text-muted) leading-relaxed">
                  Bu konaklama yeri havaalanı transfer servisi sunmaktadır (bu hizmet ücretli olabilir); misafirler seyahate çıkmadan önce rezervasyon onayındaki iletişim bilgilerini kullanarak varış tarihi detaylarını konaklama yerine bildirmelidir. Misafirleri konaklama yerine varışta resepsiyon personeli karşılayacaktır. Konaklama yeri tarafından sağlanan bilgiler, otomatik çeviri araçları kullanılarak çevrilmiş olabilir.
                </p>
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
                  :src="stableRoom.images[currentImageIndex]"
                  :alt="tRoom(stableRoom.name)"
                  class="w-full h-full object-cover"
                  width="560"
                  height="420"
                  sizes="xs:100vw sm:100vw md:50vw lg:560px"
                />
              </transition>

              <!-- Slider Arrows -->
              <template v-if="stableRoom.images.length > 1">
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
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" v-if="stableRoom.images.length > 1">
                <button
                  v-for="(_, i) in stableRoom.images"
                  :key="i"
                  @click="currentImageIndex = i"
                  class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  :class="i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'"
                />
              </div>

              <!-- Room name overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div class="absolute bottom-8 left-4 right-4 pointer-events-none">
                <h3 class="font-serif text-2xl italic text-white">{{ tRoom(stableRoom.name) }}</h3>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-xs text-white/80 flex items-center gap-1">
                    <UIcon name="i-heroicons-user-group" class="w-3.5 h-3.5" />
                    Maks. {{ stableRoom.maxGuests }} Misafir
                  </span>
                  <span class="text-xs text-white/80 flex items-center gap-1">
                    <UIcon name="i-heroicons-squares-2x2" class="w-3.5 h-3.5" />
                    {{ stableRoom.size }} m²
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

  <!-- ═══════════════════════════════════════════════════════════════════ -->
  <!-- YAZDIR SAYFASI (sadece @media print'te görünür)                     -->
  <!-- ═══════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="bookingSuccess" id="print-page" aria-hidden="true">

      <!-- LOGO + BAŞLIK -->
      <div class="print-header">
        <img :src="config.images.logo" alt="Logo" class="print-logo" />
        <h1 class="print-hotel-name">{{ config.name }}</h1>
        <p class="print-hotel-address">{{ config.contact.address?.tr || config.contact.address?.en }}</p>
        <p class="print-hotel-contact">{{ config.contact.phone }} &nbsp;·&nbsp; {{ config.contact.email }}</p>
      </div>

      <!-- BELGE BAŞLIĞI -->
      <div class="print-doc-title">
        <span class="print-doc-label">REZERVASYON BELGESİ</span>
        <span class="print-doc-meta">
          {{ new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) }}
          <span v-if="bookingSuccess.confirmationCode">&nbsp;·&nbsp; # {{ bookingSuccess.confirmationCode }}</span>
        </span>
      </div>

      <!-- DURUM BANDİ -->
      <div :class="['print-status', bookingSuccess.bookingStatus === 'CONFIRMED' ? 'status-confirmed' : 'status-pending']">
        {{ bookingSuccess.bookingStatus === 'CONFIRMED' ? '✅ Rezervasyon Onaylandı — ElektraWeb Sistemine İletildi' : '⏳ Rezervasyon Beklemede' }}
      </div>

      <!-- MÜŞTERİ BİLGİLERİ (Başlık Altında) -->
      <div class="print-guest-info">
        <div class="print-guest-row"><strong>Sayın:</strong> {{ bookingSuccess.guestName }}</div>
        <div class="print-guest-row"><strong>İletişim:</strong> {{ bookingSuccess.guestPhone }} &nbsp;·&nbsp; {{ bookingSuccess.guestEmail }}</div>
      </div>

      <!-- İÇERİK GRID -->
      <div class="print-grid">

        <!-- Sol Sütun -->
        <div class="print-col">

          <!-- OTEL BİLGİLERİ -->
          <div class="print-section">
            <div class="print-section-title"><span class="print-num">1</span> Otel Bilgileri</div>
            <div class="print-fields">
              <div class="print-field full">
                <label>Otel Adı</label>
                <span>{{ config.name }}</span>
              </div>
              <div class="print-field">
                <label>Check-In</label>
                <span>{{ config.booking.checkInTime }}</span>
              </div>
              <div class="print-field">
                <label>Check-Out</label>
                <span>{{ config.booking.checkOutTime }}</span>
              </div>
              <div class="print-field full">
                <label>Adres</label>
                <span>{{ config.contact.address?.tr || config.contact.address?.en }}</span>
              </div>
            </div>
          </div>

        </div><!-- /sol sütun -->

        <!-- Sağ Sütun -->
        <div class="print-col">

          <!-- REZERVASYON BİLGİLERİ -->
          <div class="print-section">
            <div class="print-section-title"><span class="print-num">2</span> Rezervasyon Bilgileri</div>
            <div class="print-fields">
              <div class="print-field full">
                <label>Oda</label>
                <span>{{ bookingSuccess.roomName }}</span>
              </div>
              <div class="print-field">
                <label>Giriş Tarihi</label>
                <span>{{ bookingSuccess.checkIn }}</span>
              </div>
              <div class="print-field">
                <label>Çıkış Tarihi</label>
                <span>{{ bookingSuccess.checkOut }}</span>
              </div>
              <div class="print-field">
                <label>Konaklama</label>
                <span>{{ bookingSuccess.nights }} Gece</span>
              </div>
              <div class="print-field">
                <label>Ödeme Yöntemi</label>
                <span>{{ bookingSuccess.paymentMethodLabel }}</span>
              </div>
              <div class="print-field full">
                <label>Rezervasyon Kanalı</label>
                <span class="print-channel">alacaathotel.com.tr &nbsp;<em>{{ bookingSuccess.channelRecorded ? '✅ Kayıtlı' : '' }}</em></span>
              </div>
            </div>
          </div>

          <!-- ÖDEME ÖZETİ -->
          <div class="print-section">
            <div class="print-section-title"><span class="print-num">3</span> Ödeme Özeti</div>
            <div class="print-fields">
              <div class="print-field">
                <label>Gecelik Ücret</label>
                <span>{{ bookingSuccess.currency }}{{ bookingSuccess.pricePerNight.toLocaleString('tr-TR') }}</span>
              </div>
              <div class="print-field">
                <label>Gece Sayısı</label>
                <span>{{ bookingSuccess.nights }} gece</span>
              </div>
            </div>
            <div class="print-total">
              <span>Ödenecek Toplam</span>
              <strong>{{ bookingSuccess.total }}</strong>
            </div>
          </div>

        </div><!-- /sağ sütun -->

      </div><!-- /print-grid -->

      <!-- İPTAL POLİTİKASI & DİPNOT -->
      <div class="print-cancellation">
        <strong>İptal Politikası:</strong> {{ bookingSuccess.cancellationPolicyText }}
      </div>
      <div class="print-footer">
        Bu belge alacaathotel.com.tr üzerinden ElektraWeb Channel Manager aracılığıyla otomatik oluşturulmuştur.
        Tüm vergiler dahildir. Sorularınız için: {{ config.contact.phone }} · {{ config.contact.email }}
      </div>

    </div><!-- /#print-page -->
  </Teleport>

  <!-- ═══════════════════════════════════════════════════════════════════ -->
  <!-- TOAST BİLDİRİMLERİ -->
  <!-- ═══════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div class="fixed top-6 right-4 z-[10000] flex flex-col gap-3 pointer-events-none" style="max-width: 380px; width: calc(100vw - 2rem)">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border"
          :style="
            toast.type === 'success'
              ? 'background:linear-gradient(135deg,#064e3b,#065f46);border-color:rgba(34,197,94,0.35)'
              : toast.type === 'warning'
              ? 'background:linear-gradient(135deg,#78350f,#92400e);border-color:rgba(251,191,36,0.4)'
              : 'background:linear-gradient(135deg,#450a0a,#7f1d1d);border-color:rgba(239,68,68,0.35)'"
        >
          <!-- İkon -->
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            :style="
              toast.type === 'success' ? 'background:rgba(34,197,94,0.2)'
              : toast.type === 'warning' ? 'background:rgba(251,191,36,0.2)'
              : 'background:rgba(239,68,68,0.2)'"
          >
            <UIcon
              :name="toast.type === 'success' ? 'i-heroicons-check-circle'
                    : toast.type === 'warning' ? 'i-heroicons-exclamation-triangle'
                    : 'i-heroicons-x-circle'"
              class="w-5 h-5"
              :style="
                toast.type === 'success' ? 'color:#4ade80'
                : toast.type === 'warning' ? 'color:#fde68a'
                : 'color:#f87171'"
            />
          </div>
          <!-- Metin — her zaman beyaz -->
          <div class="flex-1 min-w-0 pt-0.5">
            <p class="font-bold text-sm leading-tight" style="color:#ffffff">{{ toast.title }}</p>
            <p class="text-xs mt-0.5 leading-relaxed" style="color:rgba(255,255,255,0.85)">{{ toast.message }}</p>
          </div>
          <!-- Kapat -->
          <button
            @click="removeToast(toast.id)"
            class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
            style="background:rgba(255,255,255,0.15);opacity:0.7;color:#fff"
          >
            <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" style="color:#fff" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- BAŞARI MODALİ + ÖDEME DÖKÜMANI -->
  <!-- ═══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="bookingSuccess"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.65); backdrop-filter: blur(10px); cursor: pointer"
        @click="closeSuccess(false)"
      >
        <div
          class="relative w-full rounded-3xl shadow-2xl overflow-hidden cursor-default"
          style="max-width: 520px; max-height: 92vh; overflow-y: auto; background: var(--ui-bg-elevated); border: 1px solid color-mix(in srgb, var(--text-muted) 20%, transparent)"
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

          <div class="p-6 md:p-8">
            <!-- İkon + Başlık -->
            <div class="flex flex-col items-center text-center mb-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4"
                   style="background: linear-gradient(135deg, #22c55e, #16a34a)">
                <UIcon name="i-heroicons-check" class="w-8 h-8 text-white" />
              </div>
              <h2 class="font-serif text-2xl italic mb-1" style="color: var(--text-heading)">Rezervasyon Alındı!</h2>
              <p class="text-sm" style="color: var(--text-muted)">Talebiniz sisteme başarıyla iletildi.</p>
              <div
                v-if="bookingSuccess.confirmationCode"
                class="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-white"
                style="background-color: var(--text-highlight)"
              >
                Onay Kodu: {{ bookingSuccess.confirmationCode }}
              </div>
            </div>

            <!-- ═══════════════════════════════════════════════════ -->
            <!-- REZERVASYON BELGESİ — Profesyonel Form Tasarımı   -->
            <!-- ═══════════════════════════════════════════════════ -->
            <div id="booking-document" class="rounded-2xl overflow-hidden mb-5" style="border: 1.5px solid color-mix(in srgb, var(--text-muted) 20%, transparent)">

              <!-- ── BELGE BAŞLIĞI ── -->
              <div style="background: linear-gradient(135deg, color-mix(in srgb, var(--text-highlight) 90%, #000), var(--text-highlight)); padding: 18px 20px 16px">
                <div class="flex items-start justify-between gap-4">
                  <!-- Sol: Otel + Tarih -->
                  <div>
                    <p class="font-serif text-lg font-bold text-white leading-tight">{{ config.name }}</p>
                    <p class="text-white/70 text-xs mt-0.5">{{ config.contact.address?.tr || config.contact.address?.en || 'Alaçatı, İzmir, Türkiye' }}</p>
                    <p class="text-white/60 text-[10px] mt-1">{{ config.contact?.phone }} · {{ config.contact?.email }}</p>
                  </div>
                  <!-- Sağ: Belge tipi + Tarih -->
                  <div class="text-right shrink-0">
                    <p class="text-white text-[10px] font-black uppercase tracking-widest">Rezervasyon Belgesi</p>
                    <p class="text-white/70 text-[10px] mt-0.5">
                      {{ new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) }}
                    </p>
                    <div
                      v-if="bookingSuccess.confirmationCode"
                      class="mt-1.5 inline-block bg-white/20 rounded-lg px-2 py-0.5"
                    >
                      <span class="text-white text-[10px] font-black tracking-wider"># {{ bookingSuccess.confirmationCode }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── DURUM BANDI ── -->
              <div
                class="flex items-center justify-between px-5 py-2.5"
                :style="bookingSuccess.bookingStatus === 'CONFIRMED'
                  ? 'background: rgba(34,197,94,0.1); border-bottom: 1px solid rgba(34,197,94,0.2)'
                  : 'background: rgba(234,179,8,0.08); border-bottom: 1px solid rgba(234,179,8,0.2)'"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    :style="bookingSuccess.bookingStatus === 'CONFIRMED' ? 'background:#22c55e' : 'background:#eab308'"
                  />
                  <span class="text-xs font-bold"
                    :style="bookingSuccess.bookingStatus === 'CONFIRMED' ? 'color:#16a34a' : 'color:#a16207'"
                  >
                    {{ bookingSuccess.bookingStatus === 'CONFIRMED' ? 'ElektraWeb\'e Başarıyla İletildi · Rezervasyon Onaylandı' : 'İşlemde — Onay Bekleniyor' }}
                  </span>
                </div>
                <span class="text-[10px] font-mono" style="color:var(--text-muted)">{{ bookingSuccess.bookingStatus }}</span>
              </div>

              <div class="divide-y" style="--tw-divide-color: color-mix(in srgb, var(--text-muted) 10%, transparent)">

                <!-- ── BÖLÜM 1: MÜŞTERİ BİLGİLERİ ── -->
                <div class="px-5 py-4">
                  <!-- Bölüm Başlığı -->
                  <div class="flex items-center gap-2 mb-3">
                    <span class="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0" style="background: var(--text-highlight)">1</span>
                    <span class="text-[10px] font-black uppercase tracking-widest" style="color: var(--text-heading)">Müşteri Bilgileri</span>
                    <div class="flex-1 h-px" style="background: color-mix(in srgb, var(--text-muted) 15%, transparent)" />
                  </div>
                  <!-- Form Grid -->
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Ad Soyad -->
                    <div class="col-span-2 rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Ad Soyad</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.guestName }}</p>
                    </div>
                    <!-- Telefon -->
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Telefon</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.guestPhone }}</p>
                    </div>
                    <!-- E-posta -->
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">E-posta</p>
                      <p class="font-semibold text-sm truncate" style="color: var(--text-heading)">{{ bookingSuccess.guestEmail }}</p>
                    </div>
                  </div>
                </div>

                <!-- ── BÖLÜM 2: OTEL BİLGİLERİ ── -->
                <div class="px-5 py-4">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0" style="background: var(--text-highlight)">2</span>
                    <span class="text-[10px] font-black uppercase tracking-widest" style="color: var(--text-heading)">Otel Bilgileri</span>
                    <div class="flex-1 h-px" style="background: color-mix(in srgb, var(--text-muted) 15%, transparent)" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2 rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Otel Adı</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ config.name }}</p>
                    </div>
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Check-In Saati</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ config.booking.checkInTime }}</p>
                    </div>
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Check-Out Saati</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ config.booking.checkOutTime }}</p>
                    </div>
                    <div class="col-span-2 rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Adres</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ config.contact.address?.tr || config.contact.address?.en || 'Alaçatı, 2073. Sk. No:2, 35937 Çeşme/İzmir' }}</p>
                    </div>
                  </div>
                </div>

                <!-- ── BÖLÜM 3: REZERVASYON BİLGİLERİ ── -->
                <div class="px-5 py-4">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0" style="background: var(--text-highlight)">3</span>
                    <span class="text-[10px] font-black uppercase tracking-widest" style="color: var(--text-heading)">Rezervasyon Bilgileri</span>
                    <div class="flex-1 h-px" style="background: color-mix(in srgb, var(--text-muted) 15%, transparent)" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Oda -->
                    <div class="col-span-2 rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Oda</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.roomName }}</p>
                    </div>
                    <!-- Giriş -->
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Giriş Tarihi</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.checkIn }}</p>
                    </div>
                    <!-- Çıkış -->
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Çıkış Tarihi</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.checkOut }}</p>
                    </div>
                    <!-- Süre -->
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Konaklama Süresi</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.nights }} Gece</p>
                    </div>
                    <!-- Ödeme -->
                    <div class="rounded-xl p-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Ödeme Yöntemi</p>
                      <p class="font-semibold text-sm" style="color: var(--text-heading)">{{ bookingSuccess.paymentMethodLabel }}</p>
                    </div>
                    <!-- Kanal -->
                    <div class="col-span-2 rounded-xl p-3 flex items-center gap-3" style="background: color-mix(in srgb, var(--text-muted) 5%, transparent); border: 1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)">
                      <div class="flex-1">
                        <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted)">Rezervasyon Kanalı</p>
                        <p class="font-mono font-semibold text-sm" style="color: var(--text-heading)">alacaathotel.com.tr</p>
                      </div>
                      <span
                        class="text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shrink-0"
                        :style="bookingSuccess.channelRecorded
                          ? 'background: rgba(34,197,94,0.12); color: #16a34a'
                          : 'background: rgba(239,68,68,0.1); color: #dc2626'"
                      >
                        {{ bookingSuccess.channelRecorded ? '✅ Kayıtlı' : '❌ Kayıt Yok' }}
                      </span>
                    </div>
                  </div>
                </div>

              </div><!-- /divide-y -->

              <!-- ── TOPLAM FOOTER ── -->
              <div class="px-5 py-4" style="background: color-mix(in srgb, var(--text-highlight) 8%, transparent); border-top: 1.5px solid color-mix(in srgb, var(--text-highlight) 20%, transparent)">
                <!-- Fiyat detay satırları -->
                <div class="flex justify-between text-xs mb-1.5" style="color: var(--text-muted)">
                  <span>{{ bookingSuccess.currency }}{{ bookingSuccess.pricePerNight.toLocaleString('tr-TR') }} × {{ bookingSuccess.nights }} gece</span>
                  <span>%15 web indirimi uygulandı</span>
                </div>
                <!-- Büyük toplam -->
                <div class="flex justify-between items-center">
                  <span class="text-sm font-black uppercase tracking-wider" style="color: var(--text-heading)">Ödenecek Toplam</span>
                  <span class="text-2xl font-black" style="color: var(--text-highlight)">{{ bookingSuccess.total }}</span>
                </div>
                <!-- Dipnot -->
                <p class="text-[9px] mt-2" style="color: var(--text-muted)">
                  Bu belge ElektraWeb Channel Manager üzerinden otomatik oluşturulmuştur. Tüm vergiler dahildir.
                </p>
              </div>

            </div>
            <!-- ──────────────────── DÖKÜMAN SONU ──────────────────── -->

            <!-- Aksiyon Butonları -->
            <div class="space-y-3">
              <!-- Yazdır / PDF -->
              <button
                @click="printDocument"
                class="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 border"
                style="background: color-mix(in srgb, var(--text-muted) 6%, transparent); color: var(--text-heading); border-color: color-mix(in srgb, var(--text-muted) 20%, transparent)"
              >
                <UIcon name="i-heroicons-printer" class="w-4 h-4" />
                Belgeyi Yazdır / PDF Kaydet
              </button>

              <!-- WhatsApp -->
              <a
                :href="bookingSuccess.whatsappUrl"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style="background: #25D366"
                @click="closeSuccess(false)"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.994 0C5.369 0 0 5.369 0 11.994c0 2.1.546 4.07 1.5 5.784L0 24l6.386-1.476A11.94 11.94 0 0011.994 24C18.619 24 24 18.631 24 11.994 24 5.369 18.619 0 11.994 0zm0 21.818c-1.855 0-3.604-.501-5.104-1.376l-.366-.217-3.789.875.893-3.688-.239-.379A9.813 9.813 0 012.182 12c0-5.415 4.407-9.818 9.812-9.818 5.416 0 9.824 4.403 9.824 9.818 0 5.416-4.408 9.818-9.824 9.818z"/>
                </svg>
                WhatsApp ile Onayla
              </a>

              <!-- E-posta -->
              <a
                v-if="bookingSuccess.emailUrl"
                :href="bookingSuccess.emailUrl"
                class="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                style="background: #3b82f6"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                E-postayla Paylaş
              </a>

              <!-- Ana Sayfa -->
              <button
                @click="closeSuccess(true)"
                class="flex items-center justify-center gap-2 w-full h-10 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style="background: color-mix(in srgb, var(--text-muted) 8%, transparent); color: var(--text-body)"
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

/* Toast Animasyonu */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* Yazdır: sadece belgeyi göster */
@media print {
  /* Ekrandaki her şeyi normal akıştan kaldır */
  body > *:not(#print-page) {
    display: none !important;
  }

  /* Sadece print-page görünsün */
  #print-page {
    display: block !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto !important;
    padding: 12mm 14mm !important;
    background: #fff !important;
    color: #111 !important;
    font-family: 'Inter', Arial, sans-serif !important;
    font-size: 9pt !important;
    box-sizing: border-box !important;
  }

  /* --- Logo + Başlık --- */
  .print-header {
    text-align: center;
    margin-bottom: 8mm;
    padding-bottom: 6mm;
    border-bottom: 2px solid #b91c1c;
  }
  .print-logo {
    height: 60px;
    width: auto;
    display: block;
    margin: 0 auto 3mm;
    object-fit: contain;
  }
  .print-hotel-name {
    font-size: 16pt;
    font-weight: 800;
    color: #111;
    margin: 0 0 1mm;
    font-family: Georgia, serif;
    letter-spacing: 0.02em;
  }
  .print-hotel-address {
    font-size: 8pt;
    color: #555;
    margin: 0;
  }
  .print-hotel-contact {
    font-size: 8pt;
    color: #555;
    margin: 1mm 0 0;
  }

  /* --- Belge Başlığı --- */
  .print-doc-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3mm;
  }
  .print-doc-label {
    font-size: 11pt;
    font-weight: 800;
    color: #111;
    letter-spacing: 0.08em;
  }
  .print-doc-meta {
    font-size: 8pt;
    color: #666;
  }

  /* --- Durum Bantı --- */
  .print-status {
    padding: 2mm 4mm;
    border-radius: 4px;
    font-size: 8.5pt;
    font-weight: 700;
    margin-bottom: 5mm;
  }
  .status-confirmed {
    background: #dcfce7 !important;
    color: #166534 !important;
    border: 1px solid #86efac !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .status-pending {
    background: #fef9c3 !important;
    color: #854d0e !important;
    border: 1px solid #fde047 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* --- Müşteri Bilgileri (Başlık Altı) --- */
  .print-guest-info {
    margin-bottom: 6mm;
    padding: 3mm 4mm;
    background: #f8fafc !important;
    border-left: 4px solid #3b82f6 !important;
    border-radius: 4px;
    font-size: 9.5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-guest-row {
    margin-bottom: 1.5mm;
    color: #1e293b;
  }
  .print-guest-row:last-child {
    margin-bottom: 0;
  }

  /* --- İki Sütun Grid --- */
  .print-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm;
  }
  .print-col {
    display: flex;
    flex-direction: column;
    gap: 4mm;
  }

  /* --- Bölüm --- */
  .print-section {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
  }
  .print-section-title {
    background: #f3f4f6 !important;
    padding: 2mm 3mm;
    font-size: 8pt;
    font-weight: 800;
    color: #374151;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 2mm;
    border-bottom: 1px solid #e5e7eb;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    background: #b91c1c !important;
    color: #fff !important;
    border-radius: 3px;
    font-size: 7pt;
    font-weight: 900;
    flex-shrink: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* --- Alanlar --- */
  .print-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 2mm;
    gap: 2mm;
  }
  .print-field {
    padding: 1.5mm 2mm;
    background: #f9fafb !important;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-field.full {
    grid-column: 1 / -1;
  }
  .print-field label {
    display: block;
    font-size: 6.5pt;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5mm;
  }
  .print-field span {
    font-size: 9pt;
    font-weight: 600;
    color: #111;
  }
  .print-channel em {
    font-style: normal;
    color: #166534;
    font-size: 7.5pt;
  }

  /* --- Toplam --- */
  .print-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2.5mm 3mm;
    background: #fef2f2 !important;
    border-top: 1.5px solid #fecaca;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-total span {
    font-size: 9pt;
    font-weight: 800;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .print-total strong {
    font-size: 14pt;
    font-weight: 900;
    color: #b91c1c;
  }

  /* --- İptal & Dipnot --- */
  .print-cancellation {
    margin-top: 8mm;
    padding: 3mm;
    background: #fffbeb !important;
    border: 1px solid #fde68a !important;
    border-radius: 4px;
    font-size: 8pt;
    color: #92400e;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-footer {
    margin-top: 4mm;
    padding-top: 4mm;
    border-top: 1px solid #e5e7eb;
    font-size: 7pt;
    color: #9ca3af;
    text-align: center;
    line-height: 1.6;
  }

  /* Sayfa ayarları */
  @page {
    size: A4 portrait;
    margin: 1cm;
  }
}
</style>

