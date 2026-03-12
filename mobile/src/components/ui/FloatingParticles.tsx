import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

const PARTICLE_COUNT = 16;
const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  size: 4 + (i % 5) * 3,
  x: (i * 137) % (width - 40) + 20,
  y: (i * 89 + 50) % (height - 100) + 50,
  duration: 3000 + (i % 4) * 1000,
  delay: (i % 6) * 400,
  opacity: 0.15 + (i % 4) * 0.05,
}));

function ParticleDot({ p }: { p: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: p.duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const moveY = interpolate(progress.value, [0, 1], [0, -24]);
    const moveX = interpolate(progress.value, [0, 1], [0, 12]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [p.opacity, p.opacity * 0.5, p.opacity]);
    return {
      transform: [{ translateY: moveY }, { translateX: moveX }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          backgroundColor: '#FFFFFF',
        },
        animatedStyle,
      ]}
    />
  );
}

export function FloatingParticles() {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      {particles.map((p) => (
        <ParticleDot key={p.id} p={p} />
      ))}
    </View>
  );
}
