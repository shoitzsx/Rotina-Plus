import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, ViewStyle, StyleProp,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title, onPress, loading = false, disabled = false,
  variant = 'primary', style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const bgColor = {
    primary:   COLORS.primary,
    secondary: COLORS.secondary,
    danger:    COLORS.danger,
    outline:   'transparent',
  }[variant];

  const textColor = variant === 'outline' ? COLORS.primary : COLORS.white;
  const borderColor = variant === 'outline' ? COLORS.primary : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bgColor, borderColor, opacity: isDisabled ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height:         50,
    borderRadius:   RADIUS.md,
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    1.5,
    paddingHorizontal: SPACING.md,
  },
  text: {
    fontSize:   FONT_SIZE.md,
    fontWeight: '600',
  },
});
