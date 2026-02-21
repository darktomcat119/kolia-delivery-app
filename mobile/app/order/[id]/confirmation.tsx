import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../src/lib/supabase';
import type { OrderWithItems } from '../../../src/types';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS, SHADOWS } from '../../../src/config/constants';
import { Button } from '../../../src/components/ui/Button';

export default function OrderConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;

    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*), restaurant:restaurants(name)')
      .eq('id', id)
      .single();

    if (data) {
      setOrder(data as unknown as OrderWithItems);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        {/* Success icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: COLORS.successMuted,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <CheckCircle size={44} color={COLORS.success} />
        </View>

        {/* Title */}
        <Text
          style={{
            fontFamily: FONT_FAMILIES.display,
            fontSize: 24,
            color: COLORS.textPrimary,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {t('orderConfirmation.title')}
        </Text>

        {/* Subtitle */}
        {order?.restaurant && (
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            {t('orderConfirmation.subtitle', {
              restaurant: (order.restaurant as { name: string }).name,
            })}
          </Text>
        )}

        {/* Order info card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: BORDER_RADIUS.card,
            padding: 20,
            width: '100%',
            ...SHADOWS.card,
          }}
        >
          {order?.order_number && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 14, color: COLORS.textSecondary }}>
                {t('orderConfirmation.orderNumber')}
              </Text>
              <Text style={{ fontFamily: FONT_FAMILIES.bodySemibold, fontSize: 14, color: COLORS.textPrimary }}>
                #{order.order_number}
              </Text>
            </View>
          )}

          {order?.estimated_delivery_minutes && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 14, color: COLORS.textSecondary }}>
                {t('orderConfirmation.estimatedTime')}
              </Text>
              <Text style={{ fontFamily: FONT_FAMILIES.bodySemibold, fontSize: 14, color: COLORS.textPrimary }}>
                {order.estimated_delivery_minutes} {t('orderConfirmation.minutes')}
              </Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={{ width: '100%', marginTop: 32, gap: 12 }}>
          <Button
            title={t('orderConfirmation.trackOrder')}
            onPress={() => router.replace(`/order/${id}/tracking`)}
            variant="primary"
          />
          <Button
            title={t('orderConfirmation.backToHome')}
            onPress={() => router.replace('/(tabs)/home')}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
