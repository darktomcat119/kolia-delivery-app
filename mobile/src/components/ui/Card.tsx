import React from 'react';
import { View, type ViewProps } from 'react-native';
import { COLORS, SHADOWS } from '../../config/constants';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated = false, style, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          ...(elevated ? SHADOWS.elevated : SHADOWS.card),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
