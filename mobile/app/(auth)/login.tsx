import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores/authStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { loginSchema, type LoginFormData } from '../../src/utils/validation';
import { COLORS, FONT_FAMILIES } from '../../src/config/constants';
import { SpiceParticles } from '../../src/components/ui/SpiceParticles';
import { WarmthGlow } from '../../src/components/ui/WarmthGlow';
import { AfricanPatternOverlay } from '../../src/components/ui/AfricanPatternOverlay';
import { FlowingShapes } from '../../src/components/ui/FlowingShapes';

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

  const isNetworkError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    return /network request failed|fetch failed|failed to fetch|auth init timeout/i.test(msg);
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      router.replace('/(tabs)/home');
    } catch (err) {
      const message = isNetworkError(err) ? t('auth.errors.networkError') : t('auth.errors.loginFailed');
      Alert.alert(t('common.error'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Luxury hero with background image, gradient & orbs */}
          <View style={styles.heroWrap}>
            <Image
              source={require('../../assets/onboarding/african-cuisine.jpg')}
              style={styles.heroBgImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(26,10,10,0.92)', 'rgba(45,24,16,0.88)', 'rgba(27,94,58,0.9)']}
              style={StyleSheet.absoluteFill}
            />
            <WarmthGlow />
            <SpiceParticles />
            <AfricanPatternOverlay />
            <FlowingShapes />

            <View style={styles.heroContent}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
              <Text style={styles.welcome}>{t('auth.welcome')}</Text>
              <Text style={styles.subtitle}>{t('auth.signInSubtitle')}</Text>
            </View>
          </View>

          {/* Form card */}
          <View style={styles.formWrap}>
            <View style={styles.formCard}>
              <View style={styles.formInner}>
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

                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                  </Pressable>
                </Link>

                <Button
                  title={t('auth.signIn')}
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  fullWidth
                />
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign up */}
              <View style={styles.signUpRow}>
                <Text style={styles.signUpLabel}>{t('auth.noAccount')}</Text>
                <Link href="/(auth)/signup" asChild>
                  <Pressable>
                    <Text style={styles.signUpLink}>{t('auth.signUpLink')}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF7' },
  scrollContent: { flexGrow: 1 },
  heroWrap: {
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  heroBgImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
  },
  logo: {
    height: 42,
    width: 150,
    marginBottom: 28,
    tintColor: '#FFFFFF',
  },
  welcome: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: 34,
    color: '#FFFFFF',
    lineHeight: 42,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 24,
  },
  formWrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  formInner: { gap: 18 },
  forgotBtn: { alignSelf: 'flex-end', paddingVertical: 4 },
  forgotText: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 14,
    color: COLORS.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 12,
    color: COLORS.textTertiary,
    marginHorizontal: 16,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  signUpLabel: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  signUpLink: {
    fontFamily: FONT_FAMILIES.bodySemibold,
    fontSize: 15,
    color: COLORS.primary,
  },
});
