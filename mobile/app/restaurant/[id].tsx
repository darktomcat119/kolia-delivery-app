import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Clock, MapPin, Truck, Minus, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useCartStore } from '../../src/stores/cartStore';
import { useLocationStore } from '../../src/stores/locationStore';
import type { RestaurantWithMenu, MenuItem, MenuCategory } from '../../src/types';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  SHADOWS,
  BORDER_RADIUS,
} from '../../src/config/constants';
import { formatPrice, formatDeliveryTime, formatDistance } from '../../src/utils/formatters';
import { isRestaurantOpen } from '../../src/utils/openingHours';
import { haversineDistance } from '../../src/utils/haversine';
import { Badge } from '../../src/components/ui/Badge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DIETARY_COLORS: Record<string, { bg: string; text: string }> = {
  halal: { bg: '#E8F9EE', text: '#16A34A' },
  vegan: { bg: '#E8F9EE', text: '#16A34A' },
  vegetarian: { bg: '#E8F9EE', text: '#16A34A' },
  spicy: { bg: '#FDE8E8', text: '#DC2626' },
  gluten_free: { bg: '#E8EFFE', text: '#2563EB' },
  contains_nuts: { bg: '#FEF5E4', text: '#F59E0B' },
};

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { latitude, longitude } = useLocationStore();
  const cartStore = useCartStore();

  const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryTabsRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    if (!id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        )
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      // Sort categories and items
      const sorted = {
        ...data,
        menu_categories: (data.menu_categories ?? [])
          .filter((c: MenuCategory) => c.is_active)
          .sort((a: MenuCategory, b: MenuCategory) => a.sort_order - b.sort_order)
          .map((cat: MenuCategory & { menu_items: MenuItem[] }) => ({
            ...cat,
            menu_items: (cat.menu_items ?? []).sort(
              (a: MenuItem, b: MenuItem) => a.sort_order - b.sort_order,
            ),
          })),
      } as RestaurantWithMenu;

      setRestaurant(sorted);
      if (sorted.menu_categories.length > 0) {
        setActiveCategory(sorted.menu_categories[0].id);
      }
    }

    setLoading(false);
  };

  const distanceKm =
    latitude && longitude && restaurant
      ? haversineDistance(latitude, longitude, restaurant.latitude, restaurant.longitude)
      : undefined;

  const isOpen = restaurant ? isRestaurantOpen(restaurant.opening_hours) : false;

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      if (!restaurant) return;

      const added = cartStore.addItem(
        {
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image_url: item.image_url,
        },
        restaurant.id,
        restaurant.name,
      );

      if (!added) {
        Alert.alert(
          t('cart.differentRestaurant'),
          '',
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('cart.replaceCart'),
              style: 'destructive',
              onPress: () => {
                cartStore.clearCart();
                cartStore.addItem(
                  {
                    menu_item_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    image_url: item.image_url,
                  },
                  restaurant.id,
                  restaurant.name,
                );
              },
            },
          ],
        );
      }
    },
    [restaurant, cartStore, t],
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONT_FAMILIES.body, color: COLORS.textSecondary }}>
          Restaurant not found
        </Text>
      </SafeAreaView>
    );
  }

  const cartItemCount = cartStore.getItemCount();
  const cartTotal = cartStore.getSubtotal();
  const isCartForThisRestaurant = cartStore.restaurantId === restaurant.id;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ height: 260, backgroundColor: COLORS.skeleton }}>
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
              <Text style={{ fontSize: 64 }}>🍽️</Text>
            </View>
          )}

          {/* Back button */}
          <SafeAreaView
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            edges={['top']}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 16,
                marginTop: 8,
                ...SHADOWS.card,
              }}
            >
              <ArrowLeft size={22} color={COLORS.textPrimary} />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* Restaurant Info */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            padding: 20,
            marginTop: -20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {/* Name + Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.display,
                  fontSize: FONT_SIZES['3xl'],
                  color: COLORS.textPrimary,
                  marginBottom: 4,
                }}
              >
                {restaurant.name}
              </Text>
              {restaurant.description && (
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    marginBottom: 8,
                  }}
                >
                  {restaurant.description}
                </Text>
              )}
            </View>

            {restaurant.rating > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.primaryMuted,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 20,
                  gap: 4,
                }}
              >
                <Star size={14} color={COLORS.accent} fill={COLORS.accent} />
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 14,
                    color: COLORS.textPrimary,
                  }}
                >
                  {restaurant.rating.toFixed(1)}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 12,
                    color: COLORS.textSecondary,
                  }}
                >
                  ({restaurant.total_reviews})
                </Text>
              </View>
            )}
          </View>

          {/* Info chips */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            <InfoChip
              icon={<Clock size={14} color={COLORS.textSecondary} />}
              text={`${formatDeliveryTime(restaurant.estimated_delivery_min, restaurant.estimated_delivery_max)} min`}
            />
            {distanceKm !== undefined && (
              <InfoChip
                icon={<MapPin size={14} color={COLORS.textSecondary} />}
                text={formatDistance(distanceKm)}
              />
            )}
            <InfoChip
              icon={<Truck size={14} color={COLORS.textSecondary} />}
              text={`${formatPrice(restaurant.delivery_fee)}`}
            />
            {restaurant.minimum_order > 0 && (
              <InfoChip text={`Min. ${formatPrice(restaurant.minimum_order)}`} />
            )}
          </View>

          {/* Open/Closed status */}
          <View style={{ marginTop: 12 }}>
            <Badge
              label={isOpen ? t('restaurant.openNow') : t('restaurant.closed')}
              color={isOpen ? COLORS.success : COLORS.error}
              backgroundColor={isOpen ? COLORS.successMuted : COLORS.errorMuted}
            />
          </View>
        </View>

        {/* Category Tabs */}
        {restaurant.menu_categories.length > 0 && (
          <ScrollView
            ref={categoryTabsRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: COLORS.surface,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.borderLight,
            }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 4 }}
          >
            {restaurant.menu_categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? COLORS.primary : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isActive ? FONT_FAMILIES.bodySemibold : FONT_FAMILIES.body,
                      fontSize: 14,
                      color: isActive ? COLORS.primary : COLORS.textSecondary,
                    }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Menu Items */}
        <View style={{ padding: 20 }}>
          {restaurant.menu_categories
            .filter((cat) => !activeCategory || cat.id === activeCategory)
            .map((category) => (
              <View key={category.id} style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 18,
                    color: COLORS.textPrimary,
                    marginBottom: 12,
                  }}
                >
                  {category.name}
                </Text>

                {category.menu_items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={() => handleAddToCart(item)}
                    isOpen={isOpen}
                    cartQuantity={
                      isCartForThisRestaurant
                        ? cartStore.items.find((ci) => ci.menu_item_id === item.id)?.quantity ?? 0
                        : 0
                    }
                    onUpdateQuantity={(qty) => cartStore.updateQuantity(item.id, qty)}
                    t={t}
                  />
                ))}
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Floating Cart Bar */}
      {cartItemCount > 0 && isCartForThisRestaurant && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            paddingBottom: 32,
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.borderLight,
            ...SHADOWS.elevated,
          }}
        >
          <Pressable
            onPress={() => router.push('/cart')}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodySemibold,
                  fontSize: 14,
                  color: COLORS.textOnPrimary,
                }}
              >
                {cartItemCount}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 16,
                color: COLORS.textOnPrimary,
              }}
            >
              {t('restaurant.viewCart')}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 16,
                color: COLORS.textOnPrimary,
              }}
            >
              {formatPrice(cartTotal)}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// --- Sub-components ---

