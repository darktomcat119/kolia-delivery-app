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

const { width } = Dimensions.get('window');

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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
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
              backgroundColor: COLORS.secondary,
              paddingTop: 60,
              paddingBottom: 40,
              paddingHorizontal: 24,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              overflow: 'hidden',
            }}
          >
            {/* Decorative circles */}
            <View
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: 'rgba(255,255,255,0.06)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -20,
                left: -30,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 30,
                left: width * 0.4,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(224,122,47,0.15)',
              }}
            />

            {/* Logo */}
            <Image
              source={require('../../assets/logo.png')}
              style={{
                height: 44,
                width: 160,
                resizeMode: 'contain',
                marginBottom: 24,
                tintColor: '#FFFFFF',
              }}
            />

            <Text
              style={{
                fontFamily: FONT_FAMILIES.display,
                fontSize: 32,
                color: '#FFFFFF',
                lineHeight: 40,
                marginBottom: 8,
              }}
            >
              {t('auth.welcome')}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.body,
                fontSize: 15,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 22,
              }}
            >
              {t('auth.signInSubtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 }}>
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
                      fontFamily: FONT_FAMILIES.bodyMedium,
                      fontSize: 14,
                      color: COLORS.primary,
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

            {/* Sign up link */}
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
                {t('auth.noAccount')}
              </Text>
              <Link href="/(auth)/signup" asChild>
                <Pressable>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILIES.bodySemibold,
                      fontSize: 15,
                      color: COLORS.primary,
                    }}
                  >
                    {t('auth.signUpLink')}
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
