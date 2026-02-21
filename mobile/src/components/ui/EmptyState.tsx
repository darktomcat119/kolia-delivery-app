import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 16,
      }}
    >
      {icon && (
        <View style={{ marginBottom: 8 }}>
          {icon}
        </View>
      )}
      <Text
        style={{
          fontFamily: FONT_FAMILIES.bodySemibold,
          fontSize: 18,
          color: COLORS.textPrimary,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
        />
      )}
    </View>
  );
}
