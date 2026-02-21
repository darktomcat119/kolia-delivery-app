import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: COLORS.primary },
    text: { color: COLORS.textOnPrimary },
  },
  secondary: {
    container: { backgroundColor: COLORS.secondary },
    text: { color: COLORS.textOnPrimary },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    text: { color: COLORS.primary },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: COLORS.primary },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { height: 40, paddingHorizontal: 16 },
    text: { fontSize: 14 },
  },
  md: {
    container: { height: 48, paddingHorizontal: 20 },
    text: { fontSize: 15 },
  },
  lg: {
    container: { height: 56, paddingHorizontal: 24 },
    text: { fontSize: 16 },
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: isDisabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        vStyle.container,
        sStyle.container,
        fullWidth && { width: '100%' },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={vStyle.text.color as string}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                fontFamily: FONT_FAMILIES.bodySemibold,
              },
              vStyle.text,
              sStyle.text,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
