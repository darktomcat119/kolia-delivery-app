/**
 * Thematic particles: warm spice/steam rising from African cuisine.
 * Amber, gold, rust tones with organic rise + drift motion.
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

const WARM_COLORS = ['#E07A2F', '#D4A745', '#C4631E', '#B8860B', '#CD853F'];

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
  riseY: number;
}

const COUNT = 24;
const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  size: 2.5 + (i % 4) * 2,
  x: (i * 97) % (width + 20) - 10,
  y: height - 60 + (i % 8) * 40,
  color: WARM_COLORS[i % WARM_COLORS.length],
  duration: 4000 + (i % 5) * 800,
  delay: (i % 7) * 350,
  driftX: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 4),
  riseY: -(height * 0.15 + (i % 3) * 30),
}));

function SpiceDot({ p }: { p: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      p.delay,
      withRepeat(
        withTiming(1, { duration: p.duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const y = interpolate(progress.value, [0, 1], [0, p.riseY]);
    const x = interpolate(progress.value, [0, 0.5, 1], [0, p.driftX / 2, p.driftX]);
    const opacity = interpolate(progress.value, [0, 0.2, 0.8, 1], [0, 0.4, 0.35, 0]);
    const scale = interpolate(progress.value, [0, 0.3, 1], [0.8, 1, 0.6]);
    return {
      transform: [{ translateY: y }, { translateX: x }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          backgroundColor: p.color,
        },
        style,
      ]}
    />
  );
}

export function SpiceParticles() {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      {particles.map((p) => (
        <SpiceDot key={p.id} p={p} />
      ))}
    </View>
  );
}
