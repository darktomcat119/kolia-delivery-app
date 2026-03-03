import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
            backgroundColor: COLORS.background,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bodySemibold,
              fontSize: FONT_SIZES['2xl'],
              color: COLORS.textPrimary,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Oops!
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
            {this.props.fallbackMessage ??
              'Something went wrong. Please try again.'}
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
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
