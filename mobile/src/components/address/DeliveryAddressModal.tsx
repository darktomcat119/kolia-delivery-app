import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, Modal, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLocationStore } from '../../stores/locationStore';
import { getCurrentLocation } from '../../services/location';
import { AddressAutocomplete } from './AddressAutocomplete';
import { COLORS, FONT_FAMILIES, FONT_SIZES, BORDER_RADIUS, SPACING } from '../../config/constants';

interface DeliveryAddressModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DeliveryAddressModal({ visible, onClose }: DeliveryAddressModalProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const locationAddress = useLocationStore((s) => s.address);
  const locationLat = useLocationStore((s) => s.latitude);
  const locationLng = useLocationStore((s) => s.longitude);
  const locationLoading = useLocationStore((s) => s.isLoading);
  const setLocation = useLocationStore((s) => s.setLocation);

  const [address, setAddress] = useState(user?.address ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setAddress(user?.address ?? '');
    }
  }, [visible, user?.address]);

  useEffect(() => {
    if (locationAddress && locationLat && locationLng) {
      setAddress(locationAddress);
    }
  }, [locationAddress, locationLat, locationLng]);

  const handleUseLocation = () => {
    getCurrentLocation();
  };

  const handleSelectSuggestion = (addr: string, lat: number, lng: number) => {
    setAddress(addr);
    setLocation(lat, lng, addr);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: Record<string, unknown> = { address };
      if (locationLat && locationLng && address === locationAddress) {
        data.latitude = locationLat;
        data.longitude = locationLng;
      }
      await updateProfile(data as { address: string; latitude?: number; longitude?: number });
      Alert.alert(t('profile.addressSaved'));
      onClose();
    } catch {
      Alert.alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.overlay,
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: SPACING.lg,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: SPACING.lg,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: FONT_SIZES['2xl'],
                color: COLORS.textPrimary,
              }}
            >
              {t('profile.deliveryAddress')}
            </Text>
            <Pressable onPress={onClose}>
              <X size={24} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <AddressAutocomplete
            value={address}
            onChangeText={setAddress}
            onSelectSuggestion={handleSelectSuggestion}
            placeholder={t('profile.addressPlaceholder')}
            onUseCurrentLocation={handleUseLocation}
            useCurrentLocationLoading={locationLoading}
          />

          <Pressable
            onPress={handleSave}
            disabled={saving || !address.trim()}
            style={{
              backgroundColor:
                saving || !address.trim() ? COLORS.textTertiary : COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
              paddingVertical: 14,
              alignItems: 'center',
              marginTop: SPACING.lg,
            }}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.textOnPrimary} />
            ) : (
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodySemibold,
                  fontSize: 16,
                  color: COLORS.textOnPrimary,
                }}
              >
                {t('profile.saveChanges')}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
