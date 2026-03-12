import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../../i18n';
import { COLORS, FONT_FAMILIES, FONT_SIZES, BORDER_RADIUS } from '../../config/constants';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <LinearGradient
            colors={['#FAFAF7', '#F5F3EF', '#F0EDE8']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <View style={styles.fallbackContent}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: FONT_SIZES['2xl'],
              color: COLORS.textPrimary,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {i18n.t('common.oops')}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.body,
              fontSize: FONT_SIZES.base,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            {this.props.fallbackMessage ?? i18n.t('common.errorGeneric')}
          </Text>
          <Pressable
            onPress={this.handleReset}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: BORDER_RADIUS.button,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILIES.bodySemibold,
                fontSize: 16,
                color: COLORS.textOnPrimary,
              }}
            >
              {i18n.t('common.retry')}
            </Text>
          </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
  },
  fallbackContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
