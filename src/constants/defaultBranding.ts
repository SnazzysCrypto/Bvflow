import type { BrandingConfig } from '../types/funnel'

export const DEFAULT_BRANDING: BrandingConfig = {
  primaryColor: '#6471f5',
  accentColor: '#a5b8fd',
  backgroundColor: '#f8f9fa',
  fontFamily: 'Inter',
  logoUrl: null,
  logoAlt: '',
  faviconUrl: null,
  borderRadius: 'md',
  buttonStyle: 'filled',
  progressBar: true,
  progressBarColor: null,
  customCss: '',
}

export const FONT_OPTIONS = [
  { label: 'Inter (default)', value: 'Inter' },
  { label: 'System', value: 'system' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Montserrat', value: 'Montserrat' },
]
