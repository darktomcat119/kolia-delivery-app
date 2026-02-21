import React from 'react';
import { View, Text } from 'react-native';
import type { OrderStatus } from '../../types';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  received: { bg: COLORS.primaryMuted, text: COLORS.primary },
  preparing: { bg: COLORS.warningMuted, text: COLORS.warning },
  ready: { bg: COLORS.infoMuted, text: COLORS.info },
  on_the_way: { bg: COLORS.infoMuted, text: COLORS.info },
  completed: { bg: COLORS.successMuted, text: COLORS.success },
  cancelled: { bg: COLORS.errorMuted, text: COLORS.error },
};

interface StatusBadgeProps {
  status: OrderStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        borderRadius: 24,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          fontFamily: FONT_FAMILIES.bodyMedium,
          fontSize: 12,
          color: colors.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
