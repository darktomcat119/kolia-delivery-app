import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StripeProvider } from '@stripe/stripe-react-native';
import {
  useFonts,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { useAuthStore } from '../src/stores/authStore';
import {
  registerForPushNotifications,
  addNotificationResponseListener,
} from '../src/services/notifications';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { ENV } from '../src/config/env';
import '../src/i18n';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      await initialize();
      setAppReady(true);
    }
    prepare();
  }, [initialize]);

  // Register push notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotifications();
    }
  }, [isAuthenticated]);

  // Handle notification taps (navigate to order tracking)
  useEffect(() => {
    const subscription = addNotificationResponseListener((response) => {
      const orderId = response.notification.request.content.data?.order_id;
      if (orderId) {
        router.push(`/order/${orderId}/tracking`);
      }
    });

    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    if (fontsLoaded && appReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appReady]);

  if (!fontsLoaded || !appReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <StripeProvider publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="onboarding"
            options={{ animation: 'fade' }}
          />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="restaurant/[id]"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="cart"
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="checkout"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="order/[id]/confirmation" />
          <Stack.Screen name="order/[id]/tracking" />
        </Stack>
      </StripeProvider>
    </ErrorBoundary>
  );
}
