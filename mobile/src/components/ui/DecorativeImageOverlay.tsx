/**
 * Optional full-bleed or contained image overlay for hero sections or cards.
 * Use with a gradient on top for text readability.
 */
import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DecorativeImageOverlayProps {
  source: ImageSourcePropType;
  /** Container style (e.g. height for a hero strip) */
  style?: ViewStyle;
  /** Image opacity (default 0.25) */
  imageOpacity?: number;
  /** Gradient overlay: [top, bottom] colors for legible text (default light bottom fade) */
  gradientColors?: readonly [string, string];
  /** contentFit equivalent: 'cover' | 'contain' */
  resizeMode?: 'cover' | 'contain';
}

const DEFAULT_GRADIENT: readonly [string, string] = ['transparent', 'rgba(250,250,247,0.92)'];

export function DecorativeImageOverlay({
  source,
  style,
  imageOpacity = 0.25,
  gradientColors = DEFAULT_GRADIENT,
  resizeMode = 'cover',
}: DecorativeImageOverlayProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}
        resizeMode={resizeMode}
      />
      <LinearGradient
        colors={gradientColors as unknown as string[]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
