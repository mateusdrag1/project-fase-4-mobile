import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Post } from '../../../domain/entities/Post';

interface PostCardProps {
  post: Post;
  onPress(): void;
  onLike(): void;
}

export function PostCard({ post, onPress, onLike }: PostCardProps) {
  const preview = post.content.length > 120 ? post.content.slice(0, 120) + '…' : post.content;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      {post.description ? <Text style={styles.preview}>{post.description}</Text> : <Text style={styles.preview}>{preview}</Text>}
      <View style={styles.footer}>
        <Text style={styles.author}>por {post.author || 'Desconhecido'}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike} style={styles.likeBtn}>
            <Text style={[styles.likeText, post.likedByMe && styles.likedText]}>
              ♥ {post.likesCount}
            </Text>
          </TouchableOpacity>
          <Text style={styles.comments}>💬 {post.comments?.length ?? 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 8 },
  preview: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 12, color: '#9CA3AF' },
  actions: { flexDirection: 'row', gap: 12 },
  likeBtn: {},
  likeText: { fontSize: 14, color: '#9CA3AF' },
  likedText: { color: '#EF4444' },
  comments: { fontSize: 14, color: '#9CA3AF' },
});
