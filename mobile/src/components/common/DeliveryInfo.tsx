import React from 'react';
import { View, Text } from 'react-native';
import { Clock, MapPin, Truck } from 'lucide-react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';
import { formatPrice, formatDistance } from '../../utils/formatters';

interface DeliveryInfoProps {
  deliveryMin: number;
  deliveryMax: number;
  distanceKm?: number;
  deliveryFee: number;
}

export function DeliveryInfo({
  deliveryMin,
  deliveryMax,
  distanceKm,
  deliveryFee,
}: DeliveryInfoProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Clock size={14} color={COLORS.textSecondary} />
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 13,
            color: COLORS.textSecondary,
          }}
        >
          {deliveryMin}–{deliveryMax} min
        </Text>
      </View>

      {distanceKm !== undefined && (
        <>
          <Text style={{ color: COLORS.textTertiary }}>·</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 13,
                color: COLORS.textSecondary,
              }}
            >
              {formatDistance(distanceKm)}
            </Text>
          </View>
        </>
      )}

      <Text style={{ color: COLORS.textTertiary }}>·</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Truck size={14} color={COLORS.textSecondary} />
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 13,
            color: COLORS.textSecondary,
          }}
        >
          {formatPrice(deliveryFee)}
        </Text>
      </View>
    </View>
  );
}
