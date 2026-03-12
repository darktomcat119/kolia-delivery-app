import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  icon,
  isPassword = false,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? COLORS.error
    : focused
      ? COLORS.primary
      : COLORS.border;

  const bgColor = focused ? COLORS.primaryMuted : COLORS.surface;

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            fontFamily: FONT_FAMILIES.bodyMedium,
            fontSize: 14,
            color: COLORS.textSecondary,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 52,
          borderRadius: 14,
          borderWidth: 1,
          borderColor,
          backgroundColor: bgColor,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {icon}
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={COLORS.textTertiary}
          style={{
            flex: 1,
            fontFamily: FONT_FAMILIES.body,
            fontSize: 15,
            color: COLORS.textPrimary,
            height: '100%',
          }}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={20} color={COLORS.textTertiary} />
            ) : (
              <Eye size={20} color={COLORS.textTertiary} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: 12,
            color: COLORS.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
