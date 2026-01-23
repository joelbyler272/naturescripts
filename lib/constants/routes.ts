/**
 * NatureScripts Route Definitions
 */

export const routes = {
  // Marketing
  home: '/',
  pricing: '/pricing',
  about: '/about',
  
  // Auth
  signIn: '/sign-in',
  signUp: '/sign-up',
  verifyEmail: '/verify-email',
  
  // Public
  remedies: '/remedies',
  remedyDetail: (slug: string) => `/remedies/${slug}`,
  library: '/library',
  libraryGuides: '/library/guides',
  libraryResearch: '/library/research',
  blog: '/blog',
  
  // App
  dashboard: '/dashboard',
  consultation: '/consultation',
  protocols: '/protocols',
  protocolDetail: (id: string) => `/protocols/${id}`,
  tracking: '/tracking',
  settings: '/settings',
  upgrade: '/upgrade',
  
  // Legal
  terms: '/terms',
  privacy: '/privacy',
  disclaimer: '/disclaimer',
} as const
