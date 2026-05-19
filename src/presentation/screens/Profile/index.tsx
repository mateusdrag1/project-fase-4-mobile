import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>👤</Text>
      <Text style={styles.name}>{user?.name ?? 'Usuário'}</Text>
      <Text style={styles.email}>{user?.email ?? ''}</Text>
      <Button title="Sair" variant="danger" style={styles.btn} onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  avatar: { fontSize: 72, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  email: { fontSize: 15, color: '#6B7280', marginBottom: 32 },
  btn: { width: '100%' },
});
