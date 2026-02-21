import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Globe,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { LanguageSelector } from '../../src/components/common/LanguageSelector';
import { COLORS, FONT_FAMILIES, FONT_SIZES } from '../../src/config/constants';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  isDestructive,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: pressed ? COLORS.surfaceHover : 'transparent',
        borderRadius: 12,
      })}
    >
      <View style={{ marginRight: 12 }}>{icon}</View>
      <Text
        style={{
          flex: 1,
          fontFamily: FONT_FAMILIES.body,
          fontSize: 16,
          color: isDestructive ? COLORS.error : COLORS.textPrimary,
        }}
      >
        {label}
      </Text>
      {value && (
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 14,
            color: COLORS.textTertiary,
            marginRight: 8,
          }}
        >
          {value}
        </Text>
      )}
      <ChevronRight size={20} color={COLORS.textTertiary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [showLanguage, setShowLanguage] = useState(false);

  const handleLogout = () => {
    Alert.alert(t('auth.logoutConfirmTitle'), t('auth.logoutConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const currentLanguage =
    i18n.language === 'pt'
      ? t('profile.languagePortuguese')
      : t('profile.languageEnglish');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* User info */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 22,
                color: COLORS.textOnPrimary,
              }}
            >
              {initials}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: FONT_SIZES['2xl'],
              color: COLORS.textPrimary,
            }}
          >
            {user?.full_name ?? ''}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 14,
              color: COLORS.textSecondary,
              marginTop: 4,
            }}
          >
            {user?.email ?? ''}
          </Text>
        </View>

        {/* Settings */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 8,
          }}
        >
          <SettingsRow
            icon={<MapPin size={20} color={COLORS.textSecondary} />}
            label={t('profile.deliveryAddress')}
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Globe size={20} color={COLORS.textSecondary} />}
            label={t('profile.language')}
            value={currentLanguage}
            onPress={() => setShowLanguage(!showLanguage)}
          />

          {showLanguage && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
              <LanguageSelector onSelect={() => setShowLanguage(false)} />
            </View>
          )}

          <SettingsRow
            icon={<Bell size={20} color={COLORS.textSecondary} />}
            label={t('profile.notifications')}
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Lock size={20} color={COLORS.textSecondary} />}
            label={t('profile.changePassword')}
            onPress={() => {}}
          />
          <SettingsRow
            icon={<LogOut size={20} color={COLORS.error} />}
            label={t('profile.logout')}
            onPress={handleLogout}
            isDestructive
          />
        </View>

        {/* Version */}
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          {t('profile.version')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
