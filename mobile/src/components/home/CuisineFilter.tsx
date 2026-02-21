import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CuisineType } from '../../types';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS } from '../../config/constants';

interface CuisineFilterProps {
  selected: CuisineType | null;
  onSelect: (cuisine: CuisineType | null) => void;
}

const CUISINES: { key: CuisineType | null; labelKey: string }[] = [
  { key: null, labelKey: 'home.cuisineAll' },
  { key: 'west_african', labelKey: 'home.cuisineWestAfrican' },
  { key: 'east_african', labelKey: 'home.cuisineEastAfrican' },
  { key: 'north_african', labelKey: 'home.cuisineNorthAfrican' },
  { key: 'central_african', labelKey: 'home.cuisineCentralAfrican' },
  { key: 'southern_african', labelKey: 'home.cuisineSouthernAfrican' },
  { key: 'lusophone_african', labelKey: 'home.cuisineLusophoneAfrican' },
  { key: 'pan_african', labelKey: 'home.cuisinePanAfrican' },
];

export function CuisineFilter({ selected, onSelect }: CuisineFilterProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      style={{ flexGrow: 0, marginBottom: 16 }}
    >
      {CUISINES.map((cuisine) => {
        const isActive = selected === cuisine.key;
        return (
          <Pressable
            key={cuisine.key ?? 'all'}
            onPress={() => onSelect(cuisine.key)}
            style={{
              backgroundColor: isActive ? COLORS.primary : COLORS.surface,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: BORDER_RADIUS.pill,
              borderWidth: 1,
              borderColor: isActive ? COLORS.primary : COLORS.border,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodyMedium,
                fontSize: 13,
                color: isActive ? COLORS.textOnPrimary : COLORS.textSecondary,
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
