// =============================================================================
// 🏨 HOTEL CONFIGURATION — SINGLE CHANGE POINT
// =============================================================================
// To set up a new hotel, ONLY modify this file and replace images in public/images/
// Everything else (layout, components, pages) stays the same.
// =============================================================================

export interface HotelRoom {
  slug: string
  images: string[]
  maxGuests: number
  size: number // m²
  amenities: string[]
  name: Record<string, string>
  description: Record<string, string>
  shortDescription: Record<string, string>
  price?: number
  currency?: string
  apiId?: string // Dış sistemdeki oda ID'si ile eşleşmesi için (ElektraWeb / HotelRunner)
  // ─── API'den Gelen Dinamik Alanlar ────────────────────────────────
  mealPlan?: string        // BB, HB, FB, AI (Konaklama tipi)
  rateCode?: string        // HotelRunner rate plan kodu
  cancellationPolicy?: string  // İptal politikası
  reviews?: {
    author: string
    text: Record<string, string>
    rating: number
  }[]
}

export interface HotelAmenity {
  icon: string // UIcon name (Nuxt UI)
  name: Record<string, string>
  description: Record<string, string>
}

export interface HotelTestimonial {
  name: string
  avatar?: string
  rating: number // 1-5
  date: string
  comment: Record<string, string>
  source?: string // "Google", "TripAdvisor", etc.
}

export interface HotelGalleryItem {
  src: string
  alt: Record<string, string>
  description?: Record<string, string>
  category: 'exterior' | 'interior' | 'room' | 'restaurant' | 'pool' | 'spa' | 'view'
}

export interface HotelConfig {
  // ─── Identity ──────────────────────────────────────────────────────
  name: string
  slug: string
  stars: number
  established: number

  // ─── Localized Content ─────────────────────────────────────────────
  tagline: Record<string, string>
  description: Record<string, string>
  shortDescription: Record<string, string>
  story: Record<string, string>
  values: Array<{
    icon: string
    title: Record<string, string>
    description: Record<string, string>
  }>

  // ─── Contact ───────────────────────────────────────────────────────
  contact: {
    phone: string
    whatsapp?: string
    email: string
    address: Record<string, string>
    city: Record<string, string>
    country: Record<string, string>
    postalCode: string
  }

  // ─── Social Media ──────────────────────────────────────────────────
  social: {
    instagram?: string;
    tripadvisor?: string;
    booking?: string;
    whatsapp?: string;
  }

  // ─── Location ──────────────────────────────────────────────────────
  location: {
    lat: number
    lng: number
    mapZoom: number
  }

  // ─── Images ────────────────────────────────────────────────────────
  images: {
    logo: string
    logoDark: string
    about: string
    hero: string[]
    favicon: string
    ogImage: string
  }
  rooms: HotelRoom[]
  amenities: HotelAmenity[]
  gallery: HotelGalleryItem[]
  testimonials: HotelTestimonial[]
  seo: {
    siteUrl: string
    titleTemplate: string
    defaultDescription: Record<string, string>
    ogImage: string
    twitterHandle?: string
  }
  booking: {
    engine: 'internal' | 'external'
    externalUrl?: string
    checkInTime: string
    checkOutTime: string
  }
  theme: {
    primary: Record<number, string>
    secondary: Record<number, string>
    thirdnary: Record<number, string>
    heroOverlayOpacity: number
    topBarBg: string
  }
}

