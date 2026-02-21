import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, AlertCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../src/stores/cartStore';
import { useAuthStore } from '../src/stores/authStore';
import { useLocationStore } from '../src/stores/locationStore';
import { useRestaurantStore } from '../src/stores/restaurantStore';
import { api } from '../src/lib/api';
import { haversineDistance } from '../src/utils/haversine';
import { formatPrice } from '../src/utils/formatters';
import type { CreateOrderPayload, CreateOrderResponse, OrderType } from '../src/types';
import {
  COLORS,
  FONT_FAMILIES,
  SHADOWS,
  BORDER_RADIUS,
} from '../src/config/constants';

export default function CheckoutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { items, restaurantId, notes, getSubtotal, clearCart } = useCartStore();
  const { latitude, longitude } = useLocationStore();
  const { restaurants } = useRestaurantStore();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const subtotal = getSubtotal();
  const deliveryFee = orderType === 'delivery' ? (restaurant?.delivery_fee ?? 0) : 0;
  const total = subtotal + deliveryFee;

  // Check if within delivery radius
  const distanceKm =
    latitude && longitude && restaurant
      ? haversineDistance(latitude, longitude, restaurant.latitude, restaurant.longitude)
      : null;

  const outsideRadius =
    distanceKm !== null && restaurant
      ? distanceKm > restaurant.delivery_radius_km
      : false;

  // Below minimum order
  const belowMinimum = restaurant ? subtotal < restaurant.minimum_order : false;

  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) return;

    if (orderType === 'delivery' && outsideRadius) {
      Alert.alert(t('checkout.outsideRadius'));
      return;
    }

    if (belowMinimum) {
      Alert.alert(`Minimum order: ${formatPrice(restaurant?.minimum_order ?? 0)}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: CreateOrderPayload = {
        restaurant_id: restaurantId,
        items: items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
        })),
        order_type: orderType,
        notes: notes || undefined,
      };

      if (orderType === 'delivery') {
        payload.delivery_address = user?.address ?? '';
        if (latitude && longitude) {
          payload.delivery_lat = latitude;
          payload.delivery_lng = longitude;
        }
      }

      const result = await api.post<CreateOrderResponse>('/api/orders', payload);

      // In a full implementation, we'd handle Stripe payment here with result.client_secret
      // For MVP, we navigate directly to confirmation
      clearCart();
      router.replace(`/order/${result.order_id}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('checkout.paymentFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant || items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONT_FAMILIES.body, color: COLORS.textSecondary }}>
          {t('cart.empty')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.borderLight,
          backgroundColor: COLORS.surface,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </Pressable>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.bodySemibold,
            fontSize: 18,
            color: COLORS.textPrimary,
            marginLeft: 12,
          }}
        >
          {t('checkout.title')}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order type toggle */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: COLORS.surfaceHover,
              borderRadius: BORDER_RADIUS.button,
              padding: 4,
            }}
          >
            {(['delivery', 'pickup'] as OrderType[]).map((type) => {
              const isActive = orderType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setOrderType(type)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: BORDER_RADIUS.button - 2,
                    backgroundColor: isActive ? COLORS.surface : 'transparent',
                    alignItems: 'center',
                    ...(isActive ? SHADOWS.card : {}),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isActive ? FONT_FAMILIES.bodySemibold : FONT_FAMILIES.body,
                      fontSize: 14,
                      color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
                    }}
                  >
                    {t(`checkout.${type}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Delivery address */}
        {orderType === 'delivery' && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: BORDER_RADIUS.card,
                padding: 16,
                ...SHADOWS.card,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodyMedium,
                  fontSize: 14,
                  color: COLORS.textPrimary,
                  marginBottom: 8,
                }}
              >
                {t('checkout.deliveryAddress')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color={COLORS.primary} />
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    flex: 1,
                  }}
                  numberOfLines={2}
                >
                  {user?.address || 'No address set'}
                </Text>
              </View>

              {outsideRadius && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    backgroundColor: COLORS.warningMuted,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <AlertCircle size={16} color={COLORS.warning} />
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.body,
                      fontSize: 12,
                      color: COLORS.warning,
                      flex: 1,
                    }}
                  >
                    {t('checkout.outsideRadius')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Pickup address */}
        {orderType === 'pickup' && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: BORDER_RADIUS.card,
                padding: 16,
                ...SHADOWS.card,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodyMedium,
                  fontSize: 14,
                  color: COLORS.textPrimary,
                  marginBottom: 8,
                }}
              >
                {t('checkout.pickupAddress')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color={COLORS.secondary} />
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    flex: 1,
                  }}
                >
                  {restaurant.address}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Order summary */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: 16,
              color: COLORS.textPrimary,
              marginBottom: 12,
            }}
          >
            {t('checkout.orderSummary')}
          </Text>

          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: BORDER_RADIUS.card,
              padding: 16,
              ...SHADOWS.card,
            }}
          >
            {items.map((item) => (
              <View
                key={item.menu_item_id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 14,
                    color: COLORS.textPrimary,
                    flex: 1,
                  }}
                >
                  {item.quantity}x {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodyMedium,
                    fontSize: 14,
                    color: COLORS.textPrimary,
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: COLORS.borderLight,
                marginTop: 8,
                paddingTop: 12,
                gap: 8,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 14, color: COLORS.textSecondary }}>
                  {t('cart.subtotal')}
                </Text>
                <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 14, color: COLORS.textPrimary }}>
                  {formatPrice(subtotal)}
                </Text>
              </View>

              {orderType === 'delivery' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 14, color: COLORS.textSecondary }}>
                    {t('cart.deliveryFee')}
                  </Text>
                  <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 14, color: COLORS.textPrimary }}>
                    {formatPrice(deliveryFee)}
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderTopWidth: 1,
                  borderTopColor: COLORS.borderLight,
                  paddingTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 16,
                    color: COLORS.textPrimary,
                  }}
                >
                  {t('cart.total')}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 18,
                    color: COLORS.primary,
                  }}
                >
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <View
              style={{
                backgroundColor: COLORS.errorMuted,
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 13,
                  color: COLORS.error,
                }}
              >
                {error}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          padding: 20,
          paddingBottom: 36,
          ...SHADOWS.elevated,
        }}
      >
        <Pressable
          onPress={handlePlaceOrder}
          disabled={loading || (orderType === 'delivery' && outsideRadius) || belowMinimum}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: BORDER_RADIUS.button,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: loading || (orderType === 'delivery' && outsideRadius) || belowMinimum ? 0.5 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textOnPrimary} />
          ) : (
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 16,
                color: COLORS.textOnPrimary,
              }}
            >
              {t('checkout.placeOrder')} · {formatPrice(total)}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
