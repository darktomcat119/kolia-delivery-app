import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

function AnimatedSpinner() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  return <Animated.View style={[styles.spinnerWrap, style]} />;
}

function ShimmerDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 600 }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <LinearGradient
        colors={['#FAFAF7', '#F5F3EF']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <AnimatedSpinner />
        <View style={styles.dotsRow}>
          {[0, 150, 300].map((d) => (
            <ShimmerDot key={d} delay={d} />
          ))}
        </View>
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          <Text style={styles.brand}>Kolia</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: { alignItems: 'center', justifyContent: 'center' },
  spinnerWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.primaryLight,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginBottom: 18,
  },
  dotsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  brand: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: 22,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  message: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
