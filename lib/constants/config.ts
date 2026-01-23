/**
 * NatureScripts App Configuration
 */

export const config = {
  name: 'NatureScripts',
  tagline: 'Protocol',
  description: 'Personalized natural health protocols, in about a minute',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  features: {
    library: true,
    tracking: true,
    pdfExport: false,
  },
  limits: {
    freeConsultationsPerDay: 3,
    maxInputLength: 500,
  },
  pricing: {
    pro: {
      monthly: 9,
      yearly: 90,
    },
  },
} as const