export const hotelConfig: HotelConfig = {
  // ─── Identity ──────────────────────────────────────────────────────
  name: 'AlacaAt Hotel',
  slug: 'alacaat-hotel',
  stars: 5,
  established: 2026,

  // ─── Localized Content ─────────────────────────────────────────────
  tagline: {
    tr: 'Alaçatı\'nın Kalbinde',
    en: 'In the Heart of Alaçatı',
  },
  description: {
    tr: 'Alaçatı Hacımemiş\'te bulunan Alacaat Otel; çarşı, restaurant ve cafelere 5 dakika yürüme mesafesindedir. Çeşme Otogarı\'na 10 km, Adnan Menderes Havalimanı\'na ise 96 km mesafede yer alan tesisimiz; şehrin gürültüsünden uzak, Ege ruhunu yaşatan ev konforunda bir tatil geçirmek için ideal bir butik otel.',
    en: 'Located in Alaçatı Hacımemiş, Alacaat Hotel is a 5-minute walk from the bazaar, restaurants, and cafes. Situated 10 km from Çeşme Bus Station and 96 km from Adnan Menderes Airport, it is an ideal boutique hotel for a holiday with home comfort, reflecting the Aegean spirit away from the city noise.',
  },
  shortDescription: {
    tr: 'Alaçatı Hacımemiş\'te, havuzlu ve merkeze 5 dk yürüme mesafesinde romantik butik otel.',
    en: 'Romantic boutique hotel with a pool, 5 mins walk to the center in Alaçatı Hacımemiş.',
  },
  story: {
    tr: 'Her biri birbirinden farklı dekore edilmiş 12 odamız ile Nisan-Ekim ayları arasında 7 ay hizmet vermekteyiz. Ev yapımı reçeller ve yerel üreticilerden temin edilen özel lezzetler ile hazırlanan serpme kahvaltımızla güne başlayabilir; gün boyu bahçe ve güneşlenme terasımızdaki havuz başında kendi bahçemizin limonlarıyla hazırlanan limonatalarımızın tadını çıkarabilirsiniz. Yurtiçi ve yurtdışından uçakla gelen misafirlerimize VIP havalimanı servisi (ücretli), ayrıca beach club ve restoranlara gidişlerde transfer konusunda yardımcı olmaktayız.',
    en: 'We serve for 7 months between April and October with our 12 rooms, each decorated uniquely. You can start the day with our mixed breakfast prepared with homemade jams and special flavors procured from local producers; and enjoy our lemonades prepared with lemons from our own garden by the pool in our garden and sun terrace all day long. We assist our guests arriving by plane from domestic and abroad with VIP airport transfer (paid), as well as with transfers to beach clubs and restaurants.',
  },
  values: [
    {
      icon: 'i-heroicons-heart',
      title: { tr: 'Misafir Odaklılık', en: 'Guest Centricity' },
      description: { tr: 'Her misafirimiz bizim için özeldir.', en: 'Every guest is special to us.' },
    },
    {
      icon: 'i-heroicons-sparkles',
      title: { tr: 'Kusursuz Hizmet', en: 'Flawless Service' },
      description: { tr: 'Detaylara önem veriyoruz.', en: 'We care about details.' },
    },
    {
      icon: 'i-heroicons-globe-europe-africa',
      title: { tr: 'Sürdürülebilirlik', en: 'Sustainability' },
      description: { tr: 'Doğaya ve tarihe saygılıyız.', en: 'We respect nature and history.' },
    },
  ],

  // ─── Contact ───────────────────────────────────────────────────────
  contact: {
    phone: '+90 530 895 69 48',
    whatsapp: '+90 530 895 69 48',
    email: 'info@alacaathotel.com.tr',
    address: {
      tr: 'Alaçatı, 2073. Sk. No:2, 35937 Çeşme/İzmir',
      en: 'Alaçatı, 2073. Sk. No:2, 35937 Çeşme/İzmir',
    },
    city: { tr: 'İzmir', en: 'İzmir' },
    country: { tr: 'Türkiye', en: 'Turkey' },
    postalCode: '35937',
  },

  // ─── Social Media ──────────────────────────────────────────────────
  social: {
    instagram: 'https://instagram.com/alacaat',
    whatsapp: 'https://wa.me/+905308956948',
    tripadvisor: 'https://www.tripadvisor.com.tr/Hotel_Review-g1024116-d10615608-Reviews-Alacaat_Otel-Alacati_Cesme_Izmir_Province_Turkish_Aegean_Coast.html',
  },

  // ─── Location ──────────────────────────────────────────────────────
  location: {
    lat: 38.2818,
    lng: 26.3768,
    mapZoom: 15,
  },

  // ─── Images ────────────────────────────────────────────────────────
  images: {
    logo: '/logo/logo.avif',
    logoDark: '/logo/logo.avif',
    about: '/images/abaout/about.webp',
    hero: [
      '/images/hero/hero.webp',
    ],
    favicon: '/favicon.ico',
    ogImage: '/images/hero/hero.webp',
  },

  // ─── Rooms ─────────────────────────────────────────────────────────
  rooms: [
    {
      slug: 'ametis',
      images: [
        '/images/rooms/Ametis/v1.avif',
        '/images/rooms/Ametis/v2.avif',
        '/images/rooms/Ametis/v3.avif',
        '/images/rooms/Ametis/v4.avif'
      ],
      maxGuests: 4,
      size: 25,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'garden-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Ametis)', en: 'Deluxe Room (Ametis)' },
      description: {
        tr: 'Ametis taşının huzur veren enerjisiyle tasarlanmış odamız. Konforlu ve dinlendirici bir konaklama için ideal.',
        en: 'Our room designed with the peaceful energy of amethyst stone. Ideal for a comfortable and relaxing stay.',
      },
      shortDescription: {
        tr: 'Huzur veren, şık tasarımlı Ametis odası.',
        en: 'Peaceful, elegantly designed Ametis room.',
      },
      reviews: [
        {
                author: "Canan E.",
                text: {
                        tr: "Genişliği ve ferahlığıyla harika bir deneyimdi. Özellikle temizlik kusursuzdu.",
                        en: "It was a wonderful experience with its spaciousness. The cleanliness was especially flawless."
                },
                rating: 5
        },
        {
                author: "Bora Y.",
                text: {
                        tr: "Ametis taşının o huzur veren atmosferini gerçekten hissettik. Ailecek çok rahat ettik.",
                        en: "We really felt the peaceful atmosphere of the amethyst stone. We were very comfortable as a family."
                },
                rating: 5
        }
]
    },
    {
      slug: 'florit',
      images: [
        '/images/rooms/Florit/v1.avif',
        '/images/rooms/Florit/v2.avif',
        '/images/rooms/Florit/v3.avif',
        '/images/rooms/Florit/v4.avif'
      ],
      maxGuests: 2,
      size: 22,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'garden-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'twin-beds'],
      name: { tr: 'Deluxe Oda (Florit)', en: 'Deluxe Room (Florit)' },
      description: {
        tr: 'Zarif detaylar ve ferah bir atmosfere sahip Florit odamız. Modern olanaklarla donatılmış konforlu bir alan.',
        en: 'Our Florit room with elegant details and a spacious atmosphere. A comfortable space equipped with modern amenities.',
      },
      shortDescription: {
        tr: 'Zarif ve ferah Florit odası.',
        en: 'Elegant and spacious Florit room.',
      },
      reviews: [
        {
                author: "Selin T.",
                text: {
                        tr: "Florit odasının o zarif dekorasyonu ve bahçe manzarası bizi büyüledi. Sabahları kuş sesleriyle uyanmak harikaydı.",
                        en: "The elegant decoration and garden view of the Florit room fascinated us. Waking up to the sounds of birds in the morning was great."
                },
                rating: 5
        }
]
    },
    {
      slug: 'kalsit',
      images: [
        '/images/rooms/Kalsit/v1.avif',
        '/images/rooms/Kalsit/v2.avif',
        '/images/rooms/Kalsit/v3.avif'
      ],
      maxGuests: 3,
      size: 22,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'garden-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Kalsit)', en: 'Deluxe Room (Kalsit)' },
      description: {
        tr: 'Doğal taş konseptinin sıcaklığını yansıtan Kalsit odamız. Alaçatı ruhunu yaşamak isteyen misafirlerimiz için.',
        en: 'Our Kalsit room reflecting the warmth of the natural stone concept. For our guests who want to experience the spirit of Alaçatı.',
      },
      shortDescription: {
        en: 'A spacious and elegant suite with a separate living area.',
        tr: 'Geniş ve zarif bir süit; ayrı bir oturma alanı ile konfor sunar.'
      },
      reviews: [
        {
                author: "Ahmet D.",
                text: {
                        tr: "Doğal taş konsepti ve geniş oturma alanı ile Alaçatı ruhunu sonuna kadar yaşadık. Kesinlikle tekrar geleceğiz.",
                        en: "With the natural stone concept and large seating area, we experienced the spirit of Alaçatı to the fullest. We will definitely come back."
                },
                rating: 5
        }
]
    },
    {
      slug: 'kehribar',
      images: [
        '/images/rooms/Kehribar/v1.avif',
        '/images/rooms/Kehribar/v2.avif',
        '/images/rooms/Kehribar/v3.avif',
        '/images/rooms/Kehribar/v4.avif'
      ],
      maxGuests: 3,
      size: 20,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Standart Oda (Kehribar)', en: 'Standard Room (Kehribar)' },
      description: {
        tr: 'Kehribarın sıcak tonlarıyla dekore edilmiş geniş odamız. Özel detaylar ve üstün konfor ile unutulmaz bir tatil deneyimi.',
        en: 'Our spacious room decorated with the warm tones of amber. An unforgettable holiday experience with special details and superior comfort.',
      },
      shortDescription: {
        tr: 'Sıcak tonlarda dekore edilmiş konforlu Kehribar odası.',
        en: 'Comfortable Kehribar room decorated in warm tones.',
      },
      reviews: [
        {
                author: "Gülşah M.",
                text: {
                        tr: "Sıcak tonlar odaya inanılmaz bir romantizm katmış. Kendimizi evimizde ama bir o kadar da lüks içinde hissettik.",
                        en: "The warm tones added incredible romance to the room. We felt at home but in luxury."
                },
                rating: 5
        }
]
    },
    {
      slug: 'mercan',
      images: [
        '/images/rooms/Mercan/v1.avif',
        '/images/rooms/Mercan/v2.avif',
        '/images/rooms/Mercan/v3.avif',
        '/images/rooms/Mercan/v4.avif',
        '/images/rooms/Mercan/v5.avif'
      ],
      maxGuests: 2,
      size: 20,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'twin-beds'],
      name: { tr: 'Standart Oda (Mercan)', en: 'Standard Room (Mercan)' },
      description: {
        tr: 'Mercan renginin enerjisiyle canlanan ferah odamız. Günün yorgunluğunu atmak için mükemmel bir ortam.',
        en: 'Our spacious room enlivened by the energy of coral color. A perfect environment to relieve the tiredness of the day.',
      },
      shortDescription: {
        tr: 'Enerji dolu, ferah Mercan odası.',
        en: 'Energetic, spacious Mercan room.',
      },
      reviews: [
        {
                author: "Merve B.",
                text: {
                        tr: "Arkadaşımla konakladık. Odadaki imkanlar eksiksizdi ve renklerin enerjisi tatilimize neşe kattı.",
                        en: "Stayed with a friend. The facilities in the room were complete and the energy of the colors added joy to our holiday."
                },
                rating: 5
        }
]
    },
    {
      slug: 'oniks',
      images: [
        '/images/rooms/Oniks/v1.avif',
        '/images/rooms/Oniks/v2.avif'
      ],
      maxGuests: 2,
      size: 22,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'pool-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Oniks)', en: 'Deluxe Room (Oniks)' },
      description: {
        tr: 'Oniks taşının gizemli ve güçlü yapısından ilham alınarak tasarlanan odamız. Kendine özgü stiliyle dikkat çekiyor.',
        en: 'Our room designed inspired by the mysterious and strong structure of onyx stone. Draws attention with its unique style.',
      },
      shortDescription: {
        tr: 'Gizemli ve güçlü tasarımlı Oniks odası.',
        en: 'Mysterious and powerfully designed Oniks room.',
      },
      reviews: [
        {
                author: "Kaan A.",
                text: {
                        tr: "Oniks odasının gizemli ve güçlü tasarımı gerçekten farklı bir hava katıyor. Havuz manzarası ve konfor muazzam.",
                        en: "The mysterious and strong design of the Onyx room really adds a different atmosphere. Pool view and comfort are tremendous."
                },
                rating: 5
        }
]
    },
    {
      slug: 'opal',
      images: [
        '/images/rooms/Opal/v1.avif',
        '/images/rooms/Opal/v2.avif',
        '/images/rooms/Opal/v3.avif',
        '/images/rooms/Opal/v4.avif',
        '/images/rooms/Opal/v5.avif'
      ],
      maxGuests: 3,
      size: 25,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'garden-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed', 'extra-bed'],
      name: { tr: 'Deluxe Oda (Opal)', en: 'Deluxe Room (Opal)' },
      description: {
        tr: 'Işıltılı ve renkli Opal taşı temasını yansıtan butik odamız. Modern çizgilerle Alaçatı mimarisinin mükemmel uyumu.',
        en: 'Our boutique room reflecting the sparkling and colorful Opal stone theme. The perfect harmony of Alaçatı architecture with modern lines.',
      },
      shortDescription: {
        tr: 'Işıltılı ve şık Opal odası.',
        en: 'Sparkling and stylish Opal room.',
      },
      reviews: [
        {
                author: "Zeynep Y.",
                text: {
                        tr: "Işıltılı ve tertemiz bir oda! Her detayı ince düşünülmüş. Personel de çok ilgiliydi, herkese tavsiye ederim.",
                        en: "A sparkling and spotlessly clean room! Every detail has been carefully considered. I highly recommend it."
                },
                rating: 5
        }
]
    },
    {
      slug: 'safir',
      images: [
        '/images/rooms/Safir/v1.avif',
        '/images/rooms/Safir/v2.avif',
        '/images/rooms/Safir/v3.avif',
        '/images/rooms/Safir/v4.avif'
      ],
      maxGuests: 2,
      size: 25,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'pool-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Safir)', en: 'Deluxe Room (Safir)' },
      description: {
        tr: 'Safir mavisinin asaletini taşıyan premium odamız. Lüks konaklama detayları ve geniş yaşam alanıyla hizmetinizde.',
        en: 'Our premium room carrying the nobility of sapphire blue. At your service with luxury accommodation details and a large living area.',
      },
      shortDescription: {
        tr: 'Safir mavisinin asaletini taşıyan premium oda.',
        en: 'Premium room carrying the nobility of sapphire blue.',
      },
      reviews: [
        {
                author: "Murat C.",
                text: {
                        tr: "Safir mavisinin o premium hissi odaya adım atar atmaz sizi sarıyor. Lüks bir balayı geçirmek isteyenlere duyurulur.",
                        en: "The premium feel of sapphire blue surrounds you as soon as you step into the room. Highly recommended for a luxurious honeymoon."
                },
                rating: 5
        }
]
    },
    {
      slug: 'yakut',
      images: [
        '/images/rooms/Yakut/v1.avif',
        '/images/rooms/Yakut/v2.avif',
        '/images/rooms/Yakut/v3.avif',
        '/images/rooms/Yakut/v4.avif'
      ],
      maxGuests: 2,
      size: 25,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'garden-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Yakut)', en: 'Deluxe Room (Yakut)' },
      description: {
        tr: 'Yakut taşının tutkulu kırmızısından ilham alan romantik odamız. Çiftler için özel ve unutulmaz bir deneyim.',
        en: 'Our romantic room inspired by the passionate red of the ruby stone. A special and unforgettable experience for couples.',
      },
      shortDescription: {
        tr: 'Çiftler için romantik ve özel Yakut odası.',
        en: 'Romantic and special Yakut room for couples.',
      },
      reviews: [
        {
                author: "Derya S.",
                text: {
                        tr: "Tutkulu ve romantik konsepti tam bizlikti. Bahçe manzarasının keyfi ve odanın şıklığı birleşince rüya gibi bir 2 gün geçirdik.",
                        en: "The passionate and romantic concept was just for us. The enjoyment of the garden view and the elegance of the room made it a dream-like 2 days."
                },
                rating: 5
        }
]
    },
    {
      slug: 'yesim',
      images: [
        '/images/rooms/Yesim/v1.avif',
        '/images/rooms/Yesim/v2.avif',
        '/images/rooms/Yesim/v3.avif',
        '/images/rooms/Yesim/v4.avif',
        '/images/rooms/Yesim/v5.avif'
      ],
      maxGuests: 2,
      size: 25,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'garden-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Yeşim)', en: 'Deluxe Room (Yeşim)' },
      description: {
        tr: 'Doğanın canlılığını ve yeşimin saflığını odanıza taşıyoruz. Aydınlık ve enerjik atmosferiyle dingin bir mola.',
        en: 'We bring the vitality of nature and the purity of jade to your room. A peaceful break with its bright and energetic atmosphere.',
      },
      shortDescription: {
        tr: 'Doğal, ferah ve enerji dolu Yeşim odası.',
        en: 'Natural, spacious and energetic Yeşim room.',
      },
      reviews: [
        {
                author: "Hakan K.",
                text: {
                        tr: "Doğallığı ve sakinliği arayanlar için Yeşim odası tek kelimeyle mükemmel. Çok dinlendirici ve huzurlu bir atmosfer.",
                        en: "For those looking for naturalness and calmness, the Jade room is simply perfect. A very relaxing and peaceful atmosphere."
                },
                rating: 5
        }
]
    },
    {
      slug: 'zumrut',
      images: [
        '/images/rooms/Zumrut/v1.avif',
        '/images/rooms/Zumrut/v2.avif',
        '/images/rooms/Zumrut/v3.avif',
        '/images/rooms/Zumrut/v4.avif'
      ],
      maxGuests: 2,
      size: 25,
      amenities: ['ac', 'minibar', 'tv', 'safe', 'shower', 'bathroom', 'hairdryer', 'satellite', 'wifi', 'smoke-detector', 'soundproof', 'towels', 'slippers', 'toiletries', 'bottled-water', 'pool-view', 'room-service', 'desk', 'seating-area', 'iron', 'fire-extinguisher', 'first-aid', 'window-guards', 'double-bed'],
      name: { tr: 'Deluxe Oda (Zümrüt)', en: 'Deluxe Room (Zümrüt)' },
      description: {
        tr: 'Zümrüt zarafetiyle tasarlanmış, otelimizin en özel süitlerinden biri. Eşsiz konfor detayları ve jakuzi ayrıcalığıyla lüks bir tatil.',
        en: 'One of the most special suites of our hotel, designed with emerald elegance. A luxury holiday with unique comfort details and jacuzzi privilege.',
      },
      shortDescription: {
        tr: 'Lüks ve görkemin buluştuğu Zümrüt odası.',
        en: 'Zümrüt room where luxury and splendor meet.',
      },
      reviews: [
        {
          author: "Ece P.",
          text: {
            tr: "Zümrüt odasındaki jakuzi keyfi ve eşsiz lüks detaylar tatilimizi unutulmaz kıldı. Gördüğüm en şık odalardan biri.",
            en: "The jacuzzi enjoyment and unique luxury details in the Emerald room made our holiday unforgettable. One of the most stylish rooms I have ever seen."
          },
          rating: 5
        }
      ]
    }
  ],

  // ─── Amenities ─────────────────────────────────────────────────────
  amenities: [
    {
      icon: 'i-heroicons-sun',
      name: { tr: 'Havuz ve Bahçe', en: 'Pool and Garden' },
      description: {
        tr: 'Güneşlenme terası ve açık yüzme havuzu.',
        en: 'Sun terrace and outdoor swimming pool.',
      },
    },
    {
      icon: 'i-heroicons-sparkles',
      name: { tr: 'Günlük Temizlik', en: 'Daily Housekeeping' },
      description: {
        tr: 'Odalarda her gün düzenli temizlik hizmeti.',
        en: 'Regular daily cleaning service in rooms.',
      },
    },
    {
      icon: 'i-heroicons-wifi',
      name: { tr: 'Ücretsiz Wi-Fi', en: 'Free Wi-Fi' },
      description: {
        tr: 'Tüm alanlarda yüksek hızlı internet.',
        en: 'High-speed internet in all areas.',
      },
    },
    {
      icon: 'i-heroicons-truck',
      name: { tr: 'VIP Transfer', en: 'VIP Transfer' },
      description: {
        tr: 'Havalimanı ve plajlara VIP transfer (Ücretli).',
        en: 'VIP transfer to airport and beaches (Paid).',
      },
    },
    {
      icon: 'i-heroicons-shopping-bag',
      name: { tr: 'Kuru Temizleme & Yıkama', en: 'Dry Cleaning & Laundry' },
      description: {
        tr: 'Kuru temizleme ve çamaşırhane hizmetleri (Ücretli).',
        en: 'Dry cleaning and laundry services (Paid).',
      },
    },
    {
      icon: 'i-heroicons-clock',
      name: { tr: '24 Saat Resepsiyon', en: '24/7 Reception' },
      description: {
        tr: 'Her an hizmetinizdeyiz.',
        en: 'Always at your service.',
      },
    },
    {
      icon: 'i-heroicons-key',
      name: { tr: 'Ücretsiz Otopark', en: 'Free Parking' },
      description: {
        tr: 'Otel misafirleri için özel otopark alanı.',
        en: 'Private parking area for hotel guests.',
      },
    },
  ],

  // ─── Gallery ───────────────────────────────────────────────────────
  gallery: [
    { src: '/images/outdoor/v1.webp', alt: { tr: 'Otel dış cephesi', en: 'Hotel exterior' }, description: { tr: 'Alaçatı\'nın taş mimarisini yansıtan otelimizin dış görünümü.', en: 'The exterior of our hotel reflecting the stone architecture of Alaçatı.' }, category: 'exterior' },
    { src: '/images/outdoor/v2.webp', alt: { tr: 'Otel dış cephesi', en: 'Hotel exterior' }, description: { tr: 'Hacımemiş\'in tarihi atmosferinde sizi karşılayan şık detaylar.', en: 'Elegant details welcoming you in the historical atmosphere of Hacımemiş.' }, category: 'exterior' },
    { src: '/images/outdoor/v3.webp', alt: { tr: 'Otel dış cephesi', en: 'Hotel exterior' }, description: { tr: 'Ege ruhunu yaşatan otelimizin dış cephesi.', en: 'The exterior of our hotel reflecting the Aegean spirit.' }, category: 'exterior' },

    { src: '/images/havuz/v1.webp', alt: { tr: 'Havuz alanı', en: 'Pool area' }, description: { tr: 'Sıcak yaz günlerinde serinleyebileceğiniz havuz alanımız.', en: 'Our pool area where you can cool off on hot summer days.' }, category: 'pool' },
    { src: '/images/havuz/v2.webp', alt: { tr: 'Havuz alanı', en: 'Pool area' }, description: { tr: 'Huzurlu ve sakin bir havuz keyfi için ideal alan.', en: 'An ideal area for a peaceful and quiet pool experience.' }, category: 'pool' },
    { src: '/images/havuz/v3.webp', alt: { tr: 'Havuz alanı', en: 'Pool area' }, description: { tr: 'Şezlonglarımızda güneşlenip havuz başında dinlenebilirsiniz.', en: 'You can sunbathe on our sun loungers and relax by the pool.' }, category: 'pool' },
    { src: '/images/havuz/v4.webp', alt: { tr: 'Havuz alanı', en: 'Pool area' }, description: { tr: 'Limon bahçemizin eşlik ettiği ferah havuzumuz.', en: 'Our spacious pool accompanied by our lemon garden.' }, category: 'pool' },
    { src: '/images/havuz/v5.webp', alt: { tr: 'Havuz alanı', en: 'Pool area' }, description: { tr: 'Şehrin gürültüsünden uzak havuz keyfi.', en: 'Enjoy the pool away from the noise of the city.' }, category: 'pool' },
    
    { src: '/images/bar/v1.webp', alt: { tr: 'Restoran & Bar', en: 'Restaurant & Bar' }, description: { tr: 'Keyifli akşamlarınıza eşlik edecek bar alanımız.', en: 'Our bar area that will accompany your pleasant evenings.' }, category: 'restaurant' },
    { src: '/images/bar/v2.webp', alt: { tr: 'Restoran & Bar', en: 'Restaurant & Bar' }, description: { tr: 'Özel tatların sunulduğu şık restoranımız.', en: 'Our elegant restaurant where special flavors are served.' }, category: 'restaurant' },
    { src: '/images/bar/v3.webp', alt: { tr: 'Restoran & Bar', en: 'Restaurant & Bar' }, description: { tr: 'Kendi bahçemizin ürünleriyle hazırlanan içeceklerimiz.', en: 'Our drinks prepared with products from our own garden.' }, category: 'restaurant' },
    { src: '/images/bar/v5.webp', alt: { tr: 'Restoran & Bar', en: 'Restaurant & Bar' }, description: { tr: 'Huzurlu akşamlar için özel olarak tasarlanmış alanımız.', en: 'Our area specially designed for peaceful evenings.' }, category: 'restaurant' },
    
    { src: '/images/Kahvalti/v1.webp', alt: { tr: 'Kahvaltı', en: 'Breakfast' }, description: { tr: 'Yerel lezzetlerle donatılmış Ege serpme kahvaltımız.', en: 'Our Aegean mixed breakfast equipped with local flavors.' }, category: 'restaurant' },
    { src: '/images/Kahvalti/v2.webp', alt: { tr: 'Kahvaltı', en: 'Breakfast' }, description: { tr: 'Ev yapımı reçellerle güne tatlı bir başlangıç.', en: 'A sweet start to the day with homemade jams.' }, category: 'restaurant' },
    { src: '/images/Kahvalti/v3.webp', alt: { tr: 'Kahvaltı', en: 'Breakfast' }, description: { tr: 'Taze ve doğal ürünlerle hazırlanan zengin kahvaltı.', en: 'Rich breakfast prepared with fresh and natural products.' }, category: 'restaurant' },
    { src: '/images/Kahvalti/v4.webp', alt: { tr: 'Kahvaltı', en: 'Breakfast' }, description: { tr: 'Havuz başında veya bahçemizde kahvaltı keyfi.', en: 'Enjoy breakfast by the pool or in our garden.' }, category: 'restaurant' },
    
    { src: '/images/banyo/v1.webp', alt: { tr: 'Banyo', en: 'Bathroom' }, description: { tr: 'Modern tasarıma sahip ferah banyolarımız.', en: 'Our spacious bathrooms with modern design.' }, category: 'room' },
    { src: '/images/banyo/v2.webp', alt: { tr: 'Banyo', en: 'Bathroom' }, description: { tr: 'Günün yorgunluğunu atabileceğiniz şık detaylar.', en: 'Elegant details where you can relieve the tiredness of the day.' }, category: 'room' },
    { src: '/images/banyo/v3.webp', alt: { tr: 'Banyo', en: 'Bathroom' }, description: { tr: 'Konforunuz için özenle düşünülmüş banyo mimarisi.', en: 'Bathroom architecture carefully considered for your comfort.' }, category: 'room' },
    
    { src: '/images/recepsion/v1.webp', alt: { tr: 'Resepsiyon', en: 'Reception' }, description: { tr: 'Sizi sıcak bir şekilde karşıladığımız resepsiyon alanımız.', en: 'Our reception area where we welcome you warmly.' }, category: 'view' },
    { src: '/images/recepsion/v2.webp', alt: { tr: 'Resepsiyon', en: 'Reception' }, description: { tr: 'Giriş anınızdan itibaren hissedeceğiniz Ege misafirperverliği.', en: 'Aegean hospitality you will feel from the moment you check in.' }, category: 'view' },
    { src: '/images/recepsion/v3.webp', alt: { tr: 'Resepsiyon', en: 'Reception' }, description: { tr: 'Tüm sorularınız için 7/24 yanınızdayız.', en: 'We are with you 24/7 for all your questions.' }, category: 'view' },

    { src: '/images/rooms/Ametis/v1.avif', alt: { tr: 'Ametis Oda', en: 'Ametis Room' }, description: { tr: 'Geniş ve ferah kullanım alanıyla öne çıkan, özenle dekore edilmiş Ametis odamız.', en: 'Our carefully decorated Ametis room, standing out with its large and spacious usage area.' }, category: 'room' },
    { src: '/images/rooms/Ametis/v2.avif', alt: { tr: 'Ametis Oda', en: 'Ametis Room' }, description: { tr: 'Ametis odamızda sunulan konforlu ve şık detaylar.', en: 'Comfortable and elegant details offered in our Ametis room.' }, category: 'room' },
    { src: '/images/rooms/Ametis/v3.avif', alt: { tr: 'Ametis Oda', en: 'Ametis Room' }, description: { tr: 'Huzurlu bir konaklama için tasarlanmış Ametis odamız.', en: 'Our Ametis room designed for a peaceful stay.' }, category: 'room' },
    { src: '/images/rooms/Ametis/v4.avif', alt: { tr: 'Ametis Oda', en: 'Ametis Room' }, description: { tr: 'Doğal ışık alan, modern mobilyalarla döşenmiş Ametis.', en: 'Ametis, furnished with modern furniture and receiving natural light.' }, category: 'room' },
    
    { src: '/images/rooms/Florit/v1.avif', alt: { tr: 'Florit Oda', en: 'Florit Room' }, description: { tr: 'Zarif detayları ve huzur veren atmosferiyle Florit odamız.', en: 'Our Florit room with its elegant details and peaceful atmosphere.' }, category: 'room' },
    { src: '/images/rooms/Florit/v2.avif', alt: { tr: 'Florit Oda', en: 'Florit Room' }, description: { tr: 'Florit odamızın konforlu yatak alanı.', en: 'The comfortable bed area of our Florit room.' }, category: 'room' },
    { src: '/images/rooms/Florit/v3.avif', alt: { tr: 'Florit Oda', en: 'Florit Room' }, description: { tr: 'Ege mimarisiyle harmanlanmış şık oda tasarımı.', en: 'Elegant room design blended with Aegean architecture.' }, category: 'room' },
    { src: '/images/rooms/Florit/v4.avif', alt: { tr: 'Florit Oda', en: 'Florit Room' }, description: { tr: 'Florit odamızda yer alan dinlenme köşesi.', en: 'The resting corner in our Florit room.' }, category: 'room' },
    
    { src: '/images/rooms/Kalsit/v1.avif', alt: { tr: 'Kalsit Oda', en: 'Kalsit Room' }, description: { tr: 'Doğal taş dokuları ve modern tasarımıyla Kalsit odamız.', en: 'Our Kalsit room with natural stone textures and modern design.' }, category: 'room' },
    { src: '/images/rooms/Kalsit/v2.avif', alt: { tr: 'Kalsit Oda', en: 'Kalsit Room' }, description: { tr: 'Alaçatı ruhunu yansıtan eşsiz detaylar.', en: 'Unique details reflecting the spirit of Alaçatı.' }, category: 'room' },
    { src: '/images/rooms/Kalsit/v3.avif', alt: { tr: 'Kalsit Oda', en: 'Kalsit Room' }, description: { tr: 'Kalsit odamızın rahatlatıcı atmosferi.', en: 'The relaxing atmosphere of our Kalsit room.' }, category: 'room' },
    
    { src: '/images/rooms/Kehribar/v1.avif', alt: { tr: 'Kehribar Oda', en: 'Kehribar Room' }, description: { tr: 'Sıcak renk tonları ve şık tasarımıyla Kehribar odamız.', en: 'Our Kehribar room with warm color tones and elegant design.' }, category: 'room' },
    { src: '/images/rooms/Kehribar/v2.avif', alt: { tr: 'Kehribar Oda', en: 'Kehribar Room' }, description: { tr: 'Kendinizi evinizde hissedeceğiniz sıcak bir ortam.', en: 'A warm environment where you will feel at home.' }, category: 'room' },
    { src: '/images/rooms/Kehribar/v3.avif', alt: { tr: 'Kehribar Oda', en: 'Kehribar Room' }, description: { tr: 'Özenle seçilmiş mobilyalar ve aksesuarlar.', en: 'Carefully selected furniture and accessories.' }, category: 'room' },
    { src: '/images/rooms/Kehribar/v4.avif', alt: { tr: 'Kehribar Oda', en: 'Kehribar Room' }, description: { tr: 'Kehribar odamızın ferah iç mekanı.', en: 'The spacious interior of our Kehribar room.' }, category: 'room' },
    
    { src: '/images/rooms/Mercan/v1.avif', alt: { tr: 'Mercan Oda', en: 'Mercan Room' }, description: { tr: 'Canlı ve dinamik bir enerji sunan Mercan odamız.', en: 'Our Mercan room offering a lively and dynamic energy.' }, category: 'room' },
    { src: '/images/rooms/Mercan/v2.avif', alt: { tr: 'Mercan Oda', en: 'Mercan Room' }, description: { tr: 'Konforlu bir tatil için ihtiyacınız olan her şey.', en: 'Everything you need for a comfortable holiday.' }, category: 'room' },
    { src: '/images/rooms/Mercan/v3.avif', alt: { tr: 'Mercan Oda', en: 'Mercan Room' }, description: { tr: 'Mercan odamızın şık banyo tasarımı.', en: 'The elegant bathroom design of our Mercan room.' }, category: 'room' },
    { src: '/images/rooms/Mercan/v4.avif', alt: { tr: 'Mercan Oda', en: 'Mercan Room' }, description: { tr: 'Güne huzurla uyanacağınız yatak alanımız.', en: 'Our bed area where you will wake up peacefully.' }, category: 'room' },
    { src: '/images/rooms/Mercan/v5.avif', alt: { tr: 'Mercan Oda', en: 'Mercan Room' }, description: { tr: 'Modern ve geleneksel motiflerin eşsiz uyumu.', en: 'The unique harmony of modern and traditional motifs.' }, category: 'room' },
    
    { src: '/images/rooms/Oniks/v1.avif', alt: { tr: 'Oniks Oda', en: 'Oniks Room' }, description: { tr: 'Asil bir tasarıma sahip olan Oniks odamız.', en: 'Our Oniks room with a noble design.' }, category: 'room' },
    { src: '/images/rooms/Oniks/v2.avif', alt: { tr: 'Oniks Oda', en: 'Oniks Room' }, description: { tr: 'Oniks odamızın sunduğu eşsiz konfor.', en: 'The unique comfort offered by our Oniks room.' }, category: 'room' },
    
    { src: '/images/rooms/Opal/v1.avif', alt: { tr: 'Opal Oda', en: 'Opal Room' }, description: { tr: 'Işıl ışıl ve ferah atmosferiyle Opal odamız.', en: 'Our Opal room with its sparkling and spacious atmosphere.' }, category: 'room' },
    { src: '/images/rooms/Opal/v2.avif', alt: { tr: 'Opal Oda', en: 'Opal Room' }, description: { tr: 'Opal odamızda yer alan dinlendirici detaylar.', en: 'Relaxing details in our Opal room.' }, category: 'room' },
    { src: '/images/rooms/Opal/v3.avif', alt: { tr: 'Opal Oda', en: 'Opal Room' }, description: { tr: 'Tatile keyif katacak modern dokunuşlar.', en: 'Modern touches that will add joy to your holiday.' }, category: 'room' },
    { src: '/images/rooms/Opal/v4.avif', alt: { tr: 'Opal Oda', en: 'Opal Room' }, description: { tr: 'Opal odamızın geniş ve rahat yatağı.', en: 'The large and comfortable bed of our Opal room.' }, category: 'room' },
    { src: '/images/rooms/Opal/v5.avif', alt: { tr: 'Opal Oda', en: 'Opal Room' }, description: { tr: 'Minimalist ve zarif oda tasarımı.', en: 'Minimalist and elegant room design.' }, category: 'room' },
    
    { src: '/images/rooms/Safir/v1.avif', alt: { tr: 'Safir Oda', en: 'Safir Room' }, description: { tr: 'Mavi ve beyazın kusursuz uyumunu sunan Safir odamız.', en: 'Our Safir room offering the perfect harmony of blue and white.' }, category: 'room' },
    { src: '/images/rooms/Safir/v2.avif', alt: { tr: 'Safir Oda', en: 'Safir Room' }, description: { tr: 'Safir odamızın sakinleştiren dekorasyonu.', en: 'The calming decoration of our Safir room.' }, category: 'room' },
    { src: '/images/rooms/Safir/v3.avif', alt: { tr: 'Safir Oda', en: 'Safir Room' }, description: { tr: 'Aydınlık ve ferah yaşam alanımız.', en: 'Our bright and spacious living area.' }, category: 'room' },
    { src: '/images/rooms/Safir/v4.avif', alt: { tr: 'Safir Oda', en: 'Safir Room' }, description: { tr: 'Safir odamızda konfor ve şıklık bir arada.', en: 'Comfort and elegance combined in our Safir room.' }, category: 'room' },
    
    { src: '/images/rooms/Yakut/v1.avif', alt: { tr: 'Yakut Oda', en: 'Yakut Room' }, description: { tr: 'Gösterişli ve sıcak bir atmosfere sahip Yakut odamız.', en: 'Our Yakut room with a glamorous and warm atmosphere.' }, category: 'room' },
    { src: '/images/rooms/Yakut/v2.avif', alt: { tr: 'Yakut Oda', en: 'Yakut Room' }, description: { tr: 'Yakut odamızın özel tasarım detayları.', en: 'Special design details of our Yakut room.' }, category: 'room' },
    { src: '/images/rooms/Yakut/v3.avif', alt: { tr: 'Yakut Oda', en: 'Yakut Room' }, description: { tr: 'Lüks ve konforu bir arada sunan yaşam alanı.', en: 'Living area offering luxury and comfort together.' }, category: 'room' },
    { src: '/images/rooms/Yakut/v4.avif', alt: { tr: 'Yakut Oda', en: 'Yakut Room' }, description: { tr: 'Yakut odamızda yer alan dinlenme ve keyif köşesi.', en: 'Rest and enjoyment corner in our Yakut room.' }, category: 'room' },
    
    { src: '/images/rooms/Yesim/v1.avif', alt: { tr: 'Yeşim Oda', en: 'Yesim Room' }, description: { tr: 'Doğanın yeşil tonlarını barındıran Yeşim odamız.', en: 'Our Yesim room featuring the green tones of nature.' }, category: 'room' },
    { src: '/images/rooms/Yesim/v2.avif', alt: { tr: 'Yeşim Oda', en: 'Yesim Room' }, description: { tr: 'Yeşim odamızın tazeleyici ve ferah hissi.', en: 'The refreshing and spacious feel of our Yesim room.' }, category: 'room' },
    { src: '/images/rooms/Yesim/v3.avif', alt: { tr: 'Yeşim Oda', en: 'Yesim Room' }, description: { tr: 'Konforlu bir uyku için tasarlanan yatak köşesi.', en: 'Bed corner designed for a comfortable sleep.' }, category: 'room' },
    { src: '/images/rooms/Yesim/v4.avif', alt: { tr: 'Yeşim Oda', en: 'Yesim Room' }, description: { tr: 'Yeşim odamızın geniş pencere ve aydınlık yapısı.', en: 'The large window and bright structure of our Yesim room.' }, category: 'room' },
    { src: '/images/rooms/Yesim/v5.avif', alt: { tr: 'Yeşim Oda', en: 'Yesim Room' }, description: { tr: 'İç açıcı dekorasyonuyla huzurlu bir ortam.', en: 'A peaceful environment with its refreshing decoration.' }, category: 'room' },
    
    { src: '/images/rooms/Zumrut/v1.avif', alt: { tr: 'Zümrüt Oda', en: 'Zumrut Room' }, description: { tr: 'Göz alıcı yeşil detaylarıyla Zümrüt odamız.', en: 'Our Zumrut room with eye-catching green details.' }, category: 'room' },
    { src: '/images/rooms/Zumrut/v2.avif', alt: { tr: 'Zümrüt Oda', en: 'Zumrut Room' }, description: { tr: 'Zümrüt odamızda sunulan premium konfor.', en: 'Premium comfort offered in our Zumrut room.' }, category: 'room' },
    { src: '/images/rooms/Zumrut/v3.avif', alt: { tr: 'Zümrüt Oda', en: 'Zumrut Room' }, description: { tr: 'Ege stilini yansıtan otantik aksesuarlar.', en: 'Authentic accessories reflecting the Aegean style.' }, category: 'room' },
    { src: '/images/rooms/Zumrut/v4.avif', alt: { tr: 'Zümrüt Oda', en: 'Zumrut Room' }, description: { tr: 'Zümrüt odamızın şık ve modern banyosu.', en: 'The elegant and modern bathroom of our Zumrut room.' }, category: 'room' },
  ],

  testimonials: [
    {
      name: 'Onur Dursun Yanık',
      rating: 5,
      date: '2023-09-15',
      comment: {
        tr: 'Alaçatı her geldiğimizde kalacağımız bir otelimiz oldu. Konumu çarşıya yakın, kahvaltısı harika, çalışanları güler yüzlü yardımsever. Kendi evimizde hissettiren havuzu ideal, yatakların temizliği gayet başarılı. İyi ki varlar.',
        en: 'It became our hotel to stay every time we come to Alaçatı. Its location is close to the bazaar, breakfast is wonderful, employees are smiling and helpful. The pool that makes you feel at home is ideal, the cleanliness of the beds is quite successful. Glad they exist.',
      },
      source: 'Google',
    },
    {
      name: 'Ada',
      rating: 5,
      date: '2019-05-20',
      comment: {
        tr: 'Otel konumu itibariyle hem Alaçatı\'nın merkezine yakın hem de bir o kadar sakin sessiz bir bölgede. Kendine ait havuzu ve zengin bahçesi tam anlamıyla huzur veriyor. Odalar o kadar temiz ki adeta müstakil evinizde kalıyormuş gibi hissediyorsunuz.',
        en: 'Due to its location, the hotel is both close to the center of Alaçatı and in a quiet area. Its own pool and rich garden give complete peace. The rooms are so clean that you feel as if you are staying in your own private house.',
      },
      source: 'TripAdvisor',
    },
    {
      name: 'Aynınur Ö.',
      rating: 5,
      date: '2021-09-10',
      comment: {
        tr: 'Burası bizim Alaçatı\'daki evimiz diyebilirim. Bu sene ailecek tekrar gittik ve yine çok keyif aldık. Her şey yine güzel, temiz, leziz, nezih, samimi. Yani eksilen hiçbir şey yok 👌 Mustafa bey ve ekibinin eline yüreğine sağlık.',
        en: 'I can say this is our home in Alaçatı. We went again as a family this year and enjoyed it very much again. Everything is beautiful, clean, delicious, decent, sincere again. So there is nothing missing 👌 Health to the hands and hearts of Mr. Mustafa and his team.',
      },
      source: 'Google Reviews',
    },
    {
      name: 'Zübeyde G',
      rating: 5,
      date: '2019-07-15',
      comment: {
        tr: 'Seçtiğim butik otel beni inanılmaz mutlu etti. Alaçatı merkeze yürüyerek 5 dk içinde ulaşıyorsunuz. Hem çok sakin hem de merkezi. Odalar temiz, havuz kullanışlı. Aylin hanım her sabah muhteşem kahvaltısı ile bizi büyüledi.',
        en: 'The boutique hotel I chose made me incredibly happy. You can reach the center of Alaçatı within a 5-minute walk. Both very quiet and central. Rooms are clean, pool is handy. Ms. Aylin fascinated us with her wonderful breakfast every morning.',
      },
      source: 'TripAdvisor',
    },
    {
      name: 'Gulden S',
      rating: 5,
      date: '2020-09-05',
      comment: {
        tr: 'Geçen sene Eylül ayında konakladığımız bu otel, temizlik ve rahatlık konusunda yine bizi yanıltmadı. Başta Emine Hanım ve Özcan Bey\'in güler yüzü ve hassasiyeti bizim huzur içinde güzel bir tatil yapmamızı sağladı.',
        en: 'This hotel, where we stayed last September, did not mislead us again in terms of cleanliness and comfort. Especially the smiling faces of Ms. Emine and Mr. Özcan and their sensitivity allowed us to have a nice and peaceful holiday.',
      },
      source: 'TripAdvisor',
    },
    {
      name: 'Cemre Öztürk',
      rating: 5,
      date: '2019-08-10',
      comment: {
        tr: 'Tek kelimeyle muhteşemdi! Çok iyi ağırlandık, otel personelleri güler yüzlü ve de bizlere karşı çok ilgiliydiler. Aylin Hanım\'ın kahvaltıları ise harikaydı. Evimizde gibi hissettik, seneye tekrar görüşmek üzere :)',
        en: 'In a word, it was magnificent! We were hosted very well, the hotel staff were smiling and very attentive to us. Ms. Aylin\'s breakfasts were wonderful. We felt at home, see you again next year :)',
      },
      source: 'TripAdvisor',
    },
  ],

  // ─── SEO ───────────────────────────────────────────────────────────
  seo: {
    siteUrl: 'https://alacaathotel.com',
    titleTemplate: '%s | Alaçatı Butik Otel',
    defaultDescription: {
      tr: 'Alaçatı merkezinde havuzlu, taş ev mimarisine sahip romantik butik otel. Şık odalarımızda kahvaltı dahil konaklama fırsatı için hemen online rezervasyon yapın.',
      en: 'Romantic boutique hotel with a pool and stone architecture in the center of Alaçatı. Book your stay with breakfast included in our elegant rooms.',
    },
    ogImage: '/images/hero/hero.webp',
    twitterHandle: '@alacaathotel',
  },

  // ─── Booking ───────────────────────────────────────────────────────
  booking: {
    engine: 'internal',
    checkInTime: '14:00',
    checkOutTime: '12:00',
  },

  // ─── Theme (3 Renk Grubu) ─────────────────────────────────────────
  // 🎨 YENİ OTEL İÇİN BU 3 RENK GRUBUNU DEĞİŞTİRİN:
  //
  // primary → Koyu/ana marka: footer, header scroll, koyu bölümler
  // secondary  → Vurgu/altın: butonlar, CTA, yıldızlar, ikonlar, divider
  // thirdnary → Sıcak tonlar: arka plan vurguları, kartlar, hover
  //
  theme: {
    primary: {
      50: '#bee9e8',
      100: '#bee9e8',
      200: '#bee9e8',
      300: '#62b6cb',
      400: '#62b6cb',
      500: '#1b4965',
      600: '#1b4965',
      700: '#1b4965',
      800: '#1b4965',
      900: '#1b4965',
      950: '#1b4965',
    },
    secondary: {
      50: '#bee9e8',
      100: '#bee9e8',
      200: '#bee9e8',
      300: '#62b6cb',
      400: '#62b6cb',
      500: '#1b4965',
      600: '#1b4965',
      700: '#1b4965',
      800: '#1b4965',
      900: '#1b4965',
      950: '#1b4965',
    },
    thirdnary: {
      50: '#bee9e8',
      100: '#bee9e8',
      200: '#bee9e8',
      300: '#62b6cb',
      400: '#62b6cb',
      500: '#1b4965',
      600: '#1b4965',
      700: '#1b4965',
      800: '#1b4965',
      900: '#1b4965',
      950: '#1b4965',
    },
    heroOverlayOpacity: 0.4,
    topBarBg: '#bee9e8',
  },
}
