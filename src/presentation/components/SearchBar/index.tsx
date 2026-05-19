import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText(text: string): void;
}

export function SearchBar({ value, onChangeText, ...rest }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar posts..."
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  input: {
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#111827',
  },
});
