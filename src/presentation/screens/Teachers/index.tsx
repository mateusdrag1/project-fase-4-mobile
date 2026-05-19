import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { useTeachers } from '../../hooks/useTeachers';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../routes/types';
import { Teacher } from '../../../domain/entities/Teacher';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Teachers'>;
};

export function TeachersScreen({ navigation }: Props) {
  const { teachers, isLoading, fetchTeachers, deleteTeacher } = useTeachers();

  function handleDelete(item: Teacher) {
    Alert.alert(
      'Excluir professor',
      `Deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeacher(item.id);
            } catch (e: any) {
              Alert.alert('Erro', e.message);
            }
          },
        },
      ],
    );
  }

  useFocusEffect(
    useCallback(() => {
      fetchTeachers();
    }, [fetchTeachers]),
  );

  function renderItem({ item }: { item: Teacher }) {
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate('PersonForm', {
              type: 'teacher',
              id: item.id,
              name: item.name,
              email: item.email,
            })
          }
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && teachers.length === 0) return <Loading />;

  return (
    <View style={styles.container}>
      <Header
        title="Professores"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={() => navigation.navigate('PersonForm', { type: 'teacher' })}
            style={styles.addBtn}
          >
            <Text style={styles.addText}>+ Novo</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="Nenhum professor cadastrado." />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchTeachers} colors={['#6C63FF']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  editBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: { color: '#6C63FF', fontSize: 13, fontWeight: '700' },
  deleteBtn: { marginLeft: 8, padding: 6 },
  deleteText: { fontSize: 18 },
  addBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
