import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

interface LuxuryBackgroundProps {
  children?: React.ReactNode;
  /** Optional texture image (e.g. paper, fabric) shown at low opacity over the gradient */
  textureImage?: ImageSourcePropType;
  /** Opacity for texture image (default 0.08; use lower e.g. 0.04 for photos) */
  textureOpacity?: number;
  /** Enable a subtle animated gradient overlay that shifts over time */
  animatedOverlay?: boolean;
}

const GRADIENT_COLORS = ['#FAFAF7', '#F5F3EF', '#F0EDE8'] as const;
const OVERLAY_COLORS = ['transparent', 'rgba(224,122,47,0.04)', 'transparent', 'rgba(27,94,58,0.03)', 'transparent'] as const;

export function LuxuryBackground({ children, textureImage, textureOpacity = 0.08, animatedOverlay = true }: LuxuryBackgroundProps) {
  const shift = useSharedValue(0);

  useEffect(() => {
    if (animatedOverlay) {
      shift.value = withRepeat(
        withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [animatedOverlay]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shift.value, [0, 0.5, 1], [0.5, 1, 0.5]),
    transform: [
      { translateY: interpolate(shift.value, [0, 1], [0, 30]) },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {textureImage && (
        <Image
          source={textureImage}
          style={[StyleSheet.absoluteFill, { opacity: textureOpacity }]}
          resizeMode="cover"
          pointerEvents="none"
        />
      )}
      {animatedOverlay && (
        <Animated.View style={[StyleSheet.absoluteFill, animatedOverlayStyle]} pointerEvents="none">
          <LinearGradient
            colors={[...OVERLAY_COLORS]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>
      )}
      {children != null && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {children}
        </View>
      )}
    </View>
  );
}
