import { IPostRepository, CreatePostInput, UpdatePostInput } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { api } from '../../infra/http/api';
import { PostDTO } from '../dtos/PostDTO';
import { mapPost } from '../mappers/PostMapper';

export class PostRepository implements IPostRepository {
  async list(): Promise<Post[]> {
    const { data } = await api.get<PostDTO[]>('/posts');
    return data.map(mapPost);
  }

  async search(query: string): Promise<Post[]> {
    const { data } = await api.get<PostDTO[]>('/posts/search', { params: { q: query } });
    return data.map(mapPost);
  }

  async getById(id: string): Promise<Post> {
    const { data } = await api.get<PostDTO>(`/posts/${id}`);
    return mapPost(data);
  }

  async create(input: CreatePostInput): Promise<Post> {
    const { data } = await api.post<PostDTO>('/posts', input);
    return mapPost(data);
  }

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const { data } = await api.put<PostDTO>(`/posts/${id}`, input);
    return mapPost(data);
  }

  async remove(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  }
}
