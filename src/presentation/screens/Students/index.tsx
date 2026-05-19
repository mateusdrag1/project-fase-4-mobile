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
import { useStudents } from '../../hooks/useStudents';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../routes/types';
import { Student } from '../../../domain/entities/Student';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Students'>;
};

export function StudentsScreen({ navigation }: Props) {
  const { students, isLoading, fetchStudents, deleteStudent } = useStudents();

  function handleDelete(item: Student) {
    Alert.alert(
      'Excluir aluno',
      `Deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(item.id);
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
      fetchStudents();
    }, [fetchStudents]),
  );

  function renderItem({ item }: { item: Student }) {
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
              type: 'student',
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

  if (isLoading && students.length === 0) return <Loading />;

  return (
    <View style={styles.container}>
      <Header
        title="Alunos"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={() => navigation.navigate('PersonForm', { type: 'student' })}
            style={styles.addBtn}
          >
            <Text style={styles.addText}>+ Novo</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="Nenhum aluno cadastrado." />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchStudents} colors={['#6C63FF']} />
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
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  editBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: { color: '#10B981', fontSize: 13, fontWeight: '700' },
  deleteBtn: { marginLeft: 8, padding: 6 },
  deleteText: { fontSize: 18 },
  addBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
