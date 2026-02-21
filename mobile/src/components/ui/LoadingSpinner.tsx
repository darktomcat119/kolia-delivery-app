import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        },
        fullScreen && {
          flex: 1,
          backgroundColor: COLORS.background,
        },
      ]}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && (
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 14,
            color: COLORS.textSecondary,
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}
