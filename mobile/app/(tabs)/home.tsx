import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { useRestaurantStore } from '../../src/stores/restaurantStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { COLORS, FONT_FAMILIES } from '../../src/config/constants';
import { getTimeGreetingKey } from '../../src/utils/formatters';
import { haversineDistance } from '../../src/utils/haversine';
import { RestaurantCard } from '../../src/components/home/RestaurantCard';
import { CuisineFilter } from '../../src/components/home/CuisineFilter';
import { SearchBar } from '../../src/components/home/SearchBar';
import { LuxuryBackground } from '../../src/components/ui/LuxuryBackground';
import { RestaurantCardSkeleton } from '../../src/components/ui/SkeletonLoader';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { DeliveryAddressModal } from '../../src/components/address/DeliveryAddressModal';
import { getCurrentLocation } from '../../src/services/location';
import type { Restaurant } from '../../src/types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { latitude, longitude, address } = useLocationStore();
  const {
    isLoading,
    selectedCuisine,
    searchQuery,
    fetchRestaurants,
    setSelectedCuisine,
    setSearchQuery,
    getFilteredRestaurants,
  } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
    getCurrentLocation();
  }, [fetchRestaurants]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const filteredRestaurants = getFilteredRestaurants();
  const greetingKey = getTimeGreetingKey();
  const firstName = user?.full_name?.split(' ')[0] ?? '';

  const getDistance = useCallback(
    (restaurant: Restaurant) => {
      if (latitude && longitude) {
        return haversineDistance(
          latitude,
          longitude,
          restaurant.latitude,
          restaurant.longitude,
        );
      }
      return undefined;
    },
    [latitude, longitude],
  );

  // Sort by distance if location available, otherwise by name
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (latitude && longitude) {
      const distA = haversineDistance(latitude, longitude, a.latitude, a.longitude);
      const distB = haversineDistance(latitude, longitude, b.latitude, b.longitude);
      return distA - distB;
    }
    return a.name.localeCompare(b.name);
  });

  const header = useMemo(() => (
    <View>
      {/* Header with soft gradient strip */}
      <LinearGradient
        colors={['rgba(224,122,47,0.06)', 'rgba(27,94,58,0.04)', 'transparent']}
        style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, marginBottom: 4 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ height: 32, width: 110, resizeMode: 'contain' }}
          />
          {address ? (
            <Pressable
              onPress={() => setShowAddressModal(true)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: pressed ? COLORS.surfaceHover : COLORS.surface,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 2,
              })}
            >
              <MapPin size={14} color={COLORS.primary} />
              <Text
                style={{ fontFamily: FONT_FAMILIES.bodyMedium, fontSize: 12, color: COLORS.textSecondary, maxWidth: 120 }}
                numberOfLines={1}
              >
                {address}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setShowAddressModal(true)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: pressed ? COLORS.surfaceHover : COLORS.surface,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
              })}
            >
              <MapPin size={14} color={COLORS.primary} />
              <Text style={{ fontFamily: FONT_FAMILIES.bodyMedium, fontSize: 12, color: COLORS.textSecondary }}>
                {t('checkout.setAddress')}
              </Text>
            </Pressable>
          )}
        </View>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.display,
            fontSize: 28,
            color: COLORS.textPrimary,
            lineHeight: 36,
            marginBottom: 2,
            letterSpacing: 0.3,
          }}
        >
          {t(greetingKey)}{firstName ? ',' : ''}
        </Text>
        {firstName ? (
          <Text
            style={{
              fontFamily: FONT_FAMILIES.display,
              fontSize: 28,
              color: COLORS.primary,
              lineHeight: 36,
              letterSpacing: 0.2,
            }}
          >
            {firstName}
          </Text>
        ) : null}
      </LinearGradient>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <CuisineFilter selected={selectedCuisine} onSelect={setSelectedCuisine} />

      {/* Section title with accent */}
      <View style={{ paddingHorizontal: 20, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: COLORS.primary }} />
        <Text
          style={{
            fontFamily: FONT_FAMILIES.displaySemibold,
            fontSize: 20,
            color: COLORS.textPrimary,
            letterSpacing: 0.2,
          }}
        >
          {selectedCuisine ? t('home.filteredResults') : t('home.nearYou')}
        </Text>
      </View>
    </View>
  ), [greetingKey, firstName, searchQuery, selectedCuisine, address, setSearchQuery, setSelectedCuisine, t]);

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ paddingHorizontal: 20 }}>
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
        </View>
      );
    }

    return (
      <EmptyState
        title={t('home.noRestaurants')}
        subtitle={t('home.adjustFilters')}
        actionLabel={selectedCuisine ? t('home.cuisineAll') : undefined}
        onAction={selectedCuisine ? () => setSelectedCuisine(null) : undefined}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LuxuryBackground textureImage={require('../../assets/onboarding/jollof-restaurant.jpg')} textureOpacity={0.045} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <FlatList
          data={sortedRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 60).springify().damping(14)}
              style={{ paddingHorizontal: 20 }}
            >
              <RestaurantCard restaurant={item} distanceKm={getDistance(item)} />
            </Animated.View>
          )}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRestaurants}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <DeliveryAddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </View>
  );
}
