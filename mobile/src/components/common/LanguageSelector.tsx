import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_FAMILIES } from '../../config/constants';

const LANGUAGES = [
  { code: 'pt', flag: '🇵🇹', label: 'Português' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
] as const;

interface LanguageSelectorProps {
  onSelect?: () => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    onSelect?.();
  };

  return (
    <View style={{ gap: 4 }}>
      {LANGUAGES.map(({ code, flag, label }) => {
        const isActive = i18n.language === code;

        return (
          <Pressable
            key={code}
            onPress={() => handleSelect(code)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: pressed
                ? COLORS.surfaceHover
                : isActive
                  ? COLORS.primaryMuted
                  : 'transparent',
            })}
          >
            <Text style={{ fontSize: 22, marginRight: 12 }}>{flag}</Text>
            <Text
              style={{
                flex: 1,
                fontFamily: isActive
                  ? FONT_FAMILIES.bodySemibold
                  : FONT_FAMILIES.body,
                fontSize: 16,
                color: isActive ? COLORS.primary : COLORS.textPrimary,
              }}
            >
              {label}
            </Text>
            {isActive && <Check size={20} color={COLORS.primary} />}
          </Pressable>
        );
      })}
    </View>
  );
}
