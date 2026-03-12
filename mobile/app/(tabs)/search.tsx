import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRestaurantStore } from '../../src/stores/restaurantStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS } from '../../src/config/constants';
import { haversineDistance } from '../../src/utils/haversine';
import { RestaurantCard } from '../../src/components/home/RestaurantCard';
import { LuxuryBackground } from '../../src/components/ui/LuxuryBackground';
import { EmptyState } from '../../src/components/ui/EmptyState';
import type { Restaurant } from '../../src/types';

type SortOption = 'nearest' | 'best_rated' | 'lowest_fee';

export default function SearchScreen() {
  const { t } = useTranslation();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const { latitude, longitude } = useLocationStore();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('nearest');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  }, [fetchRestaurants]);

  useEffect(() => {
    if (restaurants.length === 0) {
      fetchRestaurants();
    }
  }, [restaurants.length, fetchRestaurants]);

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'nearest', label: t('search.sortNearest') },
    { key: 'best_rated', label: t('search.sortBestRated') },
    { key: 'lowest_fee', label: t('search.sortLowestFee') },
  ];

  const filteredAndSorted = useMemo(() => {
    let results = restaurants;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false) ||
          r.cuisine_type.replace(/_/g, ' ').includes(q) ||
          r.city.toLowerCase().includes(q),
      );
    }

    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'nearest':
          if (latitude && longitude) {
            return (
              haversineDistance(latitude, longitude, a.latitude, a.longitude) -
              haversineDistance(latitude, longitude, b.latitude, b.longitude)
            );
          }
          return a.name.localeCompare(b.name);
        case 'best_rated':
          return b.rating - a.rating;
        case 'lowest_fee':
          return a.delivery_fee - b.delivery_fee;
        default:
          return 0;
      }
    });
  }, [restaurants, query, sortBy, latitude, longitude]);

  const getDistance = (restaurant: Restaurant) => {
    if (latitude && longitude) {
      return haversineDistance(latitude, longitude, restaurant.latitude, restaurant.longitude);
    }
    return undefined;
  };

  return (
    <View style={{ flex: 1 }}>
      <LuxuryBackground textureImage={require('../../assets/onboarding/restaurant-interior.jpg')} textureOpacity={0.04} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.display,
            fontSize: 24,
            color: COLORS.textPrimary,
            marginBottom: 16,
          }}
        >
          {t('search.title')}
        </Text>

        {/* Search input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: BORDER_RADIUS.input,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 14,
            height: 48,
          }}
        >
          <SearchIcon size={20} color={COLORS.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('search.placeholder')}
            placeholderTextColor={COLORS.textTertiary}
            style={{
              flex: 1,
              marginLeft: 10,
              fontFamily: FONT_FAMILIES.body,
              fontSize: 14,
              color: COLORS.textPrimary,
            }}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Sort chips */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          gap: 8,
          marginBottom: 12,
        }}
      >
        {sortOptions.map((option) => {
          const isActive = sortBy === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setSortBy(option.key)}
              style={{
                backgroundColor: isActive ? COLORS.primary : COLORS.surface,
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: BORDER_RADIUS.pill,
                borderWidth: 1,
                borderColor: isActive ? COLORS.primary : COLORS.border,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodyMedium,
                  fontSize: 12,
                  color: isActive ? COLORS.textOnPrimary : COLORS.textSecondary,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Result count */}
      {query.trim().length > 0 && (
        <Text style={{ paddingHorizontal: 20, marginBottom: 8, fontFamily: FONT_FAMILIES.body, fontSize: 13, color: COLORS.textSecondary }}>
          {t('search.resultCount', { count: filteredAndSorted.length })}
        </Text>
      )}

      {/* Results */}
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <RestaurantCard restaurant={item} distanceKm={getDistance(item)} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            image={require('../../assets/onboarding/jollof-restaurant.jpg')}
            title={t('search.noResults')}
            subtitle={t('search.tryDifferent')}
          />
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
