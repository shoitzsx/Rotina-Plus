import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.md,
    padding:         SPACING.md,
    ...SHADOW.sm,
  },
});
