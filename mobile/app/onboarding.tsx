import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  Animated as RNAnimated,
  StyleSheet,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import { COLORS, FONT_FAMILIES } from '../src/config/constants';
import { SpiceParticles } from '../src/components/ui/SpiceParticles';
import { WarmthGlow } from '../src/components/ui/WarmthGlow';
import { AfricanPatternOverlay } from '../src/components/ui/AfricanPatternOverlay';
import { DeliveryPath } from '../src/components/ui/DeliveryPath';
import { FlowingShapes } from '../src/components/ui/FlowingShapes';

const { width, height } = Dimensions.get('window');

// Local assets (originally from Unsplash, free for commercial use)
const SLIDES = [
  {
    id: '1',
    image: require('../assets/onboarding/african-cuisine.jpg'),
    title: 'Authentic African\nCuisine',
    subtitle:
      'From West African Jollof to North African Tagine — discover the rich and diverse flavours of the continent.',
    tagline: 'Jollof • Tagine • Injera • Waakye',
    gradient: ['#1A0A0A', '#2D1810', '#4A2618'] as const,
    accent: '#E07A2F',
  },
  {
    id: '2',
    image: require('../assets/onboarding/restaurant-interior.jpg'),
    title: 'Curated\nRestaurants',
    subtitle:
      'Hand-picked restaurants serving the most authentic African dishes in your city. Every venue is quality-checked and trusted by our community.',
    tagline: 'Quality verified • Real reviews • Your taste, delivered',
    gradient: ['#0A1A12', '#0F2A1C', '#163D28'] as const,
    accent: '#2D8B5E',
  },
  {
    id: '3',
    image: require('../assets/onboarding/delivery.jpg'),
    title: 'Fast & Reliable\nDelivery',
    subtitle:
      'Track your order in real-time from kitchen to doorstep. Secure payment, live tracking, and support when you need it.',
    tagline: 'Live tracking • Safe payment • Hot & on time',
    gradient: ['#0F0A1A', '#1A1228', '#2A1A42'] as const,
    accent: '#8B5CF6',
  },
];

const ONBOARDING_KEY = '@kolia_onboarding_done';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  }, [currentIndex]);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(auth)/login');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSlide = ({ item, index }: { item: (typeof SLIDES)[0]; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [60, 0, 60],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.slide, { width }]}>
        <LinearGradient
          colors={item.gradient}
          style={StyleSheet.absoluteFill}
        />

        <WarmthGlow />
        <SpiceParticles />
        <AfricanPatternOverlay />
        <FlowingShapes />
        {index === 2 && <DeliveryPath />}

        {/* Content card with glassmorphism */}
        <RNAnimated.View
          style={[
            styles.contentWrap,
            {
              transform: [{ scale }, { translateY }],
              opacity,
            },
          ]}
        >
          {Platform.OS === 'ios' ? (
            <BlurView intensity={25} tint="dark" style={styles.glassCard}>
              <Image
                source={item.image}
                style={styles.slideImage}
                contentFit="cover"
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.tagline}>{item.tagline}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </BlurView>
          ) : (
            <View style={[styles.glassCard, styles.glassCardFallback]}>
              <Image
                source={item.image}
                style={styles.slideImage}
                contentFit="cover"
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.tagline}>{item.tagline}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          )}
        </RNAnimated.View>
      </View>
    );
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: SLIDES[0].gradient[0] }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <SafeAreaView edges={['bottom']} style={styles.bottom}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 32, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <RNAnimated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.buttons}>
          {!isLastSlide && (
            <Pressable onPress={completeOnboarding} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
          <Pressable onPress={handleNext} style={styles.nextBtn}>
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255,255,255,0.95)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextGradient}
            >
              <Text style={[styles.nextText, { color: SLIDES[currentIndex].gradient[0] }]}>
                {isLastSlide ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  glassCard: {
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 32,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  glassCardFallback: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  slideImage: {
    width: width - 56,
    maxWidth: 320,
    height: 180,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: 34,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  buttons: { flexDirection: 'row', gap: 14 },
  skipBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: FONT_FAMILIES.bodySemibold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  nextBtn: {
    flex: 2,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  nextGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    fontFamily: FONT_FAMILIES.bodySemibold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
