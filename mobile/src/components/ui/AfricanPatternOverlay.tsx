/**
 * African-inspired geometric pattern (kente/mudcloth influenced).
 * Animated shimmer – like fabric catching light.
 */
import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path, Defs, Pattern, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CELL = 24;

function DiamondPath() {
  const s = CELL * 0.4;
  return `M ${CELL / 2} 0 L ${CELL / 2 + s} ${CELL / 2} L ${CELL / 2} ${CELL} L ${CELL / 2 - s} ${CELL / 2} Z`;
}

export function AfricanPatternOverlay() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.05, 0.12, 0.05]),
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        <Defs>
          <Pattern id="diamond" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <Path
              d={DiamondPath()}
              fill="none"
              stroke="rgba(224,122,47,0.7)"
              strokeWidth={1.2}
            />
          </Pattern>
        </Defs>
        <Rect
          x={-CELL}
          y={-CELL}
          width={width + CELL * 2}
          height={height + CELL * 2}
          fill="url(#diamond)"
        />
      </Svg>
    </Animated.View>
  );
}
