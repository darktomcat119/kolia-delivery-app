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

const cardShadow = {
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.05)' as const,
  shadowColor: '#1A1A1A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 4,
};

export function RestaurantCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 18,
        ...cardShadow,
      }}
    >
      <SkeletonLoader width="100%" height={180} borderRadius={0} />
      <View style={{ padding: 18, gap: 10 }}>
        <SkeletonLoader width="60%" height={20} borderRadius={10} />
        <SkeletonLoader width="35%" height={16} borderRadius={8} />
        <SkeletonLoader width="85%" height={14} borderRadius={7} />
      </View>
    </View>
  );
}
