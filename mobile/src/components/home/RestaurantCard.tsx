import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { Restaurant } from '../../types';
import { COLORS, FONT_FAMILIES, SHADOWS, BORDER_RADIUS } from '../../config/constants';
import { formatPrice, formatDeliveryTime, formatDistance } from '../../utils/formatters';
import { isRestaurantOpen } from '../../utils/openingHours';
import { Badge } from '../ui/Badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  distanceKm?: number;
}

const CUISINE_LABELS: Record<string, string> = {
  west_african: 'West African',
  east_african: 'East African',
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

  return (
    <Pressable
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      style={({ pressed }) => ({
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.card,
        overflow: 'hidden',
        marginBottom: 16,
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        ...SHADOWS.card,
      })}
    >
      {/* Image */}
      <View style={{ height: 180, backgroundColor: COLORS.skeleton }}>
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
            <Text style={{ fontSize: 48 }}>🍽️</Text>
          </View>
        )}

        {/* Closed overlay */}
        {!open && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 14,
                color: '#FFFFFF',
              }}
            >
              {t('restaurant.closed')}
            </Text>
          </View>
        )}

        {/* Rating badge */}
        {restaurant.rating > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: COLORS.surface,
              borderRadius: 20,
              paddingHorizontal: 8,
              paddingVertical: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              ...SHADOWS.card,
            }}
          >
            <Star size={12} color={COLORS.accent} fill={COLORS.accent} />
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 12,
                color: COLORS.textPrimary,
              }}
            >
              {restaurant.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {/* Name + Cuisine */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: 16,
              color: COLORS.textPrimary,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>
          <Badge
            label={CUISINE_LABELS[restaurant.cuisine_type] ?? restaurant.cuisine_type}
            color={COLORS.primary}
            backgroundColor={COLORS.primaryMuted}
            size="sm"
          />
        </View>

        {/* Description */}
        {restaurant.description && (
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 13,
              color: COLORS.textSecondary,
              marginBottom: 8,
            }}
            numberOfLines={1}
          >
            {restaurant.description}
          </Text>
        )}

        {/* Info row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 12,
              color: COLORS.textSecondary,
            }}
          >
            {formatDeliveryTime(restaurant.estimated_delivery_min, restaurant.estimated_delivery_max)} {t('home.min')}
          </Text>

          {distanceKm !== undefined && (
            <>
              <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>·</Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}
              >
                {formatDistance(distanceKm)}
              </Text>
            </>
          )}

          <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>·</Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 12,
              color: COLORS.textSecondary,
            }}
          >
            {t('home.deliveryFee')} {formatPrice(restaurant.delivery_fee)}
          </Text>

          {restaurant.minimum_order > 0 && (
            <>
              <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>·</Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}
              >
                {t('home.minOrder')} {formatPrice(restaurant.minimum_order)}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
