import React from 'react';
import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { CuisineType } from '../../types';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

interface CuisineFilterProps {
  selected: CuisineType | null;
  onSelect: (cuisine: CuisineType | null) => void;
}

const CUISINES: { key: CuisineType | null; labelKey: string; emoji: string }[] = [
  { key: null, labelKey: 'home.cuisineAll', emoji: '🍽️' },
  { key: 'west_african', labelKey: 'home.cuisineWestAfrican', emoji: '🌍' },
  { key: 'congolese', labelKey: 'home.cuisineCongolese', emoji: '🫕' },
  { key: 'north_african', labelKey: 'home.cuisineNorthAfrican', emoji: '🥙' },
  { key: 'central_african', labelKey: 'home.cuisineCentralAfrican', emoji: '🌿' },
  { key: 'southern_african', labelKey: 'home.cuisineSouthernAfrican', emoji: '🍖' },
  { key: 'lusophone_african', labelKey: 'home.cuisineLusophoneAfrican', emoji: '🇦🇴' },
  { key: 'pan_african', labelKey: 'home.cuisinePanAfrican', emoji: '✨' },
];

function Chip({
  cuisine,
  isActive,
  onPress,
  label,
}: {
  cuisine: (typeof CUISINES)[0];
  isActive: boolean;
  onPress: () => void;
  label: string;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.96, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1))}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View
        style={[
          styles.chipWrap,
          { borderColor: isActive ? 'rgba(255,255,255,0.4)' : COLORS.borderLight },
          isActive && styles.chipWrapActive,
          animatedStyle,
        ]}
      >
        {isActive ? (
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.chipInactive]} />
        )}
        <View style={styles.chipContent}>
          <Text style={styles.emoji}>{cuisine.emoji}</Text>
          <Text
            style={[
              styles.label,
              isActive ? styles.labelActive : styles.labelInactive,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function CuisineFilter({ selected, onSelect }: CuisineFilterProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {CUISINES.map((cuisine) => (
        <Chip
          key={cuisine.key ?? 'all'}
          cuisine={cuisine}
          isActive={selected === cuisine.key}
          onPress={() => onSelect(cuisine.key)}
          label={t(cuisine.labelKey)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginBottom: 20 },
  scrollContent: { paddingHorizontal: 20, gap: 12 },
  chipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 48,
    borderWidth: 1,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  chipWrapActive: {
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  chipInactive: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 14,
    maxWidth: 120,
  },
  labelActive: {
    fontFamily: FONT_FAMILIES.bodySemibold,
    color: '#FFFFFF',
  },
  labelInactive: {
    color: COLORS.textSecondary,
  },
});
