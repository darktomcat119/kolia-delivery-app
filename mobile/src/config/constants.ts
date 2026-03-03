export const COLORS = {
  // Brand
  primary: '#E07A2F',
  primaryLight: '#F4A261',
  primaryDark: '#C4631E',
  primaryMuted: '#FDF0E4',
  secondary: '#1B5E3A',
  secondaryLight: '#2D8B5E',
  accent: '#D4A745',

  // Neutrals
  background: '#FAFAF7',
  surface: '#FFFFFF',
  surfaceHover: '#F5F3EF',
  border: '#E8E4DD',
  borderLight: '#F0ECE6',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6560',
  textTertiary: '#A39E98',
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#16A34A',
  successMuted: '#E8F9EE',
  error: '#DC2626',
  errorMuted: '#FDE8E8',
  warning: '#F59E0B',
  warningMuted: '#FEF5E4',
  info: '#2563EB',
  infoMuted: '#E8EFFE',

  // Special
  overlay: 'rgba(26, 26, 26, 0.5)',
  skeleton: '#E8E4DD',
  skeletonShimmer: '#F0ECE6',
} as const;

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
} as const;

export const BORDER_RADIUS = {
  card: 16,
  button: 12,
  pill: 24,
  input: 12,
} as const;

export const FONT_SIZES = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 17,
  '2xl': 20,
  '3xl': 24,
  '4xl': 26,
  '5xl': 28,
  '6xl': 36,
  '7xl': 40,
} as const;

export const FONT_FAMILIES = {
  display: 'PlayfairDisplay_700Bold',
  displaySemibold: 'PlayfairDisplay_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemibold: 'DMSans_700Bold',
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const CUISINE_TYPES = [
  'west_african',
  'congolese',
  'north_african',
  'central_african',
  'southern_african',
  'lusophone_african',
  'pan_african',
] as const;

export const ORDER_STATUSES = [
  'received',
  'preparing',
  'ready',
  'on_the_way',
  'completed',
  'cancelled',
] as const;

export const TAB_BAR_HEIGHT = 60;
export const SCREEN_HORIZONTAL_PADDING = 20;
