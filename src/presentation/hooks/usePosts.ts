import { useState, useCallback } from 'react';
import { Post } from '../../domain/entities/Post';
import { CreatePostInput, UpdatePostInput } from '../../domain/repositories/IPostRepository';
import { PostRepository } from '../../data/repositories/PostRepository';
import { CommentRepository } from '../../data/repositories/CommentRepository';
import { LikeRepository } from '../../data/repositories/LikeRepository';

const postRepo = new PostRepository();
const commentRepo = new CommentRepository();
const likeRepo = new LikeRepository();

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postRepo.list();
      setPosts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPosts = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postRepo.search(query);
      setPosts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (input: CreatePostInput) => {
    const post = await postRepo.create(input);
    setPosts((prev) => [post, ...prev]);
    return post;
  }, []);

  const updatePost = useCallback(async (id: string, input: UpdatePostInput) => {
    const updated = await postRepo.update(id, input);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deletePost = useCallback(async (id: string) => {
    await postRepo.remove(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addComment = useCallback(async (postId: string, content: string) => {
    return commentRepo.create(postId, content);
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    await likeRepo.toggle(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likesCount: p.likedByMe ? p.likesCount - 1 : p.likesCount + 1 }
          : p,
      ),
    );
  }, []);

  return { posts, isLoading, error, fetchPosts, searchPosts, createPost, updatePost, deletePost, addComment, toggleLike };
}
