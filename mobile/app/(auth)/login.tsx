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
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { loginSchema, type LoginFormData } from '../../src/utils/validation';
import { COLORS, FONT_FAMILIES, FONT_SIZES } from '../../src/config/constants';

export default function LoginScreen() {
  const { t } = useTranslation();
  const signIn = useAuthStore((s) => s.signIn);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert(t('common.error'), t('auth.errors.loginFailed'));
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
          {/* Logo */}
          <Text
            style={{
              fontFamily: FONT_FAMILIES.display,
              fontSize: FONT_SIZES['6xl'],
              color: COLORS.primary,
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            Kolia
          </Text>

          {/* Welcome text */}
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: FONT_SIZES['3xl'],
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            {t('auth.welcome')}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: FONT_SIZES.md,
              color: COLORS.textSecondary,
              marginBottom: 32,
            }}
          >
            {t('auth.signInSubtitle')}
          </Text>

          {/* Form */}
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.password')}
                  placeholder="••••••"
                  isPassword
                  autoCapitalize="none"
                  autoComplete="password"
                  icon={<Lock size={20} color={COLORS.textTertiary} />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={
                    errors.password ? t(errors.password.message!) : undefined
                  }
                />
              )}
            />

            {/* Forgot password */}
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable style={{ alignSelf: 'flex-end' }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.body,
                    fontSize: 14,
                    color: COLORS.textSecondary,
                  }}
                >
                  {t('auth.forgotPassword')}
                </Text>
              </Pressable>
            </Link>

            {/* Sign in button */}
            <Button
              title={t('auth.signIn')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
            />
          </View>

          {/* Sign up link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              gap: 4,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 14,
                color: COLORS.textSecondary,
              }}
            >
              {t('auth.noAccount')}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 14,
                    color: COLORS.primary,
                  }}
                >
                  {t('auth.signUpLink')}
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
