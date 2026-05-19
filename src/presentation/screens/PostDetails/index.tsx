import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { PostRepository } from '../../../data/repositories/PostRepository';
import { CommentRepository } from '../../../data/repositories/CommentRepository';
import { LikeRepository } from '../../../data/repositories/LikeRepository';
import { Post } from '../../../domain/entities/Post';
import { Comment } from '../../../domain/entities/Comment';
import { useAuth } from '../../hooks/useAuth';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../routes/types';

const postRepo = new PostRepository();
const commentRepo = new CommentRepository();
const likeRepo = new LikeRepository();

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PostDetails'>;
  route: RouteProp<RootStackParamList, 'PostDetails'>;
};

export function PostDetailsScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const { token, user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const { requireAuth } = useRequireAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);

  async function loadPost() {
    try {
      const data = await postRepo.getById(postId);
      setPost(data);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPost();
  }, [postId]);

  async function handleLike() {
    if (!post) return;
    await likeRepo.toggle(post.id);
    setPost((prev) =>
      prev
        ? {
            ...prev,
            likedByMe: !prev.likedByMe,
            likesCount: prev.likedByMe ? prev.likesCount - 1 : prev.likesCount + 1,
          }
        : prev,
    );
  }

  async function handleComment() {
    if (!commentText.trim() || !post) return;
    setIsSendingComment(true);
    try {
      const comment = await commentRepo.create(post.id, commentText.trim());
      setPost((prev) =>
        prev ? { ...prev, comments: [...(prev.comments ?? []), comment] } : prev,
      );
      setCommentText('');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setIsSendingComment(false);
    }
  }

  function handleDelete() {
    Alert.alert('Excluir Post', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await postRepo.remove(postId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (isLoading || !post) return <Loading />;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title={post.title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.meta}>
          <Text style={styles.author}>por {post.author}</Text>
          <Text style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        {post.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        ) : null}
        {post.description ? <Text style={styles.description}>{post.description}</Text> : null}

        <Text style={styles.body}>{post.content}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => requireAuth(handleLike)}
            style={styles.likeBtn}
          >
            <Text style={[styles.likeText, post.likedByMe && styles.likedText]}>
              {post.likedByMe ? '♥' : '♡'} {post.likesCount} curtidas
            </Text>
          </TouchableOpacity>

          {isTeacher && (
            <>
              <Button
                title="Editar"
                variant="outline"
                style={styles.actionBtn}
                onPress={() => navigation.navigate('EditPost', { postId: post.id })}
              />
              <Button
                title="Excluir"
                variant="danger"
                style={styles.actionBtn}
                onPress={handleDelete}
              />
            </>
          )}
        </View>

        <Text style={styles.commentsTitle}>
          Comentários ({post.comments?.length ?? 0})
        </Text>

        {(post.comments ?? []).map((c: Comment) => (
          <View key={c.id} style={styles.commentCard}>
            <Text style={styles.commentAuthor}>{c.author?.name}</Text>
            <Text style={styles.commentText}>{c.content}</Text>
          </View>
        ))}

        {token ? (
          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Escreva um comentário..."
              placeholderTextColor="#9CA3AF"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Button
              title="Enviar"
              onPress={handleComment}
              isLoading={isSendingComment}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.guestBanner}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.guestBannerText}>
              Faça login para curtir e comentar →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 48 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  author: { fontSize: 13, color: '#6B7280' },
  date: { fontSize: 13, color: '#9CA3AF' },
  description: { fontSize: 15, color: '#6B7280', lineHeight: 22, marginBottom: 12, fontStyle: 'italic' },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  categoryText: { fontSize: 12, color: '#6C63FF', fontWeight: '700' },
  body: { fontSize: 16, color: '#111827', lineHeight: 26, marginBottom: 20 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  likeBtn: { flex: 1 },
  likeText: { fontSize: 16, color: '#9CA3AF' },
  likedText: { color: '#EF4444' },
  actionBtn: { height: 36, paddingHorizontal: 12 },
  commentsTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6C63FF',
  },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 4 },
  commentText: { fontSize: 14, color: '#4B5563' },
  commentInput: { marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    marginBottom: 8,
  },
  guestBanner: {
    marginTop: 20,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  guestBannerText: { color: '#6C63FF', fontWeight: '600', fontSize: 15 },
});
