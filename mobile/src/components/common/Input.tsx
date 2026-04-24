import React from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TextInputProps, ViewStyle, StyleProp,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Input({ label, error, containerStyle, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={COLORS.textMuted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { marginBottom: SPACING.md },
  label:      { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    height:          48,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    borderRadius:    RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize:        FONT_SIZE.md,
    color:           COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputError: { borderColor: COLORS.danger },
  error:      { fontSize: FONT_SIZE.xs, color: COLORS.danger, marginTop: SPACING.xs },
});
