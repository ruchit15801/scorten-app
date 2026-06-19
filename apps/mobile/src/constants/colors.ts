// ─── Scorten Design System - EXACT from Figma ────────────────────────────────
export const COLORS = {
  // Primary Brand (from Figma)
  primary: '#7B61FF',
  primaryDark: '#6C5CE7',
  primaryLight: '#A593FF',
  primaryBg: '#EDE9FF',
  primaryUltraLight: '#F5F3FF',

  // Backgrounds (Figma: cream/lavender white)
  background: '#FAF9FF',
  backgroundAlt: '#F0EEFF',
  surface: '#FFFFFF',
  surfaceElevated: '#F7F5FF',

  // Text
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border
  border: '#E5E0FF',
  borderLight: '#F0EDFF',
  borderError: '#FF4D4F',

  // Status
  success: '#10B981',
  successBg: '#ECFDF5',
  error: '#FF4D4F',
  errorBg: '#FFF1F0',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  info: '#3B82F6',

  // Input
  inputBg: '#F7F5FF',
  inputBorder: '#E5E0FF',
  inputBorderFocused: '#7B61FF',
  inputPlaceholder: '#9CA3AF',

  // Tab Bar (Light mode from Figma)
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#F0EDFF',
  tabBarActive: '#7B61FF',
  tabBarInactive: '#9CA3AF',

  // Gradients
  gradientPrimary: ['#7B61FF', '#6C5CE7'] as [string, string],
  gradientBg: ['#FAF9FF', '#EDE9FF'] as [string, string],
  gradientCard: ['#FFFFFF', '#F5F3FF'] as [string, string],
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  extraBold: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  screen: 24,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;
