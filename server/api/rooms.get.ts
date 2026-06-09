// GET /api/rooms — Oda listesi ve base fiyatlar
export default defineEventHandler(async () => {
  const provider = getProvider()

  try {
    const rooms = await provider.getRooms()
    return { success: true, provider: provider.name, data: rooms }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Oda listesi alınamadı: ${error.message}`,
    })
  }
})
