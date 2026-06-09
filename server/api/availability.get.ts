// GET /api/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=2&children=0
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Validasyon
  if (!query.checkIn || !query.checkOut) {
    throw createError({
      statusCode: 400,
      statusMessage: 'checkIn ve checkOut parametreleri gereklidir (YYYY-MM-DD)',
    })
  }

  const provider = getProvider()

  try {
    const results = await provider.checkAvailability({
      checkIn: String(query.checkIn),
      checkOut: String(query.checkOut),
      adults: Number(query.adults) || 2,
      children: Number(query.children) || 0,
    })

    return {
      success: true,
      provider: provider.name,
      params: {
        checkIn: query.checkIn,
        checkOut: query.checkOut,
        adults: Number(query.adults) || 2,
        children: Number(query.children) || 0,
      },
      data: results,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Müsaitlik sorgusu başarısız: ${error.message}`,
    })
  }
})
