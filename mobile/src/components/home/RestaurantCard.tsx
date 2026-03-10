import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Star, Clock, MapPin, Truck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { Restaurant } from '../../types';
import { COLORS, FONT_FAMILIES, SHADOWS } from '../../config/constants';
import { formatPrice, formatDeliveryTime, formatDistance } from '../../utils/formatters';
import { isRestaurantOpen } from '../../utils/openingHours';

interface RestaurantCardProps {
  restaurant: Restaurant;
  distanceKm?: number;
}

const CUISINE_LABELS: Record<string, string> = {
  west_african: 'West African',
  congolese: 'Congolese',
  north_african: 'North African',
  central_african: 'Central African',
  southern_african: 'Southern African',
  lusophone_african: 'Lusophone African',
  pan_african: 'Pan-African',
};

export function RestaurantCard({ restaurant, distanceKm }: RestaurantCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const open = isRestaurantOpen(restaurant.opening_hours);
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 20,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        SHADOWS.elevated,
      ]}
    >
      {/* Image */}
      <View style={{ height: 190, backgroundColor: COLORS.skeleton }}>
        {restaurant.image_url ? (
          <Image
            source={{ uri: restaurant.image_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primaryMuted,
            }}
          >
            <Text style={{ fontSize: 56 }}>🍽️</Text>
          </View>
        )}

        {/* Gradient overlay at bottom of image */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: 'transparent',
          }}
        />

        {/* Closed overlay */}
        {!open && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodySemibold,
                  fontSize: 14,
                  color: '#FFFFFF',
                  letterSpacing: 0.5,
                }}
              >
                {t('restaurant.closed')}
              </Text>
            </View>
          </View>
        )}

        {/* Rating badge */}
        {restaurant.rating > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              ...SHADOWS.elevated,
            }}
          >
            <Star size={13} color={COLORS.accent} fill={COLORS.accent} />
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 13,
                color: COLORS.textPrimary,
              }}
            >
              {restaurant.rating.toFixed(1)}
            </Text>
          </View>
        )}

        {/* Cuisine badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: COLORS.secondary,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodyMedium,
              fontSize: 11,
              color: '#FFFFFF',
              letterSpacing: 0.3,
            }}
          >
            {CUISINE_LABELS[restaurant.cuisine_type] ?? restaurant.cuisine_type}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {/* Name */}
        <Text
          style={{
            fontFamily: FONT_FAMILIES.display,
            fontSize: 18,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {restaurant.name}
        </Text>

        {/* Description */}
        {restaurant.description && (
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 13,
              color: COLORS.textSecondary,
              marginBottom: 12,
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {restaurant.description}
          </Text>
        )}

        {/* Info chips */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={13} color={COLORS.textTertiary} />
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodyMedium,
                fontSize: 12,
                color: COLORS.textSecondary,
              }}
            >
              {formatDeliveryTime(restaurant.estimated_delivery_min, restaurant.estimated_delivery_max)} {t('home.min')}
            </Text>
          </View>

          {distanceKm !== undefined && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} color={COLORS.textTertiary} />
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodyMedium,
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}
              >
                {formatDistance(distanceKm)}
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Truck size={13} color={COLORS.textTertiary} />
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodyMedium,
                fontSize: 12,
                color: COLORS.textSecondary,
              }}
            >
              {restaurant.delivery_fee === 0
                ? t('home.freeDelivery')
                : formatPrice(restaurant.delivery_fee)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
