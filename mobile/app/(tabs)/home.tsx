import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useRestaurantStore } from '../../src/stores/restaurantStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { COLORS, FONT_FAMILIES, FONT_SIZES } from '../../src/config/constants';
import { getTimeGreetingKey } from '../../src/utils/formatters';
import { haversineDistance } from '../../src/utils/haversine';
import { RestaurantCard } from '../../src/components/home/RestaurantCard';
import { CuisineFilter } from '../../src/components/home/CuisineFilter';
import { SearchBar } from '../../src/components/home/SearchBar';
import { RestaurantCardSkeleton } from '../../src/components/ui/SkeletonLoader';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { getCurrentLocation } from '../../src/services/location';
import type { Restaurant } from '../../src/types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { latitude, longitude } = useLocationStore();
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

  const renderHeader = () => (
    <View>
      {/* Greeting */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.display,
            fontSize: FONT_SIZES['4xl'],
            color: COLORS.textPrimary,
          }}
        >
          {t(greetingKey)}{firstName ? `, ${firstName}` : ''}
        </Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Cuisine Filter */}
      <CuisineFilter
        selected={selectedCuisine}
        onSelect={setSelectedCuisine}
      />
    </View>
  );

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top']}>
      <FlatList
        data={sortedRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <RestaurantCard
              restaurant={item}
              distanceKm={getDistance(item)}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRestaurants}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
