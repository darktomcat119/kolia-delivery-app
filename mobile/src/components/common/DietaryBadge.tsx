import React from 'react';
import { View, Text } from 'react-native';
import type { DietaryTag } from '../../types';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

const DIETARY_COLORS: Record<DietaryTag, { bg: string; text: string }> = {
  halal: { bg: '#E8F9EE', text: '#16A34A' },
  vegan: { bg: '#E8F9EE', text: '#16A34A' },
  vegetarian: { bg: '#E8F9EE', text: '#16A34A' },
  spicy: { bg: '#FDE8E8', text: '#DC2626' },
  gluten_free: { bg: '#E8EFFE', text: '#2563EB' },
  contains_nuts: { bg: '#FEF5E4', text: '#F59E0B' },
};

interface DietaryBadgeProps {
  tag: DietaryTag;
  label: string;
}

export function DietaryBadge({ tag, label }: DietaryBadgeProps) {
  const colors = DIETARY_COLORS[tag];

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        borderRadius: 24,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      <Text
        style={{
          fontFamily: FONT_FAMILIES.bodyMedium,
          fontSize: 10,
          color: colors.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
