import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { searchAddress, type AddressSuggestion } from '../../services/geocoding';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS } from '../../config/constants';

const DEBOUNCE_MS = 400;

interface AddressAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectSuggestion: (address: string, latitude: number, longitude: number) => void;
  placeholder?: string;
  onUseCurrentLocation?: () => void;
  useCurrentLocationLoading?: boolean;
  /** When true, hide the "Use current location" row */
  hideUseCurrentLocation?: boolean;
}

export function AddressAutocomplete({
  value,
  onChangeText,
  onSelectSuggestion,
  placeholder,
  onUseCurrentLocation,
  useCurrentLocationLoading = false,
  hideUseCurrentLocation = false,
}: AddressAutocompleteProps) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const list = await searchAddress(q);
        setSuggestions(list);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const handleSelect = useCallback(
    (item: AddressSuggestion) => {
      onChangeText(item.displayName);
      setSuggestions([]);
      Keyboard.dismiss();
      onSelectSuggestion(item.displayName, item.latitude, item.longitude);
    },
    [onChangeText, onSelectSuggestion]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <MapPin size={18} color={COLORS.textTertiary} style={styles.inputIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searching && (
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.spinner} />
        )}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => `${item.latitude}-${item.longitude}`}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionRowPressed]}
                onPress={() => handleSelect(item)}
              >
                <MapPin size={16} color={COLORS.primary} style={styles.suggestionIcon} />
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {item.displayName}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {!hideUseCurrentLocation && onUseCurrentLocation && (
        <Pressable
          onPress={onUseCurrentLocation}
          disabled={useCurrentLocationLoading}
          style={styles.useLocationRow}
        >
          {useCurrentLocationLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.useLocationIcon} />
          ) : (
            <Navigation size={18} color={COLORS.primary} style={styles.useLocationIcon} />
          )}
          <Text style={styles.useLocationText}>
            {useCurrentLocationLoading ? t('profile.locatingAddress') : t('profile.useCurrentLocation')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 0 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 48,
  },
  inputIcon: { marginLeft: 14 },
  input: {
    flex: 1,
    fontFamily: FONT_FAMILIES.body,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  spinner: { marginRight: 12 },
  suggestions: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    maxHeight: 220,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  suggestionRowPressed: { backgroundColor: COLORS.surfaceHover },
  suggestionIcon: { marginRight: 10 },
  suggestionText: {
    flex: 1,
    fontFamily: FONT_FAMILIES.body,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  useLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
  },
  useLocationIcon: { marginRight: 8 },
  useLocationText: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 14,
    color: COLORS.primary,
  },
});
