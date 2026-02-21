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
import { User, Mail, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { signupSchema, type SignupFormData } from '../../src/utils/validation';
import { COLORS, FONT_FAMILIES, FONT_SIZES } from '../../src/config/constants';

export default function SignupScreen() {
  const { t } = useTranslation();
  const signUp = useAuthStore((s) => s.signUp);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert(t('common.error'), t('auth.errors.signupFailed'));
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

          {/* Title */}
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: FONT_SIZES['3xl'],
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            {t('auth.signUpTitle')}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: FONT_SIZES.md,
              color: COLORS.textSecondary,
              marginBottom: 32,
            }}
          >
            {t('auth.signUpSubtitle')}
          </Text>

          {/* Form */}
          <View style={{ gap: 16 }}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.fullName')}
                  placeholder="Emanuel Silva"
                  autoCapitalize="words"
                  autoComplete="name"
                  icon={<User size={20} color={COLORS.textTertiary} />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={
                    errors.fullName ? t(errors.fullName.message!) : undefined
                  }
                />
              )}
            />

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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.confirmPassword')}
                  placeholder="••••••"
                  isPassword
                  autoCapitalize="none"
                  icon={<Lock size={20} color={COLORS.textTertiary} />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={
                    errors.confirmPassword
                      ? t(errors.confirmPassword.message!)
                      : undefined
                  }
                />
              )}
            />

            <Button
              title={t('auth.signUp')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
            />
          </View>

          {/* Login link */}
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
              {t('auth.hasAccount')}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.bodySemibold,
                    fontSize: 14,
                    color: COLORS.primary,
                  }}
                >
                  {t('auth.signInLink')}
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
