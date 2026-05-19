import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostCard } from '../../components/PostCard';
import { SearchBar } from '../../components/SearchBar';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../routes/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: Props) {
  const { posts, isLoading, fetchPosts, searchPosts, toggleLike } = usePosts();
  const { logout, token, user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const { requireAuth } = useRequireAuth();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) searchPosts(query.trim());
      else fetchPosts();
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  if (isLoading && posts.length === 0) return <Loading />;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.logo}>📝 Blog</Text>
        <View style={styles.topActions}>
          {token ? (
            <>
              {isTeacher && (
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CreatePost')}
                    style={styles.fab}
                  >
                    <Text style={styles.fabText}>+ Post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Teachers')}
                    style={styles.adminBtn}
                  >
                    <Text style={styles.adminText}>👨‍🏫</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Students')}
                    style={styles.adminBtn}
                  >
                    <Text style={styles.adminText}>🎓</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity onPress={handleLogout} style={styles.authBtn}>
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.fab}
              >
                <Text style={styles.fabText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.authBtn}
              >
                <Text style={styles.registerText}>Cadastrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
            onLike={() => requireAuth(() => toggleLike(item.id))}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPosts} colors={['#6C63FF']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logo: { fontSize: 20, fontWeight: '800', color: '#111827' },
  topActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  fab: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  authBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  adminBtn: { paddingHorizontal: 6, paddingVertical: 6 },
  adminText: { fontSize: 20 },
  registerText: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
});
