import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../../src/utils/validation';
import { COLORS, FONT_FAMILIES, FONT_SIZES } from '../../src/config/constants';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch {
      Alert.alert(t('common.error'), t('auth.errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: FONT_SIZES['3xl'],
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            {t('auth.forgotTitle')}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: FONT_SIZES.md,
              color: COLORS.textSecondary,
              marginBottom: 32,
            }}
          >
            {t('auth.forgotSubtitle')}
          </Text>

          {sent ? (
            /* Success state */
            <View
              style={{
                alignItems: 'center',
                gap: 16,
                padding: 24,
                backgroundColor: COLORS.successMuted,
                borderRadius: 16,
              }}
            >
              <CheckCircle size={48} color={COLORS.success} />
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodySemibold,
                  fontSize: 18,
                  color: COLORS.success,
                  textAlign: 'center',
                }}
              >
                {t('auth.resetSent')}
              </Text>
            </View>
          ) : (
            /* Form */
            <View style={{ gap: 16 }}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.email')}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    icon={<Mail size={20} color={COLORS.textTertiary} />}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email ? t(errors.email.message!) : undefined}
                  />
                )}
              />

              <Button
                title={t('auth.sendResetLink')}
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                fullWidth
              />
            </View>
          )}

          {/* Back to login */}
          <Link href="/(auth)/login" asChild>
            <Pressable
              style={{
                alignSelf: 'center',
                marginTop: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 14,
                  color: COLORS.textSecondary,
                }}
              >
                {t('auth.backToLogin')}
              </Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
