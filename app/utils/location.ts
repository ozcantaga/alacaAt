export type LocationData = { lat: number; lng: number; name?: string }

export const guideLocations: Record<string, LocationData> = {
  // ── PLAJLAR ──────────────────────────────────────────────────
  'ilica': { lat: 38.30993018514526, lng: 26.374960394977148, name: 'Ilıca Plajı' },
  'altinkum': { lat: 38.270670526911054, lng: 26.259453572142576, name: 'Altınkum Plajı' },
  'delikli': { lat: 38.229253897753225, lng: 26.342914514234675, name: 'Delikli Koy' },
  'pırlanta': { lat: 38.28576286705974, lng: 26.247019953652742, name: 'Pırlanta Plajı' },
  'boyalik': { lat: 38.32567032619305, lng: 26.326942304751096, name: 'Boyalık Plajı' },

  // ── TARİHİ YERLER ────────────────────────────────────────────
  'castle': { lat: 38.324635741118286, lng: 26.303609274883172, name: 'Çeşme Kalesi' },
  'pazaryeri': { lat: 38.27988791182317, lng: 26.377079954450934, name: 'Alaçatı Pazaryeri' },
  'windmills': { lat: 38.28629384920508, lng: 26.374069253434595, name: 'Alaçatı Yel Değirmenleri' },


  // ── SÖRF & SPOR ──────────────────────────────────────────────
  'windsurf': { lat: 38.248944696096565, lng: 26.385610488532027, name: 'Alaçatı Sörf Körfezi' },
  'kitesurf': { lat: 38.24168141523023, lng: 26.400394824702737, name: 'Kitesurf Plajı' },

  // ── GURME & RESTORANLAR ──────────────────────────────────────
  'haci-memis': { lat: 38.2795, lng: 26.3758, name: 'Hacı Memiş Sokağı' },
  'dalyan': { lat: 38.3442, lng: 26.3115, name: 'Dalyan Marina' },
  'agrilia': { lat: 38.2812, lng: 26.3748, name: 'Agrilia Restaurant' },
  'asma-yapragi': { lat: 38.2798, lng: 26.3762, name: 'Asma Yaprağı' },
  'tike': { lat: 38.2542, lng: 26.3825, name: 'Tike Restaurant (Port)' },
  'biberiye': { lat: 38.2805, lng: 26.3752, name: 'Biberiye Restaurant' },

  // ── AKTİVİTE & EĞLENCE ──────────────────────────────────────
  'marina': { lat: 38.3215, lng: 26.2952, name: 'Çeşme Marina' },
  'alacati-port': { lat: 38.2532, lng: 26.3835, name: 'Alaçatı Port' },

  // ── VARSAYILAN (AlacaAt ALAÇATI OTEL) ───────────────────────────
  'default': { lat: 38.2811, lng: 26.3703, name: 'AlacaAt Alaçatı' }
}

export const getLocationCoordinates = (id: string): LocationData => {
  return guideLocations[id] || guideLocations['default']!
}
