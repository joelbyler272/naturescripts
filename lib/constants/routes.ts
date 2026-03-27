/**
 * NatureScripts Route Definitions
 */

export const routes = {
  // Marketing
  home: '/',
  pricing: '/pricing',
  about: '/about',
  howItWorks: '/how-it-works',
  approach: '/approach',
  contact: '/contact',
  faqs: '/faqs',

  // Auth
  signIn: '/sign-in',
  signUp: '/sign-up',
  verifyEmail: '/verify-email',
  setPassword: '/auth/set-password',

  // Onboarding (new users, no auth required)
  onboarding: '/onboarding',

  // Public
  remedies: '/remedies',
  remedyDetail: (slug: string) => `/remedies/${slug}`,
  library: '/library',
  libraryGuides: '/library/guides',
  libraryResearch: '/library/research',
  blog: '/blog',

  // Consumer (requires auth) - served on app.* subdomain
  dashboard: '/dashboard',
  consultation: '/consultation',
  protocols: '/protocols',
  protocolDetail: (id: string) => `/protocols/${id}`,
  tracking: '/tracking',
  intake: '/intake',
  documents: '/documents',
  documentDetail: (id: string) => `/documents/${id}`,
  quizzes: '/quizzes',
  settings: '/settings',
  upgrade: '/upgrade',
  help: '/help',

  // Practitioner (requires auth + practitioner role) - served on practitioner.* or custom subdomain
  practitionerDashboard: '/portal',
  clients: '/clients',
  clientDetail: (id: string) => `/clients/${id}`,
  clientProtocolNew: (id: string) => `/clients/${id}/protocol/new`,
  clientInvite: '/clients/invite',
  practiceSettings: '/practice-settings',
  practiceBranding: '/practice-settings/branding',
  practitionerAnalytics: '/analytics',

  // Legal
  terms: '/terms',
  privacy: '/privacy',
  disclaimer: '/disclaimer',
} as const
