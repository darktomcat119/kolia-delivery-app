/**
 * Canvas-style floating SVG shapes (circles, lines) with Reanimated.
 * Use as a subtle motion layer behind hero or empty state content.
 */
import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
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

const SHAPES = [
  { id: 0, type: 'circle' as const, size: 80, x: width * 0.1, y: height * 0.15, duration: 8000, delay: 0, dy: -25, opacity: [0.06, 0.14] },
  { id: 1, type: 'circle' as const, size: 120, x: width * 0.75, y: height * 0.3, duration: 9000, delay: 1000, dy: 20, opacity: [0.04, 0.1] },
  { id: 2, type: 'circle' as const, size: 50, x: width * 0.5, y: height * 0.7, duration: 7000, delay: 500, dy: -15, opacity: [0.08, 0.16] },
  { id: 3, type: 'circle' as const, size: 90, x: width * 0.85, y: height * 0.8, duration: 8500, delay: 1500, dy: 18, opacity: [0.05, 0.12] },
  { id: 4, type: 'circle' as const, size: 60, x: width * 0.2, y: height * 0.55, duration: 7500, delay: 800, dy: -20, opacity: [0.06, 0.12] },
];

const COLORS = ['#E07A2F', '#D4A745', '#1B5E3A', '#C4631E'];

function ShapeLayer({ shape }: { shape: typeof SHAPES[0] }) {
  const progress = useSharedValue(0);
  const color = COLORS[shape.id % COLORS.length];

  useEffect(() => {
    progress.value = withDelay(
      shape.delay,
      withRepeat(
        withTiming(1, { duration: shape.duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, shape.dy]) },
    ],
    opacity: interpolate(progress.value, [0, 0.5, 1], [shape.opacity[0], shape.opacity[1], shape.opacity[0]]),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: shape.x - shape.size / 2,
          top: shape.y - shape.size / 2,
          width: shape.size,
          height: shape.size,
        },
        animatedStyle,
      ]}
    >
      <Svg width={shape.size} height={shape.size} viewBox={`0 0 ${shape.size} ${shape.size}`}>
        <Circle
          cx={shape.size / 2}
          cy={shape.size / 2}
          r={shape.size / 2 - 2}
          fill={color}
          fillOpacity={1}
        />
      </Svg>
    </Animated.View>
  );
}

export function FlowingShapes() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {SHAPES.map((s) => (
        <ShapeLayer key={s.id} shape={s} />
      ))}
    </View>
  );
}
