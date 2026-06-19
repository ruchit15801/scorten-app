// ─── Typography ───────────────────────────────────────────────────────────────
import { StyleSheet } from 'react-native';

export const FONTS = {
  // Using system fonts as fallback; integrate custom fonts by adding to assets
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semiBold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
  extraBold: 'Outfit-ExtraBold',
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const TYPOGRAPHY = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  h4: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
  },
  h5: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
  },
  bodyLarge: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 10,
    fontFamily: FONTS.regular,
  },
  button: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
});
