import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Globe,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { registerForPushNotifications, getNotificationPermissionStatus } from '../../src/services/notifications';
import { supabase } from '../../src/lib/supabase';
import { LanguageSelector } from '../../src/components/common/LanguageSelector';
import { DeliveryAddressModal } from '../../src/components/address/DeliveryAddressModal';
import { LuxuryBackground } from '../../src/components/ui/LuxuryBackground';
import {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  BORDER_RADIUS,
  SPACING,
} from '../../src/config/constants';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  isDestructive,
  rightElement,
  isLast,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: pressed ? COLORS.surfaceHover : 'transparent',
        borderRadius: 12,
        borderBottomWidth: isLast === true ? 0 : 1,
        borderBottomColor: COLORS.borderLight,
      })}
    >
      <View style={{ marginRight: 12, flexShrink: 0 }}>{icon}</View>
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flexShrink: 1,
            fontFamily: FONT_FAMILIES.body,
            fontSize: 16,
            color: isDestructive ? COLORS.error : COLORS.textPrimary,
          }}
        >
          {label}
        </Text>
        {value ? (
          <Text
            numberOfLines={1}
            style={{
              flexShrink: 1,
              fontFamily: FONT_FAMILIES.body,
              fontSize: 14,
              color: COLORS.textTertiary,
            }}
          >
            {value}
          </Text>
        ) : null}
      </View>
      <View style={{ marginLeft: 8, flexShrink: 0 }}>
        {rightElement ?? <ChevronRight size={20} color={COLORS.textTertiary} />}
      </View>
    </Pressable>
  );
}

// ─── Password Modal ─────────────────────────────────────────
function PasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [visible]);

  const handleSave = async () => {
    setError('');

    if (newPassword.length < 6) {
      setError(t('auth.errors.passwordMin'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      Alert.alert(t('profile.passwordChanged'));
      onClose();
    } catch {
      setError(t('profile.passwordChangeFailed'));
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
          {/* Header */}
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
              {t('profile.changePassword')}
            </Text>
            <Pressable onPress={onClose}>
              <X size={24} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          {/* New password */}
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodyMedium,
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 6,
            }}
          >
            {t('profile.newPassword')}
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 16,
              color: COLORS.textPrimary,
              backgroundColor: COLORS.surface,
              borderRadius: BORDER_RADIUS.input,
              padding: SPACING.base,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginBottom: SPACING.md,
            }}
          />

          {/* Confirm password */}
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodyMedium,
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 6,
            }}
          >
            {t('profile.confirmNewPassword')}
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 16,
              color: COLORS.textPrimary,
              backgroundColor: COLORS.surface,
              borderRadius: BORDER_RADIUS.input,
              padding: SPACING.base,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          />

          {/* Error */}
          {error ? (
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 14,
                color: COLORS.error,
                marginTop: SPACING.sm,
              }}
            >
              {error}
            </Text>
          ) : null}

          {/* Save button */}
          <Pressable
            onPress={handleSave}
            disabled={saving || !newPassword || !confirmPassword}
            style={{
              backgroundColor:
                saving || !newPassword || !confirmPassword
                  ? COLORS.textTertiary
                  : COLORS.primary,
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

// ─── Main Profile Screen ────────────────────────────────────
export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Check notification permission on mount
  useEffect(() => {
    getNotificationPermissionStatus().then(setNotificationsEnabled);
  }, []);

  const handleToggleNotifications = async () => {
    setNotifLoading(true);
    try {
      if (notificationsEnabled) {
        // Can't programmatically revoke — inform user
        Alert.alert(
          t('profile.notifications'),
          t('profile.notificationsPermissionDenied'),
        );
      } else {
        const token = await registerForPushNotifications();
        if (token) {
          setNotificationsEnabled(true);
        } else {
          Alert.alert(
            t('profile.notifications'),
            t('profile.notificationsPermissionDenied'),
          );
        }
      }
    } finally {
      setNotifLoading(false);
    }
  };

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

  const languageLabels: Record<string, string> = {
    pt: t('profile.languagePortuguese'),
    en: t('profile.languageEnglish'),
    fr: t('profile.languageFrench'),
  };
  const currentLanguage = languageLabels[i18n.language] ?? i18n.language;

  return (
    <View style={{ flex: 1 }}>
      <LuxuryBackground textureImage={require('../../assets/onboarding/african-cuisine.jpg')} textureOpacity={0.04} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* User info header */}
          <View
            style={{
              backgroundColor: COLORS.secondary,
            paddingTop: 48,
            paddingBottom: 32,
            paddingHorizontal: 20,
            alignItems: 'center',
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            marginBottom: 24,
          }}
        >
          {/* Decorative circle */}
          <View
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          />
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderWidth: 3,
              borderColor: 'rgba(255,255,255,0.3)',
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
              fontFamily: FONT_FAMILIES.display,
              fontSize: 22,
              color: '#FFFFFF',
            }}
          >
            {user?.full_name ?? ''}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 14,
              color: 'rgba(255,255,255,0.6)',
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
            borderRadius: 24,
            padding: 8,
            marginHorizontal: 20,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
            shadowColor: '#1A1A1A',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <SettingsRow
            icon={<MapPin size={20} color={COLORS.textSecondary} />}
            label={t('profile.deliveryAddress')}
            value={
              user?.address
                ? user.address.length > 24
                  ? user.address.slice(0, 24) + '…'
                  : user.address
                : undefined
            }
            onPress={() => setShowAddressModal(true)}
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
            value={
              notificationsEnabled
                ? t('profile.notificationsEnabled')
                : t('profile.notificationsDisabled')
            }
            onPress={handleToggleNotifications}
            rightElement={
              notifLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  trackColor={{
                    false: COLORS.border,
                    true: COLORS.primaryLight,
                  }}
                  thumbColor={
                    notificationsEnabled ? COLORS.primary : COLORS.textTertiary
                  }
                />
              )
            }
          />
          <SettingsRow
            icon={<Lock size={20} color={COLORS.textSecondary} />}
            label={t('profile.changePassword')}
            onPress={() => setShowPasswordModal(true)}
          />
          <SettingsRow
            icon={<LogOut size={20} color={COLORS.error} />}
            label={t('profile.logout')}
            onPress={handleLogout}
            isDestructive
            isLast
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

      {/* Modals */}
      <DeliveryAddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
      <PasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      </SafeAreaView>
    </View>
  );
}
