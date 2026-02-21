import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../src/stores/cartStore';
import { COLORS, FONT_FAMILIES, SHADOWS, BORDER_RADIUS } from '../src/config/constants';
import { formatPrice } from '../src/utils/formatters';
import { EmptyState } from '../src/components/ui/EmptyState';

export default function CartScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    items,
    restaurantName,
    notes,
    setNotes,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  const handleClearCart = () => {
    Alert.alert(t('cart.clearCart'), t('cart.clearCartConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.confirm'), style: 'destructive', onPress: clearCart },
    ]);
  };

  if (items.length === 0) {
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
            {t('cart.title')}
          </Text>
        </View>

        <EmptyState
          title={t('cart.empty')}
          actionLabel={t('cart.browseRestaurants')}
          onAction={() => router.replace('/(tabs)/home')}
        />
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
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.borderLight,
          backgroundColor: COLORS.surface,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </Pressable>
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 18,
                color: COLORS.textPrimary,
              }}
            >
              {t('cart.title')}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 13,
                color: COLORS.textSecondary,
              }}
            >
              {restaurantName}
            </Text>
          </View>
        </View>

        <Pressable onPress={handleClearCart} style={{ padding: 4 }}>
          <Trash2 size={20} color={COLORS.error} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items */}
        <View style={{ padding: 20, gap: 12 }}>
          {items.map((item) => (
            <View
              key={item.menu_item_id}
              style={{
                flexDirection: 'row',
                backgroundColor: COLORS.surface,
                borderRadius: BORDER_RADIUS.card,
                padding: 14,
                ...SHADOWS.card,
              }}
            >
              {/* Item image */}
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    marginRight: 12,
                  }}
                  resizeMode="cover"
                />
              )}

              {/* Info */}
              <View style={{ flex: 1 }}>
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
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 14,
                    color: COLORS.primary,
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>

              {/* Quantity controls */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Pressable
                  onPress={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: COLORS.surfaceHover,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} color={COLORS.textPrimary} />
                </Pressable>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 15,
                    color: COLORS.textPrimary,
                    minWidth: 20,
                    textAlign: 'center',
                  }}
                >
                  {item.quantity}
                </Text>
                <Pressable
                  onPress={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
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
            </View>
          ))}
        </View>

        {/* Notes */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodyMedium,
              fontSize: 14,
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            {t('cart.addNote')}
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder={t('cart.notePlaceholder')}
            placeholderTextColor={COLORS.textTertiary}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: BORDER_RADIUS.input,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 14,
              fontFamily: FONT_FAMILIES.body,
              fontSize: 14,
              color: COLORS.textPrimary,
              minHeight: 80,
              textAlignVertical: 'top',
            }}
          />
        </View>
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
        {/* Subtotal */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 15,
              color: COLORS.textSecondary,
            }}
          >
            {t('cart.subtotal')} ({itemCount} {t('restaurant.items')})
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: 18,
              color: COLORS.textPrimary,
            }}
          >
            {formatPrice(subtotal)}
          </Text>
        </View>

        {/* Checkout button */}
        <Pressable
          onPress={() => router.push('/checkout')}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: BORDER_RADIUS.button,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: 16,
              color: COLORS.textOnPrimary,
            }}
          >
            {t('cart.proceedToCheckout')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
