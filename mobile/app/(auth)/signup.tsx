import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { signupSchema, type SignupFormData } from '../../src/utils/validation';
import { LuxuryBackground } from '../../src/components/ui/LuxuryBackground';
import { FlowingShapes } from '../../src/components/ui/FlowingShapes';
import { COLORS, FONT_FAMILIES, FONT_SIZES } from '../../src/config/constants';

const { width } = Dimensions.get('window');

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

  const isNetworkError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    return /network request failed|fetch failed|failed to fetch|auth init timeout/i.test(msg);
  };

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      router.replace('/(tabs)/home');
    } catch (err) {
      const message = isNetworkError(err) ? t('auth.errors.networkError') : t('auth.errors.signupFailed');
      Alert.alert(t('common.error'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LuxuryBackground textureImage={require('../../assets/onboarding/african-cuisine.jpg')} textureOpacity={0.04} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero header */}
          <View
            style={{
              backgroundColor: COLORS.primary,
              paddingTop: 56,
              paddingBottom: 32,
              paddingHorizontal: 24,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              source={require('../../assets/onboarding/african-cuisine.jpg')}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12 }}
              resizeMode="cover"
            />
            <FlowingShapes />
            {/* Decorative circles */}
            <View
              style={{
                position: 'absolute',
                top: -30,
                left: -30,
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}
            />

            {/* Back button */}
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </Pressable>

            <Text
              style={{
                fontFamily: FONT_FAMILIES.display,
                fontSize: 30,
                color: '#FFFFFF',
                lineHeight: 38,
                marginBottom: 8,
              }}
            >
              {t('auth.signUpTitle')}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 15,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 22,
              }}
            >
              {t('auth.signUpSubtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 }}>
            <View style={{ gap: 14 }}>
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

              <View style={{ marginTop: 4 }}>
                <Button
                  title={t('auth.signUp')}
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  fullWidth
                />
              </View>
            </View>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 12,
                  color: COLORS.textTertiary,
                  marginHorizontal: 16,
                }}
              >
                OR
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            {/* Login link */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.body,
                  fontSize: 15,
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
                      fontSize: 15,
                      color: COLORS.primary,
                    }}
                  >
                    {t('auth.signInLink')}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
