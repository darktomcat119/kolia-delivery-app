import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_FAMILIES } from '../src/config/constants';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🍛',
    title: 'Authentic African\nCuisine',
    subtitle:
      'From West African Jollof to North African Tagine — discover the rich and diverse flavours of the continent.',
    gradient: ['#E07A2F', '#F4A261'],
    decorEmojis: ['🥘', '🍲', '🫕', '🥗', '🍖'],
  },
  {
    id: '2',
    emoji: '🏪',
    title: 'Curated\nRestaurants',
    subtitle:
      'Hand-picked restaurants serving the most authentic African dishes in your city. Quality guaranteed.',
    gradient: ['#1B5E3A', '#2D8B5E'],
    decorEmojis: ['⭐', '🏆', '✨', '💎', '🎖️'],
  },
  {
    id: '3',
    emoji: '🚀',
    title: 'Fast & Reliable\nDelivery',
    subtitle:
      'Track your order in real-time from kitchen to doorstep. Pay securely and enjoy every bite.',
    gradient: ['#8B5CF6', '#A78BFA'],
    decorEmojis: ['📍', '🛵', '⏱️', '📦', '🎉'],
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
  const scrollX = useRef(new Animated.Value(0)).current;
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

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [40, 0, 40],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ width, height: '100%' }}>
        {/* Gradient background */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: item.gradient[0],
          }}
        />
        {/* Lighter circle decoration */}
        <View
          style={{
            position: 'absolute',
            top: -height * 0.15,
            right: -width * 0.3,
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: width * 0.45,
            backgroundColor: item.gradient[1],
            opacity: 0.3,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: height * 0.15,
            left: -width * 0.2,
            width: width * 0.6,
            height: width * 0.6,
            borderRadius: width * 0.3,
            backgroundColor: item.gradient[1],
            opacity: 0.2,
          }}
        />

        {/* Floating decoration emojis */}
        {item.decorEmojis.map((e, i) => (
          <Animated.Text
            key={i}
            style={{
              position: 'absolute',
              fontSize: 24 + (i % 3) * 8,
              opacity: 0.15,
              top: 80 + (i * 120) % (height * 0.5),
              left: (i * 80 + 30) % (width - 40),
              transform: [{ rotate: `${i * 30 - 60}deg` }],
            }}
          >
            {e}
          </Animated.Text>
        ))}

        {/* Content */}
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
            transform: [{ scale }, { translateY }],
            opacity,
          }}
        >
          {/* Main emoji icon */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 36,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Text style={{ fontSize: 56 }}>{item.emoji}</Text>
          </View>

          <Text
            style={{
              fontFamily: FONT_FAMILIES.display,
              fontSize: 36,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 44,
              marginBottom: 16,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: 16,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              lineHeight: 24,
              maxWidth: 300,
            }}
          >
            {item.subtitle}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: SLIDES[0].gradient[0] }}>
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom controls */}
      <SafeAreaView
        edges={['bottom']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}
      >
        {/* Dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={{
                  height: 8,
                  width: dotWidth,
                  borderRadius: 4,
                  backgroundColor: '#FFFFFF',
                  opacity: dotOpacity,
                }}
              />
            );
          })}
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {!isLastSlide && (
            <Pressable
              onPress={completeOnboarding}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.3)',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bodySemibold,
                  fontSize: 16,
                  color: '#FFFFFF',
                }}
              >
                Skip
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleNext}
            style={{
              flex: isLastSlide ? 1 : 2,
              paddingVertical: 16,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 16,
                color: SLIDES[currentIndex].gradient[0],
              }}
            >
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
