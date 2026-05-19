import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Nenhum post encontrado.' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 48, marginBottom: 12 },
  text: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
});
