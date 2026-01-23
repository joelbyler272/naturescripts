/**
 * NatureScripts Design System - Color Constants
 * Single source of truth for all colors used in the app
 */

export const colors = {
  sage: {
    DEFAULT: 'rgb(64, 141, 89)',
    light: 'rgb(107, 142, 127)',
    dark: 'rgb(48, 106, 67)',
    muted: 'rgba(64, 141, 89, 0.1)',
  },
  text: {
    primary: 'rgb(24, 24, 27)',
    secondary: 'rgb(113, 113, 122)',
    muted: 'rgb(161, 161, 170)',
  },
  background: {
    primary: 'rgb(250, 250, 248)',
    secondary: 'rgb(244, 244, 245)',
    card: 'rgb(255, 255, 255)',
  },
  border: {
    DEFAULT: 'rgb(228, 228, 231)',
    light: 'rgb(244, 244, 245)',
  },
  status: {
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(234, 179, 8)',
    error: 'rgb(239, 68, 68)',
    info: 'rgb(59, 130, 246)',
  },
} as const
