import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  color = COLORS.textSecondary,
  backgroundColor = COLORS.surfaceHover,
  size = 'sm',
}: BadgeProps) {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 24,
        paddingHorizontal: size === 'sm' ? 8 : 12,
        paddingVertical: size === 'sm' ? 3 : 5,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontFamily: FONT_FAMILIES.bodyMedium,
          fontSize: size === 'sm' ? 11 : 13,
          color,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
