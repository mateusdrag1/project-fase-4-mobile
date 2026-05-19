import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { api } from '../../infra/http/api';
import { CommentDTO } from '../dtos/PostDTO';

export class CommentRepository implements ICommentRepository {
  async create(postId: string, content: string): Promise<Comment> {
    const { data } = await api.post<CommentDTO>('/comments', { postId, content });
    return {
      id: data.id,
      content: data.content,
      postId: data.postId,
      createdAt: data.createdAt,
      author: data.author,
    };
  }
}
