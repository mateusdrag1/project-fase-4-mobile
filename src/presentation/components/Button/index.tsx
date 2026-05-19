import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
}

export function Button({ title, isLoading, variant = 'primary', style, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.8}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#6C63FF' : '#fff'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: '#6C63FF' },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#6C63FF' },
  danger: { backgroundColor: '#EF4444' },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
  textOutline: { color: '#6C63FF' },
});
