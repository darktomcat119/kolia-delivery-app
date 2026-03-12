/**
 * Warmth from shared meal – layered organic glow.
 * Matches African hospitality and the warmth of freshly prepared food.
 */
import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface GlowLayer {
  id: number;
  color: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  scaleRange: [number, number];
  opacityRange: [number, number];
}

const LAYERS: GlowLayer[] = [
  { id: 0, color: '#E07A2F', size: 280, x: -100, y: -80, duration: 5000, delay: 0, scaleRange: [0.9, 1.2], opacityRange: [0.08, 0.22] },
  { id: 1, color: '#D4A745', size: 200, x: width - 80, y: height * 0.25, duration: 4500, delay: 600, scaleRange: [0.85, 1.15], opacityRange: [0.06, 0.16] },
  { id: 2, color: '#1B5E3A', size: 160, x: width * 0.2, y: height - 120, duration: 5500, delay: 300, scaleRange: [0.9, 1.1], opacityRange: [0.05, 0.14] },
  { id: 3, color: '#C4631E', size: 120, x: width * 0.6, y: 100, duration: 4800, delay: 900, scaleRange: [0.8, 1.1], opacityRange: [0.04, 0.12] },
];

function GlowLayerComp({ layer }: { layer: GlowLayer }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      layer.delay,
      withRepeat(
        withTiming(1, { duration: layer.duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], layer.scaleRange),
      },
    ],
    opacity: interpolate(progress.value, [0, 0.5, 1], [
      layer.opacityRange[0],
      layer.opacityRange[1],
      layer.opacityRange[0],
    ]),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: layer.x,
          top: layer.y,
          width: layer.size,
          height: layer.size,
          borderRadius: layer.size / 2,
          backgroundColor: layer.color,
        },
        style,
      ]}
    />
  );
}

export function WarmthGlow() {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      {LAYERS.map((l) => (
        <GlowLayerComp key={l.id} layer={l} />
      ))}
    </View>
  );
}
