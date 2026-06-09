// POST /api/booking — Rezervasyon oluştur
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
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guest: body.guest,
      adults: Number(body.adults) || 2,
      children: Number(body.children) || 0,
      rateCode: body.rateCode,
    })

    return {
      success: result.success,
      provider: provider.name,
      data: {
        ...result,
        paymentUrl: result.paymentUrl, // HotelRunner/ElektraWeb ödeme sayfası URL
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Rezervasyon oluşturulamadı: ${error.message}`,
    })
  }
})
