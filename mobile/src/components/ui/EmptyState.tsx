import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  /** Optional illustration image (e.g. empty cart, no orders). Shown above title. */
  image?: ImageSourcePropType;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  image,
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
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          gap: 16,
          maxWidth: 320,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          shadowColor: '#1A1A1A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        {image != null && (
          <View style={{ marginBottom: 8 }}>
            <Image
              source={image}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </View>
        )}
        {icon != null && image == null && (
          <View style={{ marginBottom: 4 }}>
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
    </View>
  );
}
