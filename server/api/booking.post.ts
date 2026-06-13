// POST /api/booking — Rezervasyon oluştur
// Rezervasyon kanalı her zaman 'alacaathotel.com.tr' olarak ElektraWeb'e iletilir
const BOOKING_CHANNEL = 'alacaathotel.com.tr'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validasyon
  if (!body.roomExternalId || !body.checkIn || !body.checkOut || !body.guest) {
    throw createError({
      statusCode: 400,
      statusMessage: 'roomExternalId, checkIn, checkOut ve guest alanları gereklidir.',
    })
  }

  if (!body.guest.firstName || !body.guest.lastName || !body.guest.email || !body.guest.phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'guest.firstName, guest.lastName, guest.email ve guest.phone alanları gereklidir.',
    })
  }

  const provider = getProvider()

  try {
    const result = await provider.createBooking({
      roomExternalId: body.roomExternalId,
      checkIn:   body.checkIn,
      checkOut:  body.checkOut,
      guest:     body.guest,
      adults:    Number(body.adults)   || 2,
      children:  Number(body.children) || 0,
      rateCode:  body.rateCode,
      bookingChannel: BOOKING_CHANNEL,  // ← alacaathotel.com.tr kanalını her zaman gönder
    })

    // Sunucu tarafı doğrulama logu
    console.log(
      `[Booking API] ` +
      `Provider: ${provider.name} | ` +
      `Oda: ${body.roomExternalId} | ` +
      `Onay: ${result.confirmationCode || '-'} | ` +
      `Durum: ${result.bookingStatus || 'OK'} | ` +
      `Kanal: ${BOOKING_CHANNEL} | ` +
      `Kanal Kaydı: ${result.channelRecorded ? 'EVET ✅' : 'HAYIR ❌'}`
    )

    if (!result.success) {
      throw createError({
        statusCode: 502,
        statusMessage: result.message || 'ElektraWeb rezervasyonu onaylamadı.',
      })
    }

    return {
      success: result.success,
      provider: provider.name,
      channel: BOOKING_CHANNEL,
      data: {
        ...result,
        paymentUrl: result.paymentUrl,
      },
    }
  } catch (error: any) {
    // createError ile oluşturulmuşsa olduğu gibi fırlat
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: `Rezervasyon oluşturulamadı: ${error.message}`,
    })
  }
})
