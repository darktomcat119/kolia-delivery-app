/**
 * Animated delivery path – route drawing toward you.
 * Reinforces "food coming to you" for the delivery concept.
 */
import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Curved path from bottom-left (restaurant) toward center (you)
const PATH_D =
  `M 0 ${height} Q ${width * 0.2} ${height * 0.6} ${width * 0.4} ${height * 0.4}` +
  ` Q ${width * 0.6} ${height * 0.25} ${width * 0.5} ${height * 0.15}`;

export function DeliveryPath() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(progress.value, [0, 1], [400, 0]);
    return { strokeDashoffset };
  });

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      <Svg width={width} height={height}>
        <AnimatedPath
          d={PATH_D}
          fill="none"
          stroke="rgba(224,122,47,0.25)"
          strokeWidth={2}
          strokeDasharray="12 8"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}
