import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_FAMILIES, SHADOWS } from '../../config/constants';

const DEBOUNCE_MS = 500;

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from parent when store value is cleared externally
  useEffect(() => {
    if (value === '' && localValue !== '') setLocalValue('');
  }, [value]);

  const handleChange = (text: string) => {
    setLocalValue(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChangeText(text), DEBOUNCE_MS);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onChangeText(localValue);
    onSubmit?.();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: focused ? COLORS.primary : COLORS.borderLight,
        paddingHorizontal: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        height: 52,
        ...SHADOWS.card,
      }}
    >
      <Search size={20} color={focused ? COLORS.primary : COLORS.textTertiary} />
      <TextInput
        value={localValue}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t('home.searchPlaceholder')}
        placeholderTextColor={COLORS.textTertiary}
        style={{
          flex: 1,
          marginLeft: 12,
          fontFamily: FONT_FAMILIES.body,
          fontSize: 15,
          color: COLORS.textPrimary,
        }}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
