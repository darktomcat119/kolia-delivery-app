import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_FAMILIES, BORDER_RADIUS } from '../../config/constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.input,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        marginHorizontal: 20,
        marginBottom: 16,
        height: 48,
      }}
    >
      <Search size={20} color={COLORS.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={t('home.searchPlaceholder')}
        placeholderTextColor={COLORS.textTertiary}
        style={{
          flex: 1,
          marginLeft: 10,
          fontFamily: FONT_FAMILIES.body,
          fontSize: 14,
          color: COLORS.textPrimary,
        }}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
