import { Comment } from '../entities/Comment';

export interface ICommentRepository {
  create(postId: string, content: string): Promise<Comment>;
}
