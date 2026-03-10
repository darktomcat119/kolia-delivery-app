import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react-native';
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
      {/* Header area */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
        {/* Top row: Logo + Location */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{ height: 32, width: 110, resizeMode: 'contain' }}
          />
          {address ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: COLORS.surface,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
              }}
            >
              <MapPin size={14} color={COLORS.primary} />
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodyMedium,
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  maxWidth: 120,
                }}
                numberOfLines={1}
              >
                {address}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Greeting */}
        <Text
          style={{
            fontFamily: FONT_FAMILIES.display,
            fontSize: 28,
            color: COLORS.textPrimary,
            lineHeight: 36,
            marginBottom: 4,
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
              marginBottom: 16,
            }}
          >
            {firstName}
          </Text>
        ) : (
          <View style={{ marginBottom: 16 }} />
        )}
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

      {/* Section title */}
      <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.bodySemibold,
            fontSize: 18,
            color: COLORS.textPrimary,
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
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
