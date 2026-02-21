import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../../config/constants';

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}

export function SkeletonLoader({ width, height, borderRadius = 8 }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.skeleton,
        },
        animatedStyle,
      ]}
    />
  );
}

export function RestaurantCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      <SkeletonLoader width="100%" height={180} borderRadius={0} />
      <View style={{ padding: 16, gap: 8 }}>
        <SkeletonLoader width="60%" height={20} />
        <SkeletonLoader width="30%" height={16} />
        <SkeletonLoader width="80%" height={14} />
      </View>
    </View>
  );
}