function InfoChip({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surfaceHover,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
      }}
    >
      {icon}
      <Text
        style={{
          fontFamily: FONT_FAMILIES.body,
          fontSize: 12,
          color: COLORS.textSecondary,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function MenuItemCard({
  item,
  onAdd,
  isOpen,
  cartQuantity,
  onUpdateQuantity,
  t,
}: {
  item: MenuItem;
  onAdd: () => void;
  isOpen: boolean;
  cartQuantity: number;
  onUpdateQuantity: (qty: number) => void;
  t: (key: string) => string;
}) {
  const isAvailable = item.is_available && isOpen;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.card,
        marginBottom: 12,
        overflow: 'hidden',
        opacity: isAvailable ? 1 : 0.5,
        ...SHADOWS.card,
      }}
    >
      {/* Content */}
      <View style={{ flex: 1, padding: 14 }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.bodySemibold,
            fontSize: 15,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        {item.description && (
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 13,
              color: COLORS.textSecondary,
              marginBottom: 6,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        {/* Dietary tags */}
        {item.dietary_tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {item.dietary_tags.map((tag) => {
              const colors = DIETARY_COLORS[tag] ?? { bg: COLORS.surfaceHover, text: COLORS.textSecondary };
              return (
                <View
                  key={tag}
                  style={{
                    backgroundColor: colors.bg,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontFamily: FONT_FAMILIES.body, fontSize: 10, color: colors.text }}>
                    {t(`dietary.${tag}`)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Price + Add button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: 15,
              color: COLORS.primary,
            }}
          >
            {formatPrice(item.price)}
          </Text>

          {isAvailable && (
            <View>
              {cartQuantity > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.primaryMuted,
                    borderRadius: 20,
                    gap: 8,
                  }}
                >
                  <Pressable
                    onPress={() => onUpdateQuantity(cartQuantity - 1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Minus size={14} color={COLORS.textOnPrimary} />
                  </Pressable>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.bodySemibold,
                      fontSize: 14,
                      color: COLORS.textPrimary,
                      minWidth: 20,
                      textAlign: 'center',
                    }}
                  >
                    {cartQuantity}
                  </Text>
                  <Pressable
                    onPress={onAdd}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={14} color={COLORS.textOnPrimary} />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={onAdd}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.bodySemibold,
                      fontSize: 12,
                      color: COLORS.textOnPrimary,
                    }}
                  >
                    + {t('restaurant.addToCart')}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {!isAvailable && (
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 12,
                color: COLORS.textTertiary,
              }}
            >
              {t('restaurant.unavailable')}
            </Text>
          )}
        </View>
      </View>

      {/* Item image */}
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={{ width: 100, height: '100%' }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
