import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../src/lib/supabase';
import type { OrderWithItems, OrderStatus } from '../../../src/types';
import { LinearGradient } from 'expo-linear-gradient';
import { LuxuryBackground } from '../../../src/components/ui/LuxuryBackground';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS } from '../../../src/config/constants';
import { formatPrice, formatOrderDate } from '../../../src/utils/formatters';

const cardShadow = {
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)' as const,
  shadowColor: '#1A1A1A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};

const STATUS_STEPS: OrderStatus[] = ['received', 'preparing', 'ready', 'on_the_way', 'completed'];

const STATUS_LABELS: Record<string, string> = {
  received: 'orderTracking.received',
  preparing: 'orderTracking.preparing',
  ready: 'orderTracking.ready',
  on_the_way: 'orderTracking.onTheWay',
  completed: 'orderTracking.completed',
  cancelled: 'orderTracking.cancelled',
};

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setOrder((prev) =>
            prev ? { ...prev, ...payload.new } as OrderWithItems : null,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;

    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*), restaurant:restaurants(name, address, phone)')
      .eq('id', id)
      .single();

    if (data) {
      setOrder(data as unknown as OrderWithItems);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <LuxuryBackground textureImage={require('../../../assets/onboarding/delivery.jpg')} textureOpacity={0.04} />
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </SafeAreaView>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1 }}>
        <LuxuryBackground textureImage={require('../../../assets/onboarding/delivery.jpg')} textureOpacity={0.04} />
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: FONT_FAMILIES.body, color: COLORS.textSecondary }}>
            {t('orderTracking.orderNotFound')}
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const restaurant = order.restaurant as { name: string; address: string; phone: string } | undefined;

  return (
    <View style={{ flex: 1 }}>
      <LuxuryBackground textureImage={require('../../../assets/onboarding/delivery.jpg')} textureOpacity={0.04} />
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={['rgba(224,122,47,0.08)', 'rgba(27,94,58,0.04)', 'transparent']}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 14,
            paddingBottom: 18,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ padding: 4 }} accessibilityRole="button" accessibilityLabel={t('common.back')}>
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </Pressable>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontFamily: FONT_FAMILIES.bodySemibold, fontSize: 18, color: COLORS.textPrimary }}>
              {t('orderTracking.title')} #{order.order_number}
            </Text>
            <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 13, color: COLORS.textSecondary }}>
              {formatOrderDate(order.created_at)}
            </Text>
          </View>
        </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status tracker */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            padding: 20,
            ...cardShadow,
          }}
        >
          {isCancelled ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: COLORS.errorMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 24 }}>✕</Text>
              </View>
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodySemibold,
                  fontSize: 16,
                  color: COLORS.error,
                }}
              >
                {t('orderTracking.cancelled')}
              </Text>
            </View>
          ) : (
            STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === STATUS_STEPS.length - 1;

              return (
                <View key={step} style={{ flexDirection: 'row' }}>
                  {/* Circle + Line */}
                  <View style={{ alignItems: 'center', marginRight: 16 }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isCompleted ? COLORS.primary : COLORS.surfaceHover,
                        borderWidth: isCurrent ? 3 : 0,
                        borderColor: isCurrent ? COLORS.primaryLight : undefined,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isCompleted && <Check size={14} color={COLORS.textOnPrimary} />}
                    </View>
                    {!isLast && (
                      <View
                        style={{
                          width: 2,
                          height: 32,
                          backgroundColor: isCompleted ? COLORS.primary : COLORS.borderLight,
                        }}
                      />
                    )}
                  </View>

                  {/* Label */}
                  <View style={{ paddingTop: 4, paddingBottom: isLast ? 0 : 20 }}>
                    <Text
                      style={{
                        fontFamily: isCurrent ? FONT_FAMILIES.bodySemibold : FONT_FAMILIES.body,
                        fontSize: 15,
                        color: isCompleted ? COLORS.textPrimary : COLORS.textTertiary,
                      }}
                    >
                      {t(STATUS_LABELS[step])}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Restaurant info */}
        {restaurant && (
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 22,
              padding: 18,
              ...cardShadow,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 15,
                color: COLORS.textPrimary,
                marginBottom: 4,
              }}
            >
              {restaurant.name}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 13,
                color: COLORS.textSecondary,
              }}
            >
              {restaurant.address}
            </Text>
          </View>
        )}

        {/* Order details */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            padding: 18,
            ...cardShadow,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: 15,
              color: COLORS.textPrimary,
              marginBottom: 12,
            }}
          >
            {t('orderTracking.orderDetails')}
          </Text>

          {order.order_items.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 14,
                  color: COLORS.textSecondary,
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
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 15,
                color: COLORS.textPrimary,
              }}
            >
              {t('cart.total')}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 16,
                color: COLORS.primary,
              }}
            >
              {formatPrice(order.total)}
            </Text>
          </View>
        </View>

        {/* Help text */}
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'center',
          }}
        >
          {t('orderTracking.needHelp')}
        </Text>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}
