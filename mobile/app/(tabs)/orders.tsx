import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ClipboardList } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/stores/authStore';
import type { OrderWithItems } from '../../src/types';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { LuxuryBackground } from '../../src/components/ui/LuxuryBackground';
import { COLORS, FONT_FAMILIES } from '../../src/config/constants';
import { formatPrice, formatOrderDate } from '../../src/utils/formatters';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  received: { bg: COLORS.primaryMuted, text: COLORS.primary },
  preparing: { bg: COLORS.warningMuted, text: COLORS.warning },
  ready: { bg: COLORS.infoMuted, text: COLORS.info },
  on_the_way: { bg: COLORS.infoMuted, text: COLORS.info },
  completed: { bg: COLORS.successMuted, text: COLORS.success },
  cancelled: { bg: COLORS.errorMuted, text: COLORS.error },
};

export default function OrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*), restaurant:restaurants(name, image_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setOrders((data ?? []) as unknown as OrderWithItems[]);
    setLoading(false);
    setRefreshing(false);
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  return (
    <View style={{ flex: 1 }}>
      <LuxuryBackground textureImage={require('../../assets/onboarding/delivery.jpg')} textureOpacity={0.04} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <LinearGradient
          colors={['rgba(224,122,47,0.06)', 'rgba(27,94,58,0.04)', 'transparent']}
          style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, marginBottom: 4 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <View style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: COLORS.primary }} />
            <Text
              style={{
                fontFamily: FONT_FAMILIES.displaySemibold,
                fontSize: 22,
                color: COLORS.textPrimary,
                letterSpacing: 0.2,
              }}
            >
              {t('orders.title')}
            </Text>
          </View>
          {orders.length > 0 && (
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 14,
                color: COLORS.textSecondary,
                marginTop: 6,
                marginLeft: 14,
              }}
            >
              {orders.length} {t('orders.totalOrders')}
            </Text>
          )}
        </LinearGradient>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const restaurant = item.restaurant as { name: string; image_url: string | null } | undefined;
            const statusColor = STATUS_COLORS[item.status] ?? STATUS_COLORS.received;
            const itemCount = item.order_items.reduce((sum, oi) => sum + oi.quantity, 0);

            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50).springify().damping(14)}
                style={{ marginHorizontal: 20, marginBottom: 16 }}
              >
                <Pressable
                  onPress={() => router.push(`/order/${item.id}/tracking`)}
                  style={({ pressed }) => ({
                    backgroundColor: COLORS.surface,
                    borderRadius: 22,
                    padding: 18,
                    opacity: pressed ? 0.95 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.06)',
                    shadowColor: '#1A1A1A',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 4,
                  })}
                >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.bodySemibold,
                      fontSize: 15,
                      color: COLORS.textPrimary,
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {restaurant?.name ?? 'Restaurant'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.body,
                      fontSize: 12,
                      color: COLORS.textTertiary,
                    }}
                  >
                    #{item.order_number} · {formatOrderDate(item.created_at)}
                  </Text>
                </View>

                {/* Status badge */}
                <View
                  style={{
                    backgroundColor: statusColor.bg,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.bodyMedium,
                      fontSize: 11,
                      color: statusColor.text,
                    }}
                  >
                    {t(`status.${item.status}`)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 13,
                    color: COLORS.textSecondary,
                  }}
                >
                  {itemCount} {t('orders.items')}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 15,
                    color: COLORS.primary,
                  }}
                >
                  {formatPrice(item.total)}
                </Text>
              </View>
                </Pressable>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
          loading ? null : (
            <EmptyState
              image={require('../../assets/onboarding/delivery.jpg')}
              title={t('orders.empty')}
              actionLabel={t('orders.exploreRestaurants')}
              onAction={() => router.replace('/(tabs)/home')}
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}
