import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CuisineType } from '../../types';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS, SHADOWS } from '../../config/constants';

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

export function CuisineFilter({ selected, onSelect }: CuisineFilterProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      style={{ flexGrow: 0, marginBottom: 20 }}
    >
      {CUISINES.map((cuisine) => {
        const isActive = selected === cuisine.key;
        return (
          <Pressable
            key={cuisine.key ?? 'all'}
            onPress={() => onSelect(cuisine.key)}
            style={{
              backgroundColor: isActive ? COLORS.secondary : COLORS.surface,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: BORDER_RADIUS.pill,
              borderWidth: 1.5,
              borderColor: isActive ? COLORS.secondary : COLORS.borderLight,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              ...(isActive ? SHADOWS.card : {}),
            }}
          >
            <Text style={{ fontSize: 16 }}>{cuisine.emoji}</Text>
            <Text
              style={{
                fontFamily: isActive ? FONT_FAMILIES.bodySemibold : FONT_FAMILIES.bodyMedium,
                fontSize: 13,
                color: isActive ? '#FFFFFF' : COLORS.textSecondary,
              }}
            >
              {t(cuisine.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
