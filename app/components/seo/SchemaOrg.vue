<template>
  <!-- Schema.org structured data rendered as JSON-LD -->
</template>

<script setup lang="ts">
const { config, t, getStarsArray } = useHotelConfig()
const { locale } = useI18n()

// Hotel Schema.org structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        'name': config.name,
        'description': t(config.description),
        'url': config.seo.siteUrl,
        'image': config.images.hero[0],
        'telephone': config.contact.phone,
        'email': config.contact.email,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': t(config.contact.address),
          'addressLocality': t(config.contact.city),
          'addressCountry': t(config.contact.country),
          'postalCode': config.contact.postalCode,
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': config.location.lat,
          'longitude': config.location.lng,
        },
        'starRating': {
          '@type': 'Rating',
          'ratingValue': config.stars,
        },
        'checkinTime': config.booking.checkInTime,
        'checkoutTime': config.booking.checkOutTime,
        'numberOfRooms': config.rooms.length,
        'amenityFeature': config.amenities.map(a => ({
          '@type': 'LocationFeatureSpecification',
          'name': t(a.name),
          'value': true,
        })),
        'sameAs': [
          config.social.instagram,
          config.social.whatsapp,
          config.social.tripadvisor,
        ].filter(Boolean),
      })
    }
  ]
})
</script>
