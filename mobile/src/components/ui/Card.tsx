import React from 'react';
import { View, type ViewProps } from 'react-native';
import { COLORS } from '../../config/constants';

const cardShadow = {
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)' as const,
  shadowColor: '#1A1A1A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};
const elevatedShadow = {
  ...cardShadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 6,
};

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
          borderRadius: 20,
          ...(elevated ? elevatedShadow : cardShadow),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
