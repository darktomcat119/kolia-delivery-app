import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Clock, MapPin, Truck } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { Restaurant } from '../../types';
import { COLORS, FONT_FAMILIES } from '../../config/constants';
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      onPressIn={() => (scale.value = withSpring(0.98, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View style={[styles.cardWrap, animatedStyle]}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
          {restaurant.image_url ? (
            <Image
              source={{ uri: restaurant.image_url }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.placeholderImage]}>
              <Text style={{ fontSize: 56 }}>🍽️</Text>
            </View>
          )}

          {/* Bottom gradient overlay for text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.imageGradient}
          />

          {/* Closed overlay */}
          {!open && (
            <View style={styles.closedOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.5)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.closedBadge}>
                <Text style={styles.closedText}>{t('restaurant.closed')}</Text>
              </View>
            </View>
          )}

          {/* Rating badge */}
          {restaurant.rating > 0 && (
            <View style={styles.ratingBadge}>
              <Star size={13} color={COLORS.accent} fill={COLORS.accent} />
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            </View>
          )}

          {/* Cuisine badge */}
          <View style={styles.cuisineBadge}>
            <Text style={styles.cuisineText}>
              {CUISINE_LABELS[restaurant.cuisine_type] ?? restaurant.cuisine_type}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          {restaurant.description && (
            <Text style={styles.description} numberOfLines={2}>
              {restaurant.description}
            </Text>
          )}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={13} color={COLORS.textTertiary} />
              <Text style={styles.metaText}>
                {formatDeliveryTime(restaurant.estimated_delivery_min, restaurant.estimated_delivery_max)} {t('home.min')}
              </Text>
            </View>
            {distanceKm !== undefined && (
              <View style={styles.metaItem}>
                <MapPin size={13} color={COLORS.textTertiary} />
                <Text style={styles.metaText}>{formatDistance(distanceKm)}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Truck size={13} color={COLORS.textTertiary} />
              <Text style={styles.metaText}>
                {restaurant.delivery_fee === 0 ? t('home.freeDelivery') : formatPrice(restaurant.delivery_fee)}
              </Text>
            </View>
          </View>
        </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  imageContainer: {
    height: 200,
    backgroundColor: COLORS.skeleton,
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryMuted,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
  },
  closedText: {
    fontFamily: FONT_FAMILIES.bodySemibold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingText: {
    fontFamily: FONT_FAMILIES.bodySemibold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  cuisineBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cuisineText: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  content: {
    padding: 18,
  },
  name: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  description: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
